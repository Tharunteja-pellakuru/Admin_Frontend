import React, { createContext, useContext, useState, useEffect } from "react";
import { ApplicationStatus } from "../types";
import {
  MOCK_JOBS,
  MOCK_APPLICATIONS,
  HIRING_STAGES,
  NOTIFICATION_TEMPLATES,
  INTERVIEW_TEMPLATES,
} from "../constants";

const StoreContext = createContext(undefined);
const API_BASE = "http://localhost:5000";

const INITIAL_USERS = [
  { id: "u1", name: "Admin User", email: "admin@careers.com", role: "admin" },
  { id: "u2", name: "John Editor", email: "john@careers.com", role: "editor" },
];

export const StoreProvider = ({ children }) => {
  // --- Persistence Helper ---
  const getSaved = (key, fallback) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  };

  const [user, setUser] = useState(() =>
    getSaved("careers_user_session", null)
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!getSaved("careers_user_session", null)
  );

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const [jobs, setJobs] = useState(() => getSaved("careers_jobs", MOCK_JOBS));
  const [applications, setApplications] = useState(() =>
    getSaved("careers_applications", MOCK_APPLICATIONS)
  );

  const [notifications, setNotifications] = useState([]);

  // --- Persistence Effects ---

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await res.json();
        console.log(data);

        if (!res.ok) throw new Error(data.message || "Failed to fetch users");

        setUsers(data.users);
        setUsersLoading(false);
      } catch (err) {
        console.error("User fetch error:", err.message);
        showToast("Unable to fetch users from server", "error");

        // fallback to local users
        setUsers(INITIAL_USERS);
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    localStorage.setItem("careers_jobs", JSON.stringify(jobs));
  }, [jobs]);
  useEffect(() => {
    localStorage.setItem("careers_applications", JSON.stringify(applications));
  }, [applications]);
  useEffect(() => {
    if (user)
      localStorage.setItem("careers_user_session", JSON.stringify(user));
    else localStorage.removeItem("careers_user_session");
  }, [user]);

  const showToast = (message, type) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  // --- Mock Backend Functions ---
  const sendEmail = (to, subject, body) => {
    console.log(
      `[MOCK EMAIL]\nTo: ${to}\nSubject: ${subject}\nBody: ${body}\n-------------------`
    );
    return true;
  };

  const sendWhatsApp = (phone, message) => {
    console.log(
      `[MOCK WHATSAPP]\nTo: ${phone}\nMessage: ${message}\n-------------------`
    );
    return true;
  };
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

  const updateJob = (updatedJob) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === updatedJob.id ? updatedJob : j))
    );
    showToast("Job updated successfully", "success");
  };

  const deleteJob = (id) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    showToast("Job deleted successfully", "success");
  };

  // Add new Editor
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

      if (!res.ok) throw new Error(data.message || "Failed to add user");

      // backend returns the created user object
      setUsers((prev) => [...prev, data.user]);

      showToast("User added successfully", "success");
      return data.user;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  // Delete Editor
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
      if (!res.ok) throw new Error(data.message || "Failed to delete user");

      // update UI
      setUsers((prev) => prev.filter((u) => u.id !== userId));

      showToast("User removed successfully", "success");
      return true;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  // Update Admin Profile
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

      // update logged in user
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);

      // update user session
      localStorage.setItem("careers_user_session", JSON.stringify(updatedUser));

      // 🔥 FIX: update admin users table UI
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

  // Deprecated simple status update
  const updateApplicationStatus = (id, status) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const newEvent = {
            id: `evt_${Date.now()}`,
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

  const updateCandidateStage = (candidateId, stageId, status, note, notify) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== candidateId) return app;

        const stageDef = HIRING_STAGES.find((s) => s.id === stageId);
        if (!stageDef) return app;

        const timestamp = new Date().toLocaleString();
        const adminName = user?.name || "Admin";
        const newTimelineEvents = [];

        // 1. Send Notifications (Mock)
        let emailSent = false;
        let whatsappSent = false;

        if (notify && NOTIFICATION_TEMPLATES[stageId]) {
          const tmpl = NOTIFICATION_TEMPLATES[stageId];

          // Replace placeholders
          const processText = (text) =>
            text
              .replace(/{candidateName}/g, app.candidateName)
              .replace(/{jobTitle}/g, app.jobTitle)
              .replace(/{stageName}/g, stageDef.name);

          const emailSub = processText(tmpl.emailSubject);
          const emailBody = processText(tmpl.emailBody);
          const waBody = processText(tmpl.whatsapp);

          if (app.email) {
            sendEmail(app.email, emailSub, emailBody);
            emailSent = true;
            newTimelineEvents.push({
              id: `evt_mail_${Date.now()}`,
              type: "email",
              content: `Email sent: ${emailSub}`,
              date: timestamp,
              user: "System",
            });
          }

          if (app.phone) {
            sendWhatsApp(app.phone, waBody);
            whatsappSent = true;
            newTimelineEvents.push({
              id: `evt_wa_${Date.now()}`,
              type: "whatsapp",
              content: `WhatsApp sent: ${stageDef.name} update`,
              date: timestamp,
              user: "System",
            });
          }
        }

        // 2. Create History Entry
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

        // 3. Log Status Change to Timeline
        newTimelineEvents.push({
          id: `evt_stage_${Date.now()}`,
          type: "status_change",
          content: `Moved to ${stageDef.name} (${status})`,
          date: timestamp,
          user: adminName,
        });

        if (note) {
          newTimelineEvents.push({
            id: `evt_note_${Date.now()}`,
            type: "note",
            content: note,
            date: timestamp,
            user: adminName,
          });
        }

        return {
          ...app,
          currentStageId: stageId,
          currentStageStatus: status,
          stageHistory: [...app.stageHistory, historyEntry],
          timeline: [...newTimelineEvents, ...app.timeline],
          status:
            stageId === "13_joined"
              ? ApplicationStatus.HIRED
              : status === "Rejected"
              ? ApplicationStatus.REJECTED
              : stageId === "1_received"
              ? ApplicationStatus.NEW
              : ApplicationStatus.SHORTLISTED,
        };
      })
    );
    showToast("Stage Updated Successfully", "success");
  };

  const scheduleInterview = (candidateId, interviewData, notify) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== candidateId) return app;

        const timestamp = new Date().toLocaleString();
        const adminName = user?.name || "Admin";
        const newTimelineEvents = [];

        const interview = {
          id: `int_${Date.now()}`,
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
              id: `evt_mail_int_${Date.now()}`,
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
              id: `evt_wa_int_${Date.now()}`,
              type: "whatsapp",
              content: `WhatsApp Interview Reminder Sent`,
              date: timestamp,
              user: "System",
            });
          }
        }

        newTimelineEvents.push({
          id: `evt_int_${Date.now()}`,
          type: "interview",
          content: `Interview Scheduled: ${interview.date} @ ${interview.time}`,
          date: timestamp,
          user: adminName,
          meta: interview,
        });

        // Also add a generic history entry for the record
        const historyEntry = {
          stageId: app.currentStageId,
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

  const getJob = (id) => jobs.find((j) => j.id === id);
  const getApplication = (id) => applications.find((a) => a.id === id);

  return (
    <StoreContext.Provider
      value={{
        jobs,
        applications,
        user,
        users,
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
      }}
    >
      {children}
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
