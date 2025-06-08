"use client";

import { useState } from "react";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "USER" | "ORGANIZER" | "ADMIN";
}

export function UserRow({
  user,
  onUpdate,
  onDelete,
}: {
  user: User;
  onUpdate: (updated: User) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<User>(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      onUpdate(form);
      setIsEditing(false);
    }
  };

  return isEditing ? (
    <tr>
      <td className="border p-2">{user.email}</td>
      <td className="border p-2">
        <input name="firstName" value={form.firstName || ""} onChange={handleChange} className="input input-sm w-full" />
      </td>
      <td className="border p-2">
        <input name="lastName" value={form.lastName || ""} onChange={handleChange} className="input input-sm w-full" />
      </td>
      <td className="border p-2">
        <select name="role" value={form.role} onChange={handleChange} className="select select-sm w-full">
          <option value="USER">USER</option>
          <option value="ORGANIZER">ORGANIZER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </td>
      <td className="border p-2 flex gap-2">
        <button className="btn btn-ghost text-xl" onClick={handleSubmit}>💾</button>
        <button className="btn btn-ghost text-xl" onClick={() => setIsEditing(false)}>❌</button>
      </td>
    </tr>
  ) : (
    <tr>
      <td className="border p-2">{user.email}</td>
      <td className="border p-2">{user.firstName}</td>
      <td className="border p-2">{user.lastName}</td>
      <td className="border p-2">{user.role}</td>
      <td className="border p-2 flex gap-2">
        <button className="btn btn-ghost text-xl" onClick={() => setIsEditing(true)}>✏</button>
        <button
          className="btn btn-ghost text-xl"
          onClick={() => {
            if (confirm("Удалить пользователя?")) onDelete(user.id);
          }}
        >
          🗑
        </button>
      </td>
    </tr>
  );
}
