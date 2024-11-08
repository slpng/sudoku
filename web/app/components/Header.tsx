import { User } from "@prisma/client"
import { NavLink } from "@remix-run/react"
import { useMemo } from "react"

interface NavigationLink {
  path: string
  text: string
}

const commonLinks: NavigationLink[] = [
  {
    path: "/",
    text: "Домашняя"
  },
  {
    path: "/upload",
    text: "Загрузить фото"
  },
  {
    path: "/game",
    text: "Игровой режим"
  }
]

const noUserLinks: NavigationLink[] = [
  {
    path: "/login",
    text: "Войти"
  },
  {
    path: "/register",
    text: "Регистрация"
  }
]

interface Props {
  user: User | null
}

export default ({ user }: Props) => {
  const links = useMemo(() => {
    if (user) {
      return commonLinks.concat([
        {
          path: `/user/${user.username}`,
          text: user.username
        },
        {
          path: "/logout",
          text: "Выйти"
        }
      ])
    }
    return commonLinks.concat(noUserLinks)
  }, [user])

  return (
    <nav className="flex items-center justify-around gap-5 w-full p-1">
      {links.map((link) => (
        <NavLink key={link.path} to={link.path} className="text-pink-500">
          {link.text}
        </NavLink>
      ))}
    </nav>
  )
}