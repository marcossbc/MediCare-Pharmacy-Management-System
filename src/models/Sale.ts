import mongoose, { Schema, Types } from 'mongoose';

export interface ISaleItem {
  product: Types.ObjectId;
  name: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  subtotal: number;
}

export interface ISale {
  invoiceNumber: string;
  items: ISaleItem[];
  totalAmount: number;
  totalProfit: number;
  customerName?: string;
  paymentMethod: 'cash' | 'card' | 'insurance' | 'other';
  soldBy: Types.ObjectId;
}

const SaleItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const SaleSchema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    items: [SaleItemSchema],
    totalAmount: Number,
    totalProfit: Number,
    customerName: {
      type: String,
      default: 'Walk-in Customer',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'insurance', 'other'],
      default: 'cash',
    },
    soldBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Sale =
  mongoose.models.Sale ||
  mongoose.model('Sale', SaleSchema);

export default Sale;