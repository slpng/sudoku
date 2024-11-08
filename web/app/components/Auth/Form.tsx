import { Form, Link } from "@remix-run/react"
import { FunctionComponent, ReactElement } from "react"

interface FormProps {
  children: ReactElement[]
  formError: string | undefined
  isRegisterForm?: boolean
}

const AuthForm: FunctionComponent<FormProps> = ({
  children,
  formError,
  isRegisterForm = false
}) => {
  return (
    <div className="flex w-[460px] flex-col gap-8">
      <h1 className="text-dark-purple-200 text-center text-2xl">
        {isRegisterForm ? "Регистрация" : "Вход"}
      </h1>
      <Form
        method="post"
        className="bg-dark-purple-700 flex flex-col gap-2 rounded-md p-8"
      >
        {children}
        <div className="flex items-center justify-between">
          {isRegisterForm ? (
            <span className="text-dark-purple-200 text-sm">
              Уже зарегистрированы?{" "}
              <Link to="/login" className="text-pink-500">
                Войти
              </Link>
            </span>
          ) : (
            <span className="text-dark-purple-200 text-sm">
              Нет учетной записи?{" "}
              <Link to="/register" className="text-pink-500">
                Зарегистрироваться
              </Link>
            </span>
          )}
          <button
            type="submit"
            className="rounded-md bg-pink-500 px-5 py-1 text-sm text-white"
          >
            {isRegisterForm ? "Зарегистрироваться" : "Войти"}
          </button>
        </div>
        {formError && <p className="text-sm text-red-400">{formError}</p>}
      </Form>
    </div>
  )
}

export default AuthForm
