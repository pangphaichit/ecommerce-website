import Image from "next/image";
import Button from "@/components/ui/Button";

interface CallToActionProps {
  onExplore: () => void;
  title?: string;
  description?: string;
  imageSrc?: string;
  buttonText?: string;
}

export default function CallToAction({
  onExplore,
  title = "Looking for something else?",
  description = `Find the perfect baking course from our complete selection of bread, pastry, and oven techniques.`,
  imageSrc = "/courses/call-to-action-image.jpg",
  buttonText = "Explore All Courses",
}: CallToActionProps) {
  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full py-16 lg:py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          {/* fog overlay */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
          {/* Additional gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-700/00 via-yellow-700/20 to-yellow-700/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto text-center w-[80%]">
          <h1 className="font-bold mb-4 text-xl lg:text-3xl text-white">
            {title}
          </h1>
          <p className=" mb-6 text-base lg:text-[1.4rem] text-white">
            {description}
          </p>

          <Button
            variant="yellow"
            onClick={onExplore}
            className="mx-auto rounded-full p-8 text-xl lg:text-2xl border-3  transition-all duration-300"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
