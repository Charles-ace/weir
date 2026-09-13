import React from "react";

interface WeirLogoProps {
  className?: string;
  size?: number;
}

/**
 * 2D Geometric Vector Logo for WEIR Protocol
 * Features precision dual cobalt chutes with a central hydraulic weir crest.
 * 100% 2D flat vector with zero drop-shadow or blur.
 */
export default function WeirLogo({ className = "w-6 h-6", size }: WeirLogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
    >
      <rect width="32" height="32" rx="7" fill="#141414" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="6.5" stroke="#262626" />
      {/* Left Chute (Cobalt) */}
      <path d="M7 8H11.5L14.5 20L12 24L7 8Z" fill="#3773FF" />
      {/* Center Inverted Weir Apex (Pure Stark White) */}
      <path d="M16 11L19.5 21L16 25L12.5 21L16 11Z" fill="#FFFFFF" />
      {/* Right Chute (Cobalt) */}
      <path d="M25 8H20.5L17.5 20L20 24L25 8Z" fill="#3773FF" />
    </svg>
  );
}
