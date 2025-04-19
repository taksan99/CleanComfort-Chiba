import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "")

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secretKey)
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } catch (error) {
    return null
  }
}

export async function validateCredentials(username: string, password: string): Promise<boolean> {
  const validCredentials = {
    taksan99: "dvArXJUxKdmKREMX4MQf",
    admin: "password",
  }

  return validCredentials[username] === password
}

export async function createToken(payload: { username: string }): Promise<string> {
  return await encrypt(payload)
}

export async function getServerSession() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")

  if (!token) return null

  try {
    return await decrypt(token.value)
  } catch (error) {
    return null
  }
}
