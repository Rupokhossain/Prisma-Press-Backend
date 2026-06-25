import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import httpStatus from "http-status";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/register", userController.registerUser);

router.get(
  "/me",
  //   (req: Request, res: Response, next: NextFunction) => {
  //     const { accessToken } = req.cookies;
  //     console.log(accessToken);

  //     const verifiedToken = jwtUtils.verifiedToken(
  //       accessToken,
  //       config.jwt_access_secret,
  //     );

  //     // if (typeof verifiedToken === "string") {
  //     //   throw new Error(verifiedToken);
  //     // }

  //     if (!verifiedToken.success) {
  //       throw new Error(verifiedToken.error);
  //     }
  //     const { email, name, id, role } = verifiedToken.data as JwtPayload;

  //     // const requireRoles = ["ADMIN", "USER", "AUTHOR"];
  //     const requireRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];

  //     if (!requireRoles.includes(role)) {
  //       return res.status(403).json({
  //         success: false,
  //         statusCode: httpStatus.FORBIDDEN,
  //         message: "Forbidden. You don't have permisson to access this resource.",
  //       });
  //     }

  //     req.user = {
  //       email,
  //       name,
  //       id,
  //       role,
  //     };

  //     next();
  //   },

  auth(Role.ADMIN, Role.USER, Role.AUTHOR),

  userController.getMyProfile,
);

router.put(
  "/my-profile",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  userController.updateMyProfile,
);

export const userRoutes = router;
