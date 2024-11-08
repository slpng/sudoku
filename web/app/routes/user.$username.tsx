import { Matrix, Report } from "@prisma/client"
import { LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { prisma } from "~/utils/db.server"
import { requireUserId } from "~/utils/session.server"

interface LoaderData {
  reports: (Report & {
    matrix: Matrix | null
  })[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request)

  const reports = await prisma.report.findMany({
    where: {
      userId
    },
    include: {
      matrix: true
    }
  })

  const data: LoaderData = {
    reports
  }

  return data
}

export default () => {
  const { reports } = useLoaderData<LoaderData>()

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-dark-purple-200 text-center text-2xl">Отчеты</h1>
      <div className="bg-dark-purple-700 rounded-md p-8 text-dark-purple-200">
        <table className="table-auto">
          <thead>
            <tr className="text-dark-purple-400">
              <th>Дата</th>
              <th>Статус</th>
              <th>Идентификатор</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="p-2 text-center">
                  {new Date(report.createdAt).toLocaleDateString("ru-RU")}
                </td>
                <td className="p-2 text-center">
                  {report.type === "failed" ? "Провалено" : "Успешно"}
                </td>
                <td className="p-2 text-center">
                  <Link to={`/report/${report.id}/1`} className="text-pink-500">
                    {report.id}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
