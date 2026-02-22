import app from "./app";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Online compiler running at http://localhost:${PORT}`);
});