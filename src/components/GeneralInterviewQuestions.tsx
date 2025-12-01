type QA = {
  question: string
  answer: string
}

type QASection = {
  id: string
  title: string
  description?: string
  items: QA[]
}

const sections: QASection[] = [
  {
    id: 'eda-and-methodology',
    title: 'EDA, Sampling, and Statistical Reasoning',
    description:
      'Questions about how you explore data, design samples, and reason about uncertainty.',
    items: [
      {
        question: 'How do you typically start an exploratory data analysis?',
        answer:
          'I begin EDA by inspecting the raw data structure (head, info, dtypes), checking data quality (missing values, duplicates, outliers), summarizing distributions visually, and then exploring relationships between variables through correlations and plots to build an intuition for patterns in the dataset.',
      },
      {
        question:
          'Using only a service-request dataset, how would you start diagnosing a sudden increase in delayed response times?',
        answer:
          "To start, I'd want to confirm where the delays are happening. Since volume did not increase, I am looking for efficiency changes rather than demand issues. My first step would be to break average response time down by department, request type, and date to see if the slowdown is isolated or system wide.\n\nIf delays are concentrated in one or two departments, I would visualize response time trends over the last several months and compare them against assigned staff or workload distribution. I would also analyze request backlog by comparing submission and completion dates to see if tasks are piling up.\n\nFrom there, I would form hypotheses, for example that a single department is understaffed, certain request types are taking longer to resolve, or there was a procedural change mid month. Once I have identified patterns in the data, the next step would be speaking with department heads to validate findings and gather context that the data alone does not show.",
      },
      {
        question:
          'What is time series analysis, and what aspects would you keep in mind when working with time series?',
        answer:
          'Time series analysis is the examination of data collected over time, where the order of observations matters. The goal is to understand temporal patterns such as trends, seasonality, and fluctuations, and to use those insights for monitoring or forecasting.\n\nWhen working with time series, I pay attention to trend, seasonality, stationarity, autocorrelation, data frequency, and any external events that could influence the values. I also ensure the time index is clean and continuous because missing or irregular timestamps can distort patterns. Time series is unique in that past values often impact future ones, so preserving order and analyzing change over time is essential.',
      },
      {
        question: 'How do you decide which sampling technique to use and what do you take into account when deciding?',
        answer:
          'I choose a sampling technique based on how the population is structured, the level of representation and accuracy needed, and what resources are available. If the population is fairly uniform, a simple random sample might be sufficient, but if there are meaningful subgroups such as regions, age groups, or customer segments, I might use stratified sampling to ensure each group is proportionally represented. The goal is to balance reliability, cost, and feasibility while minimizing bias.',
      },
      {
        question: 'How do you typically create a representative sample?',
        answer:
          'To create a representative sample, I first define the population and identify key attributes that need to be preserved, such as geography, age groups, or product categories. Then I choose a sampling technique, often stratified or random, that ensures each subgroup is proportionally represented. Finally, I validate the sample by comparing it to the full population distribution and adjust if certain groups are underrepresented. The goal is to reduce bias and ensure the sample accurately reflects the population as a whole.',
      },
      {
        question: 'What is selection bias and how do you account for it in your data?',
        answer:
          'Selection bias happens when the sample used for analysis does not reflect the true population, which can distort findings. To reduce or account for it, I try to use random or stratified sampling, compare sample distributions to population characteristics, and apply weighting when necessary. If bias still exists, I document it clearly and evaluate how it might impact results.',
      },
      {
        question: 'How do you determine sample size?',
        answer:
          'To determine sample size, I start from the level of confidence and margin of error we need, along with how much variability we expect in the population. Larger variability or tighter precision requires a bigger sample. For proportion estimates, a common approach is to use the formula n = (Z^2 * p * (1 - p)) / E^2, where Z is the z-score for the chosen confidence level, p is the expected proportion, and E is the acceptable margin of error. When p is unknown, I often assume 0.5 to be conservative. In practice, I balance this theoretical size against real-world constraints like time, cost, and access to data, aiming for the smallest sample that still gives reliable, defensible conclusions.',
      },
      {
        question:
          'A healthcare company sets up a free testing center to estimate respiratory illness prevalence. How would you account for bias in that sample?',
        answer:
          'Using a free testing center means we are dealing with self-selection bias, because people who show up are probably more symptomatic or more health-conscious than the general community. To account for this, I would first collect basic demographics and compare them to the full community profile. Then I would use weighting to adjust for overrepresented or underrepresented groups and, if possible, supplement the data with more representative methods, like outreach in under-tested neighborhoods or random household invitations. Finally, I would be explicit in reporting that our prevalence estimate comes from a non-random sample and may still be biased, likely upward, relative to the true population rate.',
      },
      {
        question:
          'On any given day there is a 10% chance you will see a friend on the subway. Assuming you ride 5 days a week, what is the probability you will see a friend at least once?',
        answer:
          'We want the probability of seeing a friend at least once across 5 independent rides. It is easier to first compute the probability of the complement event, which is not seeing a friend on any day. The chance of not seeing a friend on a single day is 1 minus 0.10, which is 0.90, so over 5 independent days that becomes 0.9 to the power of 5, which is 0.59049. The probability of at least one sighting is 1 minus 0.59049, which is 0.40951, or about 41 percent.',
      },
      {
        question:
          'If three friends in London say it is raining and each has a 1/3 chance of lying, what is the probability it is actually raining?',
        answer:
          'We can treat this as a Bayesian update on the prior probability of rain. If no prior is given, a common simplifying assumption is that the probability of rain is 0.5. Each friend lies with probability 1 over 3, so tells the truth with probability 2 over 3. If it is raining, the probability all three independently say it is raining is 2 over 3 to the power of 3, which is 8 over 27. If it is not raining, the probability all three still say it is raining, meaning all three lie, is 1 over 3 to the power of 3, which is 1 over 27. Weighting by the prior 0.5 on each scenario, we get an unnormalized probability of 0.5 times 8 over 27 for rain and 0.5 times 1 over 27 for no rain. Normalizing gives a probability of rain, given that three people say it is raining, equal to 8 over 9, or about 88.9 percent.',
      },
      {
        question:
          'What is the difference between Type I and Type II errors? Which one is worse, and why?',
        answer:
          "A Type I error occurs when we reject the null hypothesis even though it is actually true, a false positive. A Type II error is the opposite: we fail to reject the null when it is false, a false negative. In other words, Type I is thinking there is an effect when there is not, while Type II is missing a real effect. Neither is universally worse; it depends on the context and the cost of each mistake. For example, diagnosing someone with a disease they do not have is a Type I error, while failing to diagnose a disease they do have is a Type II error. In public health, missing real cases (Type II) can be more dangerous, but in criminal law, convicting an innocent person (Type I) is often viewed as more severe. The worse error is the one with greater real-world consequences in that specific setting.",
      },
      {
        question: 'What is a p-value and what does it tell you?',
        answer:
          'A p-value is the probability of observing a result at least as extreme as the one in your data, assuming the null hypothesis is true. A small p-value suggests that such a result would be unlikely under the null, so it provides evidence against the null hypothesis. A large p-value indicates that the data are consistent with the null, meaning we do not have enough evidence to claim an effect. Importantly, a p-value is not the probability that the null hypothesis is true or false, it is a measure of how surprising the data are under the assumption that the null is true.',
      },
      {
        question: 'What is the Central Limit Theorem and why does it matter?',
        answer:
          'The Central Limit Theorem says that if you take many random samples from a population, the distribution of their sample means will become approximately normal as the sample size grows, even when the underlying population is not normal. The mean of those sample means is close to the true population mean, and their spread is given by the standard error, which is roughly the population standard deviation divided by the square root of the sample size. It matters because this result underpins most of statistical inference: it allows us to use the normal distribution to build confidence intervals, compute margins of error, and run hypothesis tests based on sample data instead of needing to measure the whole population.',
      },
    ],
  },
  {
    id: 'text-and-visualization',
    title: 'Text Processing and Visualization',
    description:
      'Questions about working with unstructured text and designing clear visualizations.',
    items: [
      {
        question: 'What steps would you take to normalize text?',
        answer:
          'To normalize text, I start by lowercasing it so it is comparable across samples. Next, I remove punctuation and tokenize the text into individual words. I also remove stopwords and apply stemming or lemmatization so similar words are treated consistently. Depending on the use case, I might expand contractions, correct spelling, strip whitespace, or convert numbers if needed. The goal is to transform messy natural language into a clean, standardized format that is suitable for analysis or modeling.',
      },
      {
        question: 'What makes a good visualization?',
        answer:
          'A good visualization makes insight obvious. It presents data clearly, accurately, and with a specific purpose, using an appropriate chart type, readable labels, and clean design so the viewer can grasp the message quickly. The emphasis is on revealing patterns, comparisons, or changes over time that support decision making, not on decoration or unnecessary complexity.',
      },
      {
        question: 'What types of charts do you gravitate towards and why?',
        answer:
          'I gravitate toward charts that clearly communicate relationships: line charts for trends over time, bar charts for comparing categories, histograms to show the shape of a distribution, and scatter plots when I want to understand correlations or potential causality. I prefer these because they are intuitive for most stakeholders, grounded in good data visualization practice, and they surface key patterns quickly without unnecessary visual clutter.',
      },
      {
        question: 'How would you represent six variables of a dataset?',
        answer:
          'There is no single best plot for six variables, it depends on the variable types and the question. If they are mostly numeric, I might start with a pair plot or correlation heatmap to see all pairwise relationships at a glance. For comparing multi dimensional observations, I would use a parallel coordinates plot, or apply dimensionality reduction such as PCA and plot the first two components as a scatter plot, possibly colored by a category. If I am comparing profiles of groups rather than individual records, a radar chart can work for showing how group means differ across six dimensions. The key is to match the visualization to the goal, whether exploration, comparison, or structure discovery, rather than forcing everything into a single chart type.',
      },
      {
        question: 'Which tools do you use for EDA and communication?',
        answer:
          'For EDA I mainly use Python with Pandas, NumPy, Seaborn, and Jupyter Notebooks because they give me fast, flexible exploration, strong visualization support, and a reproducible workflow. When data lives in a warehouse, I also use SQL for quick aggregations and filtering, and I sometimes supplement with Tableau or Power BI to spot visual patterns. For communication, I focus on clear storytelling, using dashboards in Tableau or Power BI for interactive business views, Python visualizations for publication quality graphics, Jupyter plus Markdown for technical walkthroughs, and slide decks for executive summaries. I tailor the format to the audience so both technical and non technical stakeholders can act on the insights.',
      },
    ],
  },
  {
    id: 'experimentation',
    title: 'Experimentation and A/B Testing',
    description:
      'Questions about designing, sizing, and interpreting controlled experiments.',
    items: [
      {
        question: 'What is the goal of A/B testing, and why is it important?',
        answer:
          "The goal of A/B testing is to compare two versions of an experience, such as a page layout or email, to see which one performs better using controlled experimentation rather than intuition. It is important because it lets teams make data-driven decisions with statistical evidence, quantify the impact of changes on key metrics, and iterate in a low-risk way. Instead of shipping large, untested changes, A/B tests support incremental, measurable optimization of products, marketing campaigns, or user flows.",
      },
      {
        question:
          'What considerations do you need to make when determining the number of participants needed for an A/B test?',
        answer:
          'To determine the number of participants needed for an A/B test, I look at the baseline conversion rate, the minimum detectable effect that is practically meaningful, and the desired levels of statistical significance and power. I also consider the variability of the metric and how much traffic is realistically available, because the test has to be both statistically valid and operationally feasible. The goal is to choose a sample size that is large enough to reliably detect a meaningful difference, but not so large that it wastes time, traffic, or resources.',
      },
      {
        question: 'If you had to stop an A/B test early, what considerations would you make?',
        answer:
          'If I had to stop an A/B test early, I would first check whether we are close to the planned sample size and whether the results look statistically stable rather than just temporarily significant. I would weigh the business impact, for example stopping early is justified if one variant is clearly harmful or creating a bad user experience. I would also look at confidence intervals and the consistency of the effect over time to avoid premature stopping that inflates false positives. If early stopping is unavoidable, I make sure to document the decision, note that error rates may be higher than planned, and communicate the added uncertainty to stakeholders.',
      },
    ],
  },
  {
    id: 'sql',
    title: 'SQL Questions',
    description:
      'Core SQL and relational database concepts you should be comfortable explaining.',
    items: [
      {
        question: 'What is SQL?',
        answer:
          'SQL is the standard language for interacting with relational databases. It lets you define and query structured data by selecting, filtering, joining, and aggregating tables so you can answer questions, build reports, and power applications in a consistent, declarative way.',
      },
      {
        question: 'What is a database, and what is a relational database?',
        answer:
          'A database is a structured system for storing and retrieving data so it can be accessed, managed, and updated efficiently. A relational database is a specific kind of database that organizes data into tables with rows and columns, and uses defined relationships (keys) between those tables. This relational structure makes it easy to join data across tables, enforce integrity rules, and run powerful, SQL-based queries.',
      },
      {
        question: 'What is an RDBMS?',
        answer:
          'An RDBMS, or relational database management system, is software that manages relational databases, which are databases organized into tables of rows and columns. It lets you create, modify, store, and query data using SQL, while enforcing relationships between tables through primary and foreign keys. A good RDBMS also handles indexing and performance, access control and security, backup and recovery, and data integrity through constraints. Common examples include MySQL, PostgreSQL, SQL Server, Oracle, and SQLite.',
      },
      {
        question: 'What is a table, and what are rows and columns within a table?',
        answer:
          'In a relational database, a table is a structured set of data that is organized into rows and columns. Each row represents a single record or observation, such as one customer or one transaction, and each column represents a specific attribute or field describing those records, such as name, date, or amount. Together, rows and columns form a grid where each cell holds one value for one attribute of one record.',
      },
      {
        question: 'What is a data type?',
        answer:
          'A data type specifies the format and kind of value a field can hold, such as number, text, Boolean, or date, and it determines how that value is stored, validated, and used in calculations or comparisons. Choosing appropriate data types helps ensure data quality, prevents invalid values, and enables efficient querying and analysis.',
      },
      {
        question: 'What is a primary key and a foreign key?',
        answer:
          'A primary key is a column or set of columns that uniquely identifies each record in a table and cannot be null. A foreign key is a column in one table that references the primary key in another table, creating a relationship between the two. Primary keys enforce uniqueness within a table, while foreign keys maintain referential integrity across tables by ensuring that related records actually exist.',
      },
      {
        question: 'What is the difference between ALTER and UPDATE in SQL?',
        answer:
          'ALTER is a data definition language, or DDL, command that is used to change the structure of a table, such as adding, removing, or modifying columns or constraints. UPDATE is a data manipulation language, or DML, command that is used to change the actual data in the rows of a table. In short, ALTER modifies the schema, while UPDATE modifies the records that are stored within that schema.',
      },
      {
        question: 'What is a query and what is a subquery?',
        answer:
          'A query is a request for information from a database, typically written in SQL to select, filter, join, and aggregate data from one or more tables. A subquery is a query nested inside another query, often in a WHERE, FROM, or SELECT clause, that you use when one result depends on another. Subqueries help break complex logic into smaller, reusable pieces and can make it easier to express multi step filtering or aggregation in a single statement.',
      },
      {
        question: 'What are constraints in a database?',
        answer:
          'Constraints are rules that are defined on tables that restrict what data can be inserted, updated, or deleted in order to maintain data quality and integrity. Common examples include primary key and unique constraints to enforce uniqueness, foreign key constraints to maintain relationships between tables, not null to prevent missing values, check constraints to enforce custom conditions, and default values to supply fallback values. Together, constraints help ensure that the data stays consistent with business rules.',
      },
      {
        question: 'What is a statement in SQL?',
        answer:
          'A statement is a complete SQL command that the database parses and executes, such as a SELECT, INSERT, UPDATE, DELETE, or ALTER TABLE. Each statement expresses a full action, such as retrieving data, modifying rows, or changing schema, so it can be run as a unit by the database engine.',
      },
      {
        question: 'What is the difference between DISTINCT and UNIQUE in SQL?',
        answer:
          'DISTINCT is used in a SELECT query to filter duplicate rows from the result set, so it affects only what you see when you are querying. UNIQUE is a constraint that is defined on one or more columns that prevents duplicate values from being stored in the table in the first place. In short, DISTINCT cleans duplicates at read time, while UNIQUE enforces data integrity at the schema level.',
      },
      {
        question:
          'What is a JOIN, and what is the difference between an INNER JOIN and a LEFT JOIN?',
        answer:
          'A JOIN links rows from two tables based on related key columns so you can query connected data in a single result set. An INNER JOIN returns only the rows where the join condition matches in both tables, the records that overlap. A LEFT JOIN returns all rows from the left table and the matching rows from the right table, filling in null values when there is no match. You use INNER JOIN when you only care about overlapping data, and LEFT JOIN when you need to preserve all records from the left side regardless of whether a match exists.',
      },
      {
        question: 'What is the purpose of window functions?',
        answer:
          'Window functions let you compute metrics like rankings, running totals, and moving averages across a set of rows while still returning each row individually. Unlike GROUP BY, which collapses rows into aggregates, window functions operate over a window of rows defined by PARTITION BY and ORDER BY clauses. This makes them ideal for trend analysis, peer comparisons, and time based calculations where you want both row level detail and richer context in the same query.',
      },
      {
        question: 'What are indexes and why are they needed?',
        answer:
          'Indexes are special data structures, often B trees or similar structures, that a database maintains on one or more columns to make lookups much faster. Instead of scanning every row in a table to find matching values, the database can use the index to jump directly to the relevant rows, similar to using a book index rather than reading every page. Indexes are especially important on large tables and on columns used frequently in WHERE clauses, joins, and sorting. However, indexes come with trade offs, because they consume additional storage and must be updated on every insert, update, or delete, which can slow down write heavy workloads. Because of this, indexes should be added selectively to the most performance critical queries rather than on every column.',
      },
    ],
  },
  {
    id: 'behavioral',
    title: 'Behavioral and Communication',
    description:
      'Behavioral questions about collaboration, conflict, and how you work with others.',
    items: [
      {
        question: 'Tell me about a time you disagreed with a supervisor.',
        answer:
          'In a web development project, my supervisor preferred to handle user search functionality entirely with client side filtering. I was concerned this approach would not scale well as the dataset grew and would lead to slower response times. To make the case, I collected sample traffic and data size estimates, modeled expected query loads, and built a small prototype using server side filtering with PostgreSQL and appropriate indexes. The comparison showed a clear performance improvement and more predictable behavior under load. After reviewing the evidence together, we agreed on a compromise, moving the heavy filtering and pagination to the server and layering in caching to keep responses fast. The final solution significantly improved performance while still aligning with the overall product direction.',
      },
      {
        question: 'Describe a time you implemented a policy or process from start to finish.',
        answer:
          'On a chat platform project, I led the rollout of structured logging and error tracking so we could diagnose production issues much faster. I started by researching tooling options and talking with the team about their pain points, then proposed a simple standard for log structure, severity levels, and correlation identifiers. Next, I implemented the logging and error tracking framework in the authentication service, defined key events and fields to capture, and wired those into dashboards and alerts so we could act on the data. I documented the conventions, added examples to our repository, and ran a short walkthrough so teammates could instrument their own services consistently. As a result, we reduced average debugging time, made error visibility much clearer for both engineers and stakeholders, and created a maintainable process for tracking issues end to end. From an analyst perspective, this was essentially a process design and data tracking project, define the event schema, implement the collection pipeline, and ensure people understood how to use the information.',
      },
      {
        question: 'How do you organize and prioritize work?',
        answer:
          'I organize work using a simple Kanban style board and break larger projects into small, measurable tasks so progress is visible. When prioritizing, I look at user impact, risk, and deadlines rather than just what is easiest to do. For example, during a release that included both login bugs and user interface enhancements, I focused first on fixing authentication issues because they blocked users from accessing the product at all, while the user interface work could wait. That decision was based on evidence from error logs and support tickets, not just intuition. In an analyst context, this translates to a structured workflow where the highest value, highest impact work, especially anything blocking users or stakeholders, gets done first, while lower impact optimizations are scheduled afterward.',
      },
      {
        question: 'Tell us about a time you defended a decision others opposed.',
        answer:
          'On a messaging project, I proposed using WebSockets for real time communication instead of sticking with long polling. Some teammates felt WebSockets were unnecessarily complex and risky for our timeline. Rather than argue in the abstract, I built a small prototype that simulated expected traffic patterns and measured throughput, latency, and server resource usage for both approaches. The results showed that WebSockets handled sustained connections more efficiently, reduced cost per request, and smoothed out traffic spikes compared to repeatedly opening and closing HTTP connections. I summarized the findings with a few clear charts and shared the trade offs, including operational considerations. After reviewing the data, the team agreed to adopt WebSockets, and later, when usage grew, that decision paid off with better scalability and a smoother user experience. From an analyst perspective, this was about evidence backed advocacy, define alternatives, measure them, and communicate the comparison clearly.',
      },
      {
        question: 'How do you deal with difficult coworkers?',
        answer:
          'When I run into friction with a coworker, I start by trying to understand their perspective instead of pushing harder on my own. For example, I once worked with someone who was very resistant to code reviews and often sounded defensive in comments. Rather than escalate, I set up a one on one conversation to ask open ended questions about what felt frustrating or unhelpful in the current process. It turned out they felt reviews were too focused on nitpicking and slowed them down without clear standards. Together we drafted a short set of shared guidelines that focused reviews on correctness, clarity, and risk first, with style handled by automated formatting. Once we aligned on expectations and removed some pain points, the tone of our collaboration improved and the reviews became more productive. As an analyst or teammate in general, I see conflict as a signal to clarify goals, listen actively, and see if we can turn that friction into a better process for everyone.',
      },
    ],
  },
  {
    id: 'analytics-experience',
    title: 'Analytics Experience and Data Workflows',
    description:
      'Questions that highlight your hands-on experience analyzing data and ensuring quality.',
    items: [
      {
        question: 'What is your experience with SQL?',
        answer:
          'I have used SQL extensively in application back ends and analytics work to query, filter, and join relational data, and to aggregate metrics such as user activity and login frequency. In practice, that has meant writing queries to debug production issues, analyze logs, and validate events in systems such as authentication and billing. I am comfortable with SELECT statements that involve multiple joins, common table expressions for structuring complex logic, window functions and aggregations for trend analysis, and using indexes and execution plans to tune performance on larger tables. This experience translates directly to a data role where you need to pull reliable datasets, debug data quality issues, and support stakeholders with accurate, well structured SQL.',
      },
      {
        question: 'How do you use qualitative vs quantitative analysis?',
        answer:
          'In my development work, I have used both qualitative and quantitative data to guide decisions. Qualitative input came from user interviews, user experience feedback, and support tickets that surfaced pain points, such as confusing flows or missing context in error messages. Quantitative data came from metrics such as page load times, error rates, click through, and conversion funnels. For example, if users reported that a sign up flow felt frustrating, I would pair that feedback with funnel data to see where drop offs spiked and with performance metrics to check for latency issues. Qualitative feedback helped generate hypotheses about what to change, and quantitative metrics let me validate whether those changes actually improved behavior. That same pattern applies directly to an analyst role, listen to what people say, measure what they do, and use both to shape and confirm decisions.',
      },
      {
        question: 'Describe a time you analyzed a large dataset.',
        answer:
          'While building dashboards and user analytics for an authentication system, I worked with large volumes of event logs that captured every step of the login flow. I used Python and Pandas to clean and standardize the data, handle missing or malformed records, and engineer features such as time to authenticate, number of attempts, and device or location flags. From there, I aggregated and visualized the data to identify where in the funnel users were failing or dropping off most often. That analysis highlighted specific bottlenecks, such as a particular integration step and edge cases in multi factor authentication, that were driving a disproportionate share of errors. Sharing those insights with the team helped us prioritize fixes, and follow up tracking showed a meaningful reduction in failed logins and support tickets. This experience translates directly to analytics work, tame a large dataset, extract the right features, and turn patterns into concrete recommendations.',
      },
      {
        question: 'How do you ensure data accuracy and integrity?',
        answer:
          "I treat data quality with the same rigor I would a production system. At collection time, I validate inputs where possible, using schema checks, required fields, and sensible defaults, to reduce bad data entering the pipeline. When working with databases or warehouses, I cross check key queries between environments such as staging and production, and I reconcile aggregates, such as record counts or totals, against known benchmarks or source systems. During transformation, I keep logic under version control, add sanity checks for outliers or unexpected category levels, and log anomalies so they can be investigated rather than silently ignored. Before sharing results, I spot check samples, rerun critical queries, and make sure definitions are consistent with stakeholder expectations. This is similar to validating a database migration, because you do pre checks and post checks so you can trust that what you are looking at is both accurate and complete.",
      },
      {
        question: 'What is your experience with data visualization?',
        answer:
          'I have built dashboards for user behavior, error tracking, and performance metrics, focusing on making patterns and anomalies easy to see at a glance. That has included visualizing usage trends over time, success and failure rates in key flows such as authentication, and spikes in errors or latency that might indicate regressions. I typically start with clear, simple charts, such as line charts for trends, bar charts for categorical comparisons, and heatmaps or distributions when needed, and iterate based on stakeholder feedback. The habits I developed there translate directly to tools such as Tableau or Power BI, define the key questions, choose appropriate visuals, and build views that help non technical stakeholders make decisions quickly.',
      },
      {
        question: 'How do you think about DEI and inclusive design in your work?',
        answer:
          'In my development work, accessibility and inclusion have been personal priorities. I have built interfaces with users on low bandwidth connections, older devices, and varying levels of technical literacy in mind, focusing on readability, clear language, and resilient performance. I see inclusive design in data as a combination of representation, making sure we are not ignoring key groups in the data, accessibility, presenting metrics in ways that a wide range of stakeholders can understand, and decision making that considers the impact on all users, not just the majority. In practice, that has meant asking who is missing from a dataset, checking whether dashboards highlight outcomes for underserved groups, and pushing for solutions that reduce, rather than widen, gaps in access or experience. That human centered lens fits well with the public service mission in Minnesota, because the goal is not just to optimize metrics, but to ensure the people behind those metrics are fairly represented and served.',
      },
    ],
  },
]

export function GeneralInterviewQuestions() {
  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight">
        General data analyst interview questions
      </h2>
      <p className="mt-1 text-sm text-slate-300">
        Use these to practice answering common data analysis interview questions out
        loud.
      </p>
      <div className="mt-4 space-y-8">
        {sections.map((section) => (
          <section key={section.id} aria-labelledby={section.id}>
            <div className="mb-2">
              <h3
                id={section.id}
                className="text-base font-semibold tracking-tight text-slate-100"
              >
                {section.title}
              </h3>
              {section.description ? (
                <p className="mt-1 text-xs text-slate-400">
                  {section.description}
                </p>
              ) : null}
            </div>
            <div className="space-y-4">
              {section.items.map((item, idx) => (
                <article
                  key={item.question}
                  className="rounded-lg bg-slate-900/60 p-3 text-sm text-slate-100 sm:p-4"
                >
                  <h4 className="text-sm font-semibold text-sky-300">
                    Q{idx + 1}. {item.question}
                  </h4>
                  <p className="mt-1 leading-relaxed text-slate-200">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
