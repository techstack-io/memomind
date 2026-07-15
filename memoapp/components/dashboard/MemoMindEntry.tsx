"use client";

import { useState } from "react";
import AgeGateModal from "./AgeGateModal";
import MemoMindOnboardingToDashboard from "./MemoMindOnboardingToDashboard";
import MemoMindDashboard from "./MemoMindDashboard";

/**
 * MemoMind entry point.
 *
 * Once the age gate is cleared, the real MemoMindDashboard renders
 * immediately underneath everything else — the onboarding wizard is a
 * blocking modal overlay on top of it (same pattern as AgeGateModal), not
 * a separate screen. That's why the dashboard is visible, dimmed, behind
 * the wizard: it's not a preview or a fake, it's the actual app already
 * mounted. Finishing the wizard just removes the overlay.
 *
 * NOTE: `ageConfirmed` and `onboarded` are only tracked in memory here for
 * the demo. In production, check both against the user's account on load
 * so returning users land straight on MemoMindDashboard without seeing
 * the age gate or wizard again — and persist each the moment it's set,
 * not just in local component state (see submitOnboardingConsent in
 * MemoMindOnboardingToDashboard.tsx for where that call should happen).
 */
export default function MemoMindEntry({ userName = "Dan" }: { userName?: string }) {
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  if (!ageConfirmed) {
    return <AgeGateModal onConfirm={() => setAgeConfirmed(true)} />;
  }

  return (
    <>
      <MemoMindDashboard userName={userName} />
      {!onboarded && (
        <MemoMindOnboardingToDashboard
          ageConfirmed={true}
          onFinish={() => setOnboarded(true)}
        />
      )}
    </>
  );
}
