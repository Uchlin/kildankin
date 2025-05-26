"use client";
import { useState } from "react";

export function AddParticipantForm({ tournamentId, router }: { tournamentId: string; router: any }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [manualMode, setManualMode] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    rating: 1200, // значение по умолчанию
    });
  const handleSearch = async (q: string) => {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const res = await fetch(`/api/participants/search?q=${encodeURIComponent(q)}`);
    const users = await res.json();
    setResults(users);
  };

  const handleAdd = async (data: any) => {
    const res = await fetch("/api/participants/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, tournamentId }),
    });

    if (res.ok) {
      router.refresh();
      setQuery("");
      setResults([]);
      setNewUser({ firstName: "", lastName: "", email: "",rating: 1200, });
      setManualMode(false);
    } else {
      const error = await res.json();
      alert(error.error);
    }
  };

  return (
    <div className="mt-4">
      {!manualMode ? (
        <div>
          <input
            type="text"
            className="input input-bordered w-full mb-2"
            placeholder="Поиск по имени или фамилии"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <ul className="menu bg-base-100 shadow rounded-box max-h-48 overflow-auto">
            {results.map((user) => (
              <li key={user.id}>
                <button onClick={() => handleAdd({ userId: user.id })}>
                  {user.lastName} {user.firstName} ({user.email})
                </button>
              </li>
            ))}
          </ul>
          <button onClick={() => setManualMode(true)} className="btn btn-sm btn-outline mt-2">
            ➕ Добавить нового участника
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd(newUser);
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-2"
        >
          <input
            type="text"
            placeholder="Имя"
            className="input input-bordered"
            required
            value={newUser.firstName}
            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Фамилия"
            className="input input-bordered"
            required
            value={newUser.lastName}
            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered"
            required
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="number"
            placeholder="Рейтинг"
            className="input input-bordered"
            required
            value={newUser.rating}
            min={100}
            max={3000}
            onChange={(e) => setNewUser({ ...newUser, rating: parseInt(e.target.value) })}
          />
          <button type="submit" className="btn btn-success w-full mt-2 md:col-span-3">
            Создать и добавить
          </button>
          <button
            type="button"
            className="btn btn-ghost w-full mt-1 md:col-span-3"
            onClick={() => setManualMode(false)}
          >
            ⬅ Назад к поиску
          </button>
        </form>
      )}
    </div>
  );
}
