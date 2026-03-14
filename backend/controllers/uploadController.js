export function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    return res.json({
      message: "File uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "File upload failed" });
  }
}
