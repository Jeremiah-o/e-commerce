import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, Shield, Users } from "lucide-react";
import { toast } from "react-toastify";
import { deleteUser, getAllUsers, updateUserRole } from "../services/userService";

const pageSize = 8;

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch = !term || [user.name, user.email].some((value) =>
        value?.toLowerCase().includes(term),
      );
      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  const handleRoleChange = async (userId, nextRole) => {
    try {
      await updateUserRole(userId, nextRole);
      toast.success(`User role updated to ${nextRole}.`);
      fetchUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update role.");
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;

    try {
      await deleteUser(pendingDelete._id);
      toast.success("User deleted successfully.");
      setPendingDelete(null);
      fetchUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete user.");
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-border bg-white p-5 shadow-[0_12px_30px_rgba(91,58,26,0.07)] md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">User administration</p>
            <h1 className="mt-2 text-2xl font-black text-text md:text-3xl">Users</h1>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl bg-[#fbf7f1] px-4 py-3 text-sm font-semibold text-text">
            <Users size={16} className="text-primary" />
            {users.length} users
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={16} />
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-border bg-[#fbf7f1] py-3 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-xl border border-border bg-[#fbf7f1] px-3 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="All">All Roles</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(91,58,26,0.07)]">
        {loading ? (
          <div className="space-y-3 p-4 md:p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-2xl border border-border bg-[#faf5ee] p-4">
                <div className="grid gap-3 md:grid-cols-7">
                  <div className="h-10 w-10 rounded-full bg-[#efe4d6]" />
                  <div className="h-5 rounded bg-[#efe4d6] md:col-span-2" />
                  <div className="h-5 rounded bg-[#efe4d6]" />
                  <div className="h-5 rounded bg-[#efe4d6]" />
                  <div className="h-5 rounded bg-[#efe4d6]" />
                  <div className="h-5 rounded bg-[#efe4d6]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#fbf7f1] text-text/60">
                  <tr>
                    <th className="px-4 py-4 font-semibold">Avatar</th>
                    <th className="px-4 py-4 font-semibold">Name</th>
                    <th className="px-4 py-4 font-semibold">Email</th>
                    <th className="px-4 py-4 font-semibold">Role</th>
                    <th className="px-4 py-4 font-semibold">Date Joined</th>
                    <th className="px-4 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <tr key={user._id} className="border-t border-border/70 align-top">
                        <td className="px-4 py-4">
                          <img
                            src={user.avatar || "https://placehold.co/100x100?text=User"}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </td>
                        <td className="px-4 py-4 font-semibold text-text">{user.name}</td>
                        <td className="px-4 py-4 text-text/75">{user.email}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${user.role === "admin" ? "bg-[#dbeafe] text-[#1d4ed8]" : "bg-[#f8f3ea] text-[#6b7280]"}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-text/75">
                          {new Date(user.createdAt).toLocaleDateString("en-KE", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() => handleRoleChange(user._id, user.role === "admin" ? "customer" : "admin")}
                              className="inline-flex items-center gap-2 rounded-lg bg-[#f7efe4] px-3 py-2 text-sm font-semibold text-primary transition hover:bg-[#efe2d0]"
                            >
                              <Shield size={14} />
                              {user.role === "admin" ? "Demote to Customer" : "Promote to Admin"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDelete(user)}
                              className="inline-flex items-center gap-2 rounded-lg bg-[#fbe4e4] px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-[#f7d4d4]"
                            >
                              Delete User
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-12 text-center text-text/65">
                        No users matched the current search or role filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-border bg-[#fbf7f1] px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-text/65">
                Showing {paginatedUsers.length} of {filteredUsers.length} users
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage <= 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-text disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>
                <span className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-text">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-text disabled:opacity-50"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1b17]/45 px-4">
          <div className="w-full max-w-md rounded-[24px] border border-border bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
            <h2 className="text-xl font-black text-text">Delete user?</h2>
            <p className="mt-3 text-sm text-text/70">
              Are you sure you want to delete <strong>{pendingDelete.name}</strong>? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded-lg border border-border bg-[#fbf7f1] px-4 py-2 text-sm font-semibold text-text transition hover:text-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin;
