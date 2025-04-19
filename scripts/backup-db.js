const { exec } = require("child_process")
const fs = require("fs")
const path = require("path")

// Check if required environment variables are set
const requiredEnvVars = ["DB_USER", "DB_HOST", "DB_NAME"]
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Error: ${varName} environment variable is not set`)
    process.exit(1)
  }
})

const backupDir = path.join(__dirname, "..", "backups")
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir)
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
const backupFile = path.join(backupDir, `backup-${timestamp}.sql`)

const command = `pg_dump -U ${process.env.DB_USER} -h ${process.env.DB_HOST} -d ${process.env.DB_NAME} > ${backupFile}`

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`)
    return
  }
  console.log(`Backup created successfully: ${backupFile}`)
})
