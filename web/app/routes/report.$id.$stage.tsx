import { LoaderFunction } from "@remix-run/node"
import { useLoaderData, Link, Form } from "@remix-run/react"
import DisableableLink from "~/components/DisableableLink"

interface LoaderData {
  path: string
  id: string
  stage: number
}

const stages = [
  "Оригинальное изображение",
  "Найден контур игрового поля",
  "Игровое поле выровнено по контуру",
  "Grayscale",
  "Адаптивный порог по среднему значению",
  "Удалены все цифры",
  "Восстановлены линии",
  "Получена маска",
]

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id
  if (!id) {
    throw new Response("Invalid ID", { status: 400 })
  }

  const stage = Number(params.stage)
  if (!Number.isInteger(stage)) {
    throw new Response("Invalid stage", { status: 400 })
  }

  const data: LoaderData = {
    path: `http://localhost:5000/reports/${id}/stages/${stage}.png`,
    id,
    stage
  }

  return data
}

export default () => {
  const { path, id, stage } = useLoaderData<LoaderData>()

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-row justify-between w-full">
        <span className="text-2xl text-dark-purple-200">
          {stages[stage - 1]}
        </span>
        <span className="text-2xl text-dark-purple-200">{stage}/{stages.length}</span>
      </div>

      <img src={path} alt={`Стадия ${stage}`} className="w-[500px] h-[500px]" />

      <div className="flex flex-row justify-between w-full">
        <DisableableLink
          disabled={stage <= 1}
          to={`/report/${id}/${stage - 1}`}
        >
          Предыдушая стадия
        </DisableableLink>
        <DisableableLink
          disabled={stage >= 8}
          to={`/report/${id}/${stage + 1}`}
        >
          Следующая стадия
        </DisableableLink>
        <DisableableLink
          to={`/game?${new URLSearchParams([["id", id]])}`}
        >
          Игровое поле
        </DisableableLink>
      </div>
    </div>
  )
}
