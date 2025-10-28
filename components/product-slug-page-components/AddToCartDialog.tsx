import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, X } from "lucide-react";
import Button from "@/components/ui/Button";

interface AddToCartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
}

export default function AddToCartDialog({
  isOpen,
  onClose,
  productName,
  productImage,
  quantity,
  price,
}: AddToCartDialogProps) {
  if (!isOpen) return null;
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleViewMyCart = () => {
    router.push(
      isAuthenticated ? "/customer/my-account/cart" : "/customer/cart"
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div className="relative flex flex-col w-full p-6 lg:p-8 lg:max-w-[530px] pb-10 bg-white lg:shadow-md mx-auto items-center justify-center rounded-xl">
        {/* Header with close button */}
        <div>
          <button
            onClick={onClose}
            className="absolute top-3 lg:top-4 right-2 lg:right-3 p-2 rounded-full text-gray-500 hover:text-yellow-600 transition-colors duration-200 cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={25} />
          </button>
        </div>

        {/* Success indicator */}

        <div className="w-full mb-2">
          <h3 className="font-bold text-xl lg:text-2xl text-yellow-700 mb-1">
            Added to Cart!
          </h3>
          <p className="text-gray-600 text-sm">
            Freshly baked <span> {productName}</span> added to your cart!
          </p>
        </div>

        {/* Product details */}
        <div className="py-4 w-full">
          <div className="bg-gray-50 rounded-xl p-4 mb-2">
            <div className="flex items-start gap-4">
              {productImage && (
                <div className="flex-shrink-0">
                  <Image
                    src={productImage}
                    alt={productName}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded-lg shadow-sm border border-gray-200"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-base lg:text-lg text-gray-900 mb-2 line-clamp-2">
                  {productName}
                </h4>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {quantity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Unit Price:</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
              <span className="text-base font-semibold text-gray-900">
                Total:
              </span>
              <span className="text-lg font-bold text-green-600">
                ${(price * quantity).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}

        <div className="space-y-3 w-full">
          <Button
            variant="yellow"
            onClick={() => {
              onClose();
              handleViewMyCart();
            }}
            className="w-full py-3 text-base font-semibold rounded-full"
          >
            <ShoppingCart size={18} className="mr-2" />
            View My Cart
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full py-3 text-base font-semibold rounded-full hover:bg-transparent underline underline-offset-3 decoration-1"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
