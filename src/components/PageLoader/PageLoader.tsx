import { Loader } from "@/components/Loader";

export const PageLoader = () => {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-white/70 z-9999">
      <Loader />
    </div>
  );
};