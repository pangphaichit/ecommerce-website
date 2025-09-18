import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  X,
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  Wheat,
  Milk,
  Bean,
  Egg,
  Circle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import AddToCartDialog from "@/components/product-slug-page-components/AddToCartDialog";

interface Product {
  product_id: string;
  name: string;
  description: string;
  price: string | number;
  is_available: boolean;
  image_url: string;
  slug: string;
  key_features: string[]; // array
  allergens: string[]; // array
  ingredients?: string[];
  nutritional_info?: string;
}

interface Props {
  products: Product[];
}

export default function YouMayAlsoLike({ products }: Props) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [showDialog, setShowDialog] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("Key Features");

  const tabContent: Record<string, string | string[]> = {
    "Key Features": selectedProduct?.key_features?.length
      ? selectedProduct.key_features
      : ["This product has amazing key features!"],
    Ingredients: selectedProduct?.ingredients?.length
      ? selectedProduct.ingredients
      : ["Ingredients data coming soon..."],
    Allergens: selectedProduct?.allergens?.length
      ? selectedProduct.allergens
      : ["Allergen information will be available later."],
  };

  const allergenIcons = {
    Nuts: <Bean size={16} className="text-yellow-600" />,
    Gluten: <Wheat size={16} className="text-yellow-600" />,
    Eggs: <Egg size={16} className="text-yellow-600" />,
    Dairy: <Milk size={16} className="text-yellow-600" />,
  };

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth >= 1024 ? 3 : 1);
      setCurrentIndex(0); // Reset index when resizing
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleProductClick = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  const displayedProducts = products.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  const openQuickPurchase = (product: Product) => {
    if (!product.is_available) return;
    setSelectedProduct(product);
    setSelectedQuantity(1); // reset quantity
    setIsDrawerOpen(true);
  };

  const handleAddToCartFromDrawer = (product: Product, quantity: number) => {
    addToCart({ ...product, price: Number(product.price) }, quantity);
    setSelectedProduct(product); // keep the product for the dialog
    setIsDrawerOpen(false);
    setShowDialog(true);
    setTimeout(() => {
      setShowDialog(false);
    }, 3000);
  };

  if (products.length === 0) return null;

  return (
    <div className="w-full drawer drawer-end">
      {/* Drawer toggle input */}
      <input
        id="cart-drawer"
        type="checkbox"
        className="drawer-toggle hidden"
      />
      {isDrawerOpen && (
        <label
          htmlFor="cart-drawer"
          className="drawer-overlay fixed top-0 left-0 w-screen h-screen bg-black/50  z-50"
          onClick={() => setIsDrawerOpen(false)}
        ></label>
      )}

      {/* Drawer content */}
      <div className="drawer-content drawer">
        <h2 className="text-xl lg:text-2xl font-bold text-yellow-600 mb-6 text-center">
          You May Also Like
        </h2>

        <div className="relative">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            {displayedProducts.map((product) => (
              <div
                key={product.product_id}
                className="cursor-pointer group border border-gray-200 rounded-xl overflow-hidden relative hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleProductClick(product.slug)}
              >
                <div className="relative h-52 bg-gray-100">
                  {!product.is_available && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gray-500 bg-opacity-30" />
                      <Badge
                        variant="destructive"
                        className="text-sm z-30 flex items-center justify-center"
                      >
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                  <Image
                    src={`${product.image_url}?t=${Date.now()}`}
                    alt={product.name}
                    className={`relative h-full w-full object-cover transition-all duration-200 ${
                      !product.is_available ? "grayscale opacity-50" : ""
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    width={400}
                    height={300}
                  />
                </div>

                <div className="p-4 relative">
                  <h3 className="font-bold text-[0.95rem] text-yellow-600 truncate">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 h-14 overflow-hidden">
                    {product.description.length > 120
                      ? product.description.slice(0, 120) + "..."
                      : product.description}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <label
                      htmlFor="cart-drawer"
                      className="cursor-pointer w-full"
                    >
                      <Button
                        size="sm"
                        variant="yellow"
                        className="flex-1 rounded-full text-xs w-full"
                        disabled={!product.is_available}
                        onClick={(e) => {
                          e.stopPropagation(); // prevent parent click
                          openQuickPurchase(product);
                        }}
                      >
                        Add to Cart
                      </Button>
                    </label>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Favorite ${product.name}!`);
                      }}
                    >
                      <Heart className="text-yellow-500" />
                    </Button>
                  </div>

                  <span className="text-[0.95rem] font-semibold absolute top-4 right-4 text-green-600">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows for mobile */}
          {itemsPerPage === 1 && products.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute top-25 left-4 transform -translate-y-1/2  bg-white p-2 rounded-full shadow-md hover:text-yellow-600 cursor-pointer"
                aria-label="Previous course"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={handleNext}
                className="absolute  top-25 right-4 transform -translate-y-1/2  bg-white p-2 rounded-full shadow-md hover:text-yellow-600 cursor-pointer"
                aria-label="Next course"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Pagination dots for mobile */}
        {itemsPerPage === 1 && products.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-yellow-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Drawer Panel */}
      {selectedProduct && (
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
                  setSelectedProduct(null);
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
                    src={selectedProduct.image_url || "/placeholder.png"}
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
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">
                    {selectedQuantity}
                  </span>
                  <button
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              {/* Accordion */}
              <div className="flex flex-col gap-2">
                {["Key Features", "Ingredients", "Allergens"].map((tab) => (
                  <div key={tab} className="overflow-hidden">
                    <div
                      className={`flex justify-between items-center p-3 cursor-pointer group border-b-3 transition-colors duration-200 ${
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
                      className={`p-4 text-sm ${
                        activeTab === tab ? "block" : "hidden"
                      }`}
                    >
                      {tab === "Key Features" &&
                      selectedProduct.key_features ? (
                        <ul className="list-disc pl-6 space-y-1">
                          {selectedProduct.key_features.map(
                            (feature: string, idx: number) => (
                              <li key={idx}>{feature}</li>
                            )
                          )}
                        </ul>
                      ) : tab === "Ingredients" &&
                        selectedProduct.ingredients ? (
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
                          {selectedProduct.allergens.map(
                            (a: string, i: number) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                              >
                                {allergenIcons[
                                  a as keyof typeof allergenIcons
                                ] || (
                                  <Circle size={16} className="text-gray-400" />
                                )}

                                <span className="capitalize">{a}</span>
                              </div>
                            )
                          )}
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
                  if (selectedProduct) {
                    handleAddToCartFromDrawer(
                      selectedProduct,
                      selectedQuantity
                    );
                  }
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
      )}

      {selectedProduct && (
        <AddToCartDialog
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          productName={selectedProduct.name}
          productImage={selectedProduct.image_url}
          quantity={selectedQuantity}
          price={Number(selectedProduct.price ?? 0)}
        />
      )}
    </div>
  );
}
