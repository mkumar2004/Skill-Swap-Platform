require("dotenv").config();
const connectDb = require("./Config/db")
const app = require("./app");
const { ConnectCloudinary } = require("./Config/cloudinary");
const PORT = process.env.PORT || 5000;


connectDb();
ConnectCloudinary();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});