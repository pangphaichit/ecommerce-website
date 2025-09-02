import { ChevronUp, ChevronDown, Circle } from "lucide-react";
import ReturnsAndDeliverySection from "./ReturnsAndDeliverySection";

interface Props {
  product: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  allergenIcons: Record<string, React.ReactNode>;
}

export default function ProductTabs({
  product,
  activeTab,
  setActiveTab,
  allergenIcons,
}: Props) {
  const tabs = [
    "Key Features",
    "Ingredients",
    "Allergens",
    "Reviews",
    "Returns & Delivery",
  ];
  const tabContent: Record<string, string | string[]> = {
    "Key Features":
      product.key_features || "This product has amazing key features!",
    Ingredients: product.ingredients || "Ingredients data coming soon...",
    Allergens:
      product.allergens || "Allergen information will be available later.",
    Reviews: product.reviews || "Customer reviews will be displayed here soon.",
  };

  return (
    <div>
      {/* Desktop Tabs */}
      <div className="hidden lg:flex gap-8 justify-center">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`p-3 cursor-pointer ${
              activeTab === tab
                ? "font-semibold border-b-3 border-yellow-600"
                : "font-medium hover:text-yellow-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="hidden lg:block max-w-3xl mx-auto py-12 min-h-[14.5rem]">
        {activeTab === "Key Features" && product.key_features ? (
          <ul className="list-disc pl-6 space-y-1">
            {product.key_features.map((feature: string, idx: number) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        ) : activeTab === "Ingredients" && product.ingredients ? (
          <div className="flex flex-col gap-4  text-sm">
            <div className="flex flex-row flex-wrap items-center">
              <span className="font-semibold text-yellow-700">
                Ingredients:&nbsp;{" "}
                <span className="font-normal text-black">
                  {product.ingredients.join(", ")}
                </span>
              </span>
            </div>

            <div className="flex flex-row">
              <span className="font-semibold text-yellow-700">
                Nutritional Information:&nbsp;{" "}
              </span>
              <p>{product.nutritional_info}</p>
            </div>
          </div>
        ) : activeTab === "Allergens" && product.allergens ? (
          <div className="flex flex-wrap gap-4 justify-center">
            {product.allergens.map((a: string, i: number) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
              >
                {allergenIcons[a] || (
                  <Circle size={16} className="text-gray-400" />
                )}
                <span className="capitalize">{a}</span>
              </div>
            ))}
          </div>
        ) : activeTab === "Returns & Delivery" ? (
          <ReturnsAndDeliverySection />
        ) : (
          <p className="text-gray-700 text-center">{tabContent[activeTab]}</p>
        )}
      </div>

      {/* Mobile Accordion */}
      <div className="lg:hidden flex flex-col gap-2">
        {tabs.map((tab) => (
          <div key={tab} className="overflow-hidden">
            <div
              className={`flex justify-between items-center p-3 cursor-pointer group border-b-3 transition-colors duration-200 ${
                activeTab === tab ? "border-yellow-600" : "border-transparent"
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
              {tab === "Key Features" && product.key_features ? (
                <ul className="list-disc pl-6 space-y-1">
                  {product.key_features.map((feature: string, idx: number) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              ) : tab === "Ingredients" && product.ingredients ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row flex-wrap items-center">
                    <span className="font-semibold text-yellow-700">
                      Ingredients:&nbsp;
                      <span className="font-normal text-black">
                        {product.ingredients.join(", ")}
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-row">
                    <span className="font-semibold text-yellow-700">
                      Nutritional Information:&nbsp;
                    </span>
                    <p>{product.nutritional_info}</p>
                  </div>
                </div>
              ) : tab === "Allergens" && product.allergens ? (
                <div className="flex flex-wrap gap-4 justify-center">
                  {product.allergens.map((a: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                    >
                      {allergenIcons[a] || (
                        <Circle size={16} className="text-gray-400" />
                      )}
                      <span className="capitalize">{a}</span>
                    </div>
                  ))}
                </div>
              ) : tab === "Returns & Delivery" ? (
                <ReturnsAndDeliverySection />
              ) : (
                <p className="text-gray-700">{tabContent[tab]}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
