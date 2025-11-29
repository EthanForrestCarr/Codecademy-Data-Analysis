import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

import type { AffordabilityMetric } from './MedianHomeValueChart'

interface Props {
  data: AffordabilityMetric[]
  geographies: string[]
}

export function RentToIncomeChart({ data, geographies }: Props) {
  const years = Array.from(new Set(data.map((d) => d.year))).sort((a, b) => a - b)

  const series = years.map((year) => {
    const row: Record<string, number | null | number> = { year }
    for (const geo of geographies) {
      const match = data.find((d) => d.year === year && d.geo_name === geo)
      row[geo] = match?.rent_to_income ?? null
    }
    return row
  })

  const colors = ['#2563eb', '#16a34a', '#f97316', '#dc2626', '#7c3aed', '#0d9488']

  const shortNames: Record<string, string> = {
    'Fergus Falls city, Minnesota': 'Fergus Falls (city)',
    'Otter Tail County, Minnesota': 'Otter Tail (county)',
    'Minneapolis city, Minnesota': 'Minneapolis (city)',
    'Hennepin County, Minnesota': 'Hennepin (county)',
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={series} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={(v) => (v == null ? '' : (v * 100).toFixed(0) + '%')} />
        <Tooltip
          formatter={(value: any) =>
            typeof value === 'number'
              ? (value * 100).toFixed(1) + '%'
              : value
          }
        />
        <Legend />
        {geographies.map((geo, index) => (
          <Line
            key={geo}
            type="monotone"
            dataKey={geo}
            name={shortNames[geo] ?? geo}
            stroke={colors[index % colors.length]}
            dot={false}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
