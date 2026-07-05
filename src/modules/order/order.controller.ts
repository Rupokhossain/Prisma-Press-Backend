import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { orderService } from "./order.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const payload = req.body;

  if (!payload.quantity || !payload.serviceId) {
    throw new Error("Please provide Service Id And Quantity");
  }

  const response = await orderService.createOrder(userId as string, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Order Placed",
    data: response,
  });
});

export const orderController = {
  createOrder,
};
