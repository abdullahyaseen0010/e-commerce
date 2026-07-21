'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export interface CartItemData {
  id: string;
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  variant?: string;
  maxQuantity?: number;
}

interface CartItemProps {
  item: CartItemData;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  isUpdating?: boolean;
}

export default function CartItem({ item, onQuantityChange, onRemove, isUpdating = false }: CartItemProps) {
  const { id, slug, name, imageUrl, price, quantity, variant, maxQuantity } = item;
  const atMax = typeof maxQuantity === 'number' && quantity >= maxQuantity;
  const atMin = quantity <= 1;

  const decrease = () => {
    if (!atMin) onQuantityChange(id, quantity - 1);
  };

  const increase = () => {
    if (!atMax) onQuantityChange(id, quantity + 1);
  };

  return (
    <div className="flex gap-4 border-b border-slate-200 py-4 last:border-b-0">
      <Link href={`/product/${slug}`} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
        <Image src={imageUrl} alt={name} fill sizes="80px" className="object-cover" />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/product/${slug}`} className="text-sm font-medium text-slate-900 hover:underline">
              {name}
            </Link>
            {variant && <p className="mt-0.5 text-sm text-slate-500">{variant}</p>}
          </div>
          <p className="text-sm font-medium text-slate-900">{formatCurrency(price * quantity)}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-md border border-slate-300">
            <button
              type="button"
              onClick={decrease}
              disabled={atMin || isUpdating}
              aria-label={`Decrease quantity of ${name}`}
              className="px-2.5 py-1 text-slate-600 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              −
            </button>
            <span className="min-w-[2rem] px-1 text-center text-sm text-slate-900" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={increase}
              disabled={atMax || isUpdating}
              aria-label={`Increase quantity of ${name}`}
              className="px-2.5 py-1 text-slate-600 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(id)}
            disabled={isUpdating}
            className="text-sm font-medium text-slate-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Remove
          </button>
        </div>

        {atMax && <p className="text-xs text-amber-600">Max available quantity reached.</p>}
      </div>
    </div>
  );
}