import { Heart, Store, Truck, Star, Minus, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface Props {
  product: any;
  quantity: number;
  setQuantity: (q: number) => void;
}

export default function ProductInfo({ product, quantity, setQuantity }: Props) {
  const increment = () => setQuantity(quantity + 1);
  const decrement = () => setQuantity(Math.max(1, quantity - 1));

  return (
    <div className="lg:w-[50%]">
      {/* Badges */}
      <div className="flex flex-wrap gap-2 my-2 items-center justify-center lg:justify-start lg:ml-4">
        {product.isBestSelling && <Badge variant="warning">Best Selling</Badge>}
        {product.isNewArrival && <Badge variant="success">New Arrival</Badge>}
        {product.online_exclusive && (
          <Badge variant="secondary">Online Exclusive</Badge>
        )}
      </div>
      <div className="flex flex-col gap-4 mx-4 lg:ml-4 lg:mr-0">
        <div className="flex justify-between items-center lg:mt-0">
          <h1 className="text-[1.1rem] lg:text-2xl font-semibold text-center">
            {product.name}
          </h1>
          <Heart size={18} />
        </div>
        <p className="text-base lg:text-lg">
          {" "}
          {product.description?.slice(0, 250)}
          {product.description && product.description.length > 250 ? "…" : ""}
        </p>

        {/* Quantity + Price */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="lightyellow" className="rounded-full p-3">
              <Minus size={15} onClick={decrement} />
            </Button>
            <input
              type="text"
              value={quantity}
              className="w-12 text-center border border-gray-300"
              readOnly
            />
            <Button variant="lightyellow" className="rounded-full p-3">
              <Plus size={15} onClick={increment} />
            </Button>
          </div>
          <p className="text-xl font-semibold text-green-600">
            ${Number(product.price ?? 0).toFixed(2)}
          </p>
        </div>

        {/* Add to Cart / Notify Me */}
        <Button
          variant={product.is_available ? "yellow" : "secondary"}
          className="w-full py-6 rounded-full"
        >
          {product.is_available ? "Add to Cart" : "Notify Me"}
        </Button>

        {/* Delivery info */}
        <div className="lg:mt-2 space-y-4">
          <div className="flex gap-2 items-center">
            {product.online_exclusive ? (
              <Star size={19} className="text-yellow-700" />
            ) : (
              <Store size={18} className="text-yellow-700" />
            )}
            <p className="text-[0.9rem] text-yellow-700 font-medium">
              {product.online_exclusive
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
      </div>
    </div>
  );
}
