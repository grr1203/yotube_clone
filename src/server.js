import express from "express"; //no babel: const express = require("express");
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middleware";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

const logger = morgan("dev"); //Middleware for log
app.use(logger);
app.use(express.urlencoded({ extended: true })); //for using req.body
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/youtubeClone",
    }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false, //data in session first change(login) -> session save
  })
);
app.use(localsMiddleware);

//Router
app.use("/uploads", express.static("uploads")); //for file
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);

export default app;
