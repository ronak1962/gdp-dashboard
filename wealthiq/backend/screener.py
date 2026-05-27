"""
WealthIQ Screener — curated stock universes with live Finnhub data.
Provides sector screening, dividend screening, and risk/return filtering.
"""

TECH_UNIVERSE = [
    "AAPL", "MSFT", "NVDA", "GOOGL", "META", "AMZN", "TSLA", "AVGO", "AMD", "CRM",
    "ORCL", "ADBE", "INTC", "CSCO", "QCOM", "TXN", "IBM", "NOW", "INTU", "AMAT",
    "MU", "PANW", "SNPS", "CDNS", "MRVL", "KLAC", "LRCX", "NXPI", "MCHP", "FTNT",
]

HEALTHCARE_UNIVERSE = [
    "UNH", "JNJ", "LLY", "ABBV", "MRK", "PFE", "TMO", "ABT", "DHR", "AMGN",
    "BMY", "MDT", "ISRG", "GILD", "CVS", "ELV", "SYK", "VRTX", "REGN", "ZTS",
    "BSX", "BDX", "CI", "HUM", "MCK", "HCA", "IDXX", "IQV", "DXCM", "A",
]

FINANCE_UNIVERSE = [
    "JPM", "BAC", "WFC", "GS", "MS", "C", "BLK", "SCHW", "AXP", "SPGI",
    "CME", "ICE", "CB", "PGR", "MMC", "AON", "MET", "PRU", "TRV", "ALL",
]

ENERGY_UNIVERSE = [
    "XOM", "CVX", "COP", "EOG", "SLB", "MPC", "PXD", "PSX", "VLO", "OXY",
    "HES", "DVN", "BKR", "HAL", "FANG", "KMI", "WMB", "OKE", "TRGP", "ET",
]

CONSUMER_UNIVERSE = [
    "WMT", "PG", "KO", "PEP", "COST", "MCD", "NKE", "SBUX", "TGT", "HD",
    "LOW", "TJX", "CL", "GIS", "K", "KHC", "MDLZ", "PM", "MO", "EL",
]

DIVIDEND_UNIVERSE = [
    "VZ", "T", "MO", "PM", "XOM", "CVX", "ABBV", "KO", "PEP", "JNJ",
    "PG", "MMM", "IBM", "INTC", "PFE", "WBA", "DOW", "LYB", "OKE", "KMI",
    "ET", "EPD", "O", "MAIN", "STAG", "NNN", "WPC", "ADC", "VICI", "MPW",
    "ENB", "BCE", "BNS", "TD", "RY", "CM", "BMO", "TRP", "FTS", "EMA",
]

ETF_UNIVERSE = [
    "VTI", "VOO", "SPY", "QQQ", "VUG", "VTV", "SCHD", "VIG", "DGRO", "DVY",
    "VYM", "HDV", "NOBL", "SDY", "SPYD", "JEPI", "JEPQ", "DIVO", "QYLD", "XYLD",
    "BND", "AGG", "TLT", "VXUS", "VEA", "VWO", "IEMG", "EFA", "ARKK", "XLK",
    "XLV", "XLF", "XLE", "XLP", "XLI", "XLU", "XLRE", "XBI", "SMH", "SOXX",
]

CANADIAN_DIVIDEND = [
    "ENB", "BCE", "BNS", "TD", "RY", "CM", "BMO", "TRP", "FTS", "EMA",
    "AQN", "PPL", "IPL", "KEY", "NTR", "SU", "CNQ", "CP", "CNR", "MFC",
]

SECTOR_MAP = {
    "technology": TECH_UNIVERSE,
    "tech": TECH_UNIVERSE,
    "healthcare": HEALTHCARE_UNIVERSE,
    "health": HEALTHCARE_UNIVERSE,
    "finance": FINANCE_UNIVERSE,
    "financial": FINANCE_UNIVERSE,
    "banking": FINANCE_UNIVERSE,
    "energy": ENERGY_UNIVERSE,
    "oil": ENERGY_UNIVERSE,
    "consumer": CONSUMER_UNIVERSE,
    "retail": CONSUMER_UNIVERSE,
    "dividend": DIVIDEND_UNIVERSE,
    "etf": ETF_UNIVERSE,
    "canadian": CANADIAN_DIVIDEND,
}
