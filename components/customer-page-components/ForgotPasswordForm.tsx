import {
  useState,
  type FormEvent,
  type ChangeEvent,
  useRef,
  useEffect,
} from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, House } from "lucide-react";
import Input from "@/components/ui/Input";
import CustomAlert from "@/components/ui/CustomAlert";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  ForgotPasswordFormData,
  ForgotFormErrorState,
  ForgotFormTouchedState,
} from "@/types/customer/";

const ForgotPasswordForm = () => {
  // Stores the values of each form field
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });

  // Tracks validation errors for each form field
  const [errors, setErrors] = useState<{
    [key in keyof ForgotPasswordFormData]: ForgotFormErrorState;
  }>({
    email: { hasError: false, message: "" },
  });

  // Tracks whether each form field has been touched
  const [touched, setTouched] = useState<ForgotFormTouchedState>({
    email: false,
  });

  // Loading
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State for managing the custom alert
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  // Refs for input fields to access their values directly
  const emailRef = useRef<HTMLInputElement>(null);

  // Handles changes to input fields and updates form data and password strength
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (!touched[name as keyof typeof touched]) {
      setTouched({
        ...touched,
        [name]: true,
      });
    }
  };

  // Validates a specific form field based on its name and value, returning any validation errors.
  const validateField = (fieldName: string, value: string) => {
    let errorState = { hasError: false, message: "" };

    switch (fieldName) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        value = value.trim();
        if (!value) {
          errorState = { hasError: true, message: "Email is required." };
        } else if (!emailRegex.test(value)) {
          errorState = {
            hasError: true,
            message: "Please enter a valid email address.",
          };
        }
        break;

      default:
        break;
    }

    return errorState;
  };

  // Validates fields that have been touched and updates the error state accordingly.
  useEffect(() => {
    const newErrors = { ...errors };

    Object.keys(touched).forEach((field) => {
      if (touched[field as keyof typeof touched]) {
        const value = formData[field as keyof typeof formData];

        // Make sure the value is a string before passing it to validateField
        if (typeof value === "string") {
          newErrors[field as keyof typeof errors] = validateField(field, value);
        }
      }
    });

    setErrors(newErrors);
  }, [formData, touched]);

  // Validates all form fields, updates error state, and focuses on the first error field.
  const validateForm = () => {
    const allTouched = Object.keys(touched).reduce((acc, field) => {
      return { ...acc, [field]: true };
    }, {});

    setTouched(allTouched as typeof touched);

    const newErrors = {
      email: validateField("email", formData.email),
    };

    const errorFields = [{ ref: emailRef, hasError: newErrors.email.hasError }];

    const firstErrorField = errorFields.find((field) => field.hasError);

    if (firstErrorField && firstErrorField.ref.current) {
      firstErrorField.ref.current.focus();
      firstErrorField.ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    return !Object.values(newErrors).some((error) => error.hasError);
  };

  // Handles form submission.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const { email } = formData;

    try {
      await axios.post("/api/auth/forgot-password", {
        email,
      });
      setAlertMessage("Password reset email has been sent successfully.");
      setAlertType("success");
      setAlertOpen(true);
    } catch (error: unknown) {
      // Type assertion to AxiosError
      if (axios.isAxiosError(error)) {
        setAlertMessage(
          error.response?.data?.error ||
            "Failed to send password reset email. Please try again."
        );
      } else {
        setAlertMessage("An unexpected error occurred. Please try again.");
      }
      setAlertType("error");
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen lg:bg-gray-100">
      <div className="hidden lg:block">
        <Link
          href="/"
          className="absolute top-6 left-6 inline-flex text-sm font-medium text-gray-600 hover:text-yellow-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
      <div className="block lg:hidden">
        <Link
          href="/"
          className="absolute top-5 left-5 inline-flex text-sm font-medium text-gray-600 hover:text-yellow-600"
        >
          <House className="mr-2 h-5 w-5" />
        </Link>
      </div>
      <Link href="/">
        <Image
          src="/landing-page/oven-and-wheat-no-tagline.png"
          alt="Bakery Brand"
          width={250}
          height={250 / 1.59}
          className="object-contain mx-auto mt-20 lg:mt-7 lg:my-6 lg:w-[350px] lg:h-[350/1.59]"
        />
      </Link>
      <div className="flex flex-col w-full lg:max-w-[500px] px-4 lg:px-10 pt-5 lg:pt-8 pb-8 mb-10 bg-white lg:shadow-md">
        <h1 className="text-lg lg:text-2xl font-semibold text-center pb-5">
          RESET PASSWORD
        </h1>
        <form
          onSubmit={handleSubmit}
          aria-labelledby="reset-password-heading"
          aria-describedby="reset-password-description"
          className="space-y-4"
        >
          <p className="text-xs lg:text-base">
            Enter your email address to receive a password reset link. We'll
            send instructions to your registered email.
          </p>
          <Input
            ref={emailRef}
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email.hasError}
            errorMsg={errors.email.message}
            type="email"
            placeholder=""
            required={true}
            ariaDescribedby="email-requirements"
          />
          <span id="email-requirements" className="sr-only">
            The email address must be in a valid format (e.g.,
            name@example.com).
          </span>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              aria-label="Reset password"
              className={`w-full px-4 py-2 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-700 cursor-pointer"
              } flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Sending Reset Link...
                </>
              ) : (
                "RESET PASSWORD"
              )}
            </button>
          </div>
          <p className="text-sm">
            Or{" "}
            <Link href="/log-in">
              <span className="underline">return to Log in</span>
            </Link>
          </p>
        </form>
        <CustomAlert
          open={alertOpen}
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertOpen(false)}
          aria-live="assertive"
        />
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
