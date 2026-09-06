import type React from "react";

export const LogoIcon = (props: React.ComponentProps<"svg">) => (
  <svg viewBox="0 0 96 96" className={`shrink-0 `} aria-hidden="true">
    <rect x="20" y="10" width="13" height="86" rx="4" fill="currentColor" />
    <path d="M33,14 H55 A16,16 0 0 1 55,46 H33 Z" fill="currentColor" />
    <path d="M33,50 H61 A21,21 0 0 1 61,92 H33 Z" fill="currentColor" />
    <rect x="37" y="23" width="22" height="6" rx="3" fill="#B98A3A" />
  </svg>
);

export const Logo = (props: React.ComponentProps<"svg">) => (
  <div className="flex items-center justify-center">
    <svg viewBox="0 0 96 96" className={`shrink-0`} aria-hidden="true">
      <rect x="20" y="10" width="13" height="86" rx="4" fill="currentColor" />
      <path d="M33,14 H55 A16,16 0 0 1 55,46 H33 Z" fill="currentColor" />
      <path d="M33,50 H61 A21,21 0 0 1 61,92 H33 Z" fill="currentColor" />
      <rect x="37" y="23" width="22" height="6" rx="3" fill="#B98A3A" />
    </svg>
    <span className="text-lg font-bold">Balotiq</span>
  </div>
);
