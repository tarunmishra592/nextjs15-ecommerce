import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order';
import * as orderService from '../services/orderService';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, shippingAddressId, paymentMethod } = req.body;
    const order = await orderService.createOrder(req.user!.sub, items, shippingAddressId, paymentMethod);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const listOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.listOrders(req.user!.sub);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.getOrderById(req.user!.sub, req.params.id);
    res.json(order);
  } catch (err) {
    next(err);
  }
};