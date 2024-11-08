import { User } from "@prisma/client"
import { LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { getUser, requireUserId } from "~/utils/session.server"

type LoaderData = {
  user: User | null
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request, "/home")
  const user = await getUser(request)

  const data: LoaderData = {
    user
  }

  return data
}

export default () => {
  const { user } = useLoaderData<LoaderData>()

  return (
    <div className="text-white flex flex-col items-center text-3xl gap-4 w-full">
      <h1 className="font-bold">Добро пожаловать, <span className="text-green-500 underline">{user?.username}</span></h1>
      <div className="flex flex-col justify-center items-center">
        <Link className="text-pink-500 underline" to="/upload">
          Загрузить фото
        </Link>
        <Link className="text-pink-500 underline" to="/game">
          Перейти в игровой режим
        </Link>
      </div>
      <Link className="text-red-500 underline" to="/logout">
        Выйти
      </Link>
    </div>
  )
}
