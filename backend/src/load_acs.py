"""Utilities for loading and standardizing ACS data.

This module is designed around the existing folder layout where each year
has its own directory at the project root, e.g.:

    2013/ACSDT5Y2013.B19013-....csv
    2013/ACSDT5Y2013.B25077-....csv
    2013/ACSDT5Y2013.B25064-....csv

We treat those year folders as the raw ACS source and build a tidy
(year, geo)-level DataFrame with median income, home value, and rent.
"""

from __future__ import annotations

from pathlib import Path
from typing import Dict, List

import pandas as pd

from .config import PROJECT_ROOT, YEARS, TARGET_GEOS


def _find_table_file(year: int, table_id: str) -> Path:
    """Return the path to the ACS CSV file for a given year and table.

    This assumes files are stored under `<PROJECT_ROOT>/{year}/` and that
    there is exactly one CSV whose filename starts with the standard
    ACS pattern, e.g. `ACSDT5Y2013.B19013` for table B19013.
    """

    year_dir = PROJECT_ROOT / str(year)
    if not year_dir.exists():
        raise FileNotFoundError(f"Expected year directory not found: {year_dir}")

    pattern = f"ACSDT5Y{year}.{table_id}"
    matches = list(year_dir.glob(f"{pattern}*.csv"))
    if not matches:
        raise FileNotFoundError(f"No ACS CSV found for year {year} and table {table_id} in {year_dir}")
    if len(matches) > 1:
        # If there are multiple matches, you may want to disambiguate later.
        # For now, take the first and log a note.
        # In a real pipeline you could enforce stricter naming.
        print(f"[load_acs] Warning: multiple files for {year} {table_id}, using {matches[0].name}")
    return matches[0]


def _load_single_table(year: int, table_id: str) -> pd.DataFrame:
    """Load a single ACS table for a given year and return a tidy DataFrame.

    This implementation is tailored to the "wide-by-geo" CSV format you
    downloaded from data.census.gov, where:

    - Each column after "Label (Grouping)" corresponds to a geography
      and contains both an Estimate and a Margin of Error, e.g.:
        - "Hennepin County, Minnesota!!Estimate"
        - "Hennepin County, Minnesota!!Margin of Error"
    - The row describing the median value is identified by its
      "Label (Grouping)" text.

    The function:
    - finds the median row,
    - extracts all "!!Estimate" columns,
    - reshapes them into rows with columns [year, geo_name, <table_id>].
    """

    csv_path = _find_table_file(year, table_id)
    df = pd.read_csv(csv_path)

    if "Label (Grouping)" not in df.columns:
        raise KeyError(
            f"Expected 'Label (Grouping)' column in {csv_path}, found columns: {list(df.columns)}"
        )

    # Identify the row that corresponds to the median value.
    # For the tables we're using (B19013, B25077, B25064), the file
    # typically only contains one logical row of interest; if there are
    # multiples, we pick the first row that contains 'Median' in its
    # label as a sensible default.
    label_col = "Label (Grouping)"
    median_rows = df[df[label_col].astype(str).str.contains("Median", case=False, na=False)]
    if median_rows.empty:
        # Fall back to the first data row if we can't find 'Median'.
        median_row = df.iloc[[0]]
    else:
        median_row = median_rows.iloc[[0]]

    # Select all columns that contain an estimate for a geography.
    estimate_cols = [c for c in median_row.columns if c.endswith("!!Estimate")]
    if not estimate_cols:
        raise KeyError(
            f"No '!!Estimate' columns found in {csv_path}; columns: {list(median_row.columns)}"
        )

    # Build a tidy DataFrame: one row per geography.
    records = []
    for col in estimate_cols:
        geo_name = col.split("!!")[0]
        raw = median_row.iloc[0][col]
        if pd.isna(raw):
            value = None
        else:
            # Handle strings like "96,339" → "96339"
            if isinstance(raw, str):
                cleaned = raw.replace(",", "").strip()
            else:
                cleaned = str(raw)
            value = float(cleaned) if cleaned != "" else None
        records.append({"year": year, "geo_name": geo_name, table_id: value})

    tidy = pd.DataFrame.from_records(records)
    return tidy


def load_acs_affordability(years: List[int] | None = None) -> pd.DataFrame:
    """Load ACS data for the given years and return a tidy affordability DataFrame.

    The returned DataFrame has one row per (year, geo_name) and columns:
    - year
    - geo_name
    - median_household_income (from B19013)
    - median_home_value (from B25077)
    - median_gross_rent (from B25064)
    - price_to_income
    - rent_to_income

    Filtering to the specific geographies of interest is done using
    TARGET_GEOS from config.py.
    """

    if years is None:
        years = YEARS

    frames: list[pd.DataFrame] = []

    for year in years:
        income = _load_single_table(year, "B19013")
        home_value = _load_single_table(year, "B25077")
        rent = _load_single_table(year, "B25064")

        merged = income.merge(home_value, on=["geo_name", "year"], how="inner")
        merged = merged.merge(rent, on=["geo_name", "year"], how="inner")

        frames.append(merged)

    all_years = pd.concat(frames, ignore_index=True)

    # Filter to just the geographies we care about, using the human-readable name.
    target_names = set(TARGET_GEOS.values())
    filtered = all_years[all_years["geo_name"].isin(target_names)].copy()

    # Rename columns to friendly metric names
    filtered.rename(
        columns={
            "B19013": "median_household_income",
            "B25077": "median_home_value",
            "B25064": "median_gross_rent",
        },
        inplace=True,
    )

    # Compute ratios (handle division by zero / missing as NaN)
    filtered["price_to_income"] = (
        filtered["median_home_value"] / filtered["median_household_income"]
    )
    filtered["rent_to_income"] = (
        filtered["median_gross_rent"] * 12 / filtered["median_household_income"]
    )

    return filtered


if __name__ == "__main__":
    # Quick manual test helper: load just the latest year and show the result.
    latest_year = max(YEARS)
    df_latest = load_acs_affordability(years=[latest_year])
    print(df_latest)
