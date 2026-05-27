"""
WealthIQ Screener — curated stock universes with live Finnhub data.
Covers US stocks, global ADRs, ETFs, sector screening, dividends, and risk/return filtering.
"""

# ─── US Sector Universes ─────────────────────────────────────────────────────

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

INDUSTRIAL_UNIVERSE = [
    "CAT", "DE", "UNP", "HON", "RTX", "BA", "LMT", "GE", "MMM", "UPS",
    "FDX", "EMR", "ITW", "ETN", "PH", "ROK", "CMI", "PCAR", "NSC", "WM",
]

REALESTATE_UNIVERSE = [
    "PLD", "AMT", "EQIX", "CCI", "SPG", "O", "WELL", "DLR", "PSA", "VICI",
    "AVB", "EQR", "ARE", "MAA", "UDR", "ESS", "INVH", "SUI", "ELS", "PEAK",
]

SEMICONDUCTOR_UNIVERSE = [
    "NVDA", "AVGO", "AMD", "INTC", "QCOM", "TXN", "MU", "MRVL", "LRCX", "KLAC",
    "AMAT", "NXPI", "MCHP", "ON", "SWKS", "ADI", "SNPS", "CDNS", "ASML", "TSM",
]

CYBERSECURITY_UNIVERSE = [
    "PANW", "CRWD", "FTNT", "ZS", "OKTA", "NET", "S", "CYBR", "QLYS", "TENB",
    "RPD", "VRNS", "SAIL", "YOU", "RDWR",
]

AI_UNIVERSE = [
    "NVDA", "MSFT", "GOOGL", "META", "AMZN", "PLTR", "AI", "PATH", "SNOW", "MDB",
    "DDOG", "CRWD", "NET", "SMCI", "ARM", "AVGO", "AMD", "TSM", "ORCL", "CRM",
]

# ─── Global / International ADRs ─────────────────────────────────────────────

CANADIAN_UNIVERSE = [
    "RY", "TD", "BNS", "BMO", "CM", "ENB", "CNQ", "TRP", "SU", "CP",
    "CNI", "MFC", "NTR", "SHOP", "BCE", "FTS", "BAM", "BN", "WCN", "QSR",
]

EUROPEAN_UNIVERSE = [
    "ASML", "SAP", "NVO", "AZN", "UL", "SHEL", "TTE", "DEO", "GSK", "SAN",
    "HSBC", "BP", "RIO", "BHP", "LIN", "SNY", "ING", "PHG", "NXPI", "SPOT",
    "SE", "GRAB", "NVS", "ABB", "UBS",
]

JAPANESE_UNIVERSE = [
    "TM", "SONY", "HMC", "MUFG", "SMFG", "NMR", "MFG", "NTDOY", "SNE",
    "HNDAF", "IX", "NTT", "CAJ", "MRAAY", "FANUY",
]

CHINESE_UNIVERSE = [
    "BABA", "JD", "PDD", "BIDU", "NIO", "LI", "XPEV", "BILI", "TME",
    "NTES", "TCOM", "ZTO", "FUTU", "MNSO", "VNET", "YMM", "DADA", "WB",
]

INDIAN_UNIVERSE = [
    "INFY", "WIT", "HDB", "IBN", "SIFY", "RDY", "TTM", "WNS", "MMYT",
    "YTRA", "AZRE", "GENI",
]

BRAZILIAN_UNIVERSE = [
    "VALE", "PBR", "ITUB", "BBD", "ABEV", "SBS", "EWZ", "BSBR", "CIG",
    "SID", "GGB", "ERJ", "VTMX", "XP", "NU", "STNE",
]

AUSTRALIAN_UNIVERSE = [
    "BHP", "RIO", "WDS", "JHX", "ATLKY", "CSL",
]

EMERGING_MARKET_UNIVERSE = [
    "TSM", "BABA", "VALE", "PBR", "INFY", "HDB", "NU", "SE", "GRAB",
    "MELI", "STNE", "XP", "NIO", "LI", "XPEV", "JD", "PDD", "ITUB",
]

# ─── Dividend Universes ───────────────────────────────────────────────────────

DIVIDEND_US = [
    "VZ", "T", "MO", "PM", "XOM", "CVX", "ABBV", "KO", "PEP", "JNJ",
    "PG", "MMM", "IBM", "INTC", "PFE", "WBA", "DOW", "LYB", "OKE", "KMI",
    "ET", "EPD", "O", "MAIN", "STAG", "NNN", "WPC", "ADC", "VICI", "MPW",
]

DIVIDEND_CANADIAN = [
    "ENB", "BCE", "BNS", "TD", "RY", "CM", "BMO", "TRP", "FTS",
    "MFC", "NTR", "SU", "CNQ", "CP", "CNI", "BAM", "BN", "QSR",
]

DIVIDEND_GLOBAL = [
    "VZ", "T", "MO", "XOM", "CVX", "ABBV", "ENB", "BCE", "TD", "RY",
    "HSBC", "BP", "SHEL", "RIO", "BHP", "UL", "TTE", "NVS",
    "VALE", "ITUB", "PBR", "TM", "NTT",
]

