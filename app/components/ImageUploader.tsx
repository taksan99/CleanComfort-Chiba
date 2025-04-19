"use client"

import { useState, useCallback, useEffect } from "react"
import { Upload, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type React from "react"
import FeedbackMessage from "@/app/components/FeedbackMessage"

interface ImageUploaderProps {
  onImageUpload: (file: File, section: string) => Promise<void>
  currentImage?: string
  width?: number
  height?: number
  className?: string
  isAdmin: boolean
  section: string
  sectionName: string
  acceptedFileTypes?: string
}

const ImageUploader = ({
  onImageUpload,
  currentImage,
  width = 600,
  height = 400,
  className = "",
  isAdmin,
  section,
  sectionName,
  acceptedFileTypes = "image/*",
}: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage)
    } else {
      async function fetchImage() {
        try {
          const response = await fetch(`/api/images?section=${section}`)
          const data = await response.json()
          if (data.url) {
            setPreview(data.url)
          }
        } catch (error) {
          console.error("Error fetching image:", error)
        }
      }
      fetchImage()
    }
  }, [currentImage, section])

  const handleFile = useCallback(
    async (file: File) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
        setIsUploading(true)
        try {
          await onImageUpload(file, section)
          setFeedback({ message: "画像が正常にアップロードされました。", type: "success" })
        } catch (error) {
          setFeedback({ message: "画像のアップロードに失敗しました。", type: "error" })
        } finally {
          setIsUploading(false)
        }
      } else {
        console.error("Invalid file type. Please upload an image.")
        setFeedback({ message: "無効なファイル形式です。画像ファイルをアップロードしてください。", type: "error" })
      }
    },
    [onImageUpload, section],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && isAdmin) handleFile(file)
    },
    [handleFile, isAdmin],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleButtonClick = useCallback(() => {
    if (isAdmin) {
      const input = document.getElementById(`image-upload-${section}`) as HTMLInputElement
      if (input) {
        input.click()
      }
    }
  }, [isAdmin, section])

  return (
    <div className={`relative ${className}`}>
      <h3 className="text-lg font-semibold mb-2">{sectionName}</h3>
      <div className="flex space-x-4">
        {/* 現在のサイトに表示されている画像 */}
        <div className="w-1/2">
          <h4 className="text-sm font-medium mb-2">現在の画像</h4>
          <Image
            src={currentImage || "/placeholder.svg"}
            alt={`Current ${sectionName} image`}
            width={width / 2}
            height={height / 2}
            className="rounded-lg object-cover"
          />
        </div>
        {/* 新しくアップロードされた画像またはアップロードエリア */}
        <div className="w-1/2">
          <h4 className="text-sm font-medium mb-2">新しい画像</h4>
          {preview ? (
            <div className="relative group">
              <Image
                src={preview || "/placeholder.svg"}
                alt={`New ${sectionName} image`}
                width={width / 2}
                height={height / 2}
                className="rounded-lg object-cover"
              />
              {isAdmin && (
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <label htmlFor={`image-upload-${section}`} className="cursor-pointer">
                    <Button variant="secondary" className="gap-2" onClick={handleButtonClick} disabled={isUploading}>
                      <Upload className="h-4 w-4" />
                      {isUploading ? "アップロード中..." : "画像を変更"}
                    </Button>
                  </label>
                </div>
              )}
            </div>
          ) : (
            isAdmin && (
              <label
                htmlFor={`image-upload-${section}`}
                className={`flex flex-col items-center justify-center w-full h-[${height / 2}px] border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  isDragging ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-12 h-12 mb-4 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">クリックして画像をアップロード</span>
                    <br />
                    またはドラッグ＆ドロップ
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF (最大 5MB)</p>
                </div>
              </label>
            )
          )}
        </div>
      </div>
      {isAdmin && (
        <input
          id={`image-upload-${section}`}
          type="file"
          className="hidden"
          accept={acceptedFileTypes}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
      )}
      {feedback && <FeedbackMessage message={feedback.message} type={feedback.type} />}
    </div>
  )
}

export default ImageUploader
