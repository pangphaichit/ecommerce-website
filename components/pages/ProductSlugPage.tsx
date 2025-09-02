import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import NotificationBar from "@/components/landing-page-components/NotificationBar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductSlugPageSection from "@/components/product-slug-page-components/ProductSlugPageSection";
import NewsletterSection from "@/components/NewsletterSection";
import AppFooter from "@/components/AppFooter";

const ProductSlugPage: React.FC = () => {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <NotificationBar />
      <Navbar />
      <div className="lg:mt-15 lg:ml-[12.5%] ">
        <Breadcrumbs />
      </div>
      <ProductSlugPageSection />
      <NewsletterSection />
      <AppFooter />
    </div>
  );
};

export default ProductSlugPage;
