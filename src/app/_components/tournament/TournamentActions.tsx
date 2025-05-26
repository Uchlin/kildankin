"use client";

import { useState } from "react";
import type { User, Participant } from "@prisma/client";

type FullTournament = {
  id: string;
  name: string;
  roundsCount: number;
  participantsCount: number;
  createdAt: Date;
  ownerId: string;
  owner?: User;
  participants: Participant[];
};

export function TournamentActions({
  tournament,
  users,
  deleteTournament,
  editTournament,
}: {
  tournament: FullTournament;
  users: User[];
  deleteTournament: (formData: FormData) => void;
  editTournament: (formData: FormData) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const [formState, setFormState] = useState({
    name: tournament.name,
    roundsCount: tournament.roundsCount.toString(),
    participantsCount: tournament.participantsCount.toString(),
    ownerId: tournament.ownerId,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  if (isEditing) {
    return (
      <>
        <td>
          <input
            name="name"
            value={formState.name}
            onChange={handleChange}
            className="input input-sm input-bordered w-full"
          />
        </td>
        <td>
          <select
            name="ownerId"
            value={formState.ownerId}
            onChange={handleChange}
            className="select select-sm select-bordered w-full"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.lastName} {u.firstName}
              </option>
            ))}
          </select>
        </td>
        <td>
          <input
            name="roundsCount"
            type="number"
            value={formState.roundsCount}
            onChange={handleChange}
            className="input input-sm input-bordered w-full"
          />
        </td>
        <td>
          <input
            name="participantsCount"
            type="number"
            value={formState.participantsCount}
            onChange={handleChange}
            className="input input-sm input-bordered w-full"
          />
        </td>
        <td>{new Date(tournament.createdAt).toLocaleDateString()}</td>
        <td className="flex gap-2">
          <form
            action={editTournament}
            onSubmit={() => setIsEditing(false)}
          >
            <input type="hidden" name="id" value={tournament.id} />
            <input type="hidden" name="name" value={formState.name} />
            <input type="hidden" name="ownerId" value={formState.ownerId} />
            <input type="hidden" name="roundsCount" value={formState.roundsCount} />
            <input type="hidden" name="participantsCount" value={formState.participantsCount} />
            <button type="submit" className="btn btn-ghost text-xl">💾</button>
          </form>
          <button
            className="btn btn-ghost text-xl"
            onClick={() => setIsEditing(false)}
          >
            ❌
          </button>
        </td>
      </>
    );
  }

  return (
    <>
      <td>{tournament.name}</td>
      <td>{tournament.owner?.lastName} {tournament.owner?.firstName}</td>
      <td>{tournament.roundsCount}</td>
      <td>{tournament.participants.length} / {tournament.participantsCount}</td>
      <td>{new Date(tournament.createdAt).toLocaleDateString()}</td>
      <td className="flex gap-2">
        <form action={deleteTournament}>
          <input type="hidden" name="id" value={tournament.id} />
          <button
            type="submit"
            className="btn btn-ghost text-xl"
            onClick={(e) => {
              if (!confirm("Удалить турнир?")) e.preventDefault();
            }}
          >
            🗑
          </button>
        </form>
        <button
          className="btn btn-ghost text-xl"
          onClick={() => setIsEditing(true)}
        >
          ✏
        </button>
      </td>
    </>
  );
}
