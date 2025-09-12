"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Database, RefreshCw } from "lucide-react"

export default function DatabaseManagement() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const initializeDatabase = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/init-content-table", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: "success",
          text: `データベースの初期化が完了しました。${data.message}`,
        })
      } else {
        setMessage({
          type: "error",
          text: `エラー: ${data.error || "Unknown error"}`,
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `接続エラー: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkDatabaseStatus = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/content?section=hero")
      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: "success",
          text: "データベース接続は正常です。コンテンツテーブルが利用可能です。",
        })
      } else {
        setMessage({
          type: "error",
          text: "データベーステーブルが見つかりません。初期化が必要です。",
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `データベース接続エラー: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">データベース管理</h1>
        <p className="text-gray-600">サイトコンテンツのデータベーステーブルを管理します。</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              データベース初期化
            </CardTitle>
            <CardDescription>コンテンツテーブルを作成し、デフォルトデータを挿入します。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={initializeDatabase} disabled={isLoading} className="flex items-center gap-2">
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                データベースを初期化
              </Button>

              <Button
                variant="outline"
                onClick={checkDatabaseStatus}
                disabled={isLoading}
                className="flex items-center gap-2 bg-transparent"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <AlertCircle className="h-4 w-4" />}
                接続状況を確認
              </Button>
            </div>

            {message && (
              <Alert
                className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}
              >
                <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>使用方法</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-gray-600">
              <h4 className="font-medium mb-2">初回セットアップ:</h4>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>「データベースを初期化」ボタンをクリック</li>
                <li>成功メッセージを確認</li>
                <li>管理者ページでコンテンツ編集を開始</li>
              </ol>
            </div>

            <div className="text-sm text-gray-600">
              <h4 className="font-medium mb-2">トラブルシューティング:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>「接続状況を確認」で現在の状態をチェック</li>
                <li>エラーが発生した場合は再度初期化を実行</li>
                <li>問題が続く場合は環境変数を確認</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
