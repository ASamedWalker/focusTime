// src/components/stats/FocusChart.tsx
import React from 'react';
import { View, Dimensions } from 'react-native';
import { Typography, Card } from '../../components/common';
import Svg, { Rect, Text, Line } from 'react-native-svg';

interface ChartData {
  day: string;
  minutes: number;
}

interface FocusChartProps {
  data: ChartData[];
}

export const FocusChart: React.FC<FocusChartProps> = ({ data }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 80; // Account for card padding
  const chartHeight = 160;
  const paddingBottom = 30;
  const paddingLeft = 35;
  const paddingRight = 20;

  const maxMinutes = Math.max(...data.map(d => d.minutes));
  const barWidth = (chartWidth - paddingLeft) / data.length - 8;

  const getY = (minutes: number) => {
    return ((chartHeight - paddingBottom) * (1 - minutes / maxMinutes));
  };

  return (
    <Card className="bg-[#1E1E1E] p-6 rounded-2xl border border-[#2A2A2A]">
      <Typography variant="h3" weight="semibold" className="text-white mb-4">
        Weekly Focus Time
      </Typography>

      <View>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Y-axis */}
          <Line
            x1={paddingLeft}
            y1={0}
            x2={paddingLeft}
            y2={chartHeight - paddingBottom}
            stroke="#374151"
            strokeWidth="1"
          />

          {/* X-axis */}
          <Line
            x1={paddingLeft}
            y1={chartHeight - paddingBottom}
            x2={chartWidth}
            y2={chartHeight - paddingBottom}
            stroke="#374151"
            strokeWidth="1"
          />

          {/* Bars */}
          {data.map((d, i) => {
            const barHeight = chartHeight - paddingBottom - getY(d.minutes);
            const x = paddingLeft + (i * ((chartWidth - paddingLeft) / data.length)) + 4;
            const y = getY(d.minutes);

            return (
              <React.Fragment key={i}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="#3B82F6"
                  rx={4}
                />
                <Text
                  x={x + (barWidth / 2)}
                  y={chartHeight - 10}
                  fill="#9CA3AF"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {d.day}
                </Text>
              </React.Fragment>
            );
          })}

          {/* Y-axis labels */}
          {[0, maxMinutes / 2, maxMinutes].map((value, i) => (
            <Text
              key={i}
              x={paddingLeft - 10}
              y={getY(value) + 5}
              fill="#9CA3AF"
              fontSize="12"
              textAnchor="end"
            >
              {Math.round(value)}
            </Text>
          ))}
        </Svg>
      </View>
    </Card>
  );
};