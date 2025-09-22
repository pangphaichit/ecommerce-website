import { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Minus,
  Plus,
  Star,
  Store,
  Truck,
  ChevronUp,
  ChevronDown,
  Circle,
  ShoppingCart,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Product } from "@/types/products";

interface DrawerPanelProps {
  selectedProduct: Product | null;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  selectedQuantity: number;
  setSelectedQuantity: (qty: number) => void;
  handleAddToCartFromDrawer: (product: Product, quantity: number) => void;
  allergenIcons: Record<string, React.ReactNode>;
  tabContent?: Record<string, string>;
}

const DrawerPanel: React.FC<DrawerPanelProps> = ({
  selectedProduct,
  isDrawerOpen,
  setIsDrawerOpen,
  selectedQuantity,
  setSelectedQuantity,
  handleAddToCartFromDrawer,
  allergenIcons,
  tabContent,
}) => {
  const [activeTab, setActiveTab] = useState<string>("Ingredients");

  useEffect(() => {
    setActiveTab("Ingredients");
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  return (
    <div
      className={`drawer-side fixed z-50 bg-white transition-transform duration-300 ease-in-out
      bottom-0 left-0 right-0 h-[80%] 
      lg:top-0 lg:right-0 lg:h-full lg:w-[450px] lg:left-auto
      ${
        isDrawerOpen
          ? "translate-y-0 lg:translate-y-0 lg:translate-x-0"
          : "translate-y-full lg:translate-y-0 lg:translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Quick Purchase</h2>
        <label htmlFor="cart-drawer">
          <button
            onClick={() => {
              setIsDrawerOpen(false);
            }}
            className="p-1"
          >
            <X size={20} className="cursor-pointer hover:text-yellow-600" />
          </button>
        </label>
      </div>

      {/* Content */}
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          {/* Product Image and Info */}
          <div className="flex gap-4 mb-6">
            <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                key={selectedProduct.product_id}
                src={selectedProduct.image_url}
                alt={selectedProduct.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {selectedProduct.name}
              </h3>
              <p className="text-2xl font-bold text-green-600">
                $
                {(
                  Number(selectedProduct.price) * Number(selectedQuantity)
                ).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                $
                {typeof selectedProduct.price === "number"
                  ? selectedProduct.price.toFixed(2)
                  : Number(selectedProduct.price).toFixed(2)}{" "}
                each
              </p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setSelectedQuantity(Math.max(1, selectedQuantity - 1))
                }
                className="p-3 rounded-full text-gray-700 border-none hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
              >
                <Minus size={15} />
              </button>
              <span className="text-lg font-semibold w-8 text-center">
                {selectedQuantity}
              </span>
              <button
                onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                className="p-3 rounded-full text-gray-700 border-none hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* Delivery info */}
          <div className="lg:mt-2 space-y-4 mb-4">
            <div className="flex gap-2 items-center">
              {selectedProduct.online_exclusive ? (
                <Star size={19} className="text-yellow-700" />
              ) : (
                <Store size={18} className="text-yellow-700" />
              )}
              <p className="text-[0.9rem] text-yellow-700 font-medium">
                {selectedProduct.online_exclusive
                  ? "Exclusively Online, Get it delivered anywhere, anytime!"
                  : "Click & Collect Available"}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Truck size={18} className="text-green-700" />
              <p className="text-[0.9rem] text-green-700 font-medium">
                Free shipping on orders over $50!
              </p>
            </div>
          </div>

          {/* Accordion */}
          <div className="flex flex-col gap-2">
            {["Ingredients", "Allergens"].map((tab) => (
              <div key={tab} className="overflow-hidden">
                <div
                  className={`flex justify-between items-center p-3 lg:p-0 lg:py-4 cursor-pointer group border-b-3 transition-colors duration-200 ${
                    activeTab === tab
                      ? "border-yellow-600"
                      : "border-transparent"
                  }`}
                  onClick={() => setActiveTab(activeTab === tab ? "" : tab)}
                >
                  <span
                    className={`font-bold transition-colors duration-200 ${
                      activeTab === tab
                        ? "font-bold"
                        : "group-hover:text-yellow-600 font-semibold"
                    }`}
                  >
                    {tab}
                  </span>
                  {activeTab === tab ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>

                <div
                  className={`p-4 lg:p-0 lg:py-4 text-sm ${
                    activeTab === tab ? "block" : "hidden"
                  }`}
                >
                  {tab === "Ingredients" && selectedProduct.ingredients ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-row flex-wrap items-center">
                        <span className="font-semibold text-yellow-700">
                          Ingredients:&nbsp;
                          <span className="font-normal text-black">
                            {selectedProduct.ingredients.join(", ")}
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-row">
                        <span className="font-semibold text-yellow-700">
                          Nutritional Information:&nbsp;
                        </span>
                        <p>{selectedProduct.nutritional_info}</p>
                      </div>
                    </div>
                  ) : tab === "Allergens" && selectedProduct.allergens ? (
                    <div className="flex flex-wrap gap-4 justify-center">
                      {selectedProduct.allergens.map((a, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                        >
                          {allergenIcons[a as keyof typeof allergenIcons] || (
                            <Circle size={16} className="text-gray-400" />
                          )}
                          <span className="capitalize">{a}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700">
                      {tabContent?.[tab] || "No information available"}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-gray-200 bg-white fixed left-0 bottom-0 w-full">
          <Button
            onClick={() => {
              if (selectedProduct)
                handleAddToCartFromDrawer(selectedProduct, selectedQuantity);
            }}
            variant="yellow"
            className="w-full py-3 text-base font-semibold flex items-center justify-center"
          >
            <ShoppingCart size={18} className="mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DrawerPanel;
