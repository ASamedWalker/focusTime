// src/components/common/Typography.tsx
import React from "react";
import { Text } from "react-native";
import { cn } from "../../lib/utils";

interface TypographyProps {
  variant?: "display" | "h1" | "h2" | "h3" | "body" | "caption"; // Added 'display' variant
  weight?: "normal" | "medium" | "semibold" | "bold";
  children: React.ReactNode;
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  weight = "normal",
  children,
  className,
}) => {
  const variantClasses = {
    display: "text-5xl leading-none", 
    h1: "text-4xl leading-tight",
    h2: "text-2xl leading-tight",
    h3: "text-xl leading-snug",
    body: "text-base leading-normal",
    caption: "text-sm leading-normal",
  };

  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  return (
    <Text
      className={cn(variantClasses[variant], weightClasses[weight], className)}
    >
      {children}
    </Text>
  );
};
