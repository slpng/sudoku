import { Link } from "@remix-run/react"
import { FunctionComponent, ReactNode } from "react"

interface DisableableLinkProps {
  children: ReactNode
  to: string
  disabled?: boolean
}

const DisableableLink: FunctionComponent<DisableableLinkProps> = ({
  children,
  to,
  disabled
}) => {
  return (
    <Link
      to={disabled ? "" : to}
      className={`rounded-md ${
        disabled ? "bg-gray-500" : "bg-pink-500"
      } px-5 py-1 text-sm text-white`}
    >
      {children}
    </Link>
  )
}

export default DisableableLink
