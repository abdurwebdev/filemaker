const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// Set EJS as the view engine
app.set("view engine", "ejs");

// Middleware to handle JSON and URL-encoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Route to list files in the 'files' directory
app.get("/", function (req, res) {
  fs.readdir("./files", function (err, files) {
    if (err) {
      console.log(err);
      res.status(500).send("Unable to read files");
    } else {
      res.render("index", { files: files });
    }
  });
});

// Route to display file content
app.get('/file/:filename', function (req, res) {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {
    if (err) {
      console.log(err);
      res.status(500).send("Error reading file");
    } else {
      res.render("read", { filename: req.params.filename, filedata: filedata });
    }
  });
});

// Route to display the file editing form
app.get("/edit/:filename", function (req, res) {
  res.render("edit", { filename: req.params.filename });
});

// Route to handle file renaming (editing)
app.post("/edit", function (req, res) {
  fs.rename(`./files/${req.body.prev}`, `./files/${req.body.new}`, function (err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error renaming file");
    } else {
      res.redirect("/");
    }
  });
});

// Route to handle file creation
app.post("/create", function (req, res) {
  fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function (err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error creating file");
    } else {
      res.redirect("/");
    }
  });
});

// Start the server on the correct port (using PORT environment variable for deployment)
const PORT = process.env.PORT || 3000;  // Default to 3000 for local development
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
