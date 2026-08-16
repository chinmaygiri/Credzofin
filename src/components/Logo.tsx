import React from "react";

interface LogoProps {
  className?: string;
  variant?: "blue" | "white" | "dark";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
}

export const CredzoIcon: React.FC<{ className?: string; color?: string }> = ({
  className = "w-10 h-10",
  color = "#0038D1",
}) => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Credzo Icon"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 152 38
           C 137 23 117 14 95 14
           C 50.3 14 14 50.3 14 95
           C 14 139.7 50.3 176 95 176
           C 109 176 122 172 133 164.5
           L 162 135.5
           L 182 155.5
           L 182 90
           L 116.5 90
           L 136.5 110
           L 114 132.5
           C 108.5 136.5 102 138.5 95 138.5
           C 71 138.5 51.5 119 51.5 95
           C 51.5 71 71 51.5 95 51.5
           C 107 51.5 118 56.5 126 64
           L 152 38 Z"
        fill={color}
      />
    </svg>
  );
};

export const CredzoFullLogoSvg: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = "h-10 w-auto", color = "#0038D1" }) => {
  return (
    <svg
      viewBox="0 0 530 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Credzo Finance Official Logo"
    >
      {/* 1. Left Emblem: Thicker & bolder matching LOGO.jpg */}
      <g transform="translate(6, 6) scale(0.66)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M 152 38
             C 137 23 117 14 95 14
             C 50.3 14 14 50.3 14 95
             C 14 139.7 50.3 176 95 176
             C 109 176 122 172 133 164.5
             L 162 135.5
             L 182 155.5
             L 182 90
             L 116.5 90
             L 136.5 110
             L 114 132.5
             C 108.5 136.5 102 138.5 95 138.5
             C 71 138.5 51.5 119 51.5 95
             C 51.5 71 71 51.5 95 51.5
             C 107 51.5 118 56.5 126 64
             L 152 38 Z"
          fill={color}
        />
      </g>

      {/* 2. Vertical Line Divider */}
      <rect x="146" y="16" width="3.5" height="108" rx="1.75" fill={color} />

      {/* 3. Perfectly Aligned & Spaced Wordmark: CREDZO (Unchanged) */}
      <text
        x="174"
        y="78"
        fill={color}
        fontSize="65"
        fontWeight="900"
        textLength="336"
        lengthAdjust="spacing"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Montserrat', 'Inter', 'Segoe UI', Roboto, sans-serif"
      >
        CREDZO
      </text>

      {/* 4. Sub-tagline: — FINANCE — (Unchanged) */}
      {/* Left Dash */}
      <rect x="174" y="106" width="46" height="3" rx="1.5" fill={color} />

      {/* Centered FINANCE Text */}
      <text
        x="342"
        y="113"
        textAnchor="middle"
        fill={color}
        fontSize="17"
        fontWeight="800"
        textLength="192"
        lengthAdjust="spacing"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Montserrat', 'Inter', 'Segoe UI', Roboto, sans-serif"
      >
        FINANCE
      </text>

      {/* Right Dash */}
      <rect x="464" y="106" width="46" height="3" rx="1.5" fill={color} />
    </svg>
  );
};

export const CredzoLogo: React.FC<LogoProps> = ({
  className = "",
  variant = "blue",
  size = "md",
}) => {
  const primaryColor =
    variant === "white"
      ? "#ffffff"
      : variant === "dark"
      ? "#0f172a"
      : "#0038D1"; // Official Royal Blue (#0038D1)

  const sizeClasses = {
    sm: "h-7 md:h-8",
    md: "h-9 md:h-11",
    lg: "h-12 md:h-14",
    xl: "h-16 md:h-20",
  }[size];

  return (
    <div className={`inline-flex items-center select-none bg-transparent ${className}`}>
      <CredzoFullLogoSvg
        className={`${sizeClasses} w-auto max-w-full`}
        color={primaryColor}
      />
    </div>
  );
};

export default CredzoLogo;


