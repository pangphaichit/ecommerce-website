import React from "react";
import Image from "next/image";

const ShopHistory = () => {
  return (
    <section
      className="w-full max-w-[93%] lg:max-w-[70%] mx-auto space-y-4 lg:space-y-10 mt-2 lg:mt-4 mb-25 text-gray-600"
      aria-label="Oven & Wheat Story Section"
    >
      <div className="lg:hidden border-3 p-2 border-yellow-700">
        <h1 className="text-2xl lg:text-3xl text-center font-medium border-4 border-double py-8 px-4 border-yellow-700">
          The Story of Oven & Wheat
        </h1>
      </div>

      <h1 className="hidden lg:block text-2xl lg:text-3xl text-start font-medium mb-5 text-yellow-700">
        The Story of Oven & Wheat
      </h1>

      <div className="w-full flex flex-col lg:flex-row lg:gap-6 lg:mt-5">
        <div className="w-full lg:w-1/2">
          <div className="w-full lg:h-[600px] relative">
            <Image
              src="/landing-page/bakery-shop.jpg"
              alt="bakery-shop"
              width={1000}
              height={620}
              className="h-[620px] object-cover"
              style={{
                objectPosition: "0% 60%",
              }}
            />
          </div>
        </div>

        <div className="w-full lg:pl-4 lg:w-1/2">
          <h2 className="text-xl font-semibold mt-4 lg:mt-0  mb-2 lg:mb-4 text-yellow-700">
            A Humble Beginning (1990s – England)
          </h2>
          <p className="leading-relaxed text-base mb-2 lg:mb-4">
            In the golden autumn of the 1990s, tucked between ivy-covered stone
            cottages in a quiet English village, a young baker named{" "}
            <span className="font-semibold">Margaret Whitmore</span> opened her
            doors for the first time. She called her little bakery{" "}
            <em>Oven & Wheat</em> a simple name that spoke to everything she
            cherished: the warmth of the hearth and the honest beauty of the
            finest grain.
          </p>
          <p className="leading-relaxed text-base mb-4">
            Each morning before dawn, Margaret would tie her flour-dusted apron
            and begin the ritual that would define her life. Hand-kneading
            dough, milling her own wheat, and baking with techniques passed down
            from her grandmother's weathered recipe book.
          </p>
          <p className="leading-relaxed italic">
            “It’s not just bread you taste it’s her heart in every bite.”
          </p>

          <p className="leading-relaxed text-base mb-4">
            Today, <span className="font-semibold">Elena Whitmore</span>,
            Margaret's granddaughter, carries the flame across oceans and
            generations. After apprenticing with master bakers from Paris to San
            Francisco, Elena returned with new techniques and global inspiration
            but never forgot the foundation her grandmother laid.
          </p>
          <p className="leading-relaxed">
            Under Elena's hands, <em>Oven & Wheat</em> has become something both
            timeless and revolutionary: a bridge between the old world and the
            new.
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col-reverse lg:flex-row lg:gap-10 lg:mt-15">
        <div className="w-full lg:w-1/2">
          <h2 className="text-xl font-semibold mt-3 lg:mt-0 mb-2 lg:mb-4 text-yellow-700">
            Crafted by Hand, Delivered with Love
          </h2>
          <p className="text-base leading-relaxed mb-4">
            As word of our baking spread beyond village borders, we knew we had
            to find a way to share Margaret's legacy with kindred spirits
            everywhere. Today, <em>Oven & Wheat</em> offers nationwide online
            delivery, bringing the warmth of our ovens directly to your table.
            <span className="font-semibold">
              {" "}
              We proudly donate 10% of our profits to support women’s
              empowerment and food security initiatives.
            </span>
          </p>

          <p className="leading-relaxed mb-4">
            At <em>Oven & Wheat</em>, we honor those who came before us while
            embracing the joy of sharing honest, handmade goods with a world
            hungry for authenticity.
          </p>
          <p className="leading-relaxed mb-4">
            Every purchase supports not just a business, but a living tradition
            that began with a young woman's dream in an English village and
            continues with every loaf that emerges from our ovens today.
          </p>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="w-full relative">
            <Image
              src="/about-us/shop-window.jpg"
              alt="bakery-shop"
              width={550}
              height={420}
              className="h-[420px] object-cover"
              style={{
                objectPosition: "0% 60%",
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-4 lg:my-15">
        {/* Image with caption */}
        <div className="flex-shrink-0 bg-white shadow-xl p-3 transform lg:-rotate-2">
          <Image
            src="/about-us/elena-whitmore.jpg"
            alt="Elena Whitmore"
            width={160}
            height={100}
            className="object-cover"
            style={{
              objectPosition: "0% 60%",
            }}
          />
          <p className="mt-3 text-center text-sm font-medium italic text-yellow-700">
            Elena Whitmore
          </p>
        </div>

        {/* Text beside image */}
        <div className="text-center lg:text-left max-w-xl px-4">
          <h2 className="text-xl lg:text-2xlfont-medium mb-4 text-yellow-700">
            A Message from Elena Whitmore
          </h2>
          <p className="text-sm lg:text-base italic leading-relaxed">
            "We may have grown from a quiet corner of England to baking for
            homes across the nation, but our purpose remains the same: to fill
            hearts through honest bread, crafted with care. Thank you for
            carrying our story forward."
          </p>
          <div className="flex flex-col">
            <span className="mt-6 lg:mt-2 text-right text-sm font-medium text-yellow-700">
              — Elena Whitmore
            </span>
            <span className="mt-2 text-right text-sm font-medium text-yellow-700">
              Oven & Wheat Owner
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopHistory;
