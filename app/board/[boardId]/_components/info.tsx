"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import Link from "next/link";
import { Hint } from "@/components/hints";
import { uesRenameModal } from "@/store/use-rename-modal";

interface InfoProps {
  boardId: string;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const Info = ({
  boardId
}: InfoProps) => {
  const { onOpen } = uesRenameModal();

  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  })

  if (!data) {
    return <InfoSkeleton />
  }

  const TabSeparator = () => {
    return (
      <div className="text-neutral-300 px-1.5 mb-1">
        |
      </div>
    )
  }

  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center justify-center shadow-md">
      <Hint label="Go to the boards" side="bottom" sideOffset={10}>
        <Button asChild variant="board" className="px-2">
          <Link href="/">
            <Image
              src="/LoadingLogo.svg"
              alt="BoardCollab Logo"
              height={50}
              width={40}
            />
            <span
              className={cn(
                "text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent transition duration-300 group-hover:scale-105",
                font.className
              )}
            >
              BoardCollab
            </span>
          </Link>
        </Button>
      </Hint>
      <TabSeparator />
      <Button
        onClick={() => onOpen(data._id, data.title)}
        variant="board"
        className="text-base font-normal px-2"
      >
        {data.title}
      </Button>
    </div >
  );
}

export const InfoSkeleton = () => {
  return (
    <div
      className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px]"
    >
    </div>
  )
}