import pino from "pino"

// Create a basic logger configuration that works in all environments
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  redact: ["password", "email"],
  // Only use pino-pretty in development
  ...(process.env.NODE_ENV === "development"
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      }
    : {}),
})

export default logger
