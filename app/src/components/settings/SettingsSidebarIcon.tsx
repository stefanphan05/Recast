import { FaWandMagicSparkles } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import { LuCommand } from "react-icons/lu";
import type { IconType } from "react-icons";

type SettingsSidebarIconProps = {
  section: "general" | "ai" | "shortcuts";
};

const ICONS: Record<
  SettingsSidebarIconProps["section"],
  { background: string; Icon: IconType }
> = {
  general: {
    background: "linear-gradient(180deg, #b4b4b9 0%, #8a8a8f 100%)",
    Icon: IoSettingsSharp,
  },
  ai: {
    background: "linear-gradient(180deg, #cb8cff 0%, #9b59f5 100%)",
    Icon: FaWandMagicSparkles,
  },
  shortcuts: {
    background: "linear-gradient(180deg, #e06cff 0%, #b030e0 100%)",
    Icon: LuCommand,
  },
};

export default function SettingsSidebarIcon({
  section,
}: SettingsSidebarIconProps) {
  const { background, Icon } = ICONS[section];

  return (
    <span
      aria-hidden
      className="inline-flex size-[26px] shrink-0 items-center justify-center rounded-[7px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_1px_rgba(0,0,0,0.08)]"
      style={{ background }}
    >
      <Icon className="size-3.5" />
    </span>
  );
}
