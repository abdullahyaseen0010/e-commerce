"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { AddressForm } from "@/components/forms/AddressForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader } from "@/components/ui/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { createOrder } from "@/lib/api/orders";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { isRequired, isValidEmail } from "@/lib/utils/validators";
import type { Address } from "@/types/user";

const EMPTY_ADDRESS: Address = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

interface PaymentDetails {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

const EMPTY_PAYMENT: PaymentDetails = {
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    items,
    itemCount,
    subtotal,
    shipping,
    tax,
    total,
    isLoading,
    clearCart,
  } = useCart();

  const [address, setAddress] = useState<Address>(
    user?.defaultAddress ?? EMPTY_ADDRESS
  );
  const [payment, setPayment] = useState<PaymentDetails>(EMPTY_PAYMENT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const next: Record<string, string> = {};

    if (!isRequired(address.fullName)) next.fullName = "Enter the recipient's name.";
    if (!isValidEmail(address.email)) next.email = "Enter a valid email address.";
    if (!isRequired(address.addressLine1)) next.addressLine1 = "Enter a street address.";
    if (!isRequired(address.city)) next.city = "Enter a city.";
    if (!isRequired(address.postalCode)) next.postalCode = "Enter a postal code.";
    if (!isRequired(payment.cardholderName)) next.cardholderName = "Enter the name on the card.";
    if (payment.cardNumber.replace(/\s/g, "").length < 15) next.cardNumber = "Enter a valid card number.";
    if (!isRequired(payment.expiry)) next.expiry = "Enter the expiry date.";
    if (payment.cvc.length < 3) next.cvc = "Enter the security code.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const order = await createOrder({
        items,
        shippingAddress: address,
        paymentMethod: {
          cardholderName: payment.cardholderName,
          last4: payment.cardNumber.slice(-4),
        },
        subtotal,
        shipping,
        tax,
        total,
      });

      clearCart();
      router.push(`/order-confirmation?orderId=${order.id}`);
    } catch {
      setSubmitError(
        "We couldn't place your order. Check your details and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="There's nothing to check out"
          description="Add something to your cart first, then come back here to complete your order."
          action={
            <Button onClick={() => router.push("/shop")}>
              Browse products
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">
        Checkout
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Shipping + payment */}
        <div className="space-y-10 lg:col-span-2">
          <section>
            <h2 className="text-base font-semibold text-zinc-900">
              Shipping address
            </h2>
            <div className="mt-4">
              <AddressForm value={address} onChange={setAddress} errors={errors} />
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900">Payment</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Name on card"
                value={payment.cardholderName}
                onChange={(e) =>
                  setPayment((p) => ({ ...p, cardholderName: e.target.value }))
                }
                error={errors.cardholderName}
                className="sm:col-span-2"
              />
              <Input
                label="Card number"
                inputMode="numeric"
                value={payment.cardNumber}
                onChange={(e) =>
                  setPayment((p) => ({ ...p, cardNumber: e.target.value }))
                }
                error={errors.cardNumber}
                className="sm:col-span-2"
              />
              <Input
                label="Expiry"
                placeholder="MM/YY"
                value={payment.expiry}
                onChange={(e) =>
                  setPayment((p) => ({ ...p, expiry: e.target.value }))
                }
                error={errors.expiry}
              />
              <Input
                label="Security code"
                inputMode="numeric"
                value={payment.cvc}
                onChange={(e) =>
                  setPayment((p) => ({ ...p, cvc: e.target.value }))
                }
                error={errors.cvc}
              />
            </div>
          </section>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-zinc-200 p-6">
            <h2 className="text-base font-semibold text-zinc-900">
              Order summary
            </h2>

            <ul role="list" className="mt-4 divide-y divide-zinc-200">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between py-3 text-sm">
                  <span className="text-zinc-600">
                    {item.name}{" "}
                    <span className="text-zinc-400">× {item.quantity}</span>
                  </span>
                  <span className="font-medium text-zinc-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 border-t border-zinc-200 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-600">Subtotal</dt>
                <dd className="text-zinc-900">{formatCurrency(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-600">Shipping</dt>
                <dd className="text-zinc-900">{formatCurrency(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-600">Tax</dt>
                <dd className="text-zinc-900">{formatCurrency(tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-semibold">
                <dt className="text-zinc-900">Total</dt>
                <dd className="text-zinc-900">{formatCurrency(total)}</dd>
              </div>
            </dl>

            {submitError && (
              <p className="mt-4 text-sm text-red-600">{submitError}</p>
            )}

            <Button
              className="mt-6 w-full"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Placing order…"
                : `Place order · ${formatCurrency(total)}`}
            </Button>

            <p className="mt-3 text-center text-xs text-zinc-400">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your order
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
