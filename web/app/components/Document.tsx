import { Links, LiveReload, Scripts, ScrollRestoration } from "@remix-run/react"
import { ReactNode } from "react"
import Header from "~/components/Header"

interface Props {
  children: ReactNode
  title?: string
}

export default ({ children, title = "sudoku-web!!!!!" }: Props) => {
  return (
    <html 
      // className="dark" 
      lang="en"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{title}</title>
        <Links />
      </head>
      <body className="dark:bg-dark-purple-900 h-screen flex flex-col justify-between items-center">
        {children}
        <Scripts />
        <LiveReload />
        <ScrollRestoration />
      </body>
    </html>
  )
}