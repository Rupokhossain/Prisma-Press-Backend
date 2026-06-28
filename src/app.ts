import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import config from "./config";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { postRoutes } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comment/comment.route";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:8000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  // const user = await prisma.user.findMany()
  // console.log(user);
  res.send("Hello World!");
});

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes)

export default app;
