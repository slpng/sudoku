import { LoaderFunction, redirect } from "@remix-run/node"
import { getUser } from "~/utils/session.server"

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  return user ? redirect('/home') : redirect('/login')
}