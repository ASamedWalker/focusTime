// src/components/common/Surface.tsx
import React from "react";
import { View } from "react-native";
import { cn } from "../../lib/utils";

interface SurfaceProps {
  children: React.ReactNode;
  className?: string;
}

export const Surface: React.FC<SurfaceProps> = ({ children, className }) => {
  return <View className={cn("flex-1 bg-slate-900", className)}>{children}</View>;
};
