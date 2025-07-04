import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";
import Image from "next/image";

export const EmptyOrg = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src="/elements.svg"
        alt="Empty"
        height={300}
        width={300}
      />
      <h2 className="text-2xl font-semibold mt-6">
        Welcome to the BoardCollab
      </h2>

      <p className="text-muted-foreground text-sm mt-2">
        Create an organization to get started
      </p>

      <div className="mt-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg">
              Create organization
            </Button>
          </DialogTrigger>
          <DialogContent className="p-6 bg-white rounded-2xl shadow-xl w-[480px]">
            <DialogTitle></DialogTitle>
            <CreateOrganization />
          </DialogContent>
        </Dialog>
      </div>

    </div>

  );
};