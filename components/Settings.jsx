import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { User, Lock, Shield, Plus, X, Trash2, Info } from "lucide-react";

const Settings = () => {
  const {
    user,
    users,
    addUser,
    setUsers,
    removeUser,
    showToast,
    updateUserProfile,
  } = useStore();

  /* ------------------ SEPARATE STATES ------------------ */

  // For updating admin profile
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  // For Add User modal
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "editor",
  });

  //For Update Password
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ------------------ SAVE PROFILE CHANGES ------------------ */
  const handleSaveChanges = async () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      showToast("Name and Email cannot be empty", "error");
      return;
    }

    try {
      await updateUserProfile({
        name: profile.name.trim(),
        email: profile.email.trim(),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, ...updatedData } : u))
      );

      showToast("Profile updated successfully", "success");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  /* ------------------ ADD NEW USER ------------------ */
  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!newUser.name.trim() || !newUser.email.trim()) return;

    // Duplicate email check
    const exists = users.some(
      (u) => u.email.toLowerCase() === newUser.email.toLowerCase()
    );
    if (exists) {
      showToast("User with this email already exists", "error");
      return;
    }

    setIsAdding(true);
    try {
      await addUser({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });

      setIsAddUserOpen(false);
      setNewUser({ name: "", email: "", role: "editor" });
    } catch (err) {
      console.error("Add user failed:", err);
    } finally {
      setIsAdding(false);
    }
  };

  /* ------------------ DELETE USER ------------------ */
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await removeUser(userToDelete.id);
      setUserToDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  /* ------------------ UPDATE PASSWORD ------------------ */
  const handlePasswordUpdate = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("All fields are required", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/update-password/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Failed to update password", "error");
        return;
      }

      showToast("Password updated successfully", "success");

      // Reset fields
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Password update failed:", err);
      showToast("Server error", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-6 relative">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      {/* ========================= PROFILE SETTINGS ========================= */}
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <User size={20} className="text-primary" />
            Admin Profile
          </h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 mr-3">
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* ========================= SECURITY SETTINGS ========================= */}
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Lock size={20} className="text-primary" />
            Security
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
              }
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={handlePasswordUpdate}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover shadow-sm"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* ========================= USER MANAGEMENT ========================= */}
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Shield size={20} className="text-primary" />
            Admin Users
          </h2>

          {user?.role === "admin" && (
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="text-sm flex items-center gap-1 text-primary hover:underline font-medium"
            >
              <Plus size={16} /> Add User
            </button>
          )}
        </div>

        <div className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-3 font-medium text-gray-900 flex items-center gap-2">
                    {u.name}
                    {u.id === user?.id && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                        (You)
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-3 text-gray-500">{u.email}</td>

                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        u.role === "admin"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {u.role === "admin" ? "Super Admin" : "Editor"}
                    </span>
                  </td>

                  <td className="px-6 py-3 text-right">
                    {user?.role === "admin" && user.id !== u.id ? (
                      <button
                        onClick={() => setUserToDelete(u)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors font-medium"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <span className="text-gray-300 cursor-not-allowed">
                        {u.id === user?.id ? "Current User" : "Read Only"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================= ADD USER MODAL ========================= */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Add New User</h3>

              <button
                onClick={() => setIsAddUserOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2 text-sm text-blue-800 mb-4">
                <Info size={16} />
                <div>
                  <p className="font-semibold mb-1">
                    Default Password:{" "}
                    <span className="font-mono bg-blue-100 px-1 rounded">
                      password123
                    </span>
                  </p>
                  <p>
                    Super Admins can manage all users. Editors can only manage
                    jobs.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/50"
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Super Admin</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isAdding}
                  className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover shadow-lg shadow-primary/30"
                >
                  {isAdding ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================= DELETE CONFIRMATION ========================= */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Delete User?
            </h3>

            <p className="text-gray-500 mb-6 text-sm">
              Are you sure you want to remove{" "}
              <span className="font-bold text-gray-800">
                {userToDelete.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteUser}
                disabled={isDeleting}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
