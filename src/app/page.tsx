import { HomeForm } from "@/components/HomeForm";

export default function Home() {
  return (
    <div className="font-sans items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
      <main className="w-full flex flex-col gap-2 row-start-2 items-center h-full justify-center">
        <HomeForm />
      </main>
    </div>
  );
}
