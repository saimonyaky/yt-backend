import fs from "fs";
import { exec } from "child_process";
import express from "express";

const app = express();

app.get("/api/video", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send({ error: "missing url" });

  // Check yt-dlp exists
  if (!fs.existsSync("./yt-dlp")) {
    return res.status(500).send({ error: "yt-dlp binary not found" });
  }

  exec(`./yt-dlp -f best -g "${url}"`, (err, stdout, stderr) => {
    if (err) {
      console.error("yt-dlp error:", stderr);
      return res.status(500).send({ error: "yt-dlp failed", stderr });
    }

    res.send({ streamUrl: stdout.trim() });
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
