"use client";

import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const OrgSidebar = () => {
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites");

  return (
    <div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-3 pt-3">
      <Link href="/">
        <div className="flex items-center gap-x-3 group">
          {/* Animated Logo */}
          <div className="relative w-[60px] h-[60px] animate-fade-in-spin group-hover:animate-pulse">
            <Image
              src="/LoadingLogo.svg"
              alt="Logo"
              fill
              className="object-contain transition-transform duration-500"
            />
          </div>

          {/* Brand Name */}
          <span
            className={cn(
              "text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent transition duration-300 group-hover:scale-105",
              font.className
            )}
          >
            BoardCollab
          </span>
        </div>
      </Link>
      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            },
            organizationSwitcherTrigger: {
              padding: "10px 14px",
              width: "100%",
              borderRadius: "12px",
              border: "1px solid #d1d5db", // Tailwind border-gray-300
              background: "linear-gradient(to right, #f9fafb, #f3f4f6)", // subtle gradient
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)", // soft shadow
              justifyContent: "space-between",
              color: "#111827", // Tailwind gray-900
              fontWeight: "600",
              transition: "all 0.3s ease",
              cursor: "pointer",
              // backgroundColor: "white"
            },
            organizationSwitcherTrigger__hover: {
              backgroundColor: "#e5e7eb", // Tailwind gray-200
              boxShadow: "0 6px 10px rgba(0, 0, 0, 0.08)",
              transform: "scale(1.02)",
            },
            organizationSwitcherTrigger__focus: {
              outline: "2px solid #6366f1", // Tailwind indigo-500
              outlineOffset: "2px",
            },
          },
        }}
      />

      <div className="space-y-1 w-full">
        <Button
          variant={favorites ? "ghost" : "secondary"}
          asChild
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Link href="/">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Team boards
          </Link>
        </Button>

        <Button
          variant={favorites ? "secondary" : "ghost"}
          asChild
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Link
            href={{
              pathname: "/",
              query: { favorites: true },
            }}
          >
            <Star className="h-4 w-4 mr-2" />
            Favourate boards
          </Link>
        </Button>
      </div>
    </div>
  );
};
