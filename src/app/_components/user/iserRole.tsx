// components/UserInfo.tsx
import React from "react";

export function UserInfo({ user, groupJSX }: { user: any; groupJSX: React.ReactNode }) {
  return (
    <main>
      <h1>Данные пользователя</h1>
      <p>Электронная почта: {user.email}</p>
      <p>Имя: {user.firstname}</p>
      <p>Фамилия: {user.surname}</p>
      <p>Роль: {user.role}</p>
      {groupJSX}
    </main>
  );
}
