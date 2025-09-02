import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";

const Breadcrumbs = () => {
  const pathname = usePathname();
  if (!pathname) return [];

  // Memoize the crumbs calculation to avoid recalculating on every render
  const crumbs = React.useMemo(() => {
    const pathSegments = pathname.split("/").filter(Boolean);

    return pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      return {
        name: decodeURIComponent(segment.replace(/-/g, " ")),
        href: index !== pathSegments.length - 1 ? href : undefined,
      };
    });
  }, [pathname]);

  // Don't render if we're on the home page
  if (crumbs.length === 0) return null;

  return (
    <nav
      className="text-sm text-gray-600 flex items-center gap-2 mb-4 ml-4 lg:ml-10"
      aria-label="Breadcrumb"
    >
      {/* Structured data for better SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item:
                  typeof window !== "undefined" ? window.location.origin : "",
              },
              ...crumbs.map((crumb, index) => ({
                "@type": "ListItem",
                position: index + 2,
                name: crumb.name,
                item: crumb.href
                  ? `${
                      typeof window !== "undefined"
                        ? window.location.origin
                        : ""
                    }${crumb.href}`
                  : undefined,
              })),
            ],
          }),
        }}
      />

      <Link
        href="/"
        className="hover:text-yellow-600 hover:font-semibold transition-colors flex items-center gap-1"
        aria-label="Go to home page"
      >
        <Home size={18} aria-hidden="true" />
        <span className="hidden lg:inline lg:ml-2">Home</span>
      </Link>

      {crumbs.map((crumb, index) => (
        <span
          key={`${crumb.href}-${index}`}
          className="flex items-center gap-2"
        >
          <ChevronRight
            size={16}
            className="text-gray-400"
            aria-hidden="true"
          />
          {crumb.href ? (
            <Link
              href={crumb.href}
              className="hover:text-yellow-600 capitalize transition-colors"
              aria-label={`Go to ${crumb.name}`}
            >
              {crumb.name}
            </Link>
          ) : (
            <span className="capitalize font-medium" aria-current="page">
              {crumb.name}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
