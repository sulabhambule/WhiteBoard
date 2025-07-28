"use client"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { useQuery } from "convex/react"
import { Hint } from "@/components/hints"
import { Poppins } from "next/font/google"
import { api } from "@/convex/_generated/api"
import { Actions } from "@/components/actions"
import { Button } from "@/components/ui/button"
import type { Id } from "@/convex/_generated/dataModel"
import { uesRenameModal } from "@/store/use-rename-modal"

interface InfoProps {
  boardId: string
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
})

export const Info = ({ boardId }: InfoProps) => {
  const { onOpen } = uesRenameModal()
  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  })

  if (!data) {
    return <InfoSkeleton />
  }

  const TabSeparator = () => {
    return (
      <div className="flex items-center justify-center h-6 mx-2">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-slate-300 to-transparent opacity-60"></div>
      </div>
    )
  }

  return (
    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl px-2 h-14 flex items-center justify-center shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
      <Hint label="Go to the boards" side="bottom" sideOffset={10}>
        <Button
          asChild
          variant="ghost"
          className="px-3 py-2 h-auto rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group"
        >
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <Image
                src="/LoadingLogo.svg"
                alt="BoardCollab Logo"
                fill
                className="object-contain filter brightness-0 invert"
              />
            </div>
            <span
              className={cn(
                "text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105",
                font.className,
              )}
            >
              BoardCollab
            </span>
          </Link>
        </Button>
      </Hint>

      <TabSeparator />

      <Hint label="Edit title" side="bottom" sideOffset={10}>
        <Button
          onClick={() => onOpen(data._id, data.title)}
          variant="ghost"
          className="text-base font-semibold px-4 py-2 h-auto rounded-xl text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:text-slate-900 transition-all duration-200 max-w-[200px] truncate border border-transparent hover:border-slate-200/50"
        >
          <span className="truncate">{data.title}</span>
        </Button>
      </Hint>

      <TabSeparator />

      <Actions id={data._id} title={data.title} side="bottom" sideOffset={10}>
        <div>
          <Hint label="Main menu" side="bottom" sideOffset={10}>
            <Button
              size="icon"
              variant="ghost"
              className="w-10 h-10 rounded-xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 transition-all duration-200 text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200/50 hover:shadow-md"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </Hint>
        </div>
      </Actions>
    </div>
  )
}

export const InfoSkeleton = () => {
  return (
    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl px-2 h-14 flex items-center shadow-lg border border-slate-200/50 w-[320px]">
      <div className="flex items-center gap-3 px-3">
        {/* Logo skeleton */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse"></div>
        {/* Brand name skeleton */}
        <div className="h-5 w-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md animate-pulse"></div>
      </div>

      <div className="flex items-center justify-center h-6 mx-2">
        <div className="w-px h-full bg-slate-200 opacity-60"></div>
      </div>

    </div>
  )
}
