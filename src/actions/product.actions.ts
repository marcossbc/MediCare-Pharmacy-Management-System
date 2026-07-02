'use server';

import { connectDB } from '@/lib/mongodb';
import Product, { IProduct } from '@/models/Product';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  category: z.string().min(1, 'Category is required'),
  purchasePrice: z.coerce.number().min(0),
  sellingPrice: z.coerce.number().min(0),
  quantity: z.coerce.number().min(0),
  lowStockThreshold: z.coerce.number().min(0).default(10),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  supplierName: z.string().min(1, 'Supplier name is required'),
  batchNumber: z.string().optional(),
  description: z.string().optional(),
});

export type ProductFormState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function getProducts(search?: string) {
  await connectDB();

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { supplierName: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const products = await Product.find(query).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getProductById(id: string) {
  await connectDB();
  const product = await Product.findById(id).lean();
  return product ? JSON.parse(JSON.stringify(product)) : null;
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await connectDB();
    await Product.create(parsed.data);
    revalidatePath('/products');
    revalidatePath('/dashboard');
    return { success: true, message: 'Product created successfully' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to create product' };
  }
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await connectDB();
    await Product.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true });
    revalidatePath('/products');
    revalidatePath('/dashboard');
    return { success: true, message: 'Product updated successfully' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to update product' };
  }
}

export async function deleteProduct(id: string) {
  await connectDB();
  await Product.findByIdAndDelete(id);
  revalidatePath('/products');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function getLowStockProducts() {
  await connectDB();
  const products = await Product.find({
    $expr: { $lte: ['$quantity', '$lowStockThreshold'] },
  })
    .sort({ quantity: 1 })
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getNearExpiryProducts(daysThreshold = 30) {
  await connectDB();
  const now = new Date();
  const threshold = new Date();
  threshold.setDate(now.getDate() + daysThreshold);

  const products = await Product.find({
    expiryDate: { $gte: now, $lte: threshold },
  })
    .sort({ expiryDate: 1 })
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getProductCategories() {
  await connectDB();
  const categories = await Product.distinct('category');
  return categories as string[];
}
