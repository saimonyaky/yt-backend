const express = require("express")
const cors = require("cors")
const { exec } = require("child_process")

const app = express()
app.use(cors())

app.get("/api/video", (req, res) => {
  const url = req.query.url
  if (!url) return res.status(400).json({ error: "Missing url param" })

  exec(`yt-dlp -f best --get-url ${url}`, (err, stdout, stderr) => {
    if (err) {
      console.error(stderr)
      return res.status(500).json({ error: "yt-dlp failed" })
    }
    res.json({ streamUrl: stdout.trim() })
  })
})

const PORT = 4000
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))