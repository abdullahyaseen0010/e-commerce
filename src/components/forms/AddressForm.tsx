'use client';

import { useState, FormEvent } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressFormProps {
  initialValues?: Partial<Address>;
  onSubmit: (data: Address) => Promise<void> | void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

type FieldErrors = Partial<Record<keyof Address, string>>;

const EMPTY_ADDRESS: Address = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  isDefault: false,
};

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Japan',
  'India',
  'Brazil',
  'Mexico',
];

const REQUIRED_FIELDS: (keyof Address)[] = [
  'fullName',
  'phone',
  'addressLine1',
  'city',
  'state',
  'postalCode',
  'country',
];

function validate(data: Address): FieldErrors {
  const errors: FieldErrors = {};

  for (const field of REQUIRED_FIELDS) {
    if (!String(data[field]).trim()) {
      errors[field] = 'This field is required.';
    }
  }

  if (data.phone && !/^[+\d][\d\s()-]{6,}$/.test(data.phone.trim())) {
    errors.phone = 'Enter a valid phone number.';
  }

  return errors;
}

export default function AddressForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Save address',
}: AddressFormProps) {
  const [formData, setFormData] = useState<Address>({ ...EMPTY_ADDRESS, ...initialValues });
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleChange =
    (field: keyof Address) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        field === 'isDefault' ? (e.target as HTMLInputElement).checked : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fieldErrors = validate(formData);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-lg space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Full name"
          name="fullName"
          type="text"
          autoComplete="name"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          error={errors.fullName}
          required
        />
        <Input
          label="Phone number"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={formData.phone}
          onChange={handleChange('phone')}
          error={errors.phone}
          required
        />
      </div>

      <Input
        label="Address line 1"
        name="addressLine1"
        type="text"
        autoComplete="address-line1"
        value={formData.addressLine1}
        onChange={handleChange('addressLine1')}
        error={errors.addressLine1}
        required
      />

      <Input
        label="Address line 2 (optional)"
        name="addressLine2"
        type="text"
        autoComplete="address-line2"
        value={formData.addressLine2}
        onChange={handleChange('addressLine2')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="City"
          name="city"
          type="text"
          autoComplete="address-level2"
          value={formData.city}
          onChange={handleChange('city')}
          error={errors.city}
          required
        />
        <Input
          label="State / province"
          name="state"
          type="text"
          autoComplete="address-level1"
          value={formData.state}
          onChange={handleChange('state')}
          error={errors.state}
          required
        />
        <Input
          label="Postal code"
          name="postalCode"
          type="text"
          autoComplete="postal-code"
          value={formData.postalCode}
          onChange={handleChange('postalCode')}
          error={errors.postalCode}
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="country" className="block text-sm font-medium text-slate-700">
          Country
        </label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange('country')}
          className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.country ? 'border-red-400' : 'border-slate-300'
          }`}
        >
          <option value="" disabled>
            Select a country
          </option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.country && <p className="text-sm text-red-600">{errors.country}</p>}
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={formData.isDefault}
          onChange={handleChange('isDefault')}
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        Set as default address
      </label>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" isLoading={isLoading}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}