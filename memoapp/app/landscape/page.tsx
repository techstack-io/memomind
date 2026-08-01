import Image from "next/image";

export default function LandscapePage() {
  return (
    <main className="relative flex min-h-screen items-start justify-center overflow-hidden bg-[#F3EEE5] pt-8">
      <div className="relative h-[90vh] w-[84vw] -translate-x-6">
        <Image
          src="/landscape/tree-trans.jpeg"
          alt=""
          fill
          priority
          sizes="84vw"
          className="object-contain"
        />
      </div>
    </main>
  );
}