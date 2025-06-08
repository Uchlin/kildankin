"use client";

import { useEffect, useState } from "react";
import { UserRow } from "../_components/user/UserRow";
import { AddUserForm } from "../_components/user/AddUserForm";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "USER" | "ORGANIZER" | "ADMIN";
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ email: "", firstName: "", lastName: "", role: "USER" });

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  const handleAdd = async (form: { email: string; firstName: string; lastName: string; role: string }) => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const newUser = await res.json();
    setUsers([...users, newUser]);
  };

  const handleUpdate = (updated: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Пользователи</h1>

      <AddUserForm onAddUser={handleAdd} />

      <table className="table w-full border">
        <thead>
          <tr className=" text-white-600">
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Имя</th>
            <th className="p-2 border">Фамилия</th>
            <th className="p-2 border">Роль</th>
            <th className="p-2 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <UserRow key={u.id} user={u} onUpdate={handleUpdate} onDelete={handleDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
