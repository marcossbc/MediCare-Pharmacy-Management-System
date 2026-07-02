'use client';

import Modal from '@/components/ui/Modal';
import ProductForm from './ProductForm';
import { ProductDTO } from '@/types';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product?: ProductDTO;
}

export default function ProductModal({ open, onClose, product }: ProductModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={product ? 'Edit Product' : 'Add New Product'} size="lg">
      <ProductForm product={product} onSuccess={onClose} />
    </Modal>
  );
}
