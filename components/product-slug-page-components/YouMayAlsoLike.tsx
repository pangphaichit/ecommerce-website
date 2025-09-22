import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Wheat,
  Milk,
  Bean,
  Egg,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import DrawerPanel from "@/components/DrawerPanel";
import AddToCartDialog from "@/components/product-slug-page-components/AddToCartDialog";
import { Product } from "@/types/products";

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

  useEffect(() => {
    if (isDrawerOpen) {
      // Lock scroll
      document.body.style.overflow = "hidden";
    } else {
      // Restore scroll
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

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
        <DrawerPanel
          selectedProduct={selectedProduct}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          selectedQuantity={selectedQuantity}
          setSelectedQuantity={setSelectedQuantity}
          handleAddToCartFromDrawer={handleAddToCartFromDrawer}
          allergenIcons={allergenIcons}
          tabContent={{
            Ingredients: "No ingredients info",
            Allergens: "No allergens info",
          }}
        />
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
