"use client";

import { useState } from "react";
import type { Tournament, User } from "@prisma/client";

export function TournamentActions({
  tournament,
  users,
  deleteTournament,
  editTournament,
}: {
  tournament: Tournament;
  users: User[];
  deleteTournament: (formData: FormData) => void;
  editTournament: (formData: FormData) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <form action={editTournament} className="flex flex-col gap-2 mt-2">
        <input type="hidden" name="id" value={tournament.id} />
        <input
          name="name"
          defaultValue={tournament.name}
          className="input input-sm input-bordered"
        />
        <input
          name="roundsCount"
          type="number"
          defaultValue={tournament.roundsCount}
          className="input input-sm input-bordered"
        />
        <input
          name="participantsCount"
          type="number"
          defaultValue={tournament.participantsCount}
          className="input input-sm input-bordered"
        />
        <select name="ownerId" className="select select-sm select-bordered">
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.lastName} {u.firstName}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button type="submit" className="btn btn-success btn-sm">💾 Сохранить</button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setIsEditing(false)}
          >
            Отмена
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex gap-2">
      <form action={deleteTournament}>
        <input type="hidden" name="id" value={tournament.id} />
        <button
          type="submit"
          className="btn btn-xs text-2xl"
          onClick={(e) => {
            if (!confirm("Удалить турнир?")) e.preventDefault();
          }}
        >
          🗑
        </button>
      </form>
      <button
        className="btn btn-xs btn-outline"
        onClick={() => setIsEditing(true)}
      >
        ✏ Редактировать
      </button>
    </div>
  );
}
