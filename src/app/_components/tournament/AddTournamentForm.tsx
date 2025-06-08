"use client";

import { useState } from "react";
import type { User } from "@prisma/client";

interface AddTournamentFormProps {
  users: User[];
  currentUser: { id: string; role: string };
  onClose: () => void;
  addTournament: (formData: FormData) => Promise<void>;
}

export function AddTournamentForm({
  users,
  currentUser,
  onClose,
  addTournament,
}: AddTournamentFormProps) {
  const [showForm, setShowForm] = useState(false);

  const isAdmin = currentUser.role === "ADMIN";
  const isOrganizer = currentUser.role === "ORGANIZER";

  if (!showForm) {
    return (
      <button className="btn btn-primary mb-4" onClick={() => setShowForm(true)}>
        Добавить турнир
      </button>
    );
  }

  return (
    <form
      action={addTournament}
      className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      onSubmit={() => onClose()}
    >
      <input
        name="name"
        placeholder="Название турнира"
        className="input input-bordered"
        required
      />
      <input
        name="participantsCount"
        type="number"
        placeholder="Количество участников"
        className="input input-bordered"
        required
        min={2}
      />

      {/* Админ может выбрать организатора, организатор — нет */}
      {isAdmin ? (
        <select name="ownerId" className="select select-bordered" required>
          <option value="">Выберите организатора</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.lastName} {u.firstName}
            </option>
          ))}
        </select>
      ) : (
        <>
          <input type="hidden" name="ownerId" value={currentUser.id} />
          <div className="flex items-center font-medium">
            Организатор:{" "}
            {
              users.find((u) => u.id === currentUser.id)?.lastName
            }{" "}
            {
              users.find((u) => u.id === currentUser.id)?.firstName
            }
          </div>
        </>
      )}

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
