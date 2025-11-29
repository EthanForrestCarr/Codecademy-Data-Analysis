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

export function FmrVsRentChart({ data, geographies }: Props) {
  const years = Array.from(new Set(data.map((d) => d.year))).sort((a, b) => a - b)

  const series = years.map((year) => {
    const row: Record<string, number | null | number> = { year }
    for (const geo of geographies) {
      const match = data.find((d) => d.year === year && d.geo_name === geo)
      row[`${geo} - FMR 2BR`] = match?.hud_fmr_2br ?? null
      row[`${geo} - Median Rent`] = match?.median_gross_rent ?? null
    }
    return row
  })

  const colors = ['#2563eb', '#16a34a', '#f97316', '#dc2626', '#7c3aed', '#0d9488']

  const shortNames: Record<string, string> = {
    'Fergus Falls city, Minnesota': 'Fergus Falls',
    'Otter Tail County, Minnesota': 'Otter Tail Co.',
    'Minneapolis city, Minnesota': 'Minneapolis',
    'Hennepin County, Minnesota': 'Hennepin Co.',
  }

  return (
    <ResponsiveContainer width="100%" height={380}>
      <LineChart data={series} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={(v) => (v == null ? '' : v.toLocaleString())} />
        <Tooltip
          formatter={(value: any, name: string) =>
            typeof value === 'number'
              ? [
                  value.toLocaleString(undefined, { maximumFractionDigits: 0 }),
                  name,
                ]
              : [value, name]
          }
        />
        <Legend />
        {geographies.map((geo, index) => (
          <>
            <Line
              key={`${geo}-fmr`}
              type="monotone"
              dataKey={`${geo} - FMR 2BR`}
              name={`${shortNames[geo] ?? geo} – HUD FMR 2BR`}
              stroke={colors[index % colors.length]}
              dot={false}
              strokeDasharray="5 2"
              connectNulls
            />
            <Line
              key={`${geo}-rent`}
              type="monotone"
              dataKey={`${geo} - Median Rent`}
              name={`${shortNames[geo] ?? geo} – Median Rent`}
              stroke={colors[index % colors.length]}
              dot={false}
              connectNulls
            />
          </>
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
