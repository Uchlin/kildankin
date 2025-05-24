

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { Navbar } from "./_components/navbar";
import { SigninLink } from "./_components/signlink";


export default async function Home() {
  const session = await auth();
  console.log(session?.user.role);
  return <h1>{session?.user.role}</h1>
}
// export default async function Home() {

//   return <h1>Main page</h1>
// }
// export default async function Home() {
//   return <h1>Main page</h1>
// }