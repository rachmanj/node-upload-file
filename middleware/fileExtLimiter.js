const path = require("path");

const fileExtLimiter = (allowedExtArray) => {
  return (req, res, next) => {
    const files = req.files;

    const fileExtensions = [];
    Object.keys(files).forEach((key) => {
      fileExtensions.push(path.extname(files[key].name));
    });

    // are the file extensions allowed?
    const allowed = fileExtensions.every((ext) =>
      allowedExtArray.includes(ext)
    );

    if (!allowed) {
      const message =
        `Upload failed. Only ${allowedExtArray.toString()} files are allowed.`.replaceAll(
          ",",
          ", "
        );

      return res.status(415).json({ status: "error", message });
    }

    next();
  };
};

module.exports = fileExtLimiter;
