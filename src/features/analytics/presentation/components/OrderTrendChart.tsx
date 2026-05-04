"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { OrderAnalyticsDTO } from "@/features/analytics/domain/types/analytics.types";

type OrderTrendChartProps = {
  data: OrderAnalyticsDTO[];
};

export default function OrderTrendChart({ data }: OrderTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#15803d" name="Số đơn" />
        <Line type="monotone" dataKey="revenue" stroke="#0f766e" name="Doanh thu" />
      </LineChart>
    </ResponsiveContainer>
  );
}
