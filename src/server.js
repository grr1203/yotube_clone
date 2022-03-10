import express from "express"; //no babel: const express = require("express");
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;
const app = express();

const logger = morgan("dev"); //Middleware for log
app.use(logger);

//Router
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);

const handleListening = () =>
  console.log(`Server listening on localhost:${PORT}✨`);

app.listen(4000, handleListening);
