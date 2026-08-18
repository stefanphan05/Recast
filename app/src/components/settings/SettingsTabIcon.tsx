import {
  AiBrain01Icon,
  CommandIcon,
  Settings02Icon,
  SlidersHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

type SettingsTabIconProps = {
  section: "general" | "models" | "shortcuts" | "modes";
};

const ICONS: Record<SettingsTabIconProps["section"], IconSvgElement> = {
  general: Settings02Icon,
  models: AiBrain01Icon,
  shortcuts: CommandIcon,
  modes: SlidersHorizontalIcon,
};

/** Strokes are `currentColor`, so the tab button owns the active/idle color. */
export default function SettingsTabIcon({ section }: SettingsTabIconProps) {
  return (
    <span
      aria-hidden
      className="inline-flex size-6 shrink-0 items-center justify-center"
    >
      <HugeiconsIcon icon={ICONS[section]} size={22} strokeWidth={1.7} />
    </span>
  );
}
