export function InterviewQuestions() {
  const qa = [
    {
      question: 'How did you define the main business question for this project?',
      answer:
        'I framed the analysis around a decision-maker\'s perspective: Otter Tail County staff and local stakeholders who want to know whether housing is becoming more or less affordable compared to the Twin Cities. That turned into a concrete question: over the last decade, is Otter Tail\'s affordability advantage shrinking, stable, or growing for both owners and renters when benchmarked against Minneapolis and Hennepin County?',
    },
    {
      question: 'Why did you choose the specific ACS tables and HUD data you used?',
      answer:
        'I chose ACS tables B19013, B25077, and B25064 because they give a consistent time series for median household income, home value, and gross rent, which are the core ingredients for price-to-income and rent-to-income ratios. I added B25091 to estimate the share of cost-burdened owners, and HUD Fair Market Rents to provide an independent benchmark for rents. Together these sources let me speak to both price levels and how those prices interact with local incomes.',
    },
    {
      question: 'How did you validate data quality before trusting the results?',
      answer:
        'I started by loading all ACS tables and checking for missing values and implausible ranges (for example, negative incomes or values that were orders of magnitude off). I also cross-checked owner cost burden using ACS B25070 as a secondary view, and I treated HUD 2022–2023 files cautiously because of parsing issues. In the final dataset I explicitly keep HUD values nullable and rely on ACS as the primary source, which I document both in the README and on the page.',
    },
    {
      question: 'Can you walk me through one key chart and what it shows?',
      answer:
          'The price-to-income chart is a good example. Each line tracks, over time, how many years of median household income it would take to buy the median home in that place. By comparing Otter Tail and Fergus Falls to Hennepin County and Minneapolis, you can see that the metro stays more expensive in absolute terms, but the relative gap and the slope over time tell you whether rural areas are catching up or remaining more affordable. It turns an abstract price series into a more intuitive "how many years of pay" measure.',
    },
    {
      question: 'How would you extend this project with more time or data?',
      answer:
        'With more time I would add local administrative data, like building permits or sales/assessment data, to understand supply dynamics, and I would explore renter outcomes more deeply by bringing in ACS rent burden distributions. On the frontend, I would add interactive filtering (for example, toggling geographies or selecting date ranges) and a dedicated study mode with flashcards so I can drill concepts like cost-burden thresholds or how to interpret ratios in an interview setting.',
    },
  ] as const

  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight">Interview questions &amp; answers</h2>
      <p className="mt-1 text-sm text-slate-300">
        These prompts are written in an interview-friendly tone so you can practice
        explaining the project, your data choices, and your analysis decisions out loud.
      </p>
      <div className="mt-4 space-y-4">
        {qa.map((item, idx) => (
          <article
            key={item.question}
            className="rounded-lg bg-slate-900/60 p-3 text-sm text-slate-100 sm:p-4"
          >
            <h3 className="text-sm font-semibold text-sky-300">
              Q{idx + 1}. {item.question}
            </h3>
            <p className="mt-1 leading-relaxed text-slate-200">{item.answer}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
