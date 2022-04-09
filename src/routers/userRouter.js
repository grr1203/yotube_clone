import express from "express";
import {
  logout,
  getEdit,
  postEdit,
  see,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController";
import { uploadFiles } from "../middleware";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.route("/edit").get(getEdit).post(postEdit);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/:id(\\d+)", see);

export default userRouter;
