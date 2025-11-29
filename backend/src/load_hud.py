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


# Placeholder mapping: update these paths to match your actual HUD files.
# Example:
# HUD_FMR_FILES = {
#     2013: PROJECT_ROOT / "backend" / "data" / "raw" / "hud_fmr_2013.xls",
#     2014: PROJECT_ROOT / "backend" / "data" / "raw" / "hud_fmr_2014.xls",
#     2023: PROJECT_ROOT / "backend" / "data" / "raw" / "hud_fmr_county_2023.xlsx",
# }
HUD_FMR_FILES: Dict[int, Path] = {}


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

        # Read Excel file. You may need engine="openpyxl" for .xlsx.
        df = pd.read_excel(path)

        # TODO: Update these column names after inspecting the file.
        # Common columns include identifiers for state, county/metro, and
        # FMRs for 0BR, 1BR, 2BR, etc.
        # Example placeholders:
        #   - "CountyName" or "areaname" for geography name
        #   - "FMR2" or similar for 2-bedroom FMR
        geo_col_candidates = [c for c in df.columns if "name" in c.lower() or "area" in c.lower()]
        if not geo_col_candidates:
            raise KeyError(f"Could not find a plausible geography-name column in HUD file: {path}")
        geo_col = geo_col_candidates[0]

        fmr_col_candidates = [c for c in df.columns if "2br" in c.lower() or "2 br" in c.lower() or "fmr2" in c.lower()]
        if not fmr_col_candidates:
            raise KeyError(f"Could not find a plausible 2BR FMR column in HUD file: {path}")
        fmr_col = fmr_col_candidates[0]

        sub = df[[geo_col, fmr_col]].copy()
        sub.rename(columns={geo_col: "geo_name", fmr_col: "hud_fmr_2br"}, inplace=True)
        sub["year"] = year

        # Filter to HUD_TARGET_GEOS by matching name substrings.
        # You may refine this logic once you've seen actual names.
        target_patterns = list(HUD_TARGET_GEOS.values())
        mask = pd.Series(False, index=sub.index)
        for pattern in target_patterns:
            mask = mask | sub["geo_name"].astype(str).str.contains(pattern.split(",")[0], case=False, na=False)
        sub = sub[mask]

        frames.append(sub)

    if not frames:
        return pd.DataFrame(columns=["year", "geo_name", "hud_fmr_2br"])

    result = pd.concat(frames, ignore_index=True)
    return result


if __name__ == "__main__":
    df = load_hud_fmr()
    print(df.head())
