"use client";

import { useEffect, useState } from "react";

interface User {
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({ email: "", firstName: "", lastName: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm({
          email: data.email || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
        });
      });
  }, []);

  const handleSave = async () => {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const updated = await res.json();
      setUser(updated.user);
      setIsEditing(false);
      setMessage("Изменения сохранены");
    } else {
      setMessage("Ошибка при сохранении");
    }
  };

  if (!user) return <p className="p-8">Загрузка...</p>;

  return (
    <div className="p-8 max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Профиль</h1>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          {isEditing ? (
            <input
              className="input input-bordered w-full"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
            />
          ) : (
            <p><strong>Email:</strong> {user.email}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          {isEditing ? (
            <input
              className="input input-bordered w-full"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="Имя"
            />
          ) : (
            <p><strong>Имя:</strong> {user.firstName || "—"}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          {isEditing ? (
            <input
              className="input input-bordered w-full"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Фамилия"
            />
          ) : (
            <p><strong>Фамилия:</strong> {user.lastName || "—"}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p><strong>Роль:</strong> {user.role}</p>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button className="btn btn-ghost text-xl btn-outline" onClick={handleSave}>
                💾
              </button>
              <button
                className="btn btn-ghost text-xl btn-outline"
                onClick={() => {
                  setForm({
                    email: user.email,
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                  });
                  setIsEditing(false);
                }}
              >
                ❌
              </button>
            </>
          ) : (
            <button className="btn btn-ghost text-xl btn-outline" onClick={() => setIsEditing(true)}>
              ✏️
            </button>
          )}
        </div>

        {message && <p className="text-sm text-gray-500">{message}</p>}
      </div>
    </div>
  );
}
