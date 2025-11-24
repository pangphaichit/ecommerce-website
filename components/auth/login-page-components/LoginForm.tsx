import {
  useState,
  type FormEvent,
  type ChangeEvent,
  useRef,
  useEffect,
} from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, House, Eye, EyeOff } from "lucide-react";
import Input from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CustomHelpTooltip from "@/components/ui/CustomHelpTooltip";
import {
  LoginFormData,
  LoginErrorState,
  LoginTouchedState,
} from "@/types/auth/";

const LoginForm = () => {
  const { login, showAlert } = useAuth();
  // Stores the values of each form field
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  // Tracks validation errors for each form field
  const [errors, setErrors] = useState<{
    [key in keyof LoginFormData]: LoginErrorState;
  }>({
    email: { hasError: false, message: "" },
    password: { hasError: false, message: "" },
  });

  // Tracks whether each form field has been touched
  const [touched, setTouched] = useState<LoginTouchedState>({
    email: false,
    password: false,
  });

  // State for handling password visibility toggles
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Loading
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Refs for input fields to access their values directly
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Toggles the visibility of the password and confirm password field
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

      case "password":
        if (!value) {
          errorState = { hasError: true, message: "Password is required." };
        } else if (/\s/.test(value)) {
          errorState = {
            hasError: true,
            message: "Password cannot contain spaces.",
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
      password: validateField("password", formData.password),
    };

    const errorFields = [
      { ref: emailRef, hasError: newErrors.email.hasError },
      { ref: passwordRef, hasError: newErrors.password.hasError },
    ];

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

    const { email, password, rememberMe } = formData;

    try {
      await login({ email, password, rememberMe });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error;
        showAlert(errorMessage, "error", "global");
        if (
          errorMessage?.includes("credentails") ||
          errorMessage?.includes("Invalid credentials")
        ) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: {
              hasError: true,
              message: "Invalid email or password",
            },
            password: {
              hasError: true,
              message: "Invalid email or password",
            },
          }));
          if (emailRef.current) {
            emailRef.current.focus();
            emailRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        } else {
          showAlert("Login failed. Please try again.", "error", "global");
        }
      } else {
        showAlert(
          "An unexpected error occurred. Please try again.",
          "error",
          "global"
        );
      }
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
          LOG IN
        </h1>
        <form
          onSubmit={handleSubmit}
          aria-labelledby="login-heading"
          aria-describedby="login-description"
          className="space-y-4"
        >
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
          <div className="relative">
            <Input
              ref={passwordRef}
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password.hasError}
              errorMsg={errors.password.message}
              type={showPassword ? "text" : "password"}
              placeholder=""
              required={true}
              ariaDescribedby="password-requirements"
            />
            <span id="password-requirements" className="sr-only">
              Password is required.
            </span>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 lg:top-10 text-gray-500 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              aria-controls="password"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            <div className="flex justify-between items-center">
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  checked={formData.rememberMe || false}
                  onChange={handleChange}
                  className="mr-2 cursor-pointer"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-xs lg:text-sm text-yellow-600 font-medium"
                >
                  Remember Me
                </label>

                <CustomHelpTooltip text="Stay signed in on this device for faster access. Uncheck this if you're on a shared or public device." />
              </div>
              <div className="flex items-center mt-2 text-yellow-600 text-xs lg:text-sm font-medium">
                <Link href="/customer/forgot-password">
                  Forgotten your password?
                </Link>
              </div>
            </div>
          </div>

          <p id="terms-agreement" className="text-xs lg:text-xs">
            By logging in, you accept Oven and Wheat's{" "}
            <Link href="/privacy-policy">
              <span className="underline">Privacy Policy.</span>
            </Link>
          </p>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              aria-label="Login"
              aria-describedby="terms-agreement"
              className={`w-full px-4 py-2 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-700 cursor-pointer"
              } flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  LOGGING IN...
                </>
              ) : (
                "LOG IN"
              )}
            </button>
          </div>
          <p className="text-sm lg:text-base text-center">
            Don't have account?{" "}
            <Link href="/register">
              <span className="underline">Register</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
