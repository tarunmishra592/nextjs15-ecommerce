import {Product} from '../models/Product';

export async function createProduct(data: any) {
  const product = await Product.create(data);
  return product;
}

interface ProductFilter {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  tags?: string[];
  colors?: string[];
  sizes?: string[];
  rating?: number;
  discount?: number;
  sort?: string;
}

export async function listProducts(filter: ProductFilter) {
  const query: any = {};
  
  // Handle multiple categories
  if (filter.categories && filter.categories.length > 0) {
    query.category = { $in: filter.categories };
  }
  
  // Price range
  if (filter.minPrice != null || filter.maxPrice != null) {
    query.price = {};
    if (filter.minPrice != null) query.price.$gte = filter.minPrice;
    if (filter.maxPrice != null) query.price.$lte = filter.maxPrice;
  }
  
  // Text search
  if (filter.search) {
    query.$text = { $search: filter.search };
  }
  
  // Tags (must contain all selected tags)
  if (filter.tags && filter.tags.length > 0) {
    query.tags = { $all: filter.tags };
  }
  
  // Colors
  if (filter.colors && filter.colors.length > 0) {
    query['variants.colors'] = { $in: filter.colors };
  }
  
  // Sizes
  if (filter.sizes && filter.sizes.length > 0) {
    query['variants.sizes'] = { $in: filter.sizes };
  }
  
  // Minimum rating
  if (filter.rating) {
    query.rating = { $gte: filter.rating };
  }
  
  // Minimum discount
  if (filter.discount) {
    query.discountPercentage = { $gte: filter.discount };
  }

  // Sorting
  let sortOptions = {};
  switch (filter.sort) {
    case 'price-asc':
      sortOptions = { price: 1 };
      break;
    case 'price-desc':
      sortOptions = { price: -1 };
      break;
    case 'newest':
      sortOptions = { createdAt: -1 };
      break;
    case 'rating':
      sortOptions = { rating: -1 };
      break;
    case 'featured':
      sortOptions = { isFeatured: -1, createdAt: -1 };
      break;
    default:
      sortOptions = { createdAt: -1 };
  }

  return await Product.find(query).sort(sortOptions);
}

export async function getProductById(id: string) {
  const product = await Product.findById(id);
  if (!product) throw Object.assign(new Error('Product not found'), { statusCode: 404 });
  return product;
}

export async function updateProduct(id: string, updates: any) {
  const product = await Product.findByIdAndUpdate(id, updates, { new: true });
  if (!product) throw Object.assign(new Error('Product not found'), { statusCode: 404 });
  return product;
}

export async function deleteProduct(id: string) {
  const res = await Product.findByIdAndDelete(id);
  if (!res) throw Object.assign(new Error('Product not found'), { statusCode: 404 });
  return res;
}


export const searchProducts = async (query: string) => {
  const searchRegex = new RegExp(query, 'i'); // case-insensitive

  return await Product.find({
    $or: [
      { name: searchRegex },
      { description: searchRegex },
      { category: searchRegex }
    ]
  })
  .select('name price images description'); // include image in response
};