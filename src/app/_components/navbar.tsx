import { type Session } from "next-auth";
import Link from "next/link";

export async function Navbar({ session }: { session: Session }) {
  return (
    <div className="navbar bg-base-100">
      <Link href="/api/auth/signout" className="btn">
        {session.user?.name}
      </Link>
      <Link href="/" className="btn">
        Домой
      </Link>
      <Link href="/user" className="btn">
        Пользователи
      </Link>
      <Link href="/group" className="btn">
        Группы
      </Link>
      <Link href="/taskType" className="btn">
        Задачи
      </Link>
      <Link href="/student" className="btn">
        Студент
      </Link>
    </div>
  );
}