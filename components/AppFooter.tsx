import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Heart,
} from "lucide-react";

const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Courses", path: "/courses" },
    { name: "About Us", path: "/about-us" },
    { name: "Contact", path: "/contact" },
  ];

  const customerService = [
    { name: "My Account", path: "/customer/my-account" },
    { name: "Order Tracking", path: "/order-tracking" },
    { name: "Shipping Info", path: "/shipping" },
    { name: "Returns", path: "/returns" },
    { name: "FAQ", path: "/faq" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Cookie Policy", path: "/cookies" },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/landing-page/oven-and-wheat-no-tagline.png"
                alt="Oven and Wheat"
                width={160}
                height={160 / 1.59}
                className="object-contain"
              />
            </Link>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Crafting artisanal baked goods with love and tradition. From fresh
              breads to decadent pastries, we bring you the finest quality
              ingredients and time-honored recipes.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-600 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-600 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-600 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-800 font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-gray-600 hover:text-yellow-600 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-gray-800 font-semibold text-lg mb-4">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {customerService.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-gray-600 hover:text-yellow-600 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-800 font-semibold text-lg mb-4">
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin
                  size={16}
                  className="text-yellow-600 mt-1 flex-shrink-0"
                />
                <div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    123 Bakery Street
                    <br />
                    Sweet Town, ST 12345
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-yellow-600 flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-gray-600 hover:text-yellow-600 transition-colors duration-200 text-sm"
                >
                  (123) 456-7890
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-yellow-600 flex-shrink-0" />
                <a
                  href="mailto:hello@ovenandwheat.com"
                  className="text-gray-600 hover:text-yellow-600 transition-colors duration-200 text-sm"
                >
                  hello@ovenandwheat.com
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Clock
                  size={16}
                  className="text-yellow-600 mt-1 flex-shrink-0"
                />
                <div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Mon - Sat: 6:00 AM - 8:00 PM
                    <br />
                    Sunday: 7:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
              <p>© {currentYear} Oven and Wheat. All rights reserved.</p>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart size={14} className="text-red-500 fill-current" />
                <span>for baking enthusiasts</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center space-x-6 text-sm">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className="text-gray-600 hover:text-yellow-600 transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
