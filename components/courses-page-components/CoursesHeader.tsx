import { Award } from "lucide-react";

export default function CoursesHeader() {
  return (
    <div>
      <div className="w-full max-w-4xl mx-auto text-center lg:mb-12 px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Award className="w-4 h-4" />
          <span>Professional Baking Education</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl lg:text-4xl font-semibold  text-yellow-700 mb-6">
          Oven & Wheat's Academy
        </h1>

        {/* Description */}
        <p className="text-base lg:text-lg text-gray-600 lg:mb-10 max-w-4xl mx-auto leading-relaxed">
          Whether you're discovering a new passion, building skills for your
          future, or simply learning for the joy of it, we're here to guide you
          every step of the way. With hands-on learning, inspiring mentors, and
          a community that believes in you, your growth starts here.
        </p>
      </div>
    </div>
  );
}
