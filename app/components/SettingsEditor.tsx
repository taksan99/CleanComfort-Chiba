"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export default function SettingsEditor() {
  const [gaId, setGaId] = useState("")
  const [googleVerification, setGoogleVerification] = useState("")
  const [bingVerification, setBingVerification] = useState("")

  useEffect(() => {
    // 設定を取得
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const response = await fetch("/api/settings")
    const data = await response.json()
    setGaId(data.gaId || "")
    setGoogleVerification(data.googleVerification || "")
    setBingVerification(data.bingVerification || "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gaId,
        googleVerification,
        bingVerification,
      }),
    })

    if (response.ok) {
      toast({
        title: "設定が保存されました",
        description: "アナリティクスと検索エンジン設定が更新されました。",
      })
    } else {
      toast({
        title: "エラー",
        description: "設定の保存中にエラーが発生しました。",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="gaId">Google Analytics ID</Label>
        <Input id="gaId" value={gaId} onChange={(e) => setGaId(e.target.value)} placeholder="G-XXXXXXXXXX" />
      </div>
      <div>
        <Label htmlFor="googleVerification">Google Search Console 検証コード</Label>
        <Input
          id="googleVerification"
          value={googleVerification}
          onChange={(e) => setGoogleVerification(e.target.value)}
          placeholder="Google検証コード"
        />
      </div>
      <div>
        <Label htmlFor="bingVerification">Bing Webmaster Tools 検証コード</Label>
        <Input
          id="bingVerification"
          value={bingVerification}
          onChange={(e) => setBingVerification(e.target.value)}
          placeholder="Bing検証コード"
        />
      </div>
      <Button type="submit">設定を保存</Button>
    </form>
  )
}
