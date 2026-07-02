import { Schema, models, model } from 'mongoose';

/**
 * Reports are mostly computed on the fly from the Sale collection (see
 * src/actions/report.actions.ts). This model persists a snapshot whenever a
 * report is generated/exported, so past reports can be audited or re-exported
 * without recomputation.
 */
export type ReportPeriod = 'day' | 'month' | 'year' | 'custom';

export interface IReport {
  _id?: string;
  period: ReportPeriod;
  startDate: Date;
  endDate: Date;
  totalSalesAmount: number;
  totalProductsSold: number;
  totalProfit: number;
  totalInvoices: number;
  generatedBy: Schema.Types.ObjectId;
  createdAt?: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    period: { type: String, enum: ['day', 'month', 'year', 'custom'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalSalesAmount: { type: Number, required: true, default: 0 },
    totalProductsSold: { type: Number, required: true, default: 0 },
    totalProfit: { type: Number, required: true, default: 0 },
    totalInvoices: { type: Number, required: true, default: 0 },
    generatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default models.Report || model<IReport>('Report', ReportSchema);
