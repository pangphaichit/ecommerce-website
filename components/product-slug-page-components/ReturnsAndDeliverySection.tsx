import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ReturnsAndDeliverySection: React.FC = () => {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white min-h-screen">
      <div>
        <div className="ml-2 max-w-none">
          <div className="space-y-8">
            {/* Delivery Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Delivery
              </h2>
              <p className="text-gray-700 font-medium">Areas & Times</p>
              <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                <li>Within 5 miles: Same-day delivery available</li>
                <li>Within 10 miles: Next-day delivery</li>
                <li>Special arrangements for events or large orders</li>
              </ul>

              <p className="text-gray-700 font-medium mt-4">Order Deadlines</p>
              <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                <li>Same-Day: Place by 2 PM (delivery 4–8 PM)</li>
                <li>Next-Day: Place by 8 PM (delivery following day)</li>
                <li>
                  Weekend: Friday orders deliver Saturday, Saturday orders
                  deliver Sunday
                </li>
                <li>Scheduled delivery: Up to 7 days in advance</li>
              </ul>

              <p className="text-gray-700 font-medium mt-4">Delivery Fees</p>
              <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                <li>Orders under $30: $5.99</li>
                <li>$30–$49.99: $3.99</li>
                <li>$50+: Free</li>
                <li>Same-day: +$2 rush fee</li>
              </ul>
            </section>

            {/* Returns & Refunds Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Returns & Refunds
              </h2>
              <p className="text-gray-700 font-medium">Quality Guarantee</p>
              <p className="text-gray-700">
                We take pride in our fresh, handcrafted baked goods. Your
                satisfaction is our priority.
              </p>

              <p className="text-gray-700 font-medium mt-2">Accepted Returns</p>
              <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                <li>Quality issues: damaged, stale, or substandard items</li>
                <li>Incorrect orders</li>
                <li>Late deliveries (2+ hours)</li>
                <li>Temperature issues</li>
              </ul>

              <p className="text-gray-700 font-medium mt-2">Exclusions</p>
              <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                <li>Change of mind</li>
                <li>Items past normal shelf life</li>
                <li>Dietary restrictions (please check ingredients)</li>
                <li>Custom/personalized orders (unless quality issue)</li>
              </ul>
            </section>

            {/* Guidelines Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Fresh Baked Goods Guidelines
              </h2>
              <p className="text-gray-700 font-medium">Shelf Life</p>
              <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                <li>Bread & rolls: 2–3 days, paper bag</li>
                <li>Pastries: 1–2 days, refrigerate cream items</li>
                <li>Cakes: 2–4 days depending on frosting</li>
                <li>Cookies: 5–7 days, airtight container</li>
                <li>Pies: 2–3 days, refrigerate cream pies</li>
              </ul>

              <p className="text-gray-700 font-medium mt-2">Storage</p>
              <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                <li>Room temperature unless noted</li>
                <li>Refrigerate cream, custard, or fresh fruit items</li>
                <li>Freeze bread up to 3 months</li>
                <li>Avoid plastic bags (moisture buildup)</li>
              </ul>
            </section>

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

          <p className="text-sm text-gray-500 mt-8">
            *Last updated: {lastUpdated}*
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnsAndDeliverySection;
