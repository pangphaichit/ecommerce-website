import React from "react";
import {
  BadgeCheck,
  Truck,
  ShieldCheck,
  Cookie,
  Star,
  Leaf,
  Clock,
  Users,
  Heart,
} from "lucide-react";

type Benefit = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const benefits: Benefit[] = [
  {
    icon: <BadgeCheck size={28} className="text-yellow-600" />,
    title: "Premium Quality",
    description:
      "We source only the finest ingredients to create exceptional flavors that keep customers coming back.",
  },
  {
    icon: <Truck size={28} className="text-yellow-600" />,
    title: "Express Delivery",
    description:
      "Same-day delivery within 3 miles. Orders over $50 ship free with temperature-controlled packaging.",
  },
  {
    icon: <ShieldCheck size={28} className="text-yellow-600" />,
    title: "Satisfaction Guarantee",
    description:
      "Not completely satisfied? We'll make it right with a full refund or fresh replacement.",
  },
  {
    icon: <Cookie size={28} className="text-yellow-600" />,
    title: "Handcrafted Daily",
    description:
      "Every item is baked fresh each morning using traditional techniques passed down through generations.",
  },
  {
    icon: <Users size={28} className="text-yellow-600" />,
    title: "Local Community Favorite",
    description:
      "Proudly serving our neighborhood for years with recipes that bring families together.",
  },
  {
    icon: <Heart size={28} className="text-yellow-600" />,
    title: "Giving Back",
    description:
      "We donate 10% of our profits to charity. Spreading love and support with every purchase.",
  },
  {
    icon: <Leaf size={28} className="text-yellow-600" />,
    title: "Natural Ingredients",
    description:
      "We believe in keeping it simple, real butter, farm-fresh eggs, and zero artificial preservatives.",
  },
  {
    icon: <Clock size={28} className="text-yellow-600" />,
    title: "Custom Orders Welcome",
    description:
      "Special occasion coming up? We love creating personalized treats tailored to your celebration.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="grid grid-cols-2  lg:grid-cols-4 gap-4 py-8 px-4 lg:px-10">
      {benefits.map((benefit, index) => (
        <div
          key={index}
          className="relative lg:border-l-4 lg:border-yellow-600 aspect-square sm:aspect-auto flex flex-col  items-center lg:items-start justify-center sm:justify-start gap-2 sm:gap-4 bg-gray-50 p-1 lg:p-6 rounded-r-xl shadow-sm hover:shadow-md transition-all"
        >
          <div className="text-yellow-600">{benefit.icon}</div>
          <div className="text-center sm:text-left">
            <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">
              {benefit.title}
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
              {benefit.description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default BenefitsSection;
