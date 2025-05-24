import Link from "next/link";
import { AdminUserForm } from "~/app/_components/user/adminRole";
import { UserInfo } from "~/app/_components/user/iserRole";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await db.user.findUnique({ where: { id: params.id } });

  if (!user)
    return (
      <main>
        <h1>User not found</h1>
      </main>
    );

  const role = (await auth())?.user.role;

  const group =
    user.groupId &&
    (await db.group.findUnique({ where: { id: user.groupId } }));
  const groupJSX =
    group && (
      <>
        <label>Группа</label>
        <Link href={"/group/" + group.id}>
          {group.name + "-" + user.subgroup}
        </Link>
      </>
    );

  if (role === "ADMIN") {
    return <AdminUserForm user={user} groupJSX={groupJSX} />;
  }

  return <UserInfo user={user} groupJSX={groupJSX} />;
}
