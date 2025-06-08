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
  currentUser,
  showActions,
}: {
  tournament: FullTournament;
  users: User[];
  deleteTournament: (formData: FormData) => void;
  editTournament: (formData: FormData) => void;
  currentUser: { id: string; role: string };
  showActions: boolean;
}) {
  const isOwner = currentUser.id === tournament.ownerId;
  const isAdmin = currentUser.role === "ADMIN";
  const canEdit = isOwner || isAdmin;
  const [isEditing, setIsEditing] = useState(false);

  const [formState, setFormState] = useState({
    name: tournament.name,
    roundsCount: tournament.roundsCount.toString(),
    participantsCount: tournament.participantsCount.toString(),
    ownerId: tournament.ownerId,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "participantsCount") {
      const parsed = parseInt(value);
      const newRounds = estimateSwissRounds(parsed);
      setFormState((prev) => ({
        ...prev,
        participantsCount: value,
        roundsCount: newRounds.toString(),
      }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  return isEditing ? (
    <tr>
      <td colSpan={showActions ? 6 : 5}>
        <form
          action={editTournament}
          onSubmit={() => setIsEditing(false)}
          className="grid grid-cols-6 gap-2"
        >
          <input type="hidden" name="id" value={tournament.id} />
          <input type="hidden" name="roundsCount" value={formState.roundsCount} />

          <input
            name="name"
            value={formState.name}
            onChange={handleChange}
            className="input input-sm input-bordered w-full"
          />

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
          <input
            name="roundsCount"
            type="number"
            value={formState.roundsCount}
            readOnly
            className="input input-sm input-bordered w-full"
          />
          <input
            name="participantsCount"
            type="number"
            value={formState.participantsCount}
            onChange={handleChange}
            className="input input-sm input-bordered w-full"
          />

          <span className="flex items-center justify-center text-sm">
            {new Date(tournament.createdAt).toLocaleDateString()}
          </span>

          <div className="flex gap-2 justify-end">
            <button type="submit" className="btn btn-ghost text-xl">💾</button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-ghost text-xl"
            >
              ❌
            </button>
          </div>
        </form>
      </td>
    </tr>
  ) : (
    <tr>
      <td className="p-2 border">
        <a
          href={`/tournaments/${tournament.id}`}
          className="link text-blue-600 hover:underline"
        >
          {tournament.name}
        </a>
      </td>
      <td className="p-2 border">{tournament.owner?.lastName} {tournament.owner?.firstName}</td>
      <td className="p-2 border">{tournament.roundsCount}</td>
      <td className="p-2 border">{tournament.participants.length} / {tournament.participantsCount}</td>
      <td className="p-2 border">{new Date(tournament.createdAt).toLocaleDateString()}</td>
      {showActions && (
        <td className="flex gap-2 p-2 border">
          {canEdit && (
            <>
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
            </>
          )}
        </td>
      )}
    </tr>
  );
}

function estimateSwissRounds(N: number): number {
  if (N == 2) return 1;
  if (N <= 3) return 2;
  if (N <= 4) return 3;
  if (N <= 6) return 4;
  if (N <= 8) return 5;
  if (N <= 16) return 6;
  if (N <= 32) return 7;
  if (N <= 64) return 8;
  if (N <= 128) return 9;
  if (N <= 256) return 10;
  if (N <= 512) return 11;
  if (N <= 1024) return 12;
  if (N <= 2048) return 13;
  if (N <= 4096) return 14;
  if (N <= 8192) return 15;
  return 16;
}
