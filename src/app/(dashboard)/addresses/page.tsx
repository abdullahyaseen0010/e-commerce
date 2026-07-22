"use client";

import { useEffect, useState } from "react";
import {
  getAddresses,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/api/user";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import AddressForm from "@/components/forms/AddressForm";
import type { Address } from "@/types/user";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const data = await getAddresses();
      setAddresses(data);
      setError(null);
    } catch (err) {
      setError("We couldn't load your addresses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleAddClick = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleFormSuccess = () => {
    handleModalClose();
    loadAddresses();
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((address) => address.id !== id));
    } catch (err) {
      setError("We couldn't delete that address. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      setAddresses((prev) =>
        prev.map((address) => ({
          ...address,
          isDefault: address.id === id,
        }))
      );
    } catch (err) {
      setError("We couldn't update your default address. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Addresses</h1>
          <p className="mt-1 text-gray-600">
            Manage the addresses used for shipping and billing.
          </p>
        </div>
        <Button onClick={handleAddClick}>Add Address</Button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader />
        </div>
      ) : addresses.length === 0 ? (
        <EmptyState
          title="No addresses yet"
          description="Add an address to speed up checkout next time."
          action={<Button onClick={handleAddClick}>Add Your First Address</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="relative rounded-lg border border-gray-200 p-5"
            >
              {address.isDefault && (
                <span className="absolute right-4 top-4 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  Default
                </span>
              )}
              <p className="font-medium text-gray-900">{address.fullName}</p>
              <p className="mt-1 text-sm text-gray-600">
                {address.line1}
                {address.line2 && (
                  <>
                    <br />
                    {address.line2}
                  </>
                )}
                <br />
                {address.city}, {address.state} {address.postalCode}
                <br />
                {address.country}
              </p>
              {address.phone && (
                <p className="mt-1 text-sm text-gray-500">{address.phone}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => handleEditClick(address)}>
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(address.id)}
                  disabled={deletingId === address.id}
                >
                  {deletingId === address.id ? "Removing..." : "Remove"}
                </Button>
                {!address.isDefault && (
                  <Button
                    variant="ghost"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Set as Default
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingAddress ? "Edit Address" : "Add Address"}
      >
        <AddressForm
          initialValues={editingAddress ?? undefined}
          onSuccess={handleFormSuccess}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
}
