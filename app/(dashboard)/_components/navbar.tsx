"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { SearchInput } from "./search-input";
import { InviteButton } from "./invite-button";
import { useOrganization } from "@clerk/nextjs";

export const Navbar = () => {
  const {organization} = useOrganization();
  return (
    <div className="flex items-center gap-x-4 p-5">
      <div className="hidden lg:flex lg:flex-1">
        <SearchInput />
      </div>
      <div className="block lg:hidden flex-1">
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                maxWidth: "376px"
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

      </div>
      {organization && (<InviteButton/>)}
      <UserButton />
    </div>
  )
}