import { useEffect, useState } from 'react'
import './App.css'
import { MedianHomeValueChart } from './components/MedianHomeValueChart'
import { PriceToIncomeChart } from './components/PriceToIncomeChart'
import { RentToIncomeChart } from './components/RentToIncomeChart'
import { OwnerCostBurdenChart } from './components/OwnerCostBurdenChart'
import { FmrVsRentChart } from './components/FmrVsRentChart'

type AffordabilityMetric = {
  year: number
  geo_name: string
  median_household_income: number | null
  median_home_value: number | null
  median_gross_rent: number | null
  price_to_income: number | null
  rent_to_income: number | null
  owner_cost_burdened_share?: number | null
  hud_fmr_2br?: number | null
}

type AffordabilityDataset = {
  geographies: string[]
  metrics: AffordabilityMetric[]
}

function App() {
  const [data, setData] = useState<AffordabilityMetric[] | null>(null)
  const [geographies, setGeographies] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const res = await fetch('/data/housing_affordability_timeseries.json')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = (await res.json()) as AffordabilityDataset
        setData(json.metrics)
        setGeographies(json.geographies)
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return <main className="app-container">Loading housing affordability data…</main>
  }

  if (error) {
    return (
      <main className="app-container">
        <p style={{ color: 'red' }}>Error loading data: {error}</p>
      </main>
    )
  }

  if (!data || data.length === 0) {
    return <main className="app-container">No data available.</main>
  }

  return (
    <main className="app-container">
      <h1>Housing Affordability: Otter Tail vs Minneapolis</h1>
      <p>
        Data source: ACS 5-year estimates (2013–2023) for Fergus Falls, Otter Tail
        County, Minneapolis, and Hennepin County.
      </p>

      <section>
        <h2>How to read this page</h2>
        <p>
          This dashboard compares a rural county (Otter Tail and its hub city, Fergus
          Falls) with a major metro (Hennepin County and Minneapolis). The first chart
          shows how median home values have changed over time. The second and third
          charts translate those prices into affordability: how many years of income it
          takes to buy a median home, and what share of income goes to rent.
        </p>
        <p>
          In general, higher price-to-income and rent-to-income lines mean housing is
          less affordable for a typical household. This framing is designed to help
          county staff quickly see whether local households are more or less strained
          than peers in the Twin Cities.
        </p>
      </section>

      <section>
        <h2>Median Home Value Over Time</h2>
        <p>
          Comparing median home values across Fergus Falls, Otter Tail County, Minneapolis,
          and Hennepin County.
        </p>
        <MedianHomeValueChart data={data} geographies={geographies} />
      </section>

      <section>
        <h2>Price-to-Income Ratio</h2>
        <p>
          How many years of median household income it would take to buy the median home
          (higher values indicate less affordability).
        </p>
        <PriceToIncomeChart data={data} geographies={geographies} />
      </section>

      <section>
        <h2>Rent-to-Income Share</h2>
        <p>
          Share of median household income going to median gross rent (30%+ is typically
          considered cost-burdened).
        </p>
        <RentToIncomeChart data={data} geographies={geographies} />
      </section>

      <section>
        <h2>HUD Fair Market Rent vs Median Rent</h2>
        <p>
          Comparison of HUD&apos;s 2-bedroom Fair Market Rent (FMR) benchmarks to observed
          median gross rent. Where available, dashed lines show FMR and solid lines
          show ACS median rent for the same geography.
        </p>
        <FmrVsRentChart data={data} geographies={geographies} />
      </section>

      <section>
        <h2>Owner Households Cost-Burdened (30%+)</h2>
        <p>
          Approximate share of owner-occupied households spending at least 30% of income on
          housing costs. This is derived from ACS table B25091 by summing the 30%+ cost
          brackets and dividing by the total number of owner households.
        </p>
        <OwnerCostBurdenChart data={data} geographies={geographies} />
      </section>

      <section>
        <h2>Key takeaways for Otter Tail County</h2>
        <ul>
          <li>
            This view compares a rural hub (Fergus Falls and Otter Tail County) with a
            major metro benchmark (Minneapolis and Hennepin County), so staff can see at a
            glance whether local households are more or less strained than Twin Cities
            households.
          </li>
          <li>
            The price-to-income chart answers Can a typical household reasonably buy a
            median home here? by showing how many years of income it would take. Higher
            lines signal less affordable ownership.
          </li>
          <li>
            The rent-to-income chart focuses on renters. Values approaching or exceeding
            30% suggest cost-burdened renters and can help target renter support or
            affordable housing efforts.
          </li>
        </ul>
      </section>

      <section>
        <h2>Quick Peek (raw records)</h2>
        <p>
          Loaded {data.length} records for {geographies.length} geographies.
        </p>
        <pre className="data-preview">
          {JSON.stringify(data.slice(0, 8), null, 2)}
        </pre>
      </section>
    </main>
  )
}

export default App
