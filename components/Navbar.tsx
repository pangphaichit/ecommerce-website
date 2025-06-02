import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "@/context/authentication";
import { useRouter } from "next/router";
import { Menu, X, Search, Heart, User, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";

const routes = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Courses", path: "/courses" },
  { name: "News & Events", path: "/news-and-events" },
  { name: "Blog", path: "/blog" },
  { name: "About", path: "/about-us" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>("");
  const pathname = usePathname();
  const { isAuthenticated, logout, userRole, userId } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const userRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/customer/${userId}`);
        setUserName(res.data.data?.first_name || "Guest");
        setUserImage(res.data.data?.image || null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch user data");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    const currentRoute = routes.find((route) => route.path === pathname);
    if (currentRoute) {
      setActiveItem(currentRoute.name);
    }
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleNavClick = (itemName: string) => {
    setActiveItem(itemName);
    setIsOpen(false);
  };

  const handleLoginClick = () => {
    router.push("/log-in");
    setShowPopup(false);
  };

  const handleRegisterClick = () => {
    router.push("/register");
    setShowPopup(false);
  };

  const handleLogoutClick = () => {
    logout();
    setShowPopup(false);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 300);
  };

  const handleUserClick = () => {
    setShowPopup((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div>
      <nav className="bg-white w-full relative">
        <div className="w-full mx-auto flex items-center py-6 lg:py-10 lg:pr-10">
          {/* Logo */}
          <div className="absolute w-full flex items-center justify-center pointer-events-none">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-800 pointer-events-auto"
            >
              <Image
                src="/landing-page/oven-and-wheat-no-tagline.png"
                alt="Bakery Brand"
                width={180}
                height={180 / 1.59}
                className="object-contain lg:w-[300px] lg:h-[300/1.59]"
              />
            </Link>
          </div>
          <div className="flex flex-row justify-between lg:justify-end lg:gap-2 w-full">
            <div className="flex items-center lg:gap-2">
              <div className="flex items-center pl-3 lg:pl-0">
                {/* Hamburger Button (Mobile) */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="lg:hidden text-gray-800 z-50"
                >
                  {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
              <Search
                size={24}
                className="text-gray-800 hover:text-yellow-600 cursor-pointer hidden lg:block"
              />
              <Heart
                size={24}
                className="text-gray-800 hover:text-yellow-600 cursor-pointer hidden lg:block"
              />
            </div>
            <div className="flex items-center lg:gap-2 pr-3 lg:pr-0">
              <div
                className="relative hidden lg:block"
                ref={userRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div onClick={handleUserClick} className="cursor-pointer">
                  <User
                    size={24}
                    className="text-gray-800 hover:text-yellow-600 cursor-pointer hidden lg:block"
                  />
                </div>
                {showPopup && (
                  <div
                    className="absolute top-full right-0 bg-white shadow-lg border border-gray-200 z-50 w-[250px] py-4"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {isAuthenticated ? (
                      <div className="w-full">
                        <Link
                          href={`/customer/my-account`}
                          className="shrink-0 group"
                        >
                          <div className="flex items-center gap-3 px-4 pb-3">
                            {userImage ? (
                              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center group-hover:ring-2 group-hover:ring-yellow-400 group-hover:ring-offset-2 transition-all duration-200">
                                <Image
                                  src={userImage}
                                  alt="User Profile"
                                  width={48}
                                  height={48}
                                  className="rounded-full object-cover border-2 border-gray-200"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center group-hover:ring-2 group-hover:ring-yellow-400 group-hover:ring-offset-1 transition-all duration-200">
                                <User className="text-yellow-600" size={20} />
                              </div>
                            )}

                            <div className="flex-1">
                              <span className="text-sm font-semibold text-gray-800 block group-hover:text-yellow-600 transition-colors duration-200">
                                {userName}
                              </span>
                              <span className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                                Welcome back!
                              </span>
                            </div>
                          </div>
                        </Link>
                        <hr className="border-gray-100" />
                        <button
                          onClick={handleLogoutClick}
                          className="block w-full text-left px-4 py-2 text-sm font-medium hover:font-semibold hover:bg-yellow-50 text-gray-700 cursor-pointer hover:text-yellow-600 transition-all duration-200 rounded-md"
                        >
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="w-full">
                        <div className="px-4 pb-3">
                          <h3 className="text-sm font-semibold text-gray-800 mb-1">
                            Welcome to Oven and Wheat
                          </h3>
                          <p className="text-xs text-gray-500">
                            Sign in to access your account
                          </p>
                        </div>
                        <hr className="border-gray-100" />
                        <button
                          onClick={handleLoginClick}
                          className="block w-full text-left px-4 py-2 text-sm font-medium hover:font-semibold hover:bg-yellow-50 text-gray-700 cursor-pointer hover:text-yellow-600 transition-all duration-200 rounded-md"
                        >
                          Login
                        </button>
                        <button
                          onClick={handleRegisterClick}
                          className="block w-full text-left px-4 py-2 text-sm font-medium hover:font-semibold hover:bg-yellow-50 text-gray-700 cursor-pointer hover:text-yellow-600 transition-all duration-200 rounded-md"
                        >
                          Register
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <ShoppingCart
                size={24}
                className="text-gray-800 hover:text-yellow-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex w-full justify-center pt-2 pb-5 space-x-8 text-lg font-medium">
          {routes.map((route) => (
            <li key={route.name}>
              <Link
                href={route.path}
                className={`px-4 py-2  transition-colors ${
                  activeItem === route.name
                    ? "bg-yellow-600 text-white"
                    : "text-gray-800 hover:text-yellow-600"
                }`}
                onClick={() => handleNavClick(route.name)}
              >
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed top-28 left-0 right-0 bottom-0 bg-white z-40 text-lg overflow-y-auto">
          {isAuthenticated ? (
            <div className="w-full mt-5 flex items-center justify-between">
              <Link href={`/customer/my-account`} className="shrink-0 group">
                <div className="flex items-center gap-3 px-4 pb-3">
                  {userImage ? (
                    <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center group-hover:ring-2 group-hover:ring-yellow-400 group-hover:ring-offset-2 transition-all duration-200">
                      <Image
                        src={userImage}
                        alt="User Profile"
                        width={56}
                        height={56}
                        className="rounded-full object-cover border-2 border-gray-200"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center group-hover:ring-2 group-hover:ring-yellow-400 group-hover:ring-offset-1 transition-all duration-200">
                      <User className="text-yellow-600" size={23} />
                    </div>
                  )}

                  <div className="flex-1">
                    <span className="text-base font-semibold text-gray-800 block group-hover:text-yellow-600 transition-colors duration-200">
                      {userName}
                    </span>
                    <span className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                      Welcome back!
                    </span>
                  </div>
                </div>
              </Link>

              <Button
                variant="destructive"
                size="default"
                onClick={handleLogoutClick}
                className="block w-22 py-2 mr-4 text-sm font-medium hover:font-semibold text-white cursor-pointer rounded-md"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="w-full">
              <div className="px-4 py-4 pb-3 text-center">
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  Welcome to Oven and Wheat
                </h3>
                <p className="text-sm text-gray-500">
                  Sign in to access your account
                </p>
              </div>
              <div className="flex flex-row justify-between m-4 gap-4">
                <Button
                  variant="yellow"
                  size="default"
                  onClick={handleLoginClick}
                  className="block w-full px-4 py-2 text-base font-medium hover:font-semibold rounded-none"
                >
                  Login
                </Button>
                <Button
                  variant="lightyellow"
                  size="default"
                  onClick={handleRegisterClick}
                  className="block w-full px-4 py-2 text-base font-medium hover:font-semibold rounded-none"
                >
                  Register
                </Button>
              </div>
            </div>
          )}

          {/* Close Button */}
          {/* Search Bar */}
          <div className="flex flex-row items-center justify-center py-2">
            <Search
              size={24}
              className="text-gray-800 hover:text-yellow-600 cursor-pointer hidden lg:block"
            />
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 w-80 border-b-2 border-gray-300 focus:outline-none focus:border-yellow-600"
            />
          </div>
          {/* Menu Items */}
          <ul className="flex flex-col items-center space-y-4 py-4">
            {routes.map((route) => (
              <li key={route.name} className="py-1">
                <Link
                  href={route.path}
                  className={`px-4 py-2 transition-colors w-full ${
                    activeItem === route.name
                      ? " text-yellow-600 font-semibold"
                      : "text-gray-800 hover:text-yellow-600 font-semibold"
                  }`}
                  onClick={() => handleNavClick(route.name)}
                >
                  {route.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
