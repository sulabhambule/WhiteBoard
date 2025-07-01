"use client";;

import {Plus} from "lucide-react";
import { CreateOrganization } from "@clerk/nextjs";
import { Dialog, DialogTitle, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Hint } from "@/components/hints";

export const NewButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild> 
        <div className="aspect-square mt-4">
          <Hint 
            label="Create Organization"
            side="right"
            align="start"
            sideOffset={18}
          >
            <button className="bg-white/25 h-full w-full rounded-md flex items-center justify-center opacity-60 hover:opacity-100 transition">
            <Plus className="text-white" />
            </button>
          </Hint>
        </div>
      </DialogTrigger> 
      <DialogContent className="flex max-w-[480px]">
         <DialogTitle></DialogTitle>
        <CreateOrganization/>
      </DialogContent>
    </Dialog>
  );
};
