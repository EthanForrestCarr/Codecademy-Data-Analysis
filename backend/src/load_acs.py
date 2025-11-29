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


def _load_owner_cost_burden_share(year: int) -> pd.DataFrame:
    """Load B25091 and compute share of owner households cost-burdened.

    We approximate owner cost burden as the share of owner-occupied
    housing units with costs >= 30% of household income. In the B25091
    exports you downloaded, this corresponds to summing the rows whose
    labels include "30.0 to 34.9 percent", "35.0 to 39.9 percent",
    "40.0 to 49.9 percent", and "50.0 percent or more" and dividing by
    the "Total:" row, for each geography.

    Returns a tidy DataFrame with columns:
    - year
    - geo_name
    - owner_cost_burdened_share (0–1)
    """

    csv_path = _find_table_file(year, "B25091")
    df = pd.read_csv(csv_path)

    if "Label (Grouping)" not in df.columns:
        raise KeyError(
            f"Expected 'Label (Grouping)' column in {csv_path}, found columns: {list(df.columns)}"
        )

    label_col = "Label (Grouping)"

    total_row = df[df[label_col].astype(str).str.strip() == "Total:"]
    if total_row.empty:
        # Fall back to the first row if we can't find the explicit Total row.
        total_row = df.iloc[[0]]

    burden_labels = [
        "30.0 to 34.9 percent",
        "35.0 to 39.9 percent",
        "40.0 to 49.9 percent",
        "50.0 percent or more",
    ]
    burden_rows = df[
        df[label_col]
        .astype(str)
        .str.strip()
        .isin(burden_labels)
    ]

    # All geographic estimate columns (same pattern as other tables).
    estimate_cols = [c for c in df.columns if c.endswith("!!Estimate")]
    if not estimate_cols:
        raise KeyError(
            f"No '!!Estimate' columns found in {csv_path}; columns: {list(df.columns)}"
        )

    records = []
    for col in estimate_cols:
        geo_name = col.split("!!")[0]
        total_raw = total_row.iloc[0][col]
        if pd.isna(total_raw):
            total_val = None
        else:
            total_val = float(str(total_raw).replace(",", "").strip() or 0.0)

        burden_sum = 0.0
        for _, r in burden_rows.iterrows():
            raw = r[col]
            if pd.isna(raw):
                continue
            burden_sum += float(str(raw).replace(",", "").strip() or 0.0)

        if not total_val or total_val == 0:
            share = None
        else:
            share = burden_sum / total_val

        records.append(
            {
                "year": year,
                "geo_name": geo_name,
                "owner_cost_burdened_share": share,
            }
        )

    return pd.DataFrame.from_records(records)


def _load_owner_cost_burden_share_b25070(year: int) -> pd.DataFrame:
    """Approximate owner cost-burdened share using ACS table B25070.

    This mirrors the logic in `_load_owner_cost_burden_share` but uses
    B25070 as a quiet cross-check. It is *not* surfaced to the
    frontend; we only log large discrepancies so you can validate that
    B25091 and B25070 tell a consistent story.
    """

    csv_path = _find_table_file(year, "B25070")
    df = pd.read_csv(csv_path)

    if "Label (Grouping)" not in df.columns:
        raise KeyError(
            f"Expected 'Label (Grouping)' column in {csv_path}, found columns: {list(df.columns)}"
        )

    label_col = "Label (Grouping)"

    total_row = df[df[label_col].astype(str).str.strip() == "Total:"]
    if total_row.empty:
        total_row = df.iloc[[0]]

    burden_labels = [
        "30.0 to 34.9 percent",
        "35.0 to 39.9 percent",
        "40.0 to 49.9 percent",
        "50.0 percent or more",
    ]
    burden_rows = df[
        df[label_col]
        .astype(str)
        .str.strip()
        .isin(burden_labels)
    ]

    estimate_cols = [c for c in df.columns if c.endswith("!!Estimate")]
    if not estimate_cols:
        raise KeyError(
            f"No '!!Estimate' columns found in {csv_path}; columns: {list(df.columns)}"
        )

    records = []
    for col in estimate_cols:
        geo_name = col.split("!!")[0]
        total_raw = total_row.iloc[0][col]
        if pd.isna(total_raw):
            total_val = None
        else:
            total_val = float(str(total_raw).replace(",", "").strip() or 0.0)

        burden_sum = 0.0
        for _, r in burden_rows.iterrows():
            raw = r[col]
            if pd.isna(raw):
                continue
            burden_sum += float(str(raw).replace(",", "").strip() or 0.0)

        if not total_val or total_val == 0:
            share = None
        else:
            share = burden_sum / total_val

        records.append(
            {
                "year": year,
                "geo_name": geo_name,
                "owner_cost_burdened_share_b25070": share,
            }
        )

    return pd.DataFrame.from_records(records)


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
        owner_burden = _load_owner_cost_burden_share(year)
        owner_burden_b25070 = _load_owner_cost_burden_share_b25070(year)

        merged = income.merge(home_value, on=["geo_name", "year"], how="inner")
        merged = merged.merge(rent, on=["geo_name", "year"], how="inner")
        merged = merged.merge(owner_burden, on=["geo_name", "year"], how="left")

        # Quiet cross-check: compare B25091- vs B25070-derived burden.
        merged = merged.merge(
            owner_burden_b25070,
            on=["geo_name", "year"],
            how="left",
        )

        if "owner_cost_burdened_share_b25070" in merged.columns:
            diff = (
                merged["owner_cost_burdened_share"]
                - merged["owner_cost_burdened_share_b25070"]
            ).abs()
            if (diff > 0.02).any():
                print(
                    f"[load_acs] Warning: B25091 vs B25070 burden differs by >2pp in {year}; max diff = {diff.max():.3f}",
                )

        # Drop the cross-check column so it never reaches the frontend
        if "owner_cost_burdened_share_b25070" in merged.columns:
            merged.drop(columns=["owner_cost_burdened_share_b25070"], inplace=True)

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
