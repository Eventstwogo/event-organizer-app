"use client";

import {
  LayoutDashboard,
  Users,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Plus,
  Calendar,
  CalendarDays,
  Tags,
  LineChart,
  BarChart3,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NavItem = {
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  // { label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { label: 'Events', icon: CalendarDays, href: '/Events' },
  { label: 'Bookings', icon: BookOpen, href: '/bookings' },
  // { label: 'Revenue', icon: DollarSign, href: '/revenue' },
  { label: 'Queries', icon: MessageSquare, href: '/queries' },
  // { label: 'Users', icon: Users, href: '/Users' },
];

export default function AppSidebar({
  collapsed,
  isMobile,
}: {
  collapsed: boolean;
  hidden?: boolean;
  isMobile?: boolean;
}) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isLinkActive = (item: NavItem) => {
    if (item.href && pathname === item.href) return true;
    if (item.children) {
      return item.children.some((child) => pathname.startsWith(child.href));
    }
    return false;
  };

  return (
    <aside
      className={`
    bg-[#111827] text-white h-full z-50 shadow-lg flex flex-col
    transition-all duration-300 ease-in-out
    ${collapsed ? "w-20" : "w-64"}
    ${isMobile ? "fixed top-0 left-0" : "md:static"}
    ${isMobile && collapsed ? "-translate-x-full" : "translate-x-0"}
  `}
    >
      {/* Header */}
      <div className="flex items-center justify-center py-4 border-b border-gray-700 ">
        <Image src="/logo.png" alt="Events2Go" height={50} width={50} className="mr-2"/>
        <h1
          className={`text-xl font-bold text-purple-400 transition-all ${
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          }`}
        >
          Events2Go
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = isLinkActive(item);
          const Icon = item.icon;
          const isDropdownOpen = openMenus[item.label];

          return (
            <div key={item.label}>
              {item.children ? (
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`flex items-center w-full p-2 rounded-lg text-sm font-medium transition-all group ${
                    active
                      ? "bg-purple-700 text-white"
                      : "hover:bg-purple-600/20 text-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {isDropdownOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </>
                  )}
                </button>
              ) : (
                <SidebarLink
                  collapsed={collapsed}
                  href={item.href!}
                  label={item.label}
                  icon={item.icon}
                  active={active}
                />
              )}

              {/* Submenu */}
              {!collapsed &&
                isDropdownOpen &&
                item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`ml-8 block text-sm p-2  mt-2 rounded-md transition ${
                      pathname === child.href
                        ? "bg-purple-600 text-white"
                        : "hover:bg-purple-600/10 text-gray-300"
                    }`}
                  >
                    {child.label}
                  </Link>
                ))}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

type SidebarLinkProps = {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  collapsed: boolean;
};

function SidebarLink({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
}: SidebarLinkProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={`flex items-center p-3 rounded-lg text-sm font-medium transition-all group ${
            active
              ? "bg-purple-700 text-white"
              : "hover:bg-purple-600/20 text-gray-300"
          }`}
        >
          <Icon className="w-5 h-5 mr-2 shrink-0" />
          {!collapsed && <span>{label}</span>}
        </Link>
      </TooltipTrigger>
      {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
    </Tooltip>
  );
}
