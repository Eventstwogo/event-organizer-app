"use client"; // Mark this component as a client component

import { usePathname } from "next/navigation"; // Use next/navigation
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";

const DynamicBreadcrumb: React.FC = () => {
  const pathname = usePathname(); // Get the current pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  // Split and filter empty segments

  return (
    <div className="ml-2">
      <Breadcrumb>
        <BreadcrumbList className="list-none flex items-center">
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>

          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const key = `${segment}-${index}`;
            return (
              <span key={key} className="flex items-center">
                <BreadcrumbSeparator /> {/* Ensure it's outside <li> */}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{segment.replace(/-/g, " ")}</BreadcrumbPage> // Display the current page
                  ) : (
                    <BreadcrumbLink href={`/${pathSegments.slice(0, index + 1).join("/")}`}>
                      {segment.replace(/-/g, " ")}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </span>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default DynamicBreadcrumb;
