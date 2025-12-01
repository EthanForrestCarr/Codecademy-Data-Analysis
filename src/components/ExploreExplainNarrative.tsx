export function ExploreExplainNarrative() {
  return (
    <section>
      <h2>Explore and Explain the Data</h2>
      <p>
        After confirming the dataset was clean, the next step was to get acquainted with
        how affordability actually looks across places and over time. Using Python, the
        processed JSON was grouped by geography to compute simple summary statistics for
        key metrics: mean, minimum, and maximum price-to-income, rent-to-income, and
        owner cost-burdened share, along with 10-year percentage changes in median home
        values.
      </p>
      <p>
        This exploration showed clear and intuitive patterns. Homes are systematically
        more expensive relative to income in Minneapolis and Hennepin County than in
        Fergus Falls and Otter Tail County: average price-to-income ratios cluster around
        4.0+ in Minneapolis versus roughly 3.0–3.3 in Fergus Falls and Otter Tail.
        Renters in Otter Tail spend the lowest share of income on rent (around 14–15%),
        while Minneapolis renters sit closer to 20%. Owner cost-burdened shares are
        highest in Minneapolis and lowest in Fergus Falls, with Otter Tail and Hennepin
        in between. Median home values have risen everywhere—on the order of 50–66%
        since 2013—with the fastest growth in the metro but substantial increases even in
        rural Otter Tail.
      </p>
      <p>
        These summary statistics informed the narrative and chart design. They confirm
        that Otter Tail still enjoys a meaningful affordability advantage over the Twin
        Cities, especially for homeowners, while also highlighting that rural households
        are not insulated from rising housing costs. The dashboard's time-series charts
        make these contrasts and trends visible to non-technical stakeholders, turning the
        exploratory findings into an accessible story.
      </p>
    </section>
  )
}
