import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ImageSlider from "@/components/ui/ImageSlider";
import CoursesHeader from "@/components/courses-page-components/CoursesHeader";
import ReviewsCarousel from "@/components/courses-page-components/ReviewsCarousel";
import RecommendedCourses from "@/components/courses-page-components/RecommendedCourses";
import CoursesHeroSection from "@/components/courses-page-components/CoursesHeroSection";
import CourseFeatures from "@/components/courses-page-components/CourseFeatures";
import CallToAction from "@/components/courses-page-components/CallToAction";
import SkeletonRecommendedCourses from "@/components/ui/SkeletonRecommendedCourses";

interface CourseOutcome {
  id: number;
  outcome: string;
}

interface CourseData {
  course_id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  discounted_price?: number;
  discount_percentage?: number;
  format: "Onsite" | "Video-based";
  difficulty_level: "Beginner" | "Intermediate" | "Advanced";
  duration: {
    total_hours: number;
    lessons: number;
    estimated_completion: string;
  };
  category: number;
  rating: number;
  enrolled_students: number;
  slug: string;
  is_bookable: boolean;
  is_bestseller: boolean;
  created_date: string;
  last_updated: string;
  outcomes: CourseOutcome[];
}

const images = [
  { id: 1, src: "/landing-page/baking-class.jpg", alt: "Baking class" },
  { id: 2, src: "/courses/image-slider-croissant.jpg", alt: "Croissant" },
  { id: 3, src: "/courses/image-slider-bread.jpg", alt: "Bread" },
];

const courseReviews = [
  {
    id: 1,
    imageSrc: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Sarah Johnson",
    review:
      "Amazing baking course! I learned so much about bread making techniques.",
  },
  {
    id: 2,
    imageSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Mike Chen",
    review:
      "Perfect for beginners. The instructor was patient and very knowledgeable.",
  },
  {
    id: 3,
    imageSrc: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Emma Davis",
    review:
      "Loved the hands-on approach. My pastry skills improved tremendously!",
  },
  {
    id: 4,
    imageSrc: "https://randomuser.me/api/portraits/men/45.jpg",
    name: "John Smith",
    review:
      "The course exceeded my expectations. Clear instructions and great support.",
  },
];

const recommendedCourses: CourseData[] = [
  {
    course_id: "course_001",
    title: "Baking for Kids",
    description:
      "A fun, hands-on class where children learn essential baking skills while creating cookies, cupcakes, and other delicious treats in a safe, supervised environment. Perfect for young aspiring bakers!",
    image: "/landing-page/baking-course.jpg",
    price: 39.99,
    discounted_price: 35.99,
    discount_percentage: 10,
    format: "Onsite",
    difficulty_level: "Beginner",
    duration: { total_hours: 3, lessons: 5, estimated_completion: "1 day" },
    category: 5,
    slug: "/",
    rating: 4.7,
    enrolled_students: 212,
    is_bookable: true,
    is_bestseller: true,
    created_date: "2025-07-15",
    last_updated: "2025-07-30",
    outcomes: [
      { id: 1, outcome: "Learn basic baking techniques for kids" },
      { id: 2, outcome: "Make cookies, cupcakes, and other fun treats" },
      { id: 3, outcome: "Understand kitchen safety and hygiene" },
    ],
  },
  {
    course_id: "course_002",
    title: "Chocolate Chip Cookie Masterclass",
    description:
      "Master the art of baking perfect chocolate chip cookies from scratch in this comprehensive video course. Step-by-step lessons cover mixing techniques, baking secrets, and decorating tips.",
    image: "/courses/chocolate-chip-cookies.jpg",
    price: 0,
    discounted_price: 0,
    discount_percentage: 0,
    format: "Video-based",
    difficulty_level: "Beginner",
    duration: { total_hours: 2, lessons: 4, estimated_completion: "2 days" },
    category: 2,
    slug: "/",
    rating: 4.8,
    enrolled_students: 180,
    is_bookable: true,
    is_bestseller: true,
    created_date: "2025-07-20",
    last_updated: "2025-07-30",
    outcomes: [
      { id: 1, outcome: "Bake perfect chocolate chip cookies every time" },
      { id: 2, outcome: "Master mixing and baking techniques" },
      { id: 3, outcome: "Learn decorating tips for cookies" },
    ],
  },
  {
    course_id: "course_003",
    title: "Classic Croissant Baking",
    description:
      "Learn the art of creating flaky, buttery croissants from scratch in this comprehensive hands-on course. Master essential techniques including dough preparation, lamination, and professional baking methods.",
    image: "/courses/croissants.jpg",
    price: 49.99,
    format: "Onsite",
    difficulty_level: "Advanced",
    duration: { total_hours: 4, lessons: 3, estimated_completion: "1 day" },
    category: 3,
    slug: "/",
    rating: 4.6,
    enrolled_students: 95,
    is_bookable: true,
    is_bestseller: false,
    created_date: "2025-07-18",
    last_updated: "2025-07-28",
    outcomes: [
      { id: 1, outcome: "Create professional-quality croissants" },
      { id: 2, outcome: "Master dough lamination techniques" },
      { id: 3, outcome: "Understand fermentation and baking timing" },
    ],
  },
  {
    course_id: "course_005",
    title: "Artisan Bread Making",
    description:
      "Discover the traditional art of bread making in this comprehensive course. Learn to create crusty, flavorful loaves using time-honored techniques including proper kneading, fermentation, and shaping methods.",
    image: "/courses/bread.jpg",
    price: 44.99,
    format: "Onsite",
    difficulty_level: "Intermediate",
    duration: { total_hours: 5, lessons: 4, estimated_completion: "1 day" },
    category: 1,
    slug: "/",
    rating: 4.5,
    enrolled_students: 128,
    is_bookable: false,
    is_bestseller: false,
    created_date: "2025-07-12",
    last_updated: "2025-07-25",
    outcomes: [
      { id: 1, outcome: "Bake artisan bread with traditional techniques" },
      { id: 2, outcome: "Master kneading, shaping, and fermentation" },
      { id: 3, outcome: "Understand crust and crumb development" },
    ],
  },
];

export default function CoursesSection() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Simulate data loading
  useEffect(() => {
    const loadCourses = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setCourses(recommendedCourses);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load courses");
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleClick = () => {
    router.push("/courses/all");
  };

  return (
    <div className="flex flex-col gap-6 lg:mb-5">
      <CoursesHeader />

      <CourseFeatures />

      <ImageSlider
        images={images}
        autoPlayInterval={4000}
        height="h-[400px] lg:h-[650px]"
        width="w-full lg:w-[95%]"
        dotColor="bg-white"
        activeDotColor="bg-blue-500"
      />

      <div className="flex flex-col mx-4 lg:mx-auto lg:w-[95%] gap-6">
        <CoursesHeroSection />

        {isLoading ? (
          <SkeletonRecommendedCourses title="Featured Courses" count={4} />
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <RecommendedCourses
            courses={courses}
            title="Courses We Think You'll Love"
          />
        )}

        <ReviewsCarousel reviews={courseReviews} />
      </div>

      <div className="lg:mx-auto lg:w-[95%]">
        <CallToAction onExplore={handleClick} />
      </div>
    </div>
  );
}
