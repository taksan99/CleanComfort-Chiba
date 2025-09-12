"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function DatabaseManagement() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  const initializeDatabase = async () => {
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/init-content-table", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setMessage("データベースが正常に初期化されました！")
        setMessageType("success")
      } else {
        setMessage(`エラー: ${data.error}`)
        setMessageType("error")
      }
    } catch (error) {
      setMessage(`エラー: ${error.message}`)
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  const testContentAPI = async () => {
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/content?section=services")
      const data = await response.json()

      if (data.content) {
        setMessage("コンテンツAPIが正常に動作しています！")
        setMessageType("success")
      } else {
        setMessage("コンテンツが見つかりませんでした。データベースを初期化してください。")
        setMessageType("error")
      }
    } catch (error) {
      setMessage(`APIテストエラー: ${error.message}`)
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  const checkDatabaseStatus = async () => {
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/init-content-table")
      const data = await response.json()

      if (data.success) {
        setMessage(`データベース接続OK - レコード数: ${data.recordCount}`)
        setMessageType("success")
      } else {
        setMessage(`データベースステータス: ${data.error}`)
        setMessageType("error")
      }
    } catch (error) {
      setMessage(`接続エラー: ${error.message}`)
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>データベース管理</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={initializeDatabase} disabled={loading} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                データベースを初期化
              </Button>

              <Button onClick={testContentAPI} disabled={loading} variant="outline" className="w-full bg-transparent">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                コンテンツAPIをテスト
              </Button>

              <Button
                onClick={checkDatabaseStatus}
                disabled={loading}
                variant="outline"
                className="w-full bg-transparent"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                接続状況を確認
              </Button>
            </div>

            {message && (
              <Alert
                className={messageType === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}
              >
                <AlertDescription className={messageType === "success" ? "text-green-800" : "text-red-800"}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">使用方法:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>「データベースを初期化」をクリックしてテーブルとデータを作成</li>
                <li>「コンテンツAPIをテスト」で動作確認</li>
                <li>管理者ページ（/admin）でコンテンツを編集</li>
                <li>別ブラウザで変更が反映されることを確認</li>
              </ol>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold mb-2">トラブルシューティング:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>変更が反映されない場合は、ページを再読み込みしてください</li>
                <li>エラーが発生する場合は、「接続状況を確認」をクリックしてください</li>
                <li>それでも解決しない場合は、データベースを再初期化してください</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
