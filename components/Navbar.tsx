import { useState, useEffect } from "react";
import { Menu, X, Search, Heart, User, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

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

  useEffect(() => {
    const currentRoute = routes.find((route) => route.path === pathname);
    if (currentRoute) {
      setActiveItem(currentRoute.name);
    }
  }, [pathname]);

  const handleNavClick = (itemName: string) => {
    setActiveItem(itemName);
    setIsOpen(false);
  };

  return (
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
            <User
              size={24}
              className="text-gray-800 hover:text-yellow-600 cursor-pointer hidden lg:block"
            />
            <ShoppingCart
              size={24}
              className="text-gray-800 hover:text-yellow-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-28 bg-white z-50 text-lg">
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
              <li key={route.name}>
                <Link
                  href={route.path}
                  className={`px-4 py-2 transition-colors w-full ${
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
        </div>
      )}

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
  );
};

export default Navbar;
