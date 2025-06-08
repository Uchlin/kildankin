import { type Session } from "next-auth";
import Link from "next/link";

export async function Navbar({ session }: { session: Session }) {
  return (
    <div className="navbar bg-base-100">
      <Link href="/api/auth/signout" className="btn">
        {session.user?.email}
      </Link>
      <Link href="/" className="btn btn-ghost">
          Главная
        </Link>
        <Link href="/user" className="btn btn-ghost">
          Пользователи
        </Link>
        <Link href="/tournaments" className="btn btn-ghost">
          Турниры
        </Link>
        <Link href="/participants" className="btn btn-ghost">
          Участники
        </Link>
    </div>
  );
}