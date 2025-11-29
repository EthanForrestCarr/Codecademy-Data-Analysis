"""Utilities for loading HUD Fair Market Rent (FMR) data.

This module expects a mapping from year to HUD FMR file paths to be
configured in `config.py`. Files may be in .xls or .xlsx format; we
rely on pandas + appropriate Excel engines (e.g., openpyxl) to read
these files.
"""

from __future__ import annotations

from pathlib import Path
from typing import Dict, List

import pandas as pd

from .config import PROJECT_ROOT


# Mapping from year to HUD FMR Excel file paths. These files live in
# the same year-labelled folders as the ACS CSV exports.
HUD_FMR_FILES: Dict[int, Path] = {
    2013: PROJECT_ROOT / "2013" / "FY2013_4050_Final.xls",
    2014: PROJECT_ROOT / "2014" / "FY2014_4050_RevFinal.xls",
    2015: PROJECT_ROOT / "2015" / "FY2015_4050_RevFinal (1).xls",
    2016: PROJECT_ROOT / "2016" / "FY2016F-4050-RevFinal4.xlsx",
    2017: PROJECT_ROOT / "2017" / "FY2017-4050-County-Level_Data.xlsx",
    2018: PROJECT_ROOT / "2018" / "FY18_4050_FMRs_rev (1).xlsx",
    2019: PROJECT_ROOT / "2019" / "FY2019_4050_FMRs_rev2.xlsx",
    2020: PROJECT_ROOT / "2020" / "FY20_4050_FMRs_rev.xlsx",
    2021: PROJECT_ROOT / "2021" / "FY21_4050_FMRs_rev.xlsx",
    2022: PROJECT_ROOT / "2022" / "FY22_FMRs_revised.xlsx",
    2023: PROJECT_ROOT / "2023" / "FY23_FMRs_revised.xlsx",
}


# Human-readable geography names here should match (or be mappable to)
# the names you use in ACS (geo_name). You may need to adjust after
# inspecting actual HUD columns.
HUD_TARGET_GEOS = {
    "otter_tail_county": "Otter Tail County, MN",
    "hennepin_county": "Hennepin County, MN",  # or metro area name if needed
}


def load_hud_fmr(years: List[int] | None = None) -> pd.DataFrame:
    """Load HUD FMR data for the given years and return a tidy DataFrame.

    The returned DataFrame has one row per (year, geo_name) with:
    - year
    - geo_name
    - hud_fmr_2br (or whichever bedroom size you choose)

    NOTE: You will need to inspect the HUD files to determine the
    exact column names for:
    - county / area name
    - 2-bedroom FMR (or preferred metric)
    and then update the code below accordingly.
    """

    if years is None:
        years = sorted(HUD_FMR_FILES.keys())

    frames: list[pd.DataFrame] = []

    for year in years:
        path = HUD_FMR_FILES.get(year)
        if path is None:
            print(f"[load_hud] No HUD FMR file configured for year {year}, skipping.")
            continue
        if not path.exists():
            print(f"[load_hud] Configured HUD file not found for {year}: {path}")
            continue

        # Read Excel file. Some HUD workbooks (notably 2023) have
        # malformed XML properties that openpyxl cannot parse. In that
        # case we log and skip the year instead of failing the entire
        # pipeline.
        try:
            df = pd.read_excel(path)
        except Exception as exc:  # pragma: no cover - defensive
            print(f"[load_hud] Failed to read HUD workbook for {year}: {path} ({exc})")
            continue

        # Prefer concrete, known-good columns when available
        if "areaname" in df.columns and "fmr_2" in df.columns:
            geo_col = "areaname"
            fmr_col = "fmr_2"
        else:
            # Fallback: heuristic search for plausible name and 2BR FMR columns
            geo_col_candidates = [c for c in df.columns if "name" in str(c).lower() or "area" in str(c).lower()]
            if not geo_col_candidates:
                print(f"[load_hud] No plausible geography-name column in HUD file: {path}")
                continue
            geo_col = geo_col_candidates[0]

            fmr_col_candidates = [
                c
                for c in df.columns
                if any(k in str(c).lower() for k in ["2br", "2 br", "fmr2", "fmr_2"])
            ]
            if not fmr_col_candidates:
                print(f"[load_hud] No plausible 2BR FMR column in HUD file: {path}")
                continue
            fmr_col = fmr_col_candidates[0]

        sub = df[[geo_col, fmr_col, "countyname"]].copy()
        sub.rename(columns={fmr_col: "hud_fmr_2br"}, inplace=True)
        sub["year"] = year

        # Map HUD rows to the ACS geo_name values we actually use.
        # We duplicate some HUD rows so both county and principal city
        # in that county can share the same FMR where appropriate.
        def _expand_to_acs_geos(row: pd.Series) -> list[dict]:
            acs_rows: list[dict] = []
            countyname = str(row.get("countyname", ""))
            base = {
                "year": row["year"],
                "hud_fmr_2br": row["hud_fmr_2br"],
            }

            # Otter Tail County, MN HUD row →
            # - Otter Tail County, Minnesota
            # - Fergus Falls city, Minnesota (principal city in county)
            if "otter tail" in countyname.lower():
                for geo in [
                    "Otter Tail County, Minnesota",
                    "Fergus Falls city, Minnesota",
                ]:
                    rec = base.copy()
                    rec["geo_name"] = geo
                    acs_rows.append(rec)

            # Hennepin County HUD row (part of MSP metro) →
            # - Hennepin County, Minnesota
            # - Minneapolis city, Minnesota
            if "hennepin" in countyname.lower():
                for geo in [
                    "Hennepin County, Minnesota",
                    "Minneapolis city, Minnesota",
                ]:
                    rec = base.copy()
                    rec["geo_name"] = geo
                    acs_rows.append(rec)

            return acs_rows

        expanded_records: list[dict] = []
        for _, row in sub.iterrows():
            expanded_records.extend(_expand_to_acs_geos(row))

        if not expanded_records:
            continue

        mapped = pd.DataFrame(expanded_records)
        frames.append(mapped)

    if not frames:
        return pd.DataFrame(columns=["year", "geo_name", "hud_fmr_2br"])

    result = pd.concat(frames, ignore_index=True)
    return result


if __name__ == "__main__":
    df = load_hud_fmr()
    print(df.head())
