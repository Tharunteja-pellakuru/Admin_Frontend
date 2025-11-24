import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { JobStatus } from "../types";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Archive,
  MapPin,
  Calendar,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import { Button, Input, Select, Badge, Modal, EmptyState, Card } from "./ui";

/**
 * JobsList Component
 * 
 * Displays a list of all jobs with filtering, pagination, and actions.
 * Refactored to use the new design system components.
 */
const JobsList = () => {
  const JOBS_PER_PAGE = 10;
  const { jobs, deleteJob, updateJob, apiFetchJobs, showToast } = useStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDept, setFilterDept] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [jobToDelete, setJobToDelete] = useState(null);
  const [jobToClose, setJobToClose] = useState(null);

  const departments = ["Design", "Development", "Marketing", "Media"];

  // Fetch jobs when component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        await apiFetchJobs();
        // apiFetchJobs already updates the jobs state in context
      } catch (err) {
        console.error("Error fetching jobs:", err);
        // Error is already handled in context with fallback to local storage
      }
    };

    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtering logic
  const filteredJobs = jobs.filter((job) => {
    const title = job.title?.toLowerCase() || "";
    const dept = job.details?.department?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    const matchesSearch = title.includes(search) || dept.includes(search);
    const matchesStatus = filterStatus === "All" || job.details?.status === filterStatus;
    const matchesDept = filterDept === "All" || job.details?.department === filterDept;

    return matchesSearch && matchesStatus && matchesDept;
  });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  // Delete handler
  const confirmDelete = () => {
    if (jobToDelete) {
      deleteJob(jobToDelete.id);
      setJobToDelete(null);
    }
  };

  // Close job handler
  const confirmClose = () => {
    if (jobToClose) {
      const updatedDetails = {
        ...jobToClose.details,
        status: JobStatus.CLOSED,
      };
      updateJob({ ...jobToClose, details: updatedDetails });
      setJobToClose(null);
    }
  };

  // Get badge variant based on status
  const getStatusVariant = (status) => {
    switch (status) {
      case JobStatus.PUBLISHED:
        return 'success';
      case JobStatus.DRAFT:
        return 'gray';
      case JobStatus.CLOSED:
        return 'error';
      default:
        return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-500 mt-1">Manage your job postings</p>
        </div>
        
        <Link to="/jobs/new">
          <Button variant="primary" leftIcon={<Plus size={18} />}>
            Create Job
          </Button>
        </Link>
      </div>

      {/* Filters Card */}
      <Card padding="sm">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>

            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              {Object.values(JobStatus).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* Jobs Table */}
      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b text-gray-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Job Title</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Posted</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {currentJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12">
                    <EmptyState
                      variant="search"
                      title={searchTerm ? "No jobs found" : "No jobs yet"}
                      description={
                        searchTerm
                          ? "Try adjusting your search or filters"
                          : "Create your first job posting to get started"
                      }
                      action={
                        !searchTerm && (
                          <Link to="/jobs/new">
                            <Button variant="primary" leftIcon={<Plus size={16} />}>
                              Create First Job
                            </Button>
                          </Link>
                        )
                      }
                    />
                  </td>
                </tr>
              ) : (
                currentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{job.title}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                        <Briefcase size={12} /> {job.details?.type}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {job.details?.department}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} /> {job.details?.location}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Badge 
                        variant={getStatusVariant(job.details?.status)}
                        dot
                      >
                        {job.details?.status}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {job.details?.status !== JobStatus.CLOSED && (
                          <button
                            onClick={() => setJobToClose(job)}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Close job"
                          >
                            <Archive size={18} />
                          </button>
                        )}

                        <Link
                          to={`/jobs/${job.id}`}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit job"
                        >
                          <Edit size={18} />
                        </Link>

                        <button
                          onClick={() => setJobToDelete(job)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete job"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {currentJobs.length > 0 && (
          <div className="border-t px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredJobs.length)} of{" "}
              {filteredJobs.length} jobs
            </span>

            <div className="flex gap-2">
              <Button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>

              <Button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Close Job Modal */}
      <Modal
        isOpen={!!jobToClose}
        onClose={() => setJobToClose(null)}
        title="Close Job Posting"
        footer={
          <>
            <Button variant="ghost" onClick={() => setJobToClose(null)}>
              Cancel
            </Button>
            <Button variant="warning" onClick={confirmClose} leftIcon={<Archive size={16} />}>
              Close Job
            </Button>
          </>
        }
      >
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Archive size={24} />
          </div>
          <p className="text-gray-700">
            Are you sure you want to close{" "}
            <strong className="text-gray-900">{jobToClose?.title}</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            New applications will be disabled.
          </p>
        </div>
      </Modal>

      {/* Delete Job Modal */}
      <Modal
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        title="Delete Job"
        footer={
          <>
            <Button variant="ghost" onClick={() => setJobToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} leftIcon={<Trash2 size={16} />}>
              Delete Job
            </Button>
          </>
        }
      >
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={24} />
          </div>
          <p className="text-gray-700">
            Are you sure you want to delete{" "}
            <strong className="text-gray-900">{jobToDelete?.title}</strong>?
          </p>
          <p className="text-sm text-red-600 mt-2 font-medium">
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default JobsList;
