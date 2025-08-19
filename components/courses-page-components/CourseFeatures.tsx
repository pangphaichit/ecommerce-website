import { Users, Laugh, Clock, LucideIcon } from "lucide-react";

interface FeatureItem {
  icon: LucideIcon;
  text: string;
}

interface CourseFeaturesProps {
  features?: FeatureItem[];
}

const defaultFeatures: FeatureItem[] = [
  { icon: Laugh, text: "99% Student Satisfaction" },
  { icon: Clock, text: "Lifetime Access" },
  { icon: Users, text: "2,500+ Students" },
];

export default function CourseFeatures({
  features = defaultFeatures,
}: CourseFeaturesProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:items-center gap-6 lg:gap-8 text-gray-700">
      {features.map((feature, index) => (
        <div
          key={index}
          className="flex items-center gap-3 mx-auto lg:mx-0 max-w-fit"
        >
          <div className="bg-yellow-700 p-2 sm:p-3 rounded-full">
            <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="font-semibold text-sm sm:text-base">
            {feature.text}
          </span>
          {index < features.length - 1 && (
            <div className="hidden lg:block w-0.5 h-6 bg-gray-300"></div>
          )}
        </div>
      ))}
    </div>
  );
}
