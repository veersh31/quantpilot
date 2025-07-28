import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
  }

  try {
    // Try multiple data sources in order of preference

    // 1. Try Alpha Vantage first (if you have a key)
    if (process.env.ALPHA_VANTAGE_KEY) {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_KEY}`,
          { next: { revalidate: 60 } }, // Cache for 1 minute
        )

        if (response.ok) {
          const data = await response.json()
          const quote = data["Global Quote"]

          if (quote && quote["05. price"]) {
            return NextResponse.json({
              symbol,
              price: Number.parseFloat(quote["05. price"]),
              change: Number.parseFloat(quote["09. change"]),
              changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
              volume: Number.parseInt(quote["06. volume"]),
              timestamp: Date.now(),
              source: "alpha_vantage",
            })
          }
        }
      } catch (error) {
        console.log(`Alpha Vantage error for ${symbol}:`, error)
      }
    }

    // 2. Try Polygon.io (if you have a key)
    if (process.env.POLYGON_KEY) {
      try {
        const response = await fetch(
          `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apikey=${process.env.POLYGON_KEY}`,
          { next: { revalidate: 60 } },
        )

        if (response.ok) {
          const data = await response.json()
          if (data.results && data.results.length > 0) {
            const result = data.results[0]
            return NextResponse.json({
              symbol,
              price: result.c,
              change: result.c - result.o,
              changePercent: ((result.c - result.o) / result.o) * 100,
              volume: result.v,
              timestamp: Date.now(),
              source: "polygon",
            })
          }
        }
      } catch (error) {
        console.log(`Polygon error for ${symbol}:`, error)
      }
    }

    // 3. Try Yahoo Finance via server-side request
    try {
      const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        next: { revalidate: 30 }, // Cache for 30 seconds
      })

      if (response.ok) {
        const data = await response.json()
        const result = data.chart?.result?.[0]

        if (result && result.meta) {
          const meta = result.meta
          const currentPrice = meta.regularMarketPrice || meta.previousClose
          const previousClose = meta.previousClose
          const change = currentPrice - previousClose
          const changePercent = (change / previousClose) * 100

          return NextResponse.json({
            symbol,
            price: Number(currentPrice.toFixed(2)),
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
            volume: meta.regularMarketVolume || 0,
            timestamp: Date.now(),
            source: "yahoo",
          })
        }
      }
    } catch (error) {
      console.log(`Yahoo Finance error for ${symbol}:`, error)
    }

    // 4. Fallback to realistic mock data
    const mockData = generateRealisticMockData(symbol)
    return NextResponse.json(mockData)
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error)
    const mockData = generateRealisticMockData(symbol)
    return NextResponse.json(mockData)
  }
}

function generateRealisticMockData(symbol: string) {
  // Updated with accurate current market levels (January 2025)
  const basePrices: Record<string, number> = {
    // Major Indices (ETFs)
    SPY: 598.45, // S&P 500 ETF
    QQQ: 515.2, // NASDAQ ETF
    VIX: 16.25, // Volatility Index

    // Individual Stocks
    AAPL: 225.8, // Apple
    NVDA: 145.5, // NVIDIA (post-split)
    MSFT: 445.2, // Microsoft
    GOOGL: 185.4, // Alphabet
    AMZN: 220.15, // Amazon
    TSLA: 415.3, // Tesla
    META: 595.8, // Meta
    JPM: 245.6, // JPMorgan
    JNJ: 148.9, // Johnson & Johnson
    V: 315.4, // Visa
    XOM: 118.75, // Exxon
    "BRK.B": 465.2, // Berkshire Hathaway
    TSM: 205.3, // Taiwan Semi
    ASML: 715.6, // ASML
  }

  const basePrice = basePrices[symbol] || 100

  // Create realistic intraday movement
  const volatilityMultiplier =
    symbol === "VIX"
      ? 0.08
      : ["TSLA", "NVDA", "META"].includes(symbol)
        ? 0.03
        : ["SPY", "QQQ"].includes(symbol)
          ? 0.008
          : 0.015

  const randomMovement = (Math.random() - 0.5) * volatilityMultiplier * 2
  const currentPrice = basePrice * (1 + randomMovement)
  const change = currentPrice - basePrice
  const changePercent = (change / basePrice) * 100

  // Realistic volume ranges
  const volumeRanges: Record<string, [number, number]> = {
    SPY: [50000000, 120000000],
    QQQ: [30000000, 80000000],
    AAPL: [40000000, 100000000],
    NVDA: [200000000, 500000000],
    TSLA: [80000000, 200000000],
    MSFT: [20000000, 50000000],
    GOOGL: [15000000, 35000000],
    AMZN: [25000000, 60000000],
  }

  const [minVol, maxVol] = volumeRanges[symbol] || [1000000, 10000000]
  const volume = Math.floor(Math.random() * (maxVol - minVol) + minVol)

  return {
    symbol,
    price: Number(currentPrice.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    volume,
    timestamp: Date.now(),
    source: "mock",
  }
}
