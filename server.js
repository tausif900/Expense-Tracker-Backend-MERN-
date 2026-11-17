require("dotenv").config();
const app = require("./src/app");
const connectionDB = require("./src/Config/db");
const PORT = 3000;

connectionDB();

// Server will start from here
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
