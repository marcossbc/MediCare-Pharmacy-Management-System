import mongoose, { Schema, models, model } from 'mongoose';

export interface IProduct {
  _id?: string;
  name: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  lowStockThreshold: number;
  expiryDate: Date;
  supplierName: string;
  batchNumber?: string;
  description?: string;
  // image:
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, trim: true, index: true },
    purchasePrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, required: true, default: 10 },
    expiryDate: { type: Date, required: true },
    supplierName: { type: String, required: true, trim: true },
    batchNumber: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', category: 'text', supplierName: 'text' });

export default models.Product || model<IProduct>('Product', ProductSchema);
