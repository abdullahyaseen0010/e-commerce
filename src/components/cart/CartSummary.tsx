'use client';

import { useState, FormEvent } from 'react';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/formatCurrency';

interface CartSummaryProps {
  subtotal: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  onApplyPromoCode?: (code: string) => Promise<void> | void;
  promoError?: string | null;
  onCheckout: () => void;
  isCheckoutLoading?: boolean;
  isCheckoutDisabled?: boolean;
}

export default function CartSummary({
  subtotal,
  shipping,
  tax,
  discount = 0,
  onApplyPromoCode,
  promoError = null,
  onCheckout,
  isCheckoutLoading = false,
  isCheckoutDisabled = false,
}: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const total = subtotal + (shipping ?? 0) + (tax ?? 0) - discount;

  const handleApplyPromo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!onApplyPromoCode || !promoCode.trim()) return;
    setIsApplying(true);
    try {
      await onApplyPromoCode(promoCode.trim());
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-lg border border-slate-200 p-5">
      <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Subtotal</dt>
          <dd className="text-slate-900">{formatCurrency(subtotal)}</dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-slate-500">Shipping</dt>
          <dd className="text-slate-900">
            {typeof shipping === 'number' ? formatCurrency(shipping) : 'Calculated at checkout'}
          </dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-slate-500">Tax</dt>
          <dd className="text-slate-900">
            {typeof tax === 'number' ? formatCurrency(tax) : 'Calculated at checkout'}
          </dd>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <dt>Discount</dt>
            <dd>−{formatCurrency(discount)}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-900">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>

      {onApplyPromoCode && (
        <form onSubmit={handleApplyPromo} className="mt-4 flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Promo code"
            className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button type="submit" variant="secondary" isLoading={isApplying} disabled={!promoCode.trim()}>
            Apply
          </Button>
        </form>
      )}
      {promoError && <p className="mt-1 text-sm text-red-600">{promoError}</p>}

      <Button
        type="button"
        fullWidth
        onClick={onCheckout}
        isLoading={isCheckoutLoading}
        disabled={isCheckoutDisabled}
        className="mt-5"
      >
        Proceed to checkout
      </Button>
    </div>
  );
}