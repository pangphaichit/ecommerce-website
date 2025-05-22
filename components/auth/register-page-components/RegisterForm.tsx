import React, {
  useState,
  FormEvent,
  ChangeEvent,
  useEffect,
  useRef,
} from "react";
import axios from "axios";
import { useAuth } from "@/context/authentication";
import Link from "next/link";
import Image from "next/image";
import zxcvbn from "zxcvbn";
import {
  ArrowLeft,
  House,
  Eye,
  EyeOff,
  Circle,
  CircleCheck,
} from "lucide-react";
import Input from "@/components/ui/Input";
import CustomAlert from "@/components/ui/CustomAlert";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  FormData,
  ErrorState,
  ValidationChecks,
  TouchedState,
} from "@/types/auth/";

const RegisterForm = () => {
  const { register } = useAuth();
  // Stores the values of each form field
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Tracks validation errors for each form field
  const [errors, setErrors] = useState<{ [key in keyof FormData]: ErrorState }>(
    {
      firstName: { hasError: false, message: "" },
      lastName: { hasError: false, message: "" },
      email: { hasError: false, message: "" },
      password: { hasError: false, message: "" },
      confirmPassword: { hasError: false, message: "" },
    }
  );

  // Tracks password validation criteria
  const [checks, setChecks] = useState<ValidationChecks>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Tracks whether each form field has been touched
  const [touched, setTouched] = useState<TouchedState>({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // State for handling password visibility toggles
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  // State for tracking password strength
  const [passwordStrength, setPasswordStrength] = useState<string | null>(null);

  // Loading
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State for managing the custom alert
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  // Refs for input fields to access their values directly
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  // Toggles the visibility of the password and confirm password field
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Function to check the strength of a given password
  const checkPasswordStrength = (password: string) => {
    const result = zxcvbn(password);
    const score = result.score;

    let strength = "Weak";
    if (score === 4) {
      strength = "Very Strong";
    } else if (score === 3) {
      strength = "Strong";
    } else if (score === 2) {
      strength = "Medium";
    } else if (score === 1) {
      strength = "Weak";
    }

    return strength;
  };

  // Handles changes to input fields and updates form data and password strength
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (!touched[name as keyof typeof touched]) {
      setTouched({
        ...touched,
        [name]: true,
      });
    }
    if (name === "password") {
      const trimmedValue = value.replace(/\s/g, "");

      setChecks({
        minLength: trimmedValue.length > 6,
        hasUppercase: /[A-Z]/.test(trimmedValue),
        hasLowercase: /[a-z]/.test(trimmedValue),
        hasNumber: /\d/.test(trimmedValue),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(trimmedValue),
      });

      const strength = checkPasswordStrength(trimmedValue);
      setPasswordStrength(strength);
    }
  };

  // Validates a specific form field based on its name and value, returning any validation errors.
  const validateField = (fieldName: string, value: string) => {
    let errorState = { hasError: false, message: "" };

    switch (fieldName) {
      case "firstName":
        if (!value.trim()) {
          errorState = { hasError: true, message: "First Name is required." };
        } else if (/\s/.test(value)) {
          errorState = {
            hasError: true,
            message: "First Name cannot contain spaces.",
          };
        } else if (value.length < 1) {
          errorState = {
            hasError: true,
            message: "First Name should have at least 1 character.",
          };
        }
        break;

      case "lastName":
        if (!value.trim()) {
          errorState = { hasError: true, message: "Last Name is required." };
        } else if (/\s/.test(value)) {
          errorState = {
            hasError: true,
            message: "Last Name cannot contain spaces.",
          };
        } else if (value.length < 1) {
          errorState = {
            hasError: true,
            message: "Last Name should have at least 1 character.",
          };
        }
        break;

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
        } else if (value.length < 7) {
          errorState = {
            hasError: true,
            message: "Password should be at least 7 characters long.",
          };
        } else {
          const strength = checkPasswordStrength(value);
          if (strength === "Weak") {
            errorState = {
              hasError: true,
              message: "Please choose a stronger password.",
            };
          }
        }
        break;

      case "confirmPassword":
        if (!value) {
          errorState = {
            hasError: true,
            message: "Confirm Password is required.",
          };
        } else if (value !== formData.password) {
          errorState = {
            hasError: true,
            message: "Passwords don't match.",
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
        newErrors[field as keyof typeof errors] = validateField(field, value);
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
      firstName: validateField("firstName", formData.firstName),
      lastName: validateField("lastName", formData.lastName),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirmPassword: validateField(
        "confirmPassword",
        formData.confirmPassword
      ),
    };

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = {
        hasError: true,
        message: "Passwords do not match",
      };
    }

    setErrors(newErrors);

    const errorFields = [
      { ref: firstNameRef, hasError: newErrors.firstName.hasError },
      { ref: lastNameRef, hasError: newErrors.lastName.hasError },
      { ref: emailRef, hasError: newErrors.email.hasError },
      { ref: passwordRef, hasError: newErrors.password.hasError },
      { ref: confirmPasswordRef, hasError: newErrors.confirmPassword.hasError },
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
      setAlertMessage("Please correct the errors in the form.");
      setAlertType("error");
      setAlertOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error;

        if (errorMessage?.includes("email")) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: {
              hasError: true,
              message: errorMessage,
            },
          }));
        } else {
          setAlertMessage(
            errorMessage || "Registration failed. Please try again."
          );
          setAlertType("error");
          setAlertOpen(true);
        }
      } else {
        setAlertMessage("An unexpected error occurred. Please try again.");
        setAlertType("error");
        setAlertOpen(true);
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
      <div className="flex flex-col w-full lg:max-w-[800px] px-4 lg:px-10 pt-5 lg:pt-8 pb-8 mb-10 bg-white lg:shadow-md">
        <h1 className="text-lg lg:text-2xl font-semibold text-center pb-5">
          Register
        </h1>
        <form
          onSubmit={handleSubmit}
          aria-labelledby="registration-heading"
          aria-describedby="registration-description"
          className="space-y-4"
        >
          <div className="lg:grid lg:grid-cols-2 lg:gap-6">
            <div className="pb-4 lg:pb-0">
              <Input
                ref={firstNameRef}
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName.hasError}
                errorMsg={errors.firstName.message}
                placeholder=""
                required={true}
                ariaDescribedby="firstName-requirements"
              />
              <span id="firstName-requirements" className="sr-only">
                First name cannot contain spaces and must be at least 1
                character long.
              </span>
            </div>
            <Input
              ref={lastNameRef}
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName.hasError}
              errorMsg={errors.lastName.message}
              placeholder=""
              required={true}
              ariaDescribedby="lastname-requirements"
            />
            <span id="lastname-requirements" className="sr-only">
              Last name cannot contain spaces and must be at least 1 character
              long.
            </span>
          </div>
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
              Password must be at least 7 characters long, include uppercase and
              lowercase letters, and at least one number or special character.
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
            {touched.password && formData.password && (
              <div className="mt-2">
                <div
                  className={`password-strength text-sm ${passwordStrength}`}
                  aria-live="polite"
                >
                  {passwordStrength && (
                    <div>
                      <div>
                        <div
                          className="progressbar h-2 rounded-full mb-2"
                          style={{
                            width: `${
                              passwordStrength === "Weak"
                                ? 35
                                : passwordStrength === "Medium"
                                ? 50
                                : passwordStrength === "Strong"
                                ? 75
                                : passwordStrength === "Very Strong"
                                ? 100
                                : 0
                            }%`,
                            backgroundColor:
                              passwordStrength === "Weak"
                                ? "red"
                                : passwordStrength === "Medium"
                                ? "orange"
                                : passwordStrength === "Strong"
                                ? "#68D391"
                                : passwordStrength === "Very Strong"
                                ? "#38a169"
                                : "gray",
                          }}
                          role="progressbar"
                          aria-valuenow={
                            passwordStrength === "Weak"
                              ? 25
                              : passwordStrength === "Medium"
                              ? 50
                              : passwordStrength === "Strong"
                              ? 75
                              : passwordStrength === "Very Strong"
                              ? 100
                              : 0
                          }
                          aria-live="polite"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Password strength: ${passwordStrength}`}
                        ></div>

                        <span className="font-medium">Strength: </span>
                        <span>{passwordStrength}</span>
                      </div>

                      <div className="space-y-2 lg:space-y-1 text-xs lg:text-sm mt-2">
                        {[
                          {
                            condition: checks.minLength,
                            text: "Use a minimum of 7 characters",
                          },
                          {
                            condition:
                              checks.hasNumber || checks.hasSpecialChar,
                            text: "Use letters with at least one number or special character",
                          },
                          {
                            condition: checks.hasUppercase,
                            text: "Use letters with at least one uppercase letter",
                          },
                          {
                            condition: checks.hasLowercase,
                            text: "Use letters with at least one lowercase letter",
                          },
                        ].map(({ condition, text }, index) => (
                          <span key={index} className="flex items-center gap-2">
                            {condition ? (
                              <CircleCheck
                                size={16}
                                className="text-green-500"
                              />
                            ) : (
                              <Circle size={16} className="text-gray-400" />
                            )}
                            {text}
                          </span>
                        ))}
                        <div className="mb-2">
                          <span className="text-xs lg:text-sm">
                            * Avoid using common passwords
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative pb-4">
            <Input
              ref={confirmPasswordRef}
              name="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword.hasError}
              errorMsg={errors.confirmPassword.message}
              type={showConfirmPassword ? "text" : "password"}
              placeholder=""
              required={true}
              ariaDescribedby="confirm-password-requirements"
            />
            <span id="confirm-password-requirements" className="sr-only">
              The password must match the one above.
            </span>
            {formData.password &&
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-xs lg:text-sm sr-only">
                  Passwords don't match.
                </p>
              )}
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-9 lg:top-10 text-gray-500 focus:outline-none"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show confirm password"
              }
              aria-pressed={showConfirmPassword}
              aria-controls="confirmPassword"
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          <p id="terms-agreement" className="text-[0.7rem] lg:text-xs">
            By clicking 'CREATE ACCOUNT', I agree to the membership terms and
            conditions of 'Oven and Wheat' and confirm that I have read and
            understood the{" "}
            <Link href="/privacy-policy">
              <span className="underline">Privacy Policy.</span>
            </Link>
          </p>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              aria-label="Create account"
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
                  CREATING ACCOUNT...
                </>
              ) : (
                "CREATE ACCOUNT"
              )}
            </button>
          </div>
          <p className="text-sm lg:text-base text-center">
            Already have an account?{" "}
            <Link href="/log-in">
              <span className="underline">Log in</span>
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

export default RegisterForm;