DIVIDEND_ARISTOCRATS = [
    "JNJ", "KO", "PEP", "PG", "MMM", "ABT", "ABBV", "WMT", "XOM", "CVX",
    "CL", "MCD", "EMR", "ADP", "ITW", "SHW", "GD", "CAT", "LOW", "TGT",
    "ED", "BDX", "ECL", "PPG", "APD", "SWK", "AFL", "CINF", "HRL", "LEG",
]

# ─── ETF Universes ────────────────────────────────────────────────────────────

ETF_UNIVERSE = [
    "VTI", "VOO", "SPY", "QQQ", "VUG", "VTV", "SCHD", "VIG", "DGRO", "DVY",
    "VYM", "HDV", "NOBL", "SDY", "SPYD", "JEPI", "JEPQ", "DIVO", "QYLD", "XYLD",
    "BND", "AGG", "TLT", "VXUS", "VEA", "VWO", "IEMG", "EFA", "ARKK", "XLK",
    "XLV", "XLF", "XLE", "XLP", "XLI", "XLU", "XLRE", "XBI", "SMH", "SOXX",
]

ETF_GROWTH = [
    "QQQ", "VUG", "ARKK", "ARKW", "ARKF", "ARKG", "MGK", "IWF", "SCHG", "SPYG",
    "VGT", "XLK", "SMH", "SOXX", "IGV", "CIBR", "WCLD", "HACK", "BOTZ", "ROBO",
]

ETF_INCOME = [
    "SCHD", "VYM", "HDV", "JEPI", "JEPQ", "DIVO", "QYLD", "XYLD", "NOBL", "SDY",
    "SPYD", "DVY", "VIG", "DGRO", "DHS", "DIV", "SPHD", "FDL", "KNG", "CDC",
]

ETF_BOND = [
    "BND", "AGG", "TLT", "IEF", "SHY", "VCIT", "LQD", "HYG", "JNK", "BNDX",
    "TIP", "VTIP", "MUB", "VGSH", "VGIT", "VGLT", "BSV", "BIV", "BLV", "EMB",
]

ETF_INTERNATIONAL = [
    "VXUS", "VEA", "VWO", "IEMG", "EFA", "EEM", "INDA", "FXI", "MCHI", "EWJ",
    "EWG", "EWU", "EWC", "EWZ", "EWT", "EWY", "EWA", "EWH", "EWS", "KWEB",
]

# ─── Thematic ─────────────────────────────────────────────────────────────────

ELECTRIC_VEHICLE = [
    "TSLA", "NIO", "LI", "XPEV", "RIVN", "LCID", "F", "GM", "TM", "HMC",
    "STLA", "VWAGY", "BMWYY", "BYDDY", "QS", "CHPT", "BLNK", "PLUG", "FCEL",
]

CRYPTO_BLOCKCHAIN = [
    "COIN", "MSTR", "MARA", "RIOT", "CLSK", "HUT", "BITF", "SQ", "PYPL",
    "HOOD", "SOFI", "NU", "AFRM",
]

CLOUD_SAAS = [
    "CRM", "NOW", "SNOW", "MDB", "DDOG", "NET", "ZS", "OKTA", "HUBS", "WDAY",
    "VEEV", "SHOP", "BILL", "DOCN", "TWLO", "CFLT", "PATH", "ESTC", "MNDY", "ZI",
]

CLEAN_ENERGY = [
    "ENPH", "SEDG", "FSLR", "RUN", "PLUG", "FCEL", "BE", "NEE", "AES", "DUK",
    "SO", "D", "XEL", "EVRG", "AEP", "ICLN", "TAN", "QCLN", "PBW", "FAN",
]

GAMING_METAVERSE = [
    "RBLX", "U", "TTWO", "EA", "ATVI", "NTDOY", "SE", "DKNG", "PENN", "MGM",
    "CRSR", "HEAR", "LOGI", "SONY",
]

BIOTECH_UNIVERSE = [
    "MRNA", "BNTX", "REGN", "VRTX", "GILD", "BIIB", "ALNY", "SGEN", "BMRN", "INCY",
    "RARE", "IONS", "SRPT", "EXEL", "HALO", "PCVX", "NBIX", "ARWR", "CRSP", "NTLA",
]

FINTECH_UNIVERSE = [
    "SQ", "PYPL", "SOFI", "AFRM", "HOOD", "COIN", "NU", "STNE", "XP", "FUTU",
    "UPST", "LC", "BILL", "TOST", "FOUR", "GPN", "FIS", "FISV", "V", "MA",
]

REIT_UNIVERSE = [
    "O", "PLD", "AMT", "CCI", "SPG", "EQIX", "DLR", "WELL", "PSA", "VICI",
    "AVB", "EQR", "NNN", "STAG", "WPC", "ADC", "MPW", "MAIN", "ARE", "MAA",
]

