import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
// Ensure ApplicationStatus and JobStatus are imported from the correct path
import { ApplicationStatus, JobStatus } from "../types";
import {
  MOCK_APPLICATIONS,
  HIRING_STAGES,
  NOTIFICATION_TEMPLATES,
  INTERVIEW_TEMPLATES,
} from "../constants";

// API_BASE must be defined once
const API_BASE = "https://adminbackend-production-5195.up.railway.app";

const StoreContext = createContext(undefined);

export const StoreProvider = ({ children }) => {
  // --- Persistence Helper ---
  const getSaved = (key, fallback) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  };

  const initialUser = getSaved("careers_user_session", null);
  const [user, setUser] = useState(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialUser);

  const [users, setUsers] = useState(() => getSaved("careers_users", []));
  const [usersLoading, setUsersLoading] = useState(false);

  const [jobs, setJobs] = useState(() => getSaved("careers_jobs", []));
  const [applications, setApplications] = useState(() =>
    getSaved("careers_applications", [])
  );

  const [notifications, setNotifications] = useState([]);

  // --- Persistence Effects ---

  useEffect(() => {
    if (!isAuthenticated) return; // stop the API call before login

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return; // no token → do nothing

        const res = await fetch(`${API_BASE}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setUsers(data.users);
      } catch (err) {
        console.error("User fetch error:", err.message);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return; // Only fetch when user is logged in
    
    // Fetch applicants automatically on login
    apiFetchApplicants();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("careers_applications", JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    if (user)
      localStorage.setItem("careers_user_session", JSON.stringify(user));
    else localStorage.removeItem("careers_user_session");
  }, [user]);

  useEffect(() => {
    localStorage.setItem("careers_users", JSON.stringify(users));
  }, [users]);

  const showToast = (message, type) => {
    const id = uuidv4(); // FIX: Add the new toast to the START of the array
    setNotifications((prev) => [{ id, message, type }, ...prev]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  // --- REAL API BACKEND FUNCTIONS (using fetch) ---

  // improved apiAddJob
  const apiAddJob = async (jobData) => {
    const token = localStorage.getItem("token");
    
    console.log('🚀 apiAddJob called with jobData:', jobData);
    console.log('📋 basicFormSchema being sent:', jobData.basicFormSchema);
    console.log('📝 applicationForm being sent:', jobData.applicationForm);
    console.log('📦 Full payload:', JSON.stringify(jobData, null, 2));
    
    try {
      const response = await fetch(`${API_BASE}/add-job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(jobData),
      });

      // read raw text first
      const text = await response.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        console.error("apiAddJob - non-JSON response:", {
          status: response.status,
          body: text,
        });
        throw new Error(
          `API returned non-JSON response (status ${response.status}). Check server logs / response body in console.`
        );
      }

      if (!response.ok) {
        console.error("apiAddJob - backend error:", {
          status: response.status,
          data,
        });
        throw new Error(
          data.message ||
            data.error ||
            `API failed with status: ${response.status}`
        );
      }

      // Transform backend response to match frontend structure
      const transformedJob = {
        id: data.job.id,
        uuid: data.job.uuid,
        title: data.job.job_title,
        slug: data.job.slug,
        details: data.job.details || {},
        description: data.job.description || {},
        basicFormSchema: data.job.basicFormSchema || [],
        applicationForm: data.job.applicationForm || {},
        created_at: data.job.created_at,
      };

      return { success: true, job: transformedJob };
    } catch (error) {
      console.error("Error creating job via API:", error);
      throw error;
    }
  };

  const apiUpdateJob = async (jobData) => {
    const token = localStorage.getItem("token");

    const payload = {
      title: jobData.title,
      slug: jobData.slug,
      details: jobData.details,
      description: jobData.description,
      basicFormSchema: jobData.basicFormSchema,
      applicationForm: jobData.applicationForm,
    };

    try {
      const response = await fetch(`${API_BASE}/jobs/${jobData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Update failed");
      }

      // Transform backend response to match frontend structure
      const transformedJob = {
        id: data.job.id,
        uuid: data.job.uuid,
        title: data.job.job_title,
        slug: data.job.slug,
        details: data.job.details || {},
        description: data.job.description || {},
        basicFormSchema: data.job.basicFormSchema || [],
        applicationForm: data.job.applicationForm || {},
        created_at: data.job.created_at,
        updated_at: data.job.updated_at,
      };

      return { success: true, job: transformedJob };
    } catch (error) {
      console.error("Error updating job:", error);
      throw error;
    }
  };

  const apiDeleteJob = async (jobId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE}/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        console.error("apiDeleteJob - NON-JSON response:", text);
        throw new Error(`Invalid backend response while deleting job.`);
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Delete failed with status ${response.status}`
        );
      }

      return {
        success: true,
        id: jobId,
      };
    } catch (error) {
      console.error(`❌ Error deleting job ${jobId}:`, error);
      throw error;
    }
  };

  const apiFetchJobs = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE}/jobs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await response.json();


      if (!response.ok) {
        throw new Error(data.error || "Failed to load jobs");
      }

      // TRANSFORM INTO FRONTEND-FRIENDLY SHAPE
      const fixedJobs = data.jobs.map((job) => ({
        id: job.id,
        uuid: job.uuid,
        title: job.job_title, // FIX
        slug: job.slug,
        details: job.details || {}, // Already parsed by backend
        description: job.description || {}, // Already parsed by backend
        basicFormSchema: job.basicFormSchema || [],
        applicationForm: job.applicationForm || {},
        created_at: job.created_at,
      }));
      setJobs(fixedJobs);
      return { success: true, jobs: fixedJobs };
    } catch (error) {
      console.error("Error fetching jobs via API:", error);
      throw error;
    }
  };

