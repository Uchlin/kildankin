"use client";
import { useState } from "react";

export function EditParticipantRow({ participant, onCancel, onSave }: {
  participant: {
    id: string;
    firstName: string;
    lastName: string;
    rating: number;
  };
  onCancel: () => void;
  onSave: () => void;
}) {
  const [firstName, setFirstName] = useState(participant.firstName);
  const [lastName, setLastName] = useState(participant.lastName);
  const [rating, setRating] = useState(participant.rating);

  const handleSave = async () => {
    const res = await fetch("/api/participants/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: participant.id,
        firstName,
        lastName,
        rating,
      }),
    });

    if (res.ok) {
      onSave();
    } else {
      const err = await res.json();
      alert(err.error || "Ошибка при сохранении");
    }
  };

  return (
    <>
      <td>
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="input input-sm w-full" />
      </td>
      <td>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input input-sm w-full" />
      </td>
      <td>
        <input type="number" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="input input-sm w-full" />
      </td>
      <td className="flex gap-2">
        <button onClick={handleSave} className="btn btn-ghost text-xl">💾</button>
        <button onClick={onCancel} className="btn btn-ghost text-xl">❌</button>
      </td>
    </>
  );
}
