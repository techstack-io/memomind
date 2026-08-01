import Image from "next/image";

export default function LandscapePage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#efe4d3]">
      <Image
        src="/landscape/mettavia-landscape.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#fff3dc]/20 via-transparent to-[#4a3928]/10" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_62%_28%,rgba(255,236,183,0.38),transparent_30%)]" />
    </main>
  );
}