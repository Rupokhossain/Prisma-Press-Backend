import { Order } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createOrder = async (
  userId: string,
  payload: Pick<Order, "quantity" | "serviceId" | "status">,
) => {
  const service = await prisma.service.findUnique({
    where: {
      id: payload.serviceId,
    },
  });

  if (!service) {
    throw new Error("Service not available");
  }

  const totalPrice = Number(service.price) * payload.quantity;

  const data = {
    ...payload,
    userId,
    totalPrice,
  };

  const order = await prisma.order.create({
    data,
  });

  return order;
};

export const orderService = {
  createOrder,
};
