import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/productService';

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = {
      categories: req.query.category ? (req.query.category as string).split(',') : undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      search: req.query.search as string,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      colors: req.query.colors ? (req.query.colors as string).split(',') : undefined,
      sizes: req.query.sizes ? (req.query.sizes as string).split(',') : undefined,
      rating: req.query.rating ? Number(req.query.rating) : undefined,
      discount: req.query.discount ? Number(req.query.discount) : undefined,
      sort: req.query.sort as string || 'newest'
    };
    const products = await productService.listProducts(filter);
    console.log(products)
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await productService.updateProduct(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};


export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('----------------')
    console.log(req.query)
    const query = req.query.query as string;
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const products = await productService.searchProducts(query);
    res.json(products);
  } catch (error) {
    next(error);
  }
};