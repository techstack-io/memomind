"use client";

import { useEffect, useState } from "react";
import AgeGateModal from "./AgeGateModal";
import MemoMindDashboard from "./MemoMindDashboard";

const AGE_CONFIRMED_KEY = "memomind_age_confirmed";

type MemoMindEntryProps = {
  userName?: string;
};

export default function MemoMindEntry({
  userName = "Dan",
}: MemoMindEntryProps) {
  const [storageChecked, setStorageChecked] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  useEffect(() => {
    try {
      const savedAgeConfirmation =
        window.localStorage.getItem(AGE_CONFIRMED_KEY) === "true";

      setAgeConfirmed(savedAgeConfirmation);
    } catch (error) {
      console.error("Unable to read MemoMind state:", error);
    } finally {
      setStorageChecked(true);
    }
  }, []);

  const handleAgeConfirmation = () => {
    try {
      window.localStorage.setItem(AGE_CONFIRMED_KEY, "true");
    } catch (error) {
      console.error("Unable to save age confirmation:", error);
    }

    setAgeConfirmed(true);
  };

  if (!storageChecked) {
    return null;
  }

  if (!ageConfirmed) {
    return <AgeGateModal onConfirm={handleAgeConfirmation} />;
  }

  return <MemoMindDashboard userName={userName} />;
}