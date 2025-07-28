"use client"
import Link from "next/link"
import Image from "next/image"
import { Poppins } from "next/font/google"
import { cn } from "@/lib/utils"
import { OrganizationSwitcher } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Star } from "lucide-react"
import { useSearchParams } from "next/navigation"

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
})

export const OrgSidebar = () => {
  const searchParams = useSearchParams()
  const favorites = searchParams.get("favorites")

  return (
    <div className="hidden lg:flex flex-col w-[280px] h-full bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200/60 shadow-sm">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-200/50">
        <Link href="/" className="block">
          <div className="flex items-center gap-x-4 group cursor-pointer">
            {/* Animated Logo */}
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="relative w-full h-full animate-fade-in-spin group-hover:animate-pulse">
                <Image
                  src="/LoadingLogo.svg"
                  alt="Logo"
                  fill
                  className="object-contain filter brightness-0 invert transition-transform duration-500"
                />
              </div>
            </div>
            {/* Brand Name */}
            <div className="flex flex-col">
              <span
                className={cn(
                  "text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105",
                  font.className,
                )}
              >
                BoardCollab
              </span>
              <span className="text-xs text-slate-500 font-medium">Collaborative Workspace</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Organization Switcher Section */}
      <div className="px-6 py-4">
        <div className="mb-2">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Organization</span>
        </div>
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
                padding: "12px 16px",
                width: "100%",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
                justifyContent: "space-between",
                color: "#334155",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
              },
              organizationSwitcherTrigger__hover: {
                backgroundColor: "#f1f5f9",
                borderColor: "#cbd5e1",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)",
                transform: "translateY(-1px)",
              },
              organizationSwitcherTrigger__focus: {
                outline: "2px solid #6366f1",
                outlineOffset: "2px",
                borderColor: "#6366f1",
              },
            },
          }}
        />
      </div>

      {/* Navigation Section */}
      <div className="flex-1 px-6 py-2">
        <div className="mb-4">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Navigation</span>
        </div>
        <div className="space-y-2">
          <Button
            variant="ghost"
            asChild
            size="lg"
            className={cn(
              "w-full justify-start px-4 py-3 h-auto font-medium text-sm transition-all duration-200 rounded-xl",
              !favorites
                ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200/50 shadow-sm hover:shadow-md hover:from-indigo-100 hover:to-purple-100"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            <Link href="/" className="flex items-center w-full">
              <div
                className={cn(
                  "p-1.5 rounded-lg mr-3 transition-colors",
                  !favorites ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-500",
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
              </div>
              <span>Team boards</span>
              {!favorites && <div className="ml-auto w-2 h-2 bg-indigo-500 rounded-full"></div>}
            </Link>
          </Button>

          <Button
            variant="ghost"
            asChild
            size="lg"
            className={cn(
              "w-full justify-start px-4 py-3 h-auto font-medium text-sm transition-all duration-200 rounded-xl",
              favorites
                ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200/50 shadow-sm hover:shadow-md hover:from-amber-100 hover:to-orange-100"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            <Link
              href={{
                pathname: "/",
                query: { favorites: true },
              }}
              className="flex items-center w-full"
            >
              <div
                className={cn(
                  "p-1.5 rounded-lg mr-3 transition-colors",
                  favorites ? "bg-amber-100 text-amber-600" : "bg-slate-200 text-slate-500",
                )}
              >
                <Star className="h-4 w-4" />
              </div>
              <span>Favourite boards</span>
              {favorites && <div className="ml-auto w-2 h-2 bg-amber-500 rounded-full"></div>}
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer Section */}
      <div className="p-6 border-t border-slate-300 bg-slate-50">
        <div className="flex items-center justify-center">
          <div className="text-sm text-slate-500 font-semibold select-none">
            Made with <span className="text-red-500">❤️</span> by Sulabh Ambule
          </div>
        </div>
      </div>
    </div>
  )
}
