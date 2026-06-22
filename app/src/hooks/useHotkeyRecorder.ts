"use client";

import {
  DEFAULT_GLOBAL_HOTKEY,
  keyboardEventToAccelerator,
} from "@/lib/hotkey";
import { useCallback, useEffect, useState } from "react";

const HOTKEY_UNAVAILABLE_ERROR =
  "That shortcut is unavailable. Please try a different combination.";

export function useHotkeyRecorder(initialHotkey = DEFAULT_GLOBAL_HOTKEY) {
  const [hotkey, setHotkey] = useState(initialHotkey);
  const [recording, setRecording] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [conflictHotkey, setConflictHotkey] = useState<string | null>(null);

  useEffect(() => {
    setHotkey(initialHotkey);
  }, [initialHotkey]);

  const clearFeedback = useCallback(() => {
    setErrorMessage(null);
    setSaved(false);
    setConflictHotkey(null);
  }, []);

  const startRecording = useCallback(() => {
    setRecording(true);
    clearFeedback();
    void window.electronAPI?.beginHotkeyRecording?.();
  }, [clearFeedback]);

  const stopRecording = useCallback(() => {
    setRecording(false);
    void window.electronAPI?.endHotkeyRecording?.();
  }, []);

  const applyHotkey = useCallback(
    async (accelerator: string, errorFallback = HOTKEY_UNAVAILABLE_ERROR) => {
      setSaving(true);
      clearFeedback();

      const result = await window.electronAPI?.setHotkey(accelerator);
      setSaving(false);
      void window.electronAPI?.endHotkeyRecording?.();

      if (!result?.ok) {
        setConflictHotkey(accelerator);
        setErrorMessage(result?.error ?? errorFallback);
        return false;
      }

      setHotkey(result.accelerator ?? accelerator);
      setSaved(true);
      return true;
    },
    [clearFeedback],
  );

  const saveHotkey = useCallback(
    (accelerator: string) => applyHotkey(accelerator),
    [applyHotkey],
  );

  const restoreDefault = useCallback(async () => {
    if (hotkey === DEFAULT_GLOBAL_HOTKEY) {
      clearFeedback();
      return true;
    }

    setRecording(false);
    return applyHotkey(
      DEFAULT_GLOBAL_HOTKEY,
      "Could not restore default shortcut.",
    );
  }, [hotkey, clearFeedback, applyHotkey]);

  const handleKeyDown = useCallback(
    async (event: KeyboardEvent) => {
      if (!recording) return;

      event.preventDefault();
      event.stopPropagation();

      if (event.key === "Escape") {
        stopRecording();
        return;
      }

      const accelerator = keyboardEventToAccelerator(event);
      if (!accelerator) return;

      setRecording(false);
      await saveHotkey(accelerator);
    },
    [recording, saveHotkey, stopRecording],
  );

  useEffect(() => {
    if (!recording) return;

    const unsubscribeCaptured = window.electronAPI?.onHotkeyCaptured?.(
      (accelerator) => {
        setRecording(false);
        void saveHotkey(accelerator);
      },
    );

    const unsubscribeCancelled =
      window.electronAPI?.onHotkeyRecordingCancelled?.(() => {
        stopRecording();
      });

    return () => {
      unsubscribeCaptured?.();
      unsubscribeCancelled?.();
    };
  }, [recording, saveHotkey, stopRecording]);

  useEffect(() => {
    if (!recording || window.electronAPI?.onHotkeyCaptured) return;

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [recording, handleKeyDown]);

  useEffect(() => {
    return () => {
      void window.electronAPI?.endHotkeyRecording?.();
    };
  }, []);

  return {
    hotkey,
    conflictHotkey,
    recording,
    saving,
    errorMessage,
    saved,
    startRecording,
    stopRecording,
    restoreDefault,
  };
}
