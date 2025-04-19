export async function checkImageFormat(url: string): Promise<string> {
  try {
    const response = await fetch(url, { method: "HEAD" })
    const contentType = response.headers.get("Content-Type")
    return contentType || "unknown"
  } catch (error) {
    console.error("Error checking image format:", error)
    return "error"
  }
}
