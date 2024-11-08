import { ActionFunction, redirect } from "@remix-run/node"
import { Form, useActionData } from "@remix-run/react"
import { prisma } from "~/utils/db.server"
import { requireUserId } from "~/utils/session.server"

type ActionData = {
  message: string
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)

  const formData = await request.formData()

  const response = await fetch(`${process.env.RECOGNIZER_URL}/process-image`, {
    method: "POST",
    body: formData
  })
  if (!response.ok) {
    const { id, message } = await response.json()
    await prisma.report.create({
      data: {
        id,
        type: "failed",
        user: {
          connect: {
            id: userId
          }
        }
      }
    })

    return {
      message
    } as ActionData
  }

  const { id, board } = await response.json()
  await prisma.report.create({
    data: {
      id,
      type: "successful",
      user: {
        connect: {
          id: userId
        }
      },
      matrix: {
        create: {
          json: board
        }
      }
    }
  })

  return redirect(`/report/${id}/1`)
}

export default () => {
  const actionData = useActionData<ActionData>()

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      className="flex flex-col items-center gap-4"
    >
      <h1 className="text-dark-purple-200 text-center text-2xl">
        Загрузка изображения
      </h1>
      <input
        type="file"
        name="image"
        className="text-dark-purple-200 text-right"
      />
      <button
        type="submit"
        className="rounded-md bg-pink-500 px-5 py-1 text-sm text-white"
      >
        Загрузить
      </button>
      {actionData && (
        <p id="upload-error" className="text-sm text-red-400">
          {actionData.message}
        </p>
      )}
    </Form>
  )
}
