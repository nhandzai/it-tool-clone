"use client";
import { useState, useEffect, useCallback } from "react";
import Table from "@/components/ui/Table";
import Spinner from "@/components/ui/Spinner";
import { apiAdminGetAllUsers } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiAdminGetAllUsers();
      setUsers(data);
      console.log("Fetched users:", data);
    } catch (err) {
      setError(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = [
    { key: "userId", label: "ID" },
    { key: "username", label: "Username" },
    { key: "role", label: "Role" },
    {
      key: "createdAt",
      label: "Registered At",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  if (!isAuthenticated) {
    return <div className="p-4 text-center">Authenticating...</div>;
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">User Management</h2>

      {loading && (
        <div className="flex justify-center p-4">
          <Spinner />
        </div>
      )}
      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && <Table columns={columns} data={users} />}
    </div>
  );
}
