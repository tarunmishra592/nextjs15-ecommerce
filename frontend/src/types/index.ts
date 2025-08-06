export type ApiErrorResponse = {
    message?: string;
    error?: string;
    statusCode?: number;
    errors?: Record<string, string[]>;
};

export interface Product {
    _id: string
    name: string
    description: string
    price: number
    originalPrice?: number
    category: string
    images: string[]
    stock: number
    reviewCount: number;
    rating?: number
    tags?: string[]
    variants?: {
        colors?: string[]
        sizes?: string[]
    }
}
  
export interface Review {
    _id: string;
    user: {
      _id: string;
      name: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
}
  
export interface User {
    _id: string;
    name: string;
    email: string;
}
  
export interface OrderItem {
    product: Product;
    quantity: number;
    priceAt: number;
}
  
export interface Order {
    _id: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paid: boolean;
    createdAt: string;
}
  
export interface AuthTokens {
    token: string;
    user: any;
}
  

export interface AuthState {
    user: null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginError {
    message: string;
    status?: number;
}

export interface CartItem {
    _id: string;               // unique entry _id (if stored separately)
    productId: string;
    product: Product;
    quantity: number;
    priceAtAdd: number;
    subtotal: number;          // priceAtAdd * quantity
    addedAt: string;
}

export interface WishlistItems {
    _id: string;
    name: string;
    price: number;
    images: string[];
}

export interface Address {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
}
  
export interface RazorpaySuccessResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId?: string;
}
  
export interface OrderResult {
    id: string;
    status: 'success' | 'failed';
    message?: string;
    orderDetails?: any;
}

export interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
    receipt?: string;
    status: 'created' | 'paid' | 'failed';
  }
  
export interface PaymentVerificationPayload {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId?: string;
}
  
export interface PaymentVerificationResult {
    success: boolean;
    orderId: string;
    paymentId: string;
}

// Add these types to your existing types file
export type PaymentMethod = 'razorpay' | 'cod' | 'wallet';

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  status: 'created' | 'paid' | 'failed';
}

export interface PaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  orderId: string;
  paymentId: string;
}

export interface ShippingAddress {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
}