import React from "react";
import { useStore } from "../context/StoreContext";
import {
  Briefcase,
  TrendingUp,
  Archive,
  Zap,
  Users,
  Star,
  Trophy,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ApplicationStatus, JobStatus } from "../types";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { jobs, applications } = useStore();

  const navigate = useNavigate();

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((j) => j.status === JobStatus.PUBLISHED).length,
    closedJobs: jobs.filter((j) => j.status === JobStatus.CLOSED).length,
    totalApplications: applications.length,
    shortlisted: applications.filter(
      (a) => a.status === ApplicationStatus.SHORTLISTED
    ).length,
    hired: applications.filter((a) => a.status === ApplicationStatus.HIRED)
      .length,
  };

  const chartData = [
    { name: "Mon", applications: 4 },
    { name: "Tue", applications: 7 },
    { name: "Wed", applications: 5 },
    { name: "Thu", applications: 12 },
    { name: "Fri", applications: 8 },
    { name: "Sat", applications: 3 },
    { name: "Sun", applications: 2 },
  ];

  const recentApplications = applications.slice(0, 5);

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Overview of your hiring pipeline</p>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Jobs"
          value={stats.totalJobs}
          icon={<Briefcase size={20} />}
          bgClass="bg-blue-500"
        />
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={<Zap size={20} />}
          bgClass="bg-primary"
        />
        <StatCard
          title="Closed Jobs"
          value={stats.closedJobs}
          icon={<Archive size={20} />}
          bgClass="bg-slate-500"
        />
        <StatCard
          title="Applications"
          value={stats.totalApplications}
          icon={<Users size={20} />}
          bgClass="bg-purple-500"
        />
        <StatCard
          title="Shortlisted"
          value={stats.shortlisted}
          icon={<Star size={20} />}
          bgClass="bg-amber-500"
        />
        <StatCard
          title="Hired"
          value={stats.hired}
          icon={<Trophy size={20} />}
          bgClass="bg-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Application Volume
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
              <TrendingUp size={16} />
              <span>Last 7 Days</span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E5E5"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#F3F4F6" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="applications" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#73BF44" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Applications
          </h2>
          <div className="space-y-4 flex-1 overflow-auto">
            {recentApplications.length === 0 ? (
              <p className="text-gray-500 text-sm">No applications yet.</p>
            ) : (
              recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary-600 font-semibold text-sm shrink-0">
                    {app.candidateName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {app.candidateName}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      Applied for {app.jobTitle}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium shrink-0
                    ${
                      app.status === ApplicationStatus.NEW
                        ? "bg-blue-50 text-blue-600"
                        : app.status === ApplicationStatus.SHORTLISTED
                        ? "bg-primary-50 text-primary-600"
                        : app.status === ApplicationStatus.REJECTED
                        ? "bg-red-50 text-red-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, bgClass }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-border flex items-center justify-between transition-transform hover:-translate-y-1 duration-200 group">
    <div>
      <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
        {title}
      </p>
      <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
    </div>
    <div
      className={`p-3 rounded-lg text-white shadow-md ${bgClass} bg-opacity-90 group-hover:scale-110 transition-transform duration-200`}
    >
      {icon}
    </div>
  </div>
);

export default Dashboard;
