import Image from "next/image";

export default function LandscapePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F3EEE5]">
      <div className="relative h-[88vh] w-[82vw] -translate-x-8">
        <Image
          src="/landscape/hero.jpeg"
          alt=""
          fill
          priority
          sizes="75vw"
          className="object-contain"
        />
      </div>
    </main>
  );
}