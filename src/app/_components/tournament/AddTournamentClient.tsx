"use client";
import type { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { AddTournamentForm } from "./AddTournamentForm";
import { addTournament } from "../../api/action/tournament";

interface AddTournamentClientProps {
  users: User[];
  currentUser: { id: string; role: string };
}
export function AddTournamentClient({ users, currentUser }: AddTournamentClientProps) {
  const router = useRouter();

  const handleClose = () => {
    router.refresh();
  };

  return (
    <AddTournamentForm
      users={users}
      currentUser={currentUser}
      onClose={handleClose}
      addTournament={addTournament}
    />
  );
}
