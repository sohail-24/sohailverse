import { useState } from "react";
import { profile } from "../../data/profile";

interface BrandAvatarProps {
  className?: string;
  sizeClassName?: string;
}

export default function BrandAvatar({
  className = "",
  sizeClassName = "w-7 h-7 sm:w-8 sm:h-8",
}: BrandAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const avatarSrc = profile.avatarUrl?.trim();
  const showImage = Boolean(avatarSrc) && !imageFailed;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full border border-lime-400/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-[0_0_10px_rgba(163,230,53,0.12)] overflow-hidden group-hover:border-lime-400/60 group-hover:shadow-[0_0_14px_rgba(163,230,53,0.25)] transition-all duration-200 ${sizeClassName} ${className}`}
      aria-hidden="true"
    >
      {showImage ? (
        <img
          src={avatarSrc}
          alt={profile.name || "Sohail"}
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className="font-display font-black text-[11px] sm:text-xs text-lime-400 select-none tracking-wider flex items-center justify-center leading-none"
        >
          S
        </span>
      )}
    </div>
  );
}
