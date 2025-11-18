import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import JobsList from "./components/JobsList";
import JobEditor from "./components/JobEditor";
import ApplicationsList from "./components/ApplicationsList";
import ApplicationView from "./components/ApplicationView";
import Settings from "./components/Settings";

const App = () => {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="jobs" element={<JobsList />} />
            <Route path="jobs/new" element={<JobEditor />} />
            <Route path="jobs/:id" element={<JobEditor />} />
            <Route path="applications" element={<ApplicationsList />} />
            <Route path="applications/:id" element={<ApplicationView />} />
            <Route path="settings" element={<Settings />} />

            {/* Redirect unknown URLs */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </StoreProvider>
  );
};

export default App;
