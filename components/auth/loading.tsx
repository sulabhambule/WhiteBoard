import Image from "next/image";

export const Loading = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-background">
      <div className="relative">
        <Image
          src="/LoadingLogo.svg"
          alt="Loading Logo"
          width={100}
          height={100}
          className="animate-spin-slow drop-shadow-xl"
          priority
        />
        <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse-blur" />
      </div>
      <p className="mt-6 text-muted-foreground animate-pulse text-sm tracking-wide">
        Loading, please wait...
      </p>
    </div>
  );
};
