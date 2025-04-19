const { exec } = require("child_process")
const path = require("path")

if (process.argv.length < 3) {
  console.error("Please provide the backup file name")
  process.exit(1)
}

const backupFile = path.join(__dirname, "..", "backups", process.argv[2])

const command = `psql -U ${process.env.DB_USER} -h ${process.env.DB_HOST} -d ${process.env.DB_NAME} < ${backupFile}`

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`)
    return
  }
  console.log(`Database restored successfully from: ${backupFile}`)
})
