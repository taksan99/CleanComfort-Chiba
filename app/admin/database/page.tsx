"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Database, RefreshCw } from "lucide-react"

export default function DatabasePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [dbStatus, setDbStatus] = useState<string | null>(null)

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
        setMessage({ type: "success", text: "データベースが正常に初期化されました！" })
      } else {
        setMessage({ type: "error", text: `エラー: ${data.error || "初期化に失敗しました"}` })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `ネットワークエラー: ${error instanceof Error ? error.message : "不明なエラー"}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkDatabaseStatus = async () => {
    setIsLoading(true)
    setDbStatus(null)

    try {
      const response = await fetch("/api/db-status")
      const data = await response.json()

      if (response.ok) {
        setDbStatus(`接続成功: ${data.message || "データベースは正常に動作しています"}`)
      } else {
        setDbStatus(`接続エラー: ${data.error || "データベースに接続できません"}`)
      }
    } catch (error) {
      setDbStatus(`ネットワークエラー: ${error instanceof Error ? error.message : "不明なエラー"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testContentAPI = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      // Test fetching content
      const response = await fetch("/api/content?section=valueProposition")
      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: "success",
          text: `コンテンツAPI テスト成功: ${data.content ? "データが見つかりました" : "データが見つかりません"}`,
        })
      } else {
        setMessage({ type: "error", text: `コンテンツAPI エラー: ${data.error}` })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `API テストエラー: ${error instanceof Error ? error.message : "不明なエラー"}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">データベース管理</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              データベース初期化
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              コンテンツ管理用のデータベーステーブルを作成し、デフォルトデータを挿入します。
            </p>

            <Button onClick={initializeDatabase} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  初期化中...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  データベースを初期化
                </>
              )}
            </Button>

            {message && (
              <Alert className={message.type === "success" ? "border-green-500" : "border-red-500"}>
                {message.type === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <AlertDescription className={message.type === "success" ? "text-green-700" : "text-red-700"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>データベース接続テスト</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">データベースへの接続状況を確認します。</p>

            <Button
              onClick={checkDatabaseStatus}
              disabled={isLoading}
              variant="outline"
              className="w-full bg-transparent"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  確認中...
                </>
              ) : (
                "接続状況を確認"
              )}
            </Button>

            {dbStatus && (
              <Alert>
                <AlertDescription>{dbStatus}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>コンテンツAPI テスト</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">コンテンツ取得APIの動作を確認します。</p>

            <Button onClick={testContentAPI} disabled={isLoading} variant="outline" className="w-full bg-transparent">
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  テスト中...
                </>
              ) : (
                "コンテンツAPI をテスト"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>使用方法</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>まず「データベースを初期化」ボタンをクリックしてテーブルを作成</li>
              <li>「接続状況を確認」でデータベース接続をテスト</li>
              <li>「コンテンツAPI をテスト」でAPI動作を確認</li>
              <li>管理者ページ（/admin）でコンテンツを編集</li>
              <li>別のブラウザで変更が反映されることを確認</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
