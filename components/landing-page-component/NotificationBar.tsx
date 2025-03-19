import { useState, useEffect } from "react";
import Image from "next/image";

interface MessageWithIcon {
  image: string;
  text: string;
  backgroundColors: string;
}

const NotificationBar = () => {
  const messagesWithIcon: MessageWithIcon[] = [
    {
      image: "/landing-page/icon/free-delivery.png",
      text: "Free shipping on orders over $50!",
      backgroundColors: "bg-yellow-600",
    },
    {
      image: "/landing-page/icon/promo-code.png",
      text: "20% off your first purchase with code WELCOME20!",
      backgroundColors: "bg-green-800",
    },
    {
      image: "/landing-page/icon/charity.png",
      text: "10% of our profits are donated to charity.",
      backgroundColors: "bg-slate-400",
    },
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(
        (prevIndex) => (prevIndex + 1) % messagesWithIcon.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [messagesWithIcon.length]);

  return (
    <div
      className={`text-xs w-full text-white ${messagesWithIcon[currentMessageIndex].backgroundColors} text-center z-50 py-2 lg:px-4 h-auto lg:text-sm flex items-center justify-center`}
    >
      <Image
        src={messagesWithIcon[currentMessageIndex].image}
        alt="Notification"
        className="mr-3"
        width={27}
        height={27}
      />
      <p>{messagesWithIcon[currentMessageIndex].text}</p>
    </div>
  );
};

export default NotificationBar;
