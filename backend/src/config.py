from pathlib import Path

# Root of the project (adjust if you move backend elsewhere)
PROJECT_ROOT = Path(__file__).resolve().parents[2]

# Directories for raw and processed data
RAW_DATA_DIR = PROJECT_ROOT / "backend" / "data" / "raw"
PROCESSED_DATA_DIR = PROJECT_ROOT / "backend" / "data" / "processed"

# Years to include in the analysis
YEARS = list(range(2013, 2024))  # 2013–2023 inclusive

# Target geographies by the human-readable name used in ACS CSVs.
# You may need to tweak these after inspecting the GEO_NAME column.
TARGET_GEOS = {
    "fergus_falls_city": "Fergus Falls city, Minnesota",
    "otter_tail_county": "Otter Tail County, Minnesota",
    "minneapolis_city": "Minneapolis city, Minnesota",
    "hennepin_county": "Hennepin County, Minnesota",
}

