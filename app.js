const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");

const fileExtLimiter = require("./middleware/fileExtLimiter");
const filePayloadExists = require("./middleware/filePayloadExists");
const fileSizeLimiter = require("./middleware/fileSizeLimiter");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post(
  "/upload",
  fileUpload({ createParentPath: true }),
  filePayloadExists,
  fileExtLimiter([".png", ".jpg", ".JPG", ".jpeg", ".gif"]),
  fileSizeLimiter,
  (req, res) => {
    const files = req.files;
    console.log(files);

    Object.keys(files).forEach((key) => {
      const filepath = path.join(__dirname, "files", files[key].name);
      files[key].mv(filepath, (err) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Error uploading file",
          });
        }
      });
    });

    return res.json({
      status: "success",
      message: Object.keys(files).toString(),
    });
  }
);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
