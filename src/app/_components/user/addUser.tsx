import { UserPlusIcon } from "@heroicons/react/16/solid";
import { createUser } from "~/app/api/action/user";


export function AddUser() {
  return (
    <details className="collapse bg-base-100" tabIndex={0}>
      <summary className="collapse-title text-xl font-medium">
        <UserPlusIcon className="w-6" />
      </summary>
      <form action={createUser} className="collapse-content form-control">
        <div className="flex flex-col max-w-xs space-y-2">
          <label>Электронная почта</label>
          <input type="email" name="email" required className="input input-bordered"/>
          <label>Имя</label>
          <input type="text" name="firstname" required className="input input-bordered"/>
          <label>Фамилия</label>
          <input type="text" name="surname" required className="input input-bordered"/>
          <button type="submit" className="btn btn-primary">
            Добавить
          </button>
        </div>
      </form>
    </details>
  )}