import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { JobStatus } from '../types';
import SchemaBuilder from './SchemaBuilder';
import { ChevronLeft, Save, Loader2, Layout, AlignLeft, ListChecks } from 'lucide-react';

const JobEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getJob, addJob, updateJob } = useStore();
  const isEdit = !!id;

  const [activeTab, setActiveTab] = useState('details');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    department: '',
    location: '',
    workType: 'Onsite',
    type: 'Full-time',
    overview: '',
    responsibilities: '',
    requiredSkills: [],
    niceToHaveSkills: [],
    openings: 1,
    experienceRange: { min: 0, max: 0 },
    salaryRange: { min: 0, max: 0, currency: 'USD' },
    category: 'General',
    priority: 'Medium',
    status: JobStatus.DRAFT,
    isFeatured: false,
    showOnCareers: true,
    formSteps: [{ id: 'step1', title: 'Application' }],
    formSchema: [],
  });

  const [skillsInput, setSkillsInput] = useState({ required: '', nice: '' });

  useEffect(() => {
    if (isEdit && id) {
      const job = getJob(id);
      if (job) {
        setFormData(job);
        setSkillsInput({
            required: job.requiredSkills.join(', '),
            nice: job.niceToHaveSkills.join(', ')
        });
      } else {
        navigate('/jobs');
      }
    }
  }, [isEdit, id, getJob, navigate]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEdit && formData.title) {
        const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, isEdit]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleCheckboxChange = (e) => {
      const { name, checked } = e.target;
      setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleNestedChange = (parent, key, value) => {
      setFormData(prev => ({
          ...prev,
          [parent]: { ...prev[parent], [key]: parseFloat(value) || 0 }
      }));
  };

  const handleSkillsChange = (type, value) => {
      setSkillsInput(prev => ({ ...prev, [type]: value }));
      const skillsArray = value.split(',').map(s => s.trim()).filter(s => s);
      setFormData(prev => ({
          ...prev,
          [type === 'required' ? 'requiredSkills' : 'niceToHaveSkills']: skillsArray
      }));
  };

  const handleSchemaChange = (newSchema, newSteps) => {
    setFormData(prev => ({ ...prev, formSchema: newSchema, formSteps: newSteps }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const jobPayload = {
        ...formData,
        id: isEdit ? id : Math.random().toString(36).substr(2, 9),
        postedDate: isEdit ? formData.postedDate : new Date().toISOString().split('T')[0],
      };

      if (isEdit) {
        updateJob(jobPayload);
      } else {
        addJob(jobPayload);
      }
      setIsLoading(false);
      navigate('/jobs');
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/jobs')} className="p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Job' : 'Create New Job'}</h1>
          <p className="text-gray-500 text-sm">Configure job details, description and form.</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
          <TabButton active={activeTab === 'details'} onClick={() => setActiveTab('details')} icon={<Layout size={18} />} label="Job Details" />
          <TabButton active={activeTab === 'description'} onClick={() => setActiveTab('description')} icon={<AlignLeft size={18} />} label="Description & Skills" />
          <TabButton active={activeTab === 'form'} onClick={() => setActiveTab('form')} icon={<ListChecks size={18} />} label="Application Form" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* TAB 1: DETAILS */}
        <div className={`${activeTab === 'details' ? 'block' : 'hidden'} space-y-6`}>
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                        <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className={formInputClass} placeholder="e.g. Senior Software Engineer" />
                    </div>
                    <div className="md:col-span-2">
                         <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                         <div className="flex">
                             <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">/careers/</span>
                             <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} className={`${formInputClass} rounded-l-none`} />
                         </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <input type="text" name="department" required value={formData.department} onChange={handleInputChange} className={formInputClass} placeholder="Engineering" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Category</label>
                        <input type="text" name="category" value={formData.category} onChange={handleInputChange} className={formInputClass} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input type="text" name="location" required value={formData.location} onChange={handleInputChange} className={formInputClass} placeholder="City, Country" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Type</label>
                        <select name="workType" value={formData.workType} onChange={handleInputChange} className={formInputClass}>
                            <option value="Onsite">Onsite</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                        <select name="type" value={formData.type} onChange={handleInputChange} className={formInputClass}>
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                            <option>Internship</option>
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                         <select name="priority" value={formData.priority} onChange={handleInputChange} className={formInputClass}>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                         </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">Configuration & Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Experience Range (Years)</label>
                         <div className="flex items-center gap-2">
                             <input type="number" min="0" placeholder="Min" value={formData.experienceRange?.min} onChange={(e) => handleNestedChange('experienceRange', 'min', e.target.value)} className={formInputClass} />
                             <span className="text-gray-400">-</span>
                             <input type="number" min="0" placeholder="Max" value={formData.experienceRange?.max} onChange={(e) => handleNestedChange('experienceRange', 'max', e.target.value)} className={formInputClass} />
                         </div>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range ({formData.salaryRange?.currency})</label>
                         <div className="flex items-center gap-2">
                             <input type="number" placeholder="Min" value={formData.salaryRange?.min} onChange={(e) => handleNestedChange('salaryRange', 'min', e.target.value)} className={formInputClass} />
                             <span className="text-gray-400">-</span>
                             <input type="number" placeholder="Max" value={formData.salaryRange?.max} onChange={(e) => handleNestedChange('salaryRange', 'max', e.target.value)} className={formInputClass} />
                         </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Openings</label>
                        <input type="number" name="openings" min="1" value={formData.openings} onChange={handleInputChange} className={formInputClass} />
                    </div>

                     <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                             <select name="status" value={formData.status} onChange={handleInputChange} className={formInputClass}>
                                {Object.values(JobStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-3 md:mt-6">
                            <input 
                                type="checkbox" 
                                id="featured" 
                                name="isFeatured" 
                                checked={formData.isFeatured} 
                                onChange={handleCheckboxChange} 
                                className="w-4 h-4 border border-gray-300 rounded bg-white focus:ring-primary cursor-pointer accent-green-600" 
                            />
                            <label htmlFor="featured" className="text-sm text-gray-700 select-none cursor-pointer">Featured Job</label>
                        </div>
                        <div className="flex items-center gap-3 md:mt-6">
                            <input 
                                type="checkbox" 
                                id="show" 
                                name="showOnCareers" 
                                checked={formData.showOnCareers} 
                                onChange={handleCheckboxChange} 
                                className="w-4 h-4 border border-gray-300 rounded bg-white focus:ring-primary cursor-pointer accent-green-600" 
                            />
                            <label htmlFor="show" className="text-sm text-gray-700 select-none cursor-pointer">Show on Careers Site</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* TAB 2: DESCRIPTION */}
        <div className={`${activeTab === 'description' ? 'block' : 'hidden'} space-y-6`}>
             <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Job Description</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
                        <textarea name="overview" rows={3} value={formData.overview} onChange={handleInputChange} className={formInputClass} placeholder="Short introduction to the role..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
                        <textarea name="responsibilities" rows={6} value={formData.responsibilities} onChange={handleInputChange} className={`${formInputClass} font-mono text-sm`} placeholder="- List item 1..." />
                        <p className="text-xs text-gray-400 mt-1">Supports Markdown</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                        <input type="text" value={skillsInput.required} onChange={(e) => handleSkillsChange('required', e.target.value)} className={formInputClass} placeholder="React, TypeScript, CSS..." />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.requiredSkills?.map((skill, i) => <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{skill}</span>)}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nice-to-have Skills</label>
                        <input type="text" value={skillsInput.nice} onChange={(e) => handleSkillsChange('nice', e.target.value)} className={formInputClass} placeholder="AWS, Docker..." />
                         <div className="flex flex-wrap gap-2 mt-2">
                            {formData.niceToHaveSkills?.map((skill, i) => <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{skill}</span>)}
                        </div>
                    </div>
                </div>
             </div>
        </div>

        {/* TAB 3: FORM BUILDER */}
        <div className={`${activeTab === 'form' ? 'block' : 'hidden'}`}>
             <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Application Form Builder</h2>
                <p className="text-sm text-gray-500 mb-6">Customize the questions and steps for this job application.</p>
                <SchemaBuilder 
                    fields={formData.formSchema || []} 
                    steps={formData.formSteps || []}
                    onChange={handleSchemaChange} 
                />
            </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 flex justify-between items-center gap-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:pl-64">
             <div className="text-sm text-gray-500 hidden md:block">
                {isEdit ? `Last updated: ${formData.postedDate}` : 'Draft mode'}
             </div>
             <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => navigate('/jobs')}
                    className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {isEdit ? 'Update Job' : 'Create Job'}
                </button>
             </div>
        </div>
      </form>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${active ? 'border-primary text-primary font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
    >
        {icon}
        {label}
    </button>
);

// CSS Helper classes injected in render to avoid clutter
const formInputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white";

export default JobEditor;