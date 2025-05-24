import React from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import type { User } from "@prisma/client";
import Link from "next/link";


export default function UserTable({ users }: { users: User[] }) {
  return (
    <>
      <table className="m-4 box-border">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Почта</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="px-2">{u.firstname}</td>
              <td className="px-2">{u.surname}</td>
              <td className="px-2">{u.email}</td>
              <td className="px-2">
                <Link href={`/user/${u.id}`}>
                  <PencilSquareIcon className="w-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}