const apiFetchApplicants = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_BASE}/applicants`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const data = await response.json();
    console.log(data.applicants)
    if (!response.ok) throw new Error(data.message || "Failed to fetch new applicants");

    // Transform into UI structure
    const mappedApps = data.applicants.map((app) => {
      console.log("Raw applicant data:", app);
      return {
      id: app.id,
      jobId: app.job_id,            // if exists in response
      candidateName: app.full_name,
      email: app.email,
      phone: app.phone,

      // Job title + Department
      jobTitle: app.job_title || "",
      department: app.department || "",

      // Application Date
      appliedDate: app.applied_at
        ? new Date(app.applied_at).toLocaleDateString()
        : "",

      // Resume URL
      resumeUrl: app.resume_path ? `${API_BASE}${app.resume_path}` : null,

      // Map backend stage to frontend stage name (used for both currentStage and shortlistStage)
      currentStage: (() => {
        const backendStage = app.stage || "1_received";
        const stageMap = {
          "1_received": "Application Received",
          "2_resume_screen": "Resume Screening",
          "4_tech_test": "Technical Test",
          "5_tech_interview": "Technical Interview",
          "6_manager_interview": "Managerial Interview",
          "7_hr_final": "HR Final Round",
          "9_offer_prep": "Offer Preparation",
          "10_offer_issued": "Offer Issued",
          "11_offer_accepted": "Offer Accepted",
          "13_joined": "Joined",
          "99_rejected": "Rejected"
        };
        return stageMap[backendStage] || backendStage; // Fallback to backend value if not found
      })(),

      // Shortlist Info - use the same mapped stage
      shortlistStage: (() => {
        const backendStage = app.stage || "1_received";
        const stageMap = {
          "1_received": "Application Received",
          "2_resume_screen": "Resume Screening",
          "4_tech_test": "Technical Test",
          "5_tech_interview": "Technical Interview",
          "6_manager_interview": "Managerial Interview",
          "7_hr_final": "HR Final Round",
          "9_offer_prep": "Offer Preparation",
          "10_offer_issued": "Offer Issued",
          "11_offer_accepted": "Offer Accepted",
          "13_joined": "Joined",
          "99_rejected": "Rejected"
        };
        return stageMap[backendStage] || backendStage;
      })(),
      shortlistStatus: app.status || "Pending",
      shortlistRating: app.rating || 0,
      
      currentStageStatus: app.status || "Pending",
      stageHistory: [],
      timeline: [],

      // Application Status enum
      status: (() => {
         const stageId = app.stage || "1_received";
         const status = app.status || "Pending";
         
         if (stageId === "13_joined" || stageId === "Joined") return ApplicationStatus.HIRED;
         if (status === "Rejected" || stageId === "99_rejected" || stageId === "Rejected") return ApplicationStatus.REJECTED;
         if (stageId === "1_received" || stageId === "Application Received") return ApplicationStatus.NEW;
         return ApplicationStatus.SHORTLISTED;
      })(),

      // Applicant Form Data
      answers: app.fields || {},
      steps_json: app.steps || [],
    };
  });

    setApplications(mappedApps);
    return mappedApps;

  } catch (err) {
    console.error("Error fetching new applicants:", err);
  }
};




  // --- Mock Backend Communications (Logging) ---
  const sendEmail = (to, subject, body) => {
    return true;
  };


const sendWhatsApp = async (phone, message) => {
    const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_BASE}/api/whatsapp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "",},
      body: JSON.stringify({ phone, message }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp send failed:", data);
      return { success: false, error: data };
    }

    return { success: true };

  } catch (error) {
    console.error("WhatsApp request error:", error);
    return { success: false, error };
  }
}

  // -----------------------------

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("careers_user_session", JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("careers_user_session");
    localStorage.removeItem("token");
  };

  const addJob = (job) => {
    setJobs((prev) => [job, ...prev]);
    showToast("Job created successfully", "success");
  };

  // Inside StoreProvider (replacing the original updateJob)

  const updateJob = async (updatedJob) => {
    // <-- MAKE ASYNC
    try {
      // 1. Call the API helper with the full job object
      const result = await apiUpdateJob(updatedJob);

      // 2. Update local state using the result from the API
      setJobs((prev) =>
        prev.map((j) => (String(j.id) === String(result.job.id) ? result.job : j))
      );
      showToast("Job updated successfully", "success");

      return result.job;
    } catch (err) {
      showToast(err.message || "Failed to update job", "error");
      throw err;
    }
  };

  // Inside StoreProvider (replacing the old deleteJob)

  const deleteJob = async (id) => {
    // <-- MAKE ASYNC
    try {
      // 1. Call the API function
      await apiDeleteJob(id);

      // 2. Update local state only on successful API response
      setJobs((prev) => prev.filter((j) => j.id !== id));
      showToast("Job deleted successfully", "success");

      return true;
    } catch (err) {
      // The error is already logged in apiDeleteJob, but we show a toast here.
      showToast(err.message || "Failed to delete job", "error");
      // Re-throw so the JobsList component can catch it and close the modal
      throw err;
    }
  };

  // Inside StoreProvider (replacing the mock apiUpdateJob)

  // ... existing functions ...

  // Ensure apiUpdateJob is exposed in the context value (which it already is).

  // Ensure apiDeleteJob is exposed in the context value:
  // (inside return ( <StoreContext.Provider value={{...}}> ) )
  // ...
  // apiUpdateJob,
  // apiDeleteJob, // <-- NEWLY ADDED TO EXPOSED VALUE
  // ...

  // User Management Functions (using fetch)
  const addUser = async (newUser) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/add-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || data.error || "Failed to add user");

      setUsers((prev) => [...prev, data.user]);
      showToast("User added successfully", "success");
      return data.user;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const removeUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/delete-user/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || data.error || "Failed to delete user");

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast("User removed successfully", "success");
      return true;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const updateUserProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/update-user/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem("careers_user_session", JSON.stringify(updatedUser));

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, ...updatedData } : u))
      );
      showToast("Profile updated successfully", "success");
      return true;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  // --- Application Workflow Logic ---
  const updateApplicationStatus = (id, status) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const newEvent = {
            id: `evt_${uuidv4()}`,
            type: "status_change",
            content: `Legacy status changed to ${status}`,
            date: new Date().toLocaleString(),
            user: user?.name || "System",
          };
          return { ...app, status, timeline: [newEvent, ...app.timeline] };
        }
        return app;
      })
    );
  };  

  const apiUpdateApplicantStage = async (id, stage, status, note) => {
    const token = localStorage.getItem("token");
    try {
      console.log("Sending to backend:", { id, stage, status, note });
      
      const response = await fetch(`${API_BASE}/applicants/${id}/stage`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ stage, status, note }),
      });

      const data = await response.json();
      console.log("Backend response:", data);
      
      if (!response.ok) {
        console.error("Backend error details:", data);
        throw new Error(data.message || data.error || "Failed to update stage");
      }
      return data;
    } catch (err) {
      console.error("Error updating stage:", err);
      throw err;
    }
  };

  const updateCandidateStage = async (candidateId, stageId, status, note, notify) => {
    console.log('🔵 updateCandidateStage called with:', { 
      candidateId, 
      stageId, 
      status, 
      note, 
      notify,
      noteType: typeof note,
      notifyType: typeof notify
    });
    
    try {
        // 1. Call API first
        await apiUpdateApplicantStage(candidateId, stageId, status, note);

        // 2. Update Local State & Notifications
        setApplications((prev) =>
        prev.map((app) => {
            if (app.id !== candidateId) return app;

            const stageDef = HIRING_STAGES.find((s) => s.id === stageId);
            if (!stageDef) return app;

            const timestamp = new Date().toLocaleString();
            const adminName = user?.name || "Admin";
            const newTimelineEvents = [];

            // Notifications (Mock)
            let emailSent = false;
            let whatsappSent = false;

            if (notify && NOTIFICATION_TEMPLATES[stageId]) {
            console.log('📧 Notification enabled for stage:', stageId);
            const tmpl = NOTIFICATION_TEMPLATES[stageId];
            console.log('📧 Template found:', tmpl ? 'Yes' : 'No');

            const processText = (text) =>
                text
                .replace(/{candidateName}/g, app.candidateName)
                .replace(/{jobTitle}/g, app.jobTitle)
                .replace(/{stageName}/g, stageDef.name);

            const emailSub = processText(tmpl.emailSubject);
            const emailBody = processText(tmpl.emailBody);
            const waBody = processText(tmpl.whatsapp);

            console.log('📧 Processed WhatsApp message:', waBody);

            if (app.email) {
                sendEmail(app.email, emailSub, emailBody);
                emailSent = true;
                newTimelineEvents.push({
                id: `evt_mail_${uuidv4()}`,
                type: "email",
                content: `Email sent: ${emailSub}`,
                date: timestamp,
                user: "System",
                });
            }

            if (app.phone) {
                console.log('📱 Phone number found:', app.phone);
                
                // Format phone number for WhatsApp (remove spaces, dashes, add country code if needed)
                let formattedPhone = app.phone.replace(/[\s\-()]/g, '');
                
                // If phone doesn't start with country code, add default (India +91)
                if (!formattedPhone.startsWith('+') && !formattedPhone.startsWith('91')) {
                  formattedPhone = '91' + formattedPhone;
                }
                
                // Remove + if present (WhatsApp API expects number without +)
                formattedPhone = formattedPhone.replace(/^\+/, '');
                
                console.log('📱 Formatted phone number:', formattedPhone);
                console.log('📱 About to send WhatsApp...');
                
                // Send WhatsApp message
                sendWhatsApp(formattedPhone, waBody).then(success => {
                  if (success) {
                    console.log('✅ WhatsApp sent successfully to', formattedPhone);
                  } else {
                    console.log('❌ WhatsApp send failed to', formattedPhone);
                  }
                });
                
                whatsappSent = true;
                newTimelineEvents.push({
                id: `evt_wa_${uuidv4()}`,
                type: "whatsapp",
                content: `WhatsApp sent: ${stageDef.name} update`,
                date: timestamp,
                user: "System",
                });
            } else {
                console.log('⚠️ No phone number found for applicant');
            }
            } else {
                if (!notify) {
                    console.log('ℹ️ Notifications disabled by user');
                }
                if (!NOTIFICATION_TEMPLATES[stageId]) {
                    console.log('⚠️ No notification template found for stage:', stageId);
                }
            }

            // History Entry
            const historyEntry = {
            stageId,
            stageName: stageDef.name,
            status,
            updatedAt: timestamp,
            updatedBy: adminName,
            note,
            emailSent,
            whatsappSent,
            };

            // Log Status Change to Timeline
            newTimelineEvents.push({
            id: `evt_stage_${uuidv4()}`,
            type: "status_change",
            content: `Moved to ${stageDef.name} (${status})`,
            date: timestamp,
            user: adminName,
            });

            if (note) {
            newTimelineEvents.push({
                id: `evt_note_${uuidv4()}`,
                type: "note",
                content: note,
                date: timestamp,
                user: adminName,
            });
            }

            return {
            ...app,
            currentStage: stageId,
            currentStageStatus: status,
            stageHistory: [...app.stageHistory, historyEntry],
            timeline: [...newTimelineEvents, ...app.timeline],
            // Determine high-level status based on stages/status
            status:
            stageId === "Joined"
            ? ApplicationStatus.HIRED
            : status === "Rejected"
            ? ApplicationStatus.REJECTED
            : stageId === "Application Received"
            ? ApplicationStatus.NEW
            : ApplicationStatus.SHORTLISTED,
        };
      })
    );
    showToast("Stage Updated Successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to update stage", "error");
    }
  };

  const scheduleInterview = (candidateId, interviewData, notify) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== candidateId) return app;

        const timestamp = new Date().toLocaleString();
        const adminName = user?.name || "Admin";
        const newTimelineEvents = [];

        const interview = {
          id: `int_${uuidv4()}`,
          status: "Scheduled",
          ...interviewData,
        };

        let emailSent = false;
        let whatsappSent = false;

        if (notify) {
          const processText = (text) =>
            text
              .replace(/{candidateName}/g, app.candidateName)
              .replace(/{jobTitle}/g, app.jobTitle)
              .replace(/{date}/g, interview.date)
              .replace(/{time}/g, interview.time)
              .replace(/{mode}/g, interview.mode)
              .replace(/{meetingLink}/g, interview.meetingLink || "N/A")
              .replace(/{interviewerName}/g, interview.interviewerName);

          const emailSub = processText(INTERVIEW_TEMPLATES.emailSubject);
          const emailBody = processText(INTERVIEW_TEMPLATES.emailBody);
          const waBody = processText(INTERVIEW_TEMPLATES.whatsapp);

          if (app.email) {
            sendEmail(app.email, emailSub, emailBody);
            emailSent = true;
            newTimelineEvents.push({
              id: `evt_mail_int_${uuidv4()}`,
              type: "email",
              content: `Interview Invitation Sent`,
              date: timestamp,
              user: "System",
            });
          }

          if (app.phone) {
            sendWhatsApp(app.phone, waBody);
            whatsappSent = true;
            newTimelineEvents.push({
              id: `evt_wa_int_${uuidv4()}`,
              type: "whatsapp",
              content: `WhatsApp Interview Reminder Sent`,
              date: timestamp,
              user: "System",
            });
          }
        }

        newTimelineEvents.push({
          id: `evt_int_${uuidv4()}`,
          type: "interview",
          content: `Interview Scheduled: ${interview.date} @ ${interview.time}`,
          date: timestamp,
          user: adminName,
          meta: interview,
        });

        // Also add a generic history entry for the record
        const historyEntry = {
          stageId: app.currentStage,
          stageName: "Interview Scheduled",
          status: app.currentStageStatus,
          updatedAt: timestamp,
          updatedBy: adminName,
          note: `Interview with ${interview.interviewerName}`,
          emailSent,
          whatsappSent,
          interviewScheduled: true,
        };

        return {
          ...app,
          upcomingInterview: interview,
          stageHistory: [...app.stageHistory, historyEntry],
          timeline: [...newTimelineEvents, ...app.timeline],
        };
      })
    );
    showToast("Interview Scheduled Successfully", "success");
  };

  const updateApplication = (id, data) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...data } : app))
    );
  };

  const addTimelineEvent = (appId, event) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return { ...app, timeline: [event, ...app.timeline] };
        }
        return app;
      })
    );
  };

  const getJob = (id) => jobs.find((j) => String(j.id) === String(id));
  const getApplication = (id) => applications.find((a) => String(a.id) === String(id));

  return (
    <StoreContext.Provider
      value={{
        jobs,
        applications,
        user,
        users,
        setUsers,
        usersLoading,
        updateUserProfile,
        isAuthenticated,
        notifications,
        login,
        logout,
        addJob,
        updateJob,
        deleteJob,
        addUser,
        removeUser,
        updateApplicationStatus,
        updateCandidateStage,
        scheduleInterview,
        updateApplication,
        addTimelineEvent,
        getJob,
        getApplication,
        showToast,
        apiAddJob,
        apiUpdateJob,
        apiFetchJobs,
      }}
    >
      {children}
      {/* Simple Toast Display (Optional) */}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
