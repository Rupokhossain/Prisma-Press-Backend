import { JwtPayload } from "jsonwebtoken";
import { Order } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { paymentService } from "../payment/payment.service";

const createOrder = async (
  payload: Pick<Order, "quantity" | "serviceId" | "status">,
  user: JwtPayload,
) => {
  const service = await prisma.service.findUnique({
    where: {
      id: payload.serviceId,
    },
  });

  if (!service) {
    throw new Error("Service not available");
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  const totalPrice = Number(service.price) * payload.quantity;

  const order = await prisma.order.create({
    data: {
      ...payload,
      userId: dbUser.id,
      totalPrice,
    },
  });

  const payment = await paymentService.initiatePayment(order, dbUser);

  return {
    order,
    payment,
  };
};

export const orderService = {
  createOrder,
};
