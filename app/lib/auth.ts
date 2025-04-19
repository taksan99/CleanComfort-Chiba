// Client-side auth utilities
export function isAuthenticated() {
  if (typeof window === "undefined") return false
  return localStorage.getItem("isAdmin") === "true"
}

export async function logout() {
  localStorage.removeItem("isAdmin")
  // Clear the cookie by making a request to the logout API
  try {
    const response = await fetch("/api/auth/logout", { method: "POST" })
    if (!response.ok) {
      throw new Error("Logout failed")
    }
  } catch (error) {
    console.error("Logout error:", error)
    throw error
  }
}
