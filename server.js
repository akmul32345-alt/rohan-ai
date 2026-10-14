const express = require("express");
const app = express();

app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => {
  res.send("Rohan AI server is running!");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Rohan AI running on port ${PORT}`);
});
