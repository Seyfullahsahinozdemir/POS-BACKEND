import { Request, Response, NextFunction } from "express";
import CustomResponse from "../utils/custom.response";
import ordersDb from "../db/orders.db";
import { CustomUser } from "../interfaces/request.user.interface";
import { Order } from "../interfaces/order.interface";
import paymentsDb from "../db/payments.db";

export const pay = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.orderId;
    const user = req.user as CustomUser;

    const orders = await ordersDb.find({
      selector: {
        _id: orderId,
      },
    });

    if (orders.docs.length === 0) {
      return new CustomResponse(null, "Order not found.").error404(res);
    }

    // get order via orderId
    const order = orders.docs[0] as Order;

    // check order is taken by this user
    if (order.user_id !== user._id) {
      return new CustomResponse(null, "The order not belongs to you.").error400(
        res
      );
    }

    // check status
    if (order.status !== "completed") {
      return new CustomResponse(null, "The order not completed.").error400(res);
    }

    const payment = {
      date: new Date().toISOString(),
      order_id: orderId,
      user_id: user._id,
      total_price: order.total_price,
    };

    // just create payment doc.
    await paymentsDb.insert(payment as any);
    return new CustomResponse(payment, "Payment successfully created.").success(
      res
    );
  } catch (error: any) {
    return new CustomResponse(null, error.description).error400(res);
  }
};
