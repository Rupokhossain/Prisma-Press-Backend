import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import config from "./config";
import { userRoutes } from "./modules/user/user.route";

const app: Application = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  // const user = await prisma.user.findMany()
  // console.log(user);
  res.send("Hello World!");
});



app.use("/api/users", userRoutes);



export default app;
