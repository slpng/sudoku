import { ActionFunction, LoaderFunction } from "@remix-run/node"
import { useActionData, useLoaderData, useNavigation, useSearchParams } from "@remix-run/react"
import Board from "~/components/Board"
import { prisma } from "~/utils/db.server"

type Board = number[][]
interface ActionData {
  board?: Board
  error?: string
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const board: Board = []
  for (let i = 0; i < 9; i++) {
    board.push(
      formData.getAll(`row-${i}[]`).map((value) => {
        const num = Number(value)
        if (Number.isNaN(num)) {
          throw "NaN"
        }

        return num
      })
    )
  }

  const headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json"
  })

  try {
    const response = await fetch(`${process.env.RECOGNIZER_URL}/solve-board`, {
      method: "POST",
      headers,
      body: JSON.stringify(board)
    })

    const json = await response.json()
    if (!response.ok) {
      const data: ActionData = {
        error: json.message
      }
      return data
    }

    const data: ActionData = {
      board: json.board
    }
    return data
  } catch {
    const data: ActionData = {
      error: 'Не удалось отправить запрос на сервер обработки изображений'
    }
    return data
  }
}

interface LoaderData {
  board?: Board
  error?: string
  id: string | null
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const id = url.searchParams.get("id")

  if (!id) {
    const data: LoaderData = {
      board: undefined,
      id
    }
    return data
  }

  const report = await prisma.report.findUnique({
    where: {
      id
    },
    select: {
      matrix: {
        select: {
          json: true
        }
      }
    }
  })
  if (!report) {
    const data: LoaderData = {
      error: "Board not found",
      id
    }
    return data
  }

  const data: LoaderData = {
    board: report.matrix?.json?.valueOf() as Board,
    id
  }
  return data
}

export default () => {
  const actionData = useActionData<ActionData>()
  const loaderData = useLoaderData<LoaderData>()

  return (
    <div>
      <Board
        board={
          actionData?.board ||
          loaderData.board ||
          new Array(9).fill(new Array(9).fill(0))
        }
        error={actionData?.error}
      />
    </div>
  )
}
