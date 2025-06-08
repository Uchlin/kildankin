import { type Session } from "next-auth";
import Link from "next/link";

export async function Navbar({ session }: { session: Session }) {
  return (
    <div className="navbar bg-base-100">
      <Link href="/api/auth/signout" className="btn">
        Выход
      </Link>
      <Link href="/" className="btn btn-ghost">
          {session.user?.email}
      </Link>
      {session?.user?.role === "ADMIN"  && (
        <Link href="/user" className="btn btn-ghost">
          Пользователи
        </Link>
      )}
      <Link href="/tournaments" className="btn btn-ghost">
        Турниры
      </Link>
      <Link href="/participants" className="btn btn-ghost">
        Участники
      </Link>
    </div>
  );
}