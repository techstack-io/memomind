"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

function SendFoxEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const script = document.createElement("script");
    script.src = "https://cdn.sendfox.com/js/embed.js";
    script.async = true;
    script.setAttribute("data-form", "3l9n4v");
    script.setAttribute("data-api", "https://sendfox.com");
    containerRef.current.appendChild(script);
  }, []);

  return <div ref={containerRef} className="w-full max-w-sm" />;
}

export default function WaitlistEntry() {
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  return (
    <main className="min-h-screen bg-memo-50 text-memo-900">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center">
        <div className="flex min-w-0 items-center gap-2">
          <Image
            src="/memomind-logo@72x.svg"
            alt="mettavia"
            width={40}
            height={40}
            priority
          />

          <span className="truncate font-heading text-lg font-bold text-memo-neutral-900 sm:text-3xl">
            mettavia
          </span>

          <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 inset-ring inset-ring-gray-500/10">
            Coming Soon
          </span>
        </div>

        <h1 className="mt-10 font-[Cormorant_Garamond] text-4xl leading-tight text-memo-900 sm:text-4xl">
          Are you ready to train your mind?
        </h1>
        <p className="mt-5 max-w-md font-[Lora] text-lg text-memo-connection-700">
          mettavia is a reflective AI companion inspired by Lojong, the Tibetan Buddhist practice of training the mind through compassion, awareness, and everyday experience.
        </p>
        <h2 className="mt-10 font-[Cormorant_Garamond] text-2xl leading-tight text-memo-900 sm:text-2xl">
          Join the waitlist and begin training your mind.
        </h2>

        <div className="mt-16 flex w-full flex-col items-center gap-4">
          <SendFoxEmbed />

          <label className="flex max-w-sm items-start gap-2 text-left font-[Manrope] text-xs text-memo-connection-600">
            <input
              type="checkbox"
              checked={ageConfirmed}
              onChange={(e) => setAgeConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-memo-connection-300"
            />
            I confirm I&apos;m 18 or older.
          </label>
        </div>

        <p className="mt-20 max-w-sm font-[Manrope] text-xs text-memo-connection-500">
          What you write stays yours — you can review, edit, or delete
          any of it at any time.
        </p>
      </div>
    </main>
  );
}