"use client";

import { useState } from "react";

interface AddUserFormProps {
  onAddUser: (form: { email: string; firstName: string; lastName: string; role: string }) => Promise<void>;
}

export function AddUserForm({ onAddUser }: AddUserFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: "", firstName: "", lastName: "", role: "USER" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddUser(form);
    setForm({ email: "", firstName: "", lastName: "", role: "USER" });
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <button className="btn btn-primary mb-4" onClick={() => setShowForm(true)}>
        Добавить пользователя
      </button>
    );
  }

  return (
    <form className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-2" onSubmit={handleSubmit}>
      <input
        name="email"
        placeholder="Email"
        className="input input-bordered input-sm"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        name="firstName"
        placeholder="Имя"
        className="input input-bordered input-sm"
        value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
      />
      <input
        name="lastName"
        placeholder="Фамилия"
        className="input input-bordered input-sm"
        value={form.lastName}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
      />
      <select
        name="role"
        className="select select-bordered select-sm"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="USER">USER</option>
        <option value="ORGANIZER">ORGANIZER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <div>
        <button type="submit" className="btn btn-sm btn-primary w-full">Создать</button>
        <button
          type="button"
          className="btn btn-sm btn-ghost w-full mt-1"
          onClick={() => setShowForm(false)}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
