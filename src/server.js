import express from "express"; //no babel: const express = require("express");
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

const logger = morgan("dev"); //Middleware for log
app.use(logger);
app.use(express.urlencoded({ extended: true })); //for using req.body

//Router
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);

export default app;
