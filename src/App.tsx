import { useEffect, useState } from 'react'
import { MedianHomeValueChart } from './components/MedianHomeValueChart'
import { PriceToIncomeChart } from './components/PriceToIncomeChart'
import { RentToIncomeChart } from './components/RentToIncomeChart'
import { OwnerCostBurdenChart } from './components/OwnerCostBurdenChart'
import { FmrVsRentChart } from './components/FmrVsRentChart'
import { ProblemNarrative } from './components/ProblemNarrative'
import { LoadCheckNarrative } from './components/LoadCheckNarrative'
import { ExploreExplainNarrative } from './components/ExploreExplainNarrative'
import { NextStepsNarrative } from './components/NextStepsNarrative'
import { ExecutiveSummary } from './components/ExecutiveSummary'
import { InterviewQuestions } from './components/InterviewQuestions'
import { Navbar } from './components/Navbar'

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
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
          <p>Loading housing affordability data…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
          <p className="text-red-400">Error loading data: {error}</p>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">No data available.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-20 sm:pt-24">
        <section id="summary" className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Housing Affordability: Otter Tail vs Minneapolis
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Data source: ACS 5-year estimates (2013–2023) for Fergus Falls, Otter Tail
            County, Minneapolis, and Hennepin County, plus HUD Fair Market Rents where
            available.
          </p>
        </section>

        <section className="mb-8 sm:mb-10">
          <ExecutiveSummary />
        </section>

        <section id="problem-context" className="mb-8 sm:mb-10 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Problem &amp; Context</h2>
          <ProblemNarrative />
          <LoadCheckNarrative />
        </section>

        <section id="data-methods" className="mb-8 sm:mb-10">
          <h2 className="text-xl font-semibold tracking-tight">Data &amp; Methods</h2>
          <p className="mt-2 text-sm text-slate-200">
            This dashboard compares a rural county (Otter Tail and its hub city, Fergus
            Falls) with a major metro (Hennepin County and Minneapolis). The first chart
            shows how median home values have changed over time. The second and third
            charts translate those prices into affordability: how many years of income it
            takes to buy a median home, and what share of income goes to rent.
          </p>
          <p className="mt-2 text-sm text-slate-200">
            In general, higher price-to-income and rent-to-income lines mean housing is
            less affordable for a typical household. This framing is designed to help
            county staff and learners quickly see whether local households are more or
            less strained than peers in the Twin Cities.
          </p>
        </section>

        <section id="explore-explain" className="mb-8 sm:mb-10">
          <ExploreExplainNarrative />
        </section>
        <section id="results" className="mb-10">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Results</h2>
          <div className="space-y-10 sm:space-y-12">
            <section className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/40 p-3 sm:p-4">
              <h3 className="text-lg font-semibold tracking-tight sm:text-xl">Median Home Value Over Time</h3>
              <p className="mt-1 text-sm text-slate-200">
                Comparing median home values across Fergus Falls, Otter Tail County,
                Minneapolis, and Hennepin County to show how quickly prices have risen in
                each market.
              </p>
              <div className="mt-4 flex-1 min-h-[260px]">
                <MedianHomeValueChart data={data} geographies={geographies} />
              </div>
            </section>

            <section className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/40 p-3 sm:p-4">
              <h3 className="text-lg font-semibold tracking-tight sm:text-xl">Price-to-Income Ratio</h3>
              <p className="mt-1 text-sm text-slate-200">
                Shows how many years of median household income it would take to buy the
                median home. Higher values indicate less affordable homeownership for a
                typical household.
              </p>
              <div className="mt-4 flex-1 min-h-[240px]">
                <PriceToIncomeChart data={data} geographies={geographies} />
              </div>
            </section>

            <section className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/40 p-3 sm:p-4">
              <h3 className="text-lg font-semibold tracking-tight sm:text-xl">Rent-to-Income Share</h3>
              <p className="mt-1 text-sm text-slate-200">
                Share of median household income going to median gross rent. Values near
                or above 30% suggest cost-burdened renters who may need additional support
                or more affordable options.
              </p>
              <div className="mt-4 flex-1 min-h-[240px]">
                <RentToIncomeChart data={data} geographies={geographies} />
              </div>
            </section>

            <section className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/40 p-3 sm:p-4">
              <h3 className="text-lg font-semibold tracking-tight sm:text-xl">HUD Fair Market Rent vs Median Rent</h3>
              <p className="mt-1 text-sm text-slate-200">
                Compares HUD&apos;s 2-bedroom Fair Market Rent (FMR) benchmarks to observed
                median gross rent. Where available, dashed lines show FMR and solid lines
                show ACS median rent for the same geography.
              </p>
              <div className="mt-4 flex-1 min-h-[280px]">
                <FmrVsRentChart data={data} geographies={geographies} />
              </div>
            </section>

            <section className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/40 p-3 sm:p-4">
              <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                Owner Households Cost-Burdened (30%+)
              </h3>
              <p className="mt-1 text-sm text-slate-200">
                Approximate share of owner-occupied households spending at least 30% of
                income on housing costs, derived from ACS table B25091 by summing the
                30%+ cost brackets and dividing by the total number of owner households.
              </p>
              <div className="mt-4 flex-1 min-h-[240px]">
                <OwnerCostBurdenChart data={data} geographies={geographies} />
              </div>
            </section>
          </div>
        </section>

        <section
          id="next-steps"
          className="mb-10 rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5"
        >
          <NextStepsNarrative />
        </section>

        <section className="mt-10 space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-lg font-semibold tracking-tight">Key takeaways for Otter Tail County</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-200">
            <li>
              Otter Tail County and Fergus Falls still offer more affordable housing than
              Minneapolis and Hennepin County, especially for homeowners, but the gap has
              narrowed as rural prices and costs have risen.
            </li>
            <li>
              The ownership and rental ratios show that most local households are less
              stretched than their metro peers today, yet a meaningful share of both
              owners and renters still face cost burdens near or above the 30 percent
              threshold.
            </li>
            <li>
              Next steps for the county include pairing these high level trends with
              parcel, permitting, and mortgage data, along with local knowledge about
              zoning, employers, and short term rentals, to target policies where they
              will matter most.
            </li>
          </ul>
        </section>

        <section className="mt-10 space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5">
          <h2 className="text-lg font-semibold tracking-tight">For learners &amp; interview practice</h2>
          <section
            id="interview-questions"
            className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5"
          >
            <InterviewQuestions />
          </section>

          <section className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <h3 className="text-base font-semibold tracking-tight">Quick peek at raw records</h3>
            <p className="mt-1 text-sm text-slate-200">
              Loaded {data.length} records for {geographies.length} geographies.
            </p>
            <pre className="data-preview mt-3">
              {JSON.stringify(data.slice(0, 8), null, 2)}
            </pre>
          </section>
        </section>
      </main>
    </div>
  )
}

export default App
