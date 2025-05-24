import React from "react";
import SearchInput from "./searchInput";
import { db } from "~/server/db";
import { addTutor } from "../api/action/squad";

export default function TutorSearch({
  query,
  squadId,  
}: {
  query: string;
  squadId: string;    
}) {
  return (
    <>
      <SearchInput placeholder="Имя пользователя" />
      {query && <TutorToSet query={query} squadId={squadId}/>}
    </>
  );
}

async function TutorToSet({
  query,  
  squadId,  
}: {
  query: string;  
  squadId: string;  
}) {  
  const user = await db.user.findFirst({
    where: {
      OR: [
        { firstname: { contains: query } },
        { surname: { contains: query } },
      ],
    },
  });
  if (!user) return <div></div>;
  return (
    <form action={addTutor} className="form-control">
      <div className="flex max-w-xs flex-col space-y-2">
        <input type="hidden" name="tutorId" defaultValue={user.id} />
        <input type="hidden" name="squadId" defaultValue={squadId} />
        <button type="submit" className="btn btn-primary">
          Преподаватель: {user.firstname} {user.surname}
        </button>
      </div>
    </form>
  );
}