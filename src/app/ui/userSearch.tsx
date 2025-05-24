import React from "react";
import SearchInput from "./searchInput";
import { db } from "~/server/db";
import { addUserToGroup } from "../api/action/group";

export default function UserSearch({
  query,
  id_group,
}: {
  query: string;
  id_group: string;
}) {
  return (
    <>
      <SearchInput placeholder="Имя пользователя" />
      {query && <UserToAdd query={query} id_group={id_group} />}
    </>
  );
}

async function UserToAdd({
  query,
  id_group,
}: {
  query: string;
  id_group: string;
}) {
  const user = await db.user.findFirst({
    where: {
      AND: [
        {
          OR: [
            { firstname: { contains: query } },
            { surname: { contains: query } },
          ],
        },
        { OR: [{ groupId: null }, { NOT: { groupId: id_group } }] },
      ],
    },
  });
  if (!user) return <div></div>;
  return (
    <form action={addUserToGroup} className="form-control">
      <div className="flex max-w-xs flex-col space-y-2">
        <input type="hidden" name="id_student" defaultValue={user.id} />
        <input type="hidden" name="id_group" defaultValue={id_group} />
        <button type="submit" className="btn btn-primary">
          Добавить в группу {user.firstname} {user.surname}
        </button>
      </div>
    </form>
  );
}