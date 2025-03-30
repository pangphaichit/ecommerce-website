import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

const RegistrationSuccess = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/log-in");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen lg:bg-gray-100">
      <Link href="/">
        <Image
          src="/landing-page/oven-and-wheat-no-tagline.png"
          alt="Bakery Brand"
          width={250}
          height={250 / 1.59}
          className="object-contain mx-auto mt-20 lg:mt-7 lg:my-6 lg:w-[350px] lg:h-[350/1.59]"
        />
      </Link>
      <div className="flex flex-col w-full h-[400px] lg:max-w-[550px]  lg:px-7 pt-6 lg:pt-10 pb-10 bg-white lg:shadow-md mx-auto items-center justify-center lg:border-b-4 lg:border-green-500">
        <div className=" text-center rounded-lg">
          <div className="mx-auto flex items-center justify-center rounded-full">
            <CheckCircle
              className="h-10 w-10 lg:h-12 lg:w-12 text-green-500"
              strokeWidth={2}
            />
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mt-5">
            Registration Successful!
          </h2>
          <p className="text-xs lg:text-base text-gray-600 mt-2">
            You will be redirected to the login page in{" "}
            <span className="font-bold text-black/60">{countdown}</span>{" "}
            seconds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
