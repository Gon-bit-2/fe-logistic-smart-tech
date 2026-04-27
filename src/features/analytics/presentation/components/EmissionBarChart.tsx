"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type EmissionBarChartProps = {
  data: any[];
};

export default function EmissionBarChart({ data }: EmissionBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="co2Emitted" fill="#dc2626" name="CO2 phát thải" radius={[6, 6, 0, 0]} />
        <Bar dataKey="co2Saved" fill="#16a34a" name="CO2 tiết kiệm" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
