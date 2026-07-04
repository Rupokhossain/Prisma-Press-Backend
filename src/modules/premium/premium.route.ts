import { NextFunction, Request, Response, Router } from "express";

import { auth } from "../../middlewares/auth";
import { Role, SubscriptionStatus } from "../../../generated/prisma/enums";
import { premiumController } from "./premium.controller";
import { catchAsync } from "../../utils/catchAsync";
import { prisma } from "../../lib/prisma";
import { subscriptionGuard } from "../../middlewares/premiumGurds";


const router = Router();

router.get("/", auth(Role.ADMIN, Role.AUTHOR, Role.USER), 

subscriptionGuard(),
premiumController.getPremiumContent);

export const premiumRoutes = router;