SMALL_CAP_GROWTH = [
    "PLTR", "SOFI", "RBLX", "DKNG", "HOOD", "AFRM", "UPST", "IONQ", "SMCI",
    "APP", "CAVA", "DUOL", "CELH", "TOST", "FOUR", "MNDY", "CFLT", "DOCN",
]

# ─── Sector Map (all queryable categories) ───────────────────────────────────

SECTOR_MAP = {
    # US Sectors
    "technology": TECH_UNIVERSE,
    "tech": TECH_UNIVERSE,
    "healthcare": HEALTHCARE_UNIVERSE,
    "health": HEALTHCARE_UNIVERSE,
    "pharma": HEALTHCARE_UNIVERSE,
    "finance": FINANCE_UNIVERSE,
    "financial": FINANCE_UNIVERSE,
    "banking": FINANCE_UNIVERSE,
    "banks": FINANCE_UNIVERSE,
    "energy": ENERGY_UNIVERSE,
    "oil": ENERGY_UNIVERSE,
    "consumer": CONSUMER_UNIVERSE,
    "retail": CONSUMER_UNIVERSE,
    "industrial": INDUSTRIAL_UNIVERSE,
    "industrials": INDUSTRIAL_UNIVERSE,
    "realestate": REALESTATE_UNIVERSE,
    "reit": REIT_UNIVERSE,
    "reits": REIT_UNIVERSE,
    "semiconductor": SEMICONDUCTOR_UNIVERSE,
    "semiconductors": SEMICONDUCTOR_UNIVERSE,
    "chips": SEMICONDUCTOR_UNIVERSE,
    "cybersecurity": CYBERSECURITY_UNIVERSE,
    "cyber": CYBERSECURITY_UNIVERSE,
    "security": CYBERSECURITY_UNIVERSE,
    "ai": AI_UNIVERSE,
    "artificial intelligence": AI_UNIVERSE,
    "biotech": BIOTECH_UNIVERSE,
    "bio": BIOTECH_UNIVERSE,
    "fintech": FINTECH_UNIVERSE,
    "smallcap": SMALL_CAP_GROWTH,
    "small cap": SMALL_CAP_GROWTH,
    "growth": SMALL_CAP_GROWTH,

    # Global / Region
    "canadian": CANADIAN_UNIVERSE,
    "canada": CANADIAN_UNIVERSE,
    "european": EUROPEAN_UNIVERSE,
    "europe": EUROPEAN_UNIVERSE,
    "japanese": JAPANESE_UNIVERSE,
    "japan": JAPANESE_UNIVERSE,
    "chinese": CHINESE_UNIVERSE,
    "china": CHINESE_UNIVERSE,
    "indian": INDIAN_UNIVERSE,
    "india": INDIAN_UNIVERSE,
    "brazilian": BRAZILIAN_UNIVERSE,
    "brazil": BRAZILIAN_UNIVERSE,
    "australian": AUSTRALIAN_UNIVERSE,
    "australia": AUSTRALIAN_UNIVERSE,
    "emerging": EMERGING_MARKET_UNIVERSE,
    "emerging markets": EMERGING_MARKET_UNIVERSE,

    # Thematic
    "ev": ELECTRIC_VEHICLE,
    "electric vehicle": ELECTRIC_VEHICLE,
    "electric vehicles": ELECTRIC_VEHICLE,
    "crypto": CRYPTO_BLOCKCHAIN,
    "blockchain": CRYPTO_BLOCKCHAIN,
    "bitcoin": CRYPTO_BLOCKCHAIN,
    "cloud": CLOUD_SAAS,
    "saas": CLOUD_SAAS,
    "software": CLOUD_SAAS,
    "clean energy": CLEAN_ENERGY,
    "renewable": CLEAN_ENERGY,
    "solar": CLEAN_ENERGY,
    "green": CLEAN_ENERGY,
    "gaming": GAMING_METAVERSE,
    "metaverse": GAMING_METAVERSE,
    "games": GAMING_METAVERSE,

    # ETFs
    "etf": ETF_UNIVERSE,
    "etfs": ETF_UNIVERSE,
    "etf growth": ETF_GROWTH,
    "growth etf": ETF_GROWTH,
    "etf income": ETF_INCOME,
    "income etf": ETF_INCOME,
    "dividend etf": ETF_INCOME,
    "etf bond": ETF_BOND,
    "bond etf": ETF_BOND,
    "bonds": ETF_BOND,
    "etf international": ETF_INTERNATIONAL,
    "international etf": ETF_INTERNATIONAL,
    "global etf": ETF_INTERNATIONAL,

    # Dividend
    "dividend": DIVIDEND_US,
    "dividends": DIVIDEND_US,
    "dividend aristocrats": DIVIDEND_ARISTOCRATS,
    "aristocrats": DIVIDEND_ARISTOCRATS,
    "dividend global": DIVIDEND_GLOBAL,
}

# For backward compatibility
DIVIDEND_UNIVERSE = DIVIDEND_US
