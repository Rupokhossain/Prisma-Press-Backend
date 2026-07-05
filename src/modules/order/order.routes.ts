import { Router } from "express";
import { orderController } from "./order.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";


const orderRoutes = Router();

orderRoutes.post("/",auth(Role.CUSTOMER, Role.USER), orderController.createOrder);


export default orderRoutes;