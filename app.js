const express = require("express");
const app = express();

app.use(express.static(__dirname));

app.get("*", (req, res) => {
  res.render("index.html");
})

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));