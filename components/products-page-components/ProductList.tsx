import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Heart, Wheat, Milk, Bean, Egg } from "lucide-react";
import DrawerPanel from "@/components/DrawerPanel";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import AddToCartDialog from "@/components/product-slug-page-components/AddToCartDialog";
import { Product } from "@/types/products";

interface ProductListProps {
  products: Product[];
  isFiltering?: boolean;
  onClearFilters?: () => void;
}

export default function ProductList({
  products,
  isFiltering = false,
  onClearFilters,
}: ProductListProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showDialog, setShowDialog] = useState(false);

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

  const allergenIcons: Record<string, React.ReactNode> = {
    Nuts: <Bean size={16} className="text-yellow-600" />,
    Gluten: <Wheat size={16} className="text-yellow-600" />,
    Eggs: <Egg size={16} className="text-yellow-600" />,
    Dairy: <Milk size={16} className="text-yellow-600" />,
  };

  const handleProductClick = (slug: string) => {
    router.push(`/products/${slug}`);
  };

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

  const validProducts = products.filter(Boolean);

  if (validProducts.length === 0) {
    return (
      <div className="w-full max-w-[93%] lg:max-w-[95%] mx-auto">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative w-22 h-22 mb-4 opacity-60">
            <Image
              src="/products/bakerybag.png"
              alt="No products found"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-lg lg:text-2xl font-medium text-gray-500 mb-2">
            No Products Found
          </h3>
          <p className="text-base lg:text-lg text-gray-400 mb-6">
            {isFiltering
              ? "No products match your current filters. Try adjusting your search."
              : "No products are available right now. Please check back later!"}
          </p>
          {isFiltering && onClearFilters && (
            <Button variant="yellow" onClick={onClearFilters} className="px-6">
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[93%] lg:max-w-[95%] mx-auto grid gap-4 grid-cols-1 lg:grid-cols-3 drawer drawer-end">
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

      {validProducts.map((product) => (
        <div
          key={product.product_id}
          className="drawer-content drawer cursor-pointer group border border-gray-200 rounded-xl overflow-hidden relative hover:shadow-lg transition-shadow duration-200"
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
              <label htmlFor="cart-drawer" className="cursor-pointer w-full">
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
