const express = require("express");
const app = express();
const connectDb = require("./config/database");
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { setupWebSocket } = require("./socket");
const http = require('http')

const server = http.createServer(app);

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))
app.use(express.json());


require("dotenv").config({
  path: "src/config/.env",
});

const port = process.env.PORT;

app.use(cookieParser())
const userRouter = require("./routes/user");
const noteRouter = require("./routes/notes");

app.use("/", (req, res) => {
  res.send("Hello World");
});

app.use("/user", userRouter);
app.use("/note", noteRouter);



connectDb()
  .then(() => {
    console.log("Database connected successfully");
    
    server.listen(port, () => {
      console.log(`Server is running on the localhost:${port}`)
    });
    setupWebSocket(server);
  })
  .catch(() => {
    console.error("Database connection failed");
  });
