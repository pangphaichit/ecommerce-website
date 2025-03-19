import { useState, useEffect } from "react";
import { Menu, X, Search, Heart, User, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image"; //

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
      <div className="w-full pt-4 px-4 lg:py-4 lg:px-10">
        <div className="w-full mx-auto flex items-center justify-between">
          {/* Left Icons (Search & Favorite) */}
          <div className="flex items-center space-x-4">
            <Search
              size={24}
              className="text-gray-800 hover:text-yellow-600 cursor-pointer"
            />
            <Heart
              size={24}
              className="text-gray-800 hover:text-yellow-600 cursor-pointer"
            />
          </div>

          {/* Right Icons (Account & Basket) */}
          <div className="flex items-center space-x-4">
            <User
              size={24}
              className="text-gray-800 hover:text-yellow-600 cursor-pointer"
            />
            <ShoppingCart
              size={24}
              className="text-gray-800 hover:text-yellow-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto flex items-center justify-between py-6 px-3 lg:pt-3">
        {/* Logo */}
        <div className="w-full flex items-center justify-start lg:justify-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            <Image
              src="/landing-page/oven-and-forge-no-tagline.png"
              alt="Bakery Brand"
              width={220}
              height={220 / 1.59}
              className="object-contain lg:w-[300px] lg:h-[300/1.59]"
            />
          </Link>
        </div>

        {/* Hamburger Button (Mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-gray-800"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-22 bg-white z-50 text-lg">
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <button onClick={() => setIsOpen(false)} className="text-gray-800">
              <X size={28} />
            </button>
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
