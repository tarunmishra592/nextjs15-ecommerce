import { Request, Response, NextFunction } from 'express';
import * as reviewService from '../services/reviewService';

export const addReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rating, comment } = req.body;
    const review = await reviewService.addReview(req.user!.sub, req.params.productId, rating, comment);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

export const listReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await reviewService.listReviews(req.params.productId);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await reviewService.deleteReview(req.user!.sub, req.params.productId, req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
