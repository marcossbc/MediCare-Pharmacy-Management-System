'use server';

import { connectDB } from '@/lib/mongodb';
import Sale from '@/models/Sale';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';
import { generateInvoiceNumber } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface CreateSaleResult {
  success: boolean;
  message?: string;
  invoiceNumber?: string;
  saleId?: string;
}

export async function createSale(
  items: CartItemInput[],
  customerName: string,
  paymentMethod: 'MY CASH' | 'GolisCard' | 'EDAHABPlus' | 'other'
): Promise<CreateSaleResult> {
  if (!items || items.length === 0) {
    return {
      success: false,
      message: 'Cannot create an invoice with no items',
    };
  }

  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      success: false,
      message: 'You must be logged in to create a sale',
    };
  }

  try {
    const saleItems = [];
    let totalAmount = 0;
    let totalProfit = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (product.quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for "${product.name}". Available: ${product.quantity}`
        );
      }

      const subtotal = product.sellingPrice * item.quantity;
      const profit =
        (product.sellingPrice - product.purchasePrice) * item.quantity;

      totalAmount += subtotal;
      totalProfit += profit;

      saleItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        purchasePrice: product.purchasePrice,
        sellingPrice: product.sellingPrice,
        subtotal,
      });

      product.quantity -= item.quantity;
      await product.save();
    }

    const saleDoc = await Sale.create({
      invoiceNumber: generateInvoiceNumber(),
      items: saleItems,
      totalAmount,
      totalProfit,
      customerName: customerName || 'Walk-in Customer',
      paymentMethod,
      soldBy: session.user.id,
    });

    revalidatePath('/sales');
    revalidatePath('/products');
    revalidatePath('/dashboard');
    revalidatePath('/inventory');
    revalidatePath('/reports');

    return {
      success: true,
      invoiceNumber: saleDoc.invoiceNumber,
      saleId: saleDoc._id.toString(),
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to create sale',
    };
  }
}

export async function getSales(limit = 50) {
  await connectDB();

  const sales = await Sale.find()
    .populate('soldBy', 'name')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return JSON.parse(JSON.stringify(sales));
}

export async function getSaleById(id: string) {
  await connectDB();

  const sale = await Sale.findById(id)
    .populate('soldBy', 'name')
    .lean();

  return sale ? JSON.parse(JSON.stringify(sale)) : null;
}

export async function getSalesByDateRange(start: Date, end: Date) {
  await connectDB();

  const sales = await Sale.find({
    createdAt: {
      $gte: start,
      $lte: end,
    },
  })
    .populate('soldBy', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(sales));
}