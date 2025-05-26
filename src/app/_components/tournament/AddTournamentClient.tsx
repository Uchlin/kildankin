"use client";
import type { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { AddTournamentForm } from "./AddTournamentForm";
import { addTournament } from "../../api/action/tournament";

interface AddTournamentClientProps {
  users: User[];
}
export function AddTournamentClient({ users }: AddTournamentClientProps) {
  const router = useRouter();

  const handleClose = () => {
    router.refresh();
  };

  return (
    <AddTournamentForm
      users={users}
      onClose={handleClose}
      addTournament={addTournament}
    />
  );
}
