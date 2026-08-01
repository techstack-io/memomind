import Image from "next/image";

export default function LandscapePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F3EEE5]">
      <Image
        src="/landscape/hero.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
    </main>
  );
}