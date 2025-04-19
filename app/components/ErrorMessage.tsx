import type React from "react"
import { AlertCircle } from "lucide-react"

interface ErrorMessageProps {
  message: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">エラー: </strong>
      <span className="block sm:inline">{message}</span>
      <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </span>
    </div>
  )
}

export default ErrorMessage
