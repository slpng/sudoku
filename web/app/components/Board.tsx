import { Form } from "@remix-run/react"
import { FunctionComponent, useState } from "react"

interface BoardProps {
  board: number[][]
  error?: string
}

const Board: FunctionComponent<BoardProps> = ({ board, error }) => {
  return (
    <Form method="POST" className="flex flex-col gap-4 items-center">
      <h1 className="text-dark-purple-200 text-center text-2xl">
        Игровое поле
      </h1>
      <div>
        {board.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`${
              rowIndex >= 3 && rowIndex <= 5 ? "bg-dark-purple-800" : ""
            }`}
          >
            {row.map((cell, cellIndex) => (
              <input
                autoComplete="off"
                maxLength={1}
                className={`focus:outline-none focus:border text-center w-10 h-10 text-white ${
                  cellIndex >= 3 && cellIndex <= 5
                    ? "bg-dark-purple-800"
                    : "bg-transparent"
                }`}
                key={`cell-${cellIndex}`}
                // name={`cell-${index}`}
                name={`row-${rowIndex}[]`}
                type="text"
                defaultValue={String(cell)}
                onChange={({ target }) => {
                  target.select()
                }}
                onFocus={({ target }) => {
                  target.select()
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="rounded-md bg-pink-500 px-5 py-1 text-sm text-white"
      >
        Получить решение
      </button>
      {error && (
        <p id="upload-error" className="text-sm text-red-400">
          {error}
        </p>
      )}
    </Form>
  )
}

export default Board
