import { useState, useRef, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      return "Email is required.";
    } else if (!emailRegex.test(value.trim())) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errorMsg = validateEmail(email);
    if (errorMsg) {
      setEmailError(errorMsg);
      emailRef.current?.focus();
      return;
    }

    // Submit logic here
    console.log("Subscribed with email:", email);
    setEmail("");
  };

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[350px] lg:mx-10 lg:mb-5">
        {/* Image Left Side */}
        <div className="relative h-[200px] md:h-auto">
          <Image
            src="/newsletter-bg.jpg"
            alt="Newsletter background"
            fill
            className="object-cover rounded-none"
            priority
          />
        </div>
        {/* Right - Form Section */}
        <div className="bg-gray-200 flex flex-col justify-center px-6 py-10 lg:px-12 text-white">
          <h3 className="text-3xl lg:text-3xl text-center font-bold mb-3 lg:mb-4">
            Stay Updated with Our Latest Treats
          </h3>
          <p className="text-base text-center lg:text-xl mb-6 lg:mb-8 opacity-90 leading-relaxed">
            Subscribe for exclusive recipes, baking tips, and special offers.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-3 lg:gap-4 w-[90%] lg:w-[60%] mx-auto"
          >
            <div className="justify-center text-gray-800 w-full">
              <Input
                ref={emailRef}
                name="email"
                label="Email"
                value={email}
                onChange={handleEmailChange}
                error={!!emailError}
                errorMsg={emailError}
                type="email"
                placeholder="Enter your email"
                required={true}
              />
            </div>
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="font-semibold text-sm lg:text-base rounded-none w-full"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
