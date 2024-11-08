import { User } from "@prisma/client"
import { LinksFunction, LoaderFunction, json } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import Document from "~/components/Document"
import Header from "~/components/Header"
import Layout from "~/components/Layout"
import styles from "~/tailwind.css"
import { getUser } from "~/utils/session.server"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }]
}

interface LoaderData {
  user: User | null
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  return json<LoaderData>({ user })
}

export default () => {
  const { user } = useLoaderData<LoaderData>()

  return (
    <Document>
      <Header user={user} />
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}
