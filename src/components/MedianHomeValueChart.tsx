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

export type AffordabilityMetric = {
  year: number
  geo_name: string
  median_household_income: number | null
  median_home_value: number | null
  median_gross_rent: number | null
  price_to_income: number | null
  rent_to_income: number | null
  hud_fmr_2br?: number | null
}

interface Props {
  data: AffordabilityMetric[]
  geographies: string[]
}

export function MedianHomeValueChart({ data, geographies }: Props) {
  const years = Array.from(new Set(data.map((d) => d.year))).sort((a, b) => a - b)

  const series = years.map((year) => {
    const row: Record<string, number | null | number> = { year }
    for (const geo of geographies) {
      const match = data.find((d) => d.year === year && d.geo_name === geo)
      row[geo] = match?.median_home_value ?? null
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
    <ResponsiveContainer width="100%" height={380}>
      <LineChart data={series} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={(v) => (v == null ? '' : v.toLocaleString())} />
        <Tooltip
          formatter={(value: any) =>
            typeof value === 'number'
              ? value.toLocaleString(undefined, { maximumFractionDigits: 0 })
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
