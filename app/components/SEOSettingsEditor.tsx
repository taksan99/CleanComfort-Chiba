"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Upload, AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SEOSettingsEditor() {
  const [googleTagManagerId, setGoogleTagManagerId] = useState("")
  const [googleTagManagerBodyCode, setGoogleTagManagerBodyCode] = useState("")
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("")
  const [googleSearchConsoleVerification, setGoogleSearchConsoleVerification] = useState("")
  const [customHeadTags, setCustomHeadTags] = useState("")
  const [googleAnalyticsCode, setGoogleAnalyticsCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [faviconFile, setFaviconFile] = useState<File | null>(null)
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false)
  const [currentFaviconUrl, setCurrentFaviconUrl] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    fetchSEOSettings()
    fetchCurrentFavicon()
  }, [])

  const fetchSEOSettings = async () => {
    setIsFetching(true)
    setError(null)
    try {
      console.log("Fetching SEO settings...")

      // まずデータベース接続を確認
      const dbResponse = await fetch("/api/db-diagnostic", {
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      })

      if (!dbResponse.ok) {
        const dbErrorText = await dbResponse.text()
        console.error("Database diagnostic failed:", dbErrorText)
        throw new Error(`Database connection check failed: ${dbResponse.status}. ${dbErrorText}`)
      }

      const dbStatus = await dbResponse.json()
      console.log("Database status:", dbStatus)

      // テーブル構造を更新
      try {
        const schemaResponse = await fetch("/api/update-seo-settings-schema", {
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
        })

        if (schemaResponse.ok) {
          const schemaData = await schemaResponse.json()
          console.log("Schema update result:", schemaData)
        } else {
          const schemaErrorText = await schemaResponse.text()
          console.warn("Schema update warning:", schemaErrorText)
        }
      } catch (schemaError) {
        console.warn("Schema update error:", schemaError)
        // スキーマ更新エラーは無視して続行
      }

      // SEO設定を取得
      const settingsResponse = await fetch("/api/seo-settings", {
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      })

      // レスポンスの内容を取得
      let data
      const contentType = settingsResponse.headers.get("content-type") || ""

      if (contentType.includes("application/json")) {
        data = await settingsResponse.json()
      } else {
        // JSONでない場合はテキストを取得してエラーとして扱う
        const text = await settingsResponse.text()
        console.error("Received non-JSON response:", text.substring(0, 500))
        throw new Error(`Expected JSON response but got ${contentType}. Status: ${settingsResponse.status}`)
      }

      if (!settingsResponse.ok) {
        throw new Error(data.error || data.message || `HTTP error! status: ${settingsResponse.status}`)
      }

      // 状態を更新
      setGoogleTagManagerId(data.google_tag_manager_id || "")
      setGoogleAnalyticsId(data.google_analytics_id || "")
      setGoogleSearchConsoleVerification(data.google_search_console_verification || "")
      setCustomHeadTags(data.custom_head_tags || "")
      setGoogleAnalyticsCode(data.google_analytics_code || "")
      setGoogleTagManagerBodyCode(data.google_tag_manager_body_code || "")

      console.log("SEO settings loaded successfully")
    } catch (error) {
      console.error("Error fetching SEO settings:", error)
      setError(`SEO設定の取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`)
      toast({
        title: "エラー",
        description: "SEO設定の取得中にエラーが発生しました。",
        variant: "destructive",
      })
    } finally {
      setIsFetching(false)
      setIsRetrying(false)
    }
  }

  const fetchCurrentFavicon = async () => {
    try {
      const response = await fetch("/api/images?section=favicon")
      if (response.ok) {
        const data = await response.json()
        if (data.url) {
          setCurrentFaviconUrl(data.url)
        }
      }
    } catch (error) {
      console.error("Error fetching current favicon:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      console.log("Submitting SEO settings form...")

      // リクエストボディを作成
      const requestBody = {
        googleTagManagerId,
        googleAnalyticsId,
        googleSearchConsoleVerification,
        customHeadTags,
        googleAnalyticsCode,
        googleTagManagerBodyCode,
      }

      console.log("Request body:", JSON.stringify(requestBody))

      const response = await fetch("/api/seo-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("Response status:", response.status)

      // レスポンスの内容を取得
      let data
      const contentType = response.headers.get("content-type")

      try {
        if (contentType && contentType.includes("application/json")) {
          data = await response.json()
          console.log("Response data:", data)
        } else {
          const text = await response.text()
          console.error("Non-JSON response:", text)
          throw new Error(`Expected JSON response but got ${contentType}. Status: ${response.status}`)
        }
      } catch (parseError) {
        console.error("Error parsing response:", parseError)
        throw new Error(
          `Failed to parse response: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
        )
      }

      if (!response.ok) {
        const errorMessage = data?.error || data?.message || data?.details || `HTTP error! status: ${response.status}`
        console.error("Error response:", errorMessage)
        throw new Error(errorMessage)
      }

      toast({
        title: "設定が保存されました",
        description: "SEO設定が正常に更新されました。",
      })
    } catch (error) {
      console.error("Error saving SEO settings:", error)
      const errorMessage = error instanceof Error ? error.message : "不明なエラーが発生しました"

      setError(`SEO設定の保存中にエラーが発生しました: ${errorMessage}`)
      toast({
        title: "エラー",
        description: `SEO設定の保存中にエラーが発生しました: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFaviconUpload = async () => {
    if (!faviconFile) return

    setIsUploadingFavicon(true)
    try {
      const formData = new FormData()
      formData.append("file", faviconFile)

      const response = await fetch("/api/upload-favicon", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Favicon upload failed")
      }

      const data = await response.json()

      toast({
        title: "ファビコンをアップロードしました",
        description: "変更が反映されるまで少し時間がかかる場合があります。",
      })

      setFaviconFile(null)
      setCurrentFaviconUrl(data.url)
    } catch (error) {
      console.error("Favicon upload error:", error)
      toast({
        title: "エラー",
        description: `ファビコンのアップロードに失敗しました: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setIsUploadingFavicon(false)
    }
  }

  const handleRetry = () => {
    setIsRetrying(true)
    fetchSEOSettings()
  }

  if (isFetching) {
    return <div>SEO設定を読み込み中...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button variant="outline" size="sm" className="mt-2" onClick={handleRetry} disabled={isRetrying}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {isRetrying ? "再試行中..." : "再試行"}
          </Button>
        </Alert>
      )}

      <div>
        <Label htmlFor="googleTagManagerId">Google Tag Manager ID</Label>
        <Input
          id="googleTagManagerId"
          value={googleTagManagerId}
          onChange={(e) => setGoogleTagManagerId(e.target.value)}
          placeholder="GTM-XXXXXXX"
        />
      </div>
      <div>
        <Label htmlFor="googleTagManagerBodyCode">Google Tag Manager &lt;body&gt;タグ用コード</Label>
        <Textarea
          id="googleTagManagerBodyCode"
          value={googleTagManagerBodyCode}
          onChange={(e) => setGoogleTagManagerBodyCode(e.target.value)}
          placeholder={`<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com  Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`}
          rows={5}
        />
        <p className="text-sm text-gray-500 mt-1">
          このコードは&lt;body&gt;タグの直後に挿入されます。通常はnoscriptタグを含むGTMのコードを入力します。
        </p>
      </div>
      <div>
        <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
        <Input
          id="googleAnalyticsId"
          value={googleAnalyticsId}
          onChange={(e) => setGoogleAnalyticsId(e.target.value)}
          placeholder="G-XXXXXXXXXX"
        />
      </div>
      <div>
        <Label htmlFor="googleSearchConsoleVerification">Google Search Console 検証コード</Label>
        <Input
          id="googleSearchConsoleVerification"
          value={googleSearchConsoleVerification}
          onChange={(e) => setGoogleSearchConsoleVerification(e.target.value)}
          placeholder={`<meta name="google-site-verification" content="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />`}
        />
      </div>
      <div>
        <Label htmlFor="customHeadTags">カスタム&lt;head&gt;タグ</Label>
        <Textarea
          id="customHeadTags"
          value={customHeadTags}
          onChange={(e) => setCustomHeadTags(e.target.value)}
          placeholder={`<meta name='description' content='サイトの説明' />`}
          rows={5}
        />
      </div>
      <div>
        <Label htmlFor="googleAnalyticsCode">Google アナリティクスコード</Label>
        <Textarea
          id="googleAnalyticsCode"
          value={googleAnalyticsCode}
          onChange={(e) => setGoogleAnalyticsCode(e.target.value)}
          placeholder={`<!-- Google Analytics コードをここにペースト -->`}
          rows={10}
        />
      </div>
      <div className="space-y-4 p-4 border rounded-md mt-8">
        <h3 className="text-lg font-medium">ファビコン設定</h3>
        <p className="text-sm text-gray-600">
          ブラウザタブやブックマークに表示されるウェブサイトのアイコンをアップロードします。
          <br />
          推奨: 32x32ピクセルの.icoファイル
        </p>

        {currentFaviconUrl && (
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-sm">現在のファビコン:</div>
            <img
              src={currentFaviconUrl || "/placeholder.svg"}
              alt="Current Favicon"
              className="w-8 h-8 border rounded"
            />
          </div>
        )}

        <div className="flex items-center space-x-4">
          <div>
            <label
              htmlFor="favicon-upload"
              className="cursor-pointer flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-md hover:bg-gray-100"
            >
              <Upload className="w-4 h-4 mr-2" />
              ファビコンを選択
            </label>
            <input
              id="favicon-upload"
              type="file"
              className="hidden"
              accept=".ico,.png,.jpg,.jpeg"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFaviconFile(e.target.files[0])
                }
              }}
            />
          </div>

          {faviconFile && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="truncate max-w-xs">{faviconFile.name}</span>
              <Button variant="ghost" size="sm" onClick={() => setFaviconFile(null)} className="ml-2">
                クリア
              </Button>
            </div>
          )}

          <Button
            variant="secondary"
            size="sm"
            disabled={!faviconFile || isUploadingFavicon}
            onClick={handleFaviconUpload}
          >
            {isUploadingFavicon ? "アップロード中..." : "アップロード"}
          </Button>
        </div>

        <div className="text-sm text-amber-600 flex items-center mt-2">
          <AlertCircle className="h-4 w-4 mr-1" />
          アップロードしたファビコンはサイト全体に適用されます。反映には時間がかかる場合があります。
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "保存中..." : "設定を保存"}
      </Button>
    </form>
  )
}
