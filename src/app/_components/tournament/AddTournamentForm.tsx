"use client";

import { useState } from "react";
import type { User } from "@prisma/client";

interface AddTournamentFormProps {
  users: User[];
  onClose: () => void;
  addTournament: (formData: FormData) => Promise<void>;
}

export function AddTournamentForm({ users, onClose, addTournament }: AddTournamentFormProps) {
  const [showForm, setShowForm] = useState(false);

  if (!showForm) {
    return (
      <button className="btn btn-primary mb-4" onClick={() => setShowForm(true)}>
        Добавить турнир
      </button>
    );
  }

  return (
    <form
      action={addTournament} // серверный action
      className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      onSubmit={() => onClose()} // после отправки скрываем форму
    >
      <input
        name="name"
        placeholder="Название турнира"
        className="input input-bordered"
        required
      />
      <input
        name="roundsCount"
        type="number"
        placeholder="Количество раундов"
        className="input input-bordered"
        required
      />
      <input
        name="participantsCount"
        type="number"
        placeholder="Количество участников"
        className="input input-bordered"
        required
      />
      <select name="ownerId" className="select select-bordered" required>
        <option value="">Выберите организатора</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.lastName} {u.firstName}
          </option>
        ))}
      </select>
      <div className="md:col-span-1">
        <button type="submit" className="btn btn-primary w-full">
          Создать
        </button>
        <button
          type="button"
          className="btn btn-ghost w-full mt-2"
          onClick={() => setShowForm(false)}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
