export function LoadCheckNarrative() {
  return (
    <section>
      <h2>Load and Check the Data</h2>
      <p>
        Before building charts, the processed dataset is loaded back into Python to verify
        that it is ready for analysis and presentation. The main JSON file used by this
        dashboard contains 44 records (4 geographies by 11 years, 2013 to 2023), each with
        income, price, rent, and derived affordability metrics.
      </p>
      <p>
        For each numeric field, the pipeline checks for missing values and basic
        plausibility. All ACS-derived metrics
        (<code>median_household_income</code>, <code>median_home_value</code>,
        <code>median_gross_rent</code>, <code>price_to_income</code>,
        <code>rent_to_income</code>, and <code>owner_cost_burdened_share</code>) are fully
        populated across all 44 (year, geography) combinations, and their ranges are
        consistent with expectations for county- and city-level data (for example, home
        values in the low hundreds of thousands and rent-to-income ratios around
        14 to 20 percent). The only systematic missingness occurs in <code>hud_fmr_2br</code>,
        which is <code>null</code> for 2022 and 2023 due to malformed HUD workbooks documented in
        the data quality section.
      </p>
      <p>
        This quick load-and-check step ensures that the dashboard is built on a clean,
        internally consistent dataset. It gives stakeholders confidence that patterns in
        the charts reflect real changes in the underlying ACS and HUD data rather than
        artifacts of parsing errors or unhandled missing values.
      </p>
    </section>
  )
}
