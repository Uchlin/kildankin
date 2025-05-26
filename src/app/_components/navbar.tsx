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
        <Link href="/tournaments" className="btn btn-ghost">
          Турниры
        </Link>
        <Link href="/participants" className="btn btn-ghost">
          Участники
        </Link>
        <Link href="/rounds" className="btn btn-ghost">
          Раунды
        </Link>
        <Link href="/pairings" className="btn btn-ghost">
          Жеребьёвка
        </Link>
        <Link href="/results" className="btn btn-ghost">
          Результаты
        </Link>
        <Link href="/standings" className="btn btn-ghost">
          Таблица
        </Link>
    </div>
  );
}