// src/components/common/FeatureCard.tsx
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Typography } from "./Typography";
import { Badge } from "./Badge";
import { cn } from "../../lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  isPremium?: boolean;
  onPress?: () => void;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  subtitle,
  isPremium,
  onPress,
  className,
}) => {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      className={cn(
        "p-4 border border-dashed border-[#333333] rounded-xl",
        className
      )}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          {icon}
          <View className="ml-3">
            <Typography className="text-white" weight="medium">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" className="text-gray-400">
                {subtitle}
              </Typography>
            )}
          </View>
        </View>
        {isPremium && <Badge label="Premium" variant="premium" />}
      </View>
    </Component>
  );
};
