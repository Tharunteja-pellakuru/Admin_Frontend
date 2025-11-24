// JobEditor.jsx
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import EditableFieldcard from "./EditableFieldCard";
import SchemaBuilder from "./SchemaBuilder";
import { useStore } from "../context/StoreContext";
import { JobStatus } from "../types";
import { ChevronLeft, Save, Loader2, Layout, ListChecks } from "lucide-react";
import { Select, ChipInput, Input } from "./ui";

/**
 * JobEditor
 * - Two-step editor (Job Details / Forms)
 * - Next does NOT call API
 * - Save dropdown moved INSIDE the <form> (top-right)
 * - Uses apiAddJob / apiUpdateJob from useStore
 */

const JobEditor = () => {
  const navigate = useNavigate();
  const { id: paramId } = useParams();

  const { getJob, addJob, updateJob, showToast, apiAddJob, apiUpdateJob } =
    useStore();

  const totalSteps = 2;
  const [step, setStep] = useState(0);

  const [isLoading, setIsLoading] = useState(false); // used during publish
  const [isSavingDraft, setIsSavingDraft] = useState(false); // used during draft save
  const [savedMessage, setSavedMessage] = useState("");
  const [isPreviewing, setIsPreviewing] = useState(false);

  const [jobId, setJobId] = useState(paramId || null);
  const [isEditLocal, setIsEditLocal] = useState(!!paramId);

  // ----------------------
  // BASIC FIELDS (dummy default values included)
  // ----------------------
  const [title, setTitle] = useState("Jr Mern Stack Developer");
  const [slug, setSlug] = useState("");

  // JOB DETAILS (details JSON)
  const [jobDetails, setJobDetails] = useState({
    department: "Development",
    category: "Frontend Engineering",
    location: "Hyderabad",
    workType: "Remote",
    type: "Full-time",
    openings: 3,
    experienceRange: { min: 1, max: 3 },
    salaryRange: { min: 5, max: 10, currency: "INR" },
    priority: "Medium",
    status: JobStatus.PUBLISHED,
  });

  const DEPARTMENT_OPTIONS = ["Design", "Development", "Marketing"];
  const CATEGORY_MAP = {
    Design: ["UI/UX Designer", "Graphic Designer", "Product Designer"],
    Development: [
      "Frontend Engineering",
      "Backend Engineering",
      "Full-Stack Engineering",
      "DevOps",
    ],
    Marketing: ["SEO Specialist", "Content Writer", "Social Media Manager"],
  };

  // ----------------------
  // JOB DESCRIPTION
  // ----------------------
  const [jobDescription, setJobDescription] = useState({
    overview:
      "A Junior MERN Stack Developer is an entry-level role focused on building web applications using the MongoDB, Express.js, React, and Node.js stack. They write and debug code for both front-end and back-end development, collaborate with senior developers to learn best practices, and assist in managing databases, building user interfaces, and ensuring overall application functionality.",
    responsibilities: `- **Develop and maintain applications:** Design, develop, and maintain web applications using the MERN stack (MongoDB, Express.js, React.js, Node.js).
- **Write clean and efficient code:** Produce modular, reusable, and high-quality code for both front-end and back-end components, following best industry practices.
- **Collaborate with the team:** Work with cross-functional teams, including senior developers, to define, design, and implement new features.
- **Troubleshoot and debug:** Identify, diagnose, and resolve bugs to ensure smooth and efficient application performance.
- **Optimize performance:** Enhance application speed and scalability to provide a seamless and responsive user experience.
- **Participate in code reviews:** Engage in regular code reviews to learn from experienced developers and maintain high coding standards across the project.`,
    requiredSkills: ["React", "Node.js", "Express.js", "MongoDB", "JavaScript"],
    niceToHaveSkills: ["TypeScript", "Redux", "Next.js", "Docker"],
  });

  // No longer needed - skills will be managed as arrays directly

  // ----------------------
  // BASIC FORM (defaults included)
  // ----------------------
  const [basicFormSchema, setBasicFormSchema] = useState([
    {
      id: "basic-fullname",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "John Doe",
      helpText: "",
    },
    {
      id: "basic-email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "john@example.com",
      helpText: "",
    },
    {
      id: "basic-phone",
      label: "Phone Number",
      type: "number",
      required: true,
      placeholder: "9876543210",
      helpText: "",
    },
    {
      id: "basic-resume",
      label: "Resume Upload",
      type: "file",
      required: true,
    },
    {
      id: "basic-linkedin",
      label: "LinkedIn URL",
      type: "url",
      required: false,
    },
  ]);

  // ----------------------
  // APPLICATION FORM
  // ----------------------
  const [applicationForm, setApplicationForm] = useState({
    schema: [
      {
        id: "app-q1",
        stepId: "step-1",
        label: "Tell us about your most complex project.",
        type: "textarea",
        required: true,
        placeholder: "",
        helpText: "Max 500 words.",
      },
    ],
    steps: [{ id: "step-1", title: "Questions" }],
  });

  // ----------------------
  // Load job if editing
  // ----------------------
  useEffect(() => {
    if (!paramId) return;
    const job = getJob(paramId);
    if (!job) {
      navigate("/jobs");
      return;
    }
    setJobId(job.id);
    setIsEditLocal(true);

    setTitle(job.title || "");
    setSlug(job.slug || "");

    if (job.details) setJobDetails(job.details);
    if (job.description) setJobDescription(job.description);
    if (job.basicFormSchema) setBasicFormSchema(job.basicFormSchema);
    
    // Ensure applicationForm has proper structure
    if (job.applicationForm) {
      const appForm = job.applicationForm;
      setApplicationForm({
        schema: Array.isArray(appForm.schema) ? appForm.schema : [],
        steps: Array.isArray(appForm.steps) ? appForm.steps : [{ id: "step-1", title: "Questions" }],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId, getJob]);

  // auto-slug for new jobs
  useEffect(() => {
    if (!isEditLocal && title) {
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      // Append a short random string to ensure uniqueness
      const uniqueSuffix = Date.now().toString(36).slice(-4);
      setSlug(`${baseSlug}-${uniqueSuffix}`);
    }
  }, [title, isEditLocal]);

  // ----------------------
  // Handlers
  // ----------------------
  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedDetailChange = (parent, key, value) => {
    const parsed = parseFloat(value);
    // If it's a number-like value, parse it; otherwise keep as string (for currency, etc.)
    const finalValue = !isNaN(parsed) && value !== '' ? parsed : value;
    setJobDetails((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [key]: finalValue },
    }));
  };

  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;
    setJobDescription((prev) => ({ ...prev, [name]: value }));
  };



  // Basic form helpers
  const addBasicField = () => {
    const newField = {
      id: `basic-${uuidv4()}`,
      label: "New Field",
      type: "text",
      required: false,
      placeholder: "",
      helpText: "",
    };
    setBasicFormSchema((prev) => [...prev, newField]);
    setStep(1);
  };

  const updateBasicField = (id, key, value) => {
    setBasicFormSchema((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  };

  // Application form helpers
  const handleApplicationSchemaChange = (schema, steps) => {
    setApplicationForm({ schema, steps });
  };

  const addApplicationField = (stepId) => {
    const newField = {
      id: `app-${uuidv4()}`,
      stepId: stepId || applicationForm.steps[0]?.id,
      label: "New Question",
      type: "text",
      required: false,
    };
    setApplicationForm((prev) => ({
      ...prev,
      schema: [...prev.schema, newField],
    }));
    setStep(1);
  };

  // --------------------------------------------------
  // Build payload consumed by apiAddJob / apiUpdateJob
  // (keeps frontend keys inside JSON)
  // --------------------------------------------------
const buildDBPayload = (overrides = {}) => {
  const details = { ...jobDetails, ...overrides.details };

  // --- Convert application schema to desired format ---
  const applicationFormSchema = {};

  applicationForm.steps.forEach(step => {
    applicationFormSchema[step.title] = applicationForm.schema.filter(
      f => f.stepId === step.id
    );
  });

  return {
    title,
    slug,
    details,
    description: jobDescription,

    // basic form as-is
    basicFormSchema,

    // new converted application form
    applicationFormSchema
  };
};


  // ----------------------
  // Save as Draft (calls API)
  // ----------------------
  const saveAsDraft = async () => {
    setIsSavingDraft(true);
    try {
      const payload = buildDBPayload();
      payload.requirements = payload.requirements || {};
      payload.requirements.status = JobStatus.DRAFT;

      console.log('💾 Saving draft with title:', title);
      console.log('💾 Draft payload:', payload);

      let result;
      if (isEditLocal && jobId) {
        const jobObjForUpdate = {
          id: jobId,
          title,
          slug,
          details: payload.details,
          description: payload.description,
          basicFormSchema: payload.basicFormSchema,
          applicationForm: payload.applicationFormSchema,
        };
        result = await apiUpdateJob(jobObjForUpdate);
      } else {
        const jobDataToCreate = {
          title: payload.title,
          slug: payload.slug,
          details: payload.details,
          description: payload.description,
          basicFormSchema: payload.basicFormSchema,
          applicationForm: payload.applicationFormSchema,
        };
        console.log('💾 Creating draft job:', jobDataToCreate);
        result = await apiAddJob(jobDataToCreate);
      }

      const savedJob = result.job;
      if (!isEditLocal && savedJob?.id) {
        setJobId(savedJob.id);
        setIsEditLocal(true);
        addJob(savedJob);
      } else if (savedJob?.id) {
        updateJob(savedJob);
      }

      setSavedMessage("Draft saved");
      showToast("Draft saved", "success");
      setTimeout(() => setSavedMessage(""), 2000);
    } catch (err) {
      console.error("Save draft error:", err);
      showToast(err.message || "Failed to save draft", "error");
    } finally {
      setIsSavingDraft(false);
    }
  };

  // ----------------------
  // Publish job (calls API)
  // ----------------------
  // ----------------------
  // Save Job (respects dropdown status)
  // ----------------------
  const saveJob = async () => {
    setIsLoading(true);
    try {
      const payload = buildDBPayload();
      // payload.requirements.status is already set from jobDetails.status via buildDBPayload

      console.log('💾 Saving job with title:', title);
      console.log('💾 Full payload:', payload);

      let result;
      if (isEditLocal && jobId) {
        const jobObjForUpdate = {
          id: jobId,
          title,
          slug,
          details: payload.details,
          description: payload.description,
          basicFormSchema: payload.basicFormSchema,
          applicationForm: payload.applicationFormSchema,
        };
        console.log('💾 Updating job:', jobObjForUpdate);
        console.log('📝 applicationFormSchema from payload:', payload.applicationFormSchema);
        result = await apiUpdateJob(jobObjForUpdate);
      } else {
        const jobDataToCreate = {
          title: payload.title,
          slug: payload.slug,
          details: payload.details,
          description: payload.description,
          basicFormSchema: payload.basicFormSchema,
          applicationForm: payload.applicationFormSchema,
        };
        console.log('💾 Creating new job:', jobDataToCreate);
        console.log('📝 applicationFormSchema from payload:', payload.applicationFormSchema);
        console.log('📝 Is applicationForm empty?', Object.keys(payload.applicationFormSchema || {}).length === 0);
        result = await apiAddJob(jobDataToCreate);
      }

      const finalJob = result.job;
      if (!isEditLocal && finalJob?.id) addJob(finalJob);
      else if (finalJob?.id) updateJob(finalJob);

      showToast("Job saved successfully", "success");
      navigate("/jobs");
    } catch (err) {
      console.error("Save error:", err);
      showToast(err.message || "Failed to save job", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------
  // Explicit Publish (from dropdown)
  // ----------------------
  const publishJobExplicit = async () => {
    // Update local state first to reflect change
    setJobDetails(prev => ({ ...prev, status: JobStatus.PUBLISHED }));
    
    // Then save
    setIsLoading(true);
    try {
      const payload = buildDBPayload({ details: { status: JobStatus.PUBLISHED } });
      payload.requirements = payload.requirements || {};
      payload.requirements.status = JobStatus.PUBLISHED;

      console.log('💾 Publishing job with title:', title);
      console.log('💾 Publish payload:', payload);

      let result;
      if (isEditLocal && jobId) {
        const jobObjForUpdate = {
          id: jobId,
          title,
          slug,
          details: payload.details,
          description: payload.description,
          basicFormSchema: payload.basicFormSchema,
          applicationForm: payload.applicationFormSchema,
        };
        console.log('💾 Publishing existing job:', jobObjForUpdate);
        result = await apiUpdateJob(jobObjForUpdate);
      } else {
        const jobDataToCreate = {
          title: payload.title,
          slug: payload.slug,
          details: payload.details,
          description: payload.description,
          basicFormSchema: payload.basicFormSchema,
          applicationForm: payload.applicationFormSchema,
        };
        console.log('💾 Publishing new job:', jobDataToCreate);
        result = await apiAddJob(jobDataToCreate);
      }

      const finalJob = result.job;
      if (!isEditLocal && finalJob?.id) addJob(finalJob);
      else if (finalJob?.id) updateJob(finalJob);

      showToast("Job published successfully", "success");
      navigate("/jobs");
    } catch (err) {
      console.error("Publish error:", err);
      showToast(err.message || "Failed to publish job", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------
  // UI helpers / Navigation
  // ----------------------
  const goNext = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  };
  const goBack = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setStep((s) => Math.max(s - 1, 0));
  };
  const togglePreview = () => setIsPreviewing((p) => !p);

  const SavedIndicator = () =>
    isSavingDraft ? (
      <div className="text-sm flex items-center gap-2 text-gray-600">
        <Loader2 size={14} className="animate-spin" />
        Saving...
      </div>
    ) : savedMessage ? (
      <div className="text-sm text-primary-600">{savedMessage}</div>
    ) : null;

  const formInputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 bg-gray-50";

  // Save dropdown state + ref (now used inside form)
  const [saveOpen, setSaveOpen] = useState(false);
  const saveRef = useRef();

  // close dropdown on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (!saveRef.current) return;
      if (!saveRef.current.contains(e.target)) setSaveOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-32">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/jobs")}
          className="p-2 hover:bg-gray-200 rounded-full"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">
          {isEditLocal ? "Edit Job" : "Create Job"}
        </h1>
      </div>

      {/* TABS */}
      <div className="flex gap-4 border-b mb-6 overflow-x-auto">
        <button
          onClick={() => setStep(0)}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 ${
            step === 0
              ? "border-primary-600 text-primary-600"
              : "border-transparent"
          }`}
        >
          <Layout size={18} /> Job Details
        </button>

        <button
          onClick={() => setStep(1)}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 ${
            step === 1
              ? "border-primary-600 text-primary-600"
              : "border-transparent"
          }`}
        >
          <ListChecks size={18} /> Forms
        </button>
      </div>

      {/* FORM (Save dropdown moved INSIDE form at top-right) */}
      <form
        id="jobForm"
        onSubmit={(e) => e.preventDefault()}
        className="space-y-8 relative bg-transparent"
      >
        {/* Save dropdown positioned at top-right inside the form */}
        <div className="flex justify-end mb-2">
          <div className="relative" ref={saveRef}>
            <button
              type="button"
              onClick={() => setSaveOpen((s) => !s)}
              className="px-3 py-1 bg-primary-600 text-white rounded inline-flex items-center gap-2"
            >
              <Save size={14} />
              Save
              <svg
                className="w-3 h-3 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.25 7.5L10 12.25 14.75 7.5z" />
              </svg>
            </button>

            {saveOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow z-50">
                <button
                  onClick={() => {
                    setSaveOpen(false);
                    saveAsDraft();
                  }}
                  disabled={isSavingDraft}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  {isSavingDraft ? "Saving..." : "Save as Draft"}
                </button>
                <button
                  onClick={() => {
                    setSaveOpen(false);
                    publishJobExplicit();
                  }}
                  disabled={isLoading}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  {isLoading ? "Publishing..." : "Publish Job"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PAGE 1 */}
        {step === 0 && (
          <div className="space-y-6">
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Job Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={formInputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Slug</label>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className={formInputClass}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Department</label>
                  <select
                    name="department"
                    value={jobDetails.department}
                    onChange={(e) => {
                      const dept = e.target.value;
                      setJobDetails((prev) => ({
                        ...prev,
                        department: dept,
                        category: CATEGORY_MAP[dept]?.[0] || "",
                      }));
                    }}
                    className={formInputClass}
                  >
                    {DEPARTMENT_OPTIONS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    name="category"
                    value={jobDetails.category}
                    onChange={handleDetailChange}
                    className={formInputClass}
                  >
                    {(CATEGORY_MAP[jobDetails.department] || []).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Location</label>
                  <input
                    name="location"
                    value={jobDetails.location}
                    onChange={handleDetailChange}
                    className={formInputClass}
                  />
                </div>

                <div>
                  <Select
                    label="Work Type"
                    name="workType"
                    value={jobDetails.workType}
                    onChange={handleDetailChange}
                  >
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                  </Select>
                </div>

                <div>
                  <Select
                    label="Employment Type"
                    name="type"
                    value={jobDetails.type}
                    onChange={handleDetailChange}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Experience Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={jobDetails.experienceRange.min}
                      onChange={(e) =>
                        handleNestedDetailChange(
                          "experienceRange",
                          "min",
                          e.target.value
                        )
                      }
                      className={formInputClass}
                    />
                    <input
                      type="number"
                      value={jobDetails.experienceRange.max}
                      onChange={(e) =>
                        handleNestedDetailChange(
                          "experienceRange",
                          "max",
                          e.target.value
                        )
                      }
                      className={formInputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Openings</label>
                  <input
                    type="number"
                    name="openings"
                    value={jobDetails.openings}
                    onChange={handleDetailChange}
                    className={formInputClass}
                  />
                </div>

                <div>
                  <Select
                    label="Save As"
                    name="status"
                    value={jobDetails.status}
                    onChange={handleDetailChange}
                  >
                    <option value={JobStatus.DRAFT}>Draft</option>
                    <option value={JobStatus.PUBLISHED}>Published</option>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Job Description</h2>

              <label className="text-sm font-medium">Overview</label>
              <textarea
                name="overview"
                value={jobDescription.overview}
                onChange={handleDescriptionChange}
                rows={5}
                className={formInputClass}
              />

              <label className="text-sm font-medium mt-4 block">
                Responsibilities
              </label>
              <textarea
                name="responsibilities"
                value={jobDescription.responsibilities}
                onChange={handleDescriptionChange}
                rows={8}
                className={formInputClass}
              />

              <div className="mt-4">
                <ChipInput
                  label="Required Skills"
                  value={jobDescription.requiredSkills}
                  onChange={(skills) => setJobDescription(prev => ({ ...prev, requiredSkills: skills }))}
                  placeholder="Type skill and press Enter"
                  helpText="Add each skill one at a time by pressing Enter or comma"
                />
              </div>

              <div className="mt-4">
                <ChipInput
                  label="Nice-to-have Skills"
                  value={jobDescription.niceToHaveSkills}
                  onChange={(skills) => setJobDescription(prev => ({ ...prev, niceToHaveSkills: skills }))}
                  placeholder="Type skill and press Enter"
                  helpText="Add each skill one at a time by pressing Enter or comma"
                />
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Basic Form</h2>

              <button
                onClick={addBasicField}
                type="button"
                className="px-3 py-1 bg-primary-600 text-white rounded mb-4"
              >
                + Add Field
              </button>

              <div className="space-y-4">
                {basicFormSchema.map((field) => (
                  <EditableFieldcard
                    key={field.id}
                    field={field}
                    updateField={(key, val) =>
                      updateBasicField(field.id, key, val)
                    }
                  />
                ))}
              </div>
            </div>

            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">
                Application Form Builder
              </h2>

              <SchemaBuilder
                fields={applicationForm.schema}
                steps={applicationForm.steps}
                onChange={handleApplicationSchemaChange}
                onAddQuestion={addApplicationField}
                onPreview={togglePreview}
              />
            </div>
          </div>
        )}
      </form>

      {/* BOTTOM ACTION BAR */}
      <div className="border-t p-4 flex justify-between items-center gap-4">
        <div className="hidden md:block">
          <SavedIndicator />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className={`px-4 py-2 border rounded ${
              step === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Back
          </button>

          {step < totalSteps - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="px-4 py-2 bg-primary-600 text-white rounded"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={saveJob}
              disabled={isLoading}
              className="px-4 py-2 bg-primary-700 text-white rounded flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isEditLocal ? "Update Job" : "Create Job"}
            </button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewing && (
        <ApplicationPreviewModal
          applicationForm={applicationForm}
          onClose={togglePreview}
        />
      )}
    </div>
  );
};

// ----------------------
// Preview Modal
// ----------------------
const ApplicationPreviewModal = ({ applicationForm, onClose }) => {
  const fields = applicationForm.schema || [];
  const steps = applicationForm.steps || [];
  const [stepId, setStepId] = useState(steps[0]?.id || null);

  useEffect(() => {
    setStepId(steps[0]?.id || null);
  }, [steps]);

  const currentFields = fields.filter((f) => f.stepId === stepId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Application Preview</h3>
          <button onClick={onClose} className="text-gray-600 px-2">
            Close
          </button>
        </div>

        <div className="p-4">
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {steps.map((s) => (
              <button
                key={s.id}
                onClick={() => setStepId(s.id)}
                className={`px-3 py-1 rounded ${
                  stepId === s.id ? "bg-green-600 text-white" : "bg-gray-200"
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          {currentFields.length > 0 ? (
            <div className="space-y-4">
              {currentFields.map((f) => (
                <div key={f.id} className="border rounded p-3">
                  <label className="font-medium text-sm">
                    {f.label}
                    {f.required && <span className="text-red-500"> *</span>}
                  </label>
                  <div className="text-xs text-gray-500 mt-1">
                    [Preview: {String(f.type).toUpperCase()}]
                  </div>
                  {f.helpText && (
                    <p className="text-xs text-gray-400 mt-1">{f.helpText}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No fields configured for this step.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobEditor;
