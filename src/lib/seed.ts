/**
 * Seed script — creates the initial admin account and a handful of sample
 * products so the app is usable immediately after setup.
 *
 * Run with: npm run seed
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import User from '../models/User';
import Product from '../models/Product';

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set. Copy .env.example to .env.local and fill it in.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@pharmacy.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: 'System Administrator',
      email: adminEmail,
      password: hashed,
      role: 'admin',
      active: true,
    });
    console.log(`Created admin user: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log('Admin user already exists, skipping.');
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    const oneYear = new Date();
    oneYear.setFullYear(oneYear.getFullYear() + 1);
    const soon = new Date();
    soon.setDate(soon.getDate() + 15);

    await Product.insertMany([
      {
        name: 'Paracetamol 500mg',
        category: 'Analgesics',
        purchasePrice: 1.2,
        sellingPrice: 2.5,
        quantity: 200,
        lowStockThreshold: 30,
        expiryDate: oneYear,
        supplierName: 'HealthPlus Distributors',
        batchNumber: 'PCM-2026-01',
      },
      {
        name: 'Amoxicillin 250mg',
        category: 'Antibiotics',
        purchasePrice: 3.5,
        sellingPrice: 6.0,
        quantity: 8,
        lowStockThreshold: 15,
        expiryDate: soon,
        supplierName: 'MedSource Ltd',
        batchNumber: 'AMX-2025-11',
      },
      {
        name: 'Vitamin C 1000mg',
        category: 'Vitamins & Supplements',
        purchasePrice: 2.0,
        sellingPrice: 4.25,
        quantity: 150,
        lowStockThreshold: 25,
        expiryDate: oneYear,
        supplierName: 'NutriWell Supplies',
      },
      {
        name: 'Ibuprofen 400mg',
        category: 'Analgesics',
        purchasePrice: 1.8,
        sellingPrice: 3.2,
        quantity: 5,
        lowStockThreshold: 20,
        expiryDate: oneYear,
        supplierName: 'HealthPlus Distributors',
      },
      {
        name: 'Antiseptic Solution 500ml',
        category: 'Antiseptics',
        purchasePrice: 2.5,
        sellingPrice: 5.0,
        quantity: 60,
        lowStockThreshold: 10,
        expiryDate: oneYear,
        supplierName: 'CleanCare Inc',
      },
    ]);
    console.log('Inserted sample products.');
  } else {
    console.log('Products already exist, skipping sample data.');
  }

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
