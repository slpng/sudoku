import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

export default ({ children }: Props) => {
  return (
    <div className="flex flex-col justify-center h-full">
      {children}
    </div>
  )
}