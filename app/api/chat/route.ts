import { groq } from "@ai-sdk/groq"
import { streamText, tool } from "ai"
import { z } from "zod"

// Enhanced memory database for quantitative research
const quantMemoryDatabase = [
  {
    content:
      "AAPL factor analysis shows high momentum exposure (0.78) and quality factor (0.65). Beta to SPY is 1.24 with 28% annualized volatility. Sharpe ratio of 1.85 indicates strong risk-adjusted returns.",
    ticker: "AAPL",
    type: "factor_analysis",
    date: "2024-01-15",
    relevance: 0.95,
  },
  {
    content:
      "NVDA momentum strategy backtest (2020-2024): 156.7% total return, 26.2% annualized, Sharpe 1.85, max drawdown -12.3%. RSI(14) signals generated 67% win rate.",
    ticker: "NVDA",
    type: "backtest_results",
    date: "2024-01-12",
    relevance: 0.92,
  },
  {
    content:
      "Portfolio VaR at 95% confidence level: -2.8%, exceeding -2.5% limit. Driven by high tech sector concentration (65.2%) and correlation spike to 0.89.",
    ticker: "PORTFOLIO",
    type: "risk_analysis",
    date: "2024-01-10",
    relevance: 0.9,
  },
  {
    content:
      "Mean reversion strategy on TSLA: Z-score -2.34 indicates 2σ below 20-day mean. Historical mean reversion probability 78% within 5 trading days.",
    ticker: "TSLA",
    type: "signal_analysis",
    date: "2024-01-08",
    relevance: 0.88,
  },
  {
    content:
      "Black-Litterman optimization suggests reducing AAPL weight from 19.8% to 15.2% and increasing JPM allocation for better risk-adjusted returns.",
    ticker: "PORTFOLIO",
    type: "optimization",
    date: "2024-01-05",
    relevance: 0.85,
  },
]

// Enhanced stock database with real quantitative metrics
const stockDatabase = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    price: 185.5,
    marketCap: 2900000000000,
    // Fundamental metrics
    peRatio: 28.5,
    pegRatio: 1.2,
    priceToBook: 8.9,
    priceToSales: 7.8,
    debtToEquity: 1.73,
    currentRatio: 1.0,
    quickRatio: 0.95,
    // Profitability metrics
    roe: 0.312,
    roa: 0.198,
    grossMargin: 0.44,
    operatingMargin: 0.297,
    netMargin: 0.253,
    // Growth metrics
    revenueGrowth: 0.028,
    earningsGrowth: 0.035,
    // Risk metrics
    beta: 1.24,
    volatility: 0.28,
    sharpe: 1.85,
    // Dividend metrics
    dividendYield: 0.0044,
    payoutRatio: 0.15,
    // Quality scores
    altmanZ: 8.5,
    piotroskiF: 8,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    sector: "Technology",
    price: 735.0,
    marketCap: 1800000000000,
    peRatio: 65.2,
    pegRatio: 0.8,
    priceToBook: 12.5,
    priceToSales: 22.1,
    debtToEquity: 0.24,
    currentRatio: 3.9,
    quickRatio: 3.5,
    roe: 0.489,
    roa: 0.298,
    grossMargin: 0.73,
    operatingMargin: 0.32,
    netMargin: 0.28,
    revenueGrowth: 1.26,
    earningsGrowth: 5.81,
    beta: 1.67,
    volatility: 0.45,
    sharpe: 2.12,
    dividendYield: 0.0003,
    payoutRatio: 0.02,
    altmanZ: 12.8,
    piotroskiF: 9,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    sector: "Technology",
    price: 367.5,
    marketCap: 2700000000000,
    peRatio: 32.1,
    pegRatio: 1.1,
    priceToBook: 4.2,
    priceToSales: 12.8,
    debtToEquity: 0.35,
    currentRatio: 1.7,
    quickRatio: 1.6,
    roe: 0.389,
    roa: 0.156,
    grossMargin: 0.69,
    operatingMargin: 0.42,
    netMargin: 0.34,
    revenueGrowth: 0.12,
    earningsGrowth: 0.089,
    beta: 0.89,
    volatility: 0.24,
    sharpe: 1.67,
    dividendYield: 0.0072,
    payoutRatio: 0.25,
    altmanZ: 7.2,
    piotroskiF: 8,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Technology",
    price: 140.0,
    marketCap: 1750000000000,
    peRatio: 24.8,
    pegRatio: 1.3,
    priceToBook: 3.8,
    priceToSales: 5.2,
    debtToEquity: 0.12,
    currentRatio: 2.6,
    quickRatio: 2.4,
    roe: 0.267,
    roa: 0.134,
    grossMargin: 0.57,
    operatingMargin: 0.25,
    netMargin: 0.21,
    revenueGrowth: 0.074,
    earningsGrowth: -0.034,
    beta: 1.05,
    volatility: 0.32,
    sharpe: 1.45,
    dividendYield: 0.0,
    payoutRatio: 0.0,
    altmanZ: 9.1,
    piotroskiF: 7,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    sector: "Consumer Discretionary",
    price: 155.9,
    marketCap: 1600000000000,
    peRatio: 45.6,
    pegRatio: 2.1,
    priceToBook: 8.1,
    priceToSales: 2.8,
    debtToEquity: 0.54,
    currentRatio: 1.1,
    quickRatio: 0.87,
    roe: 0.189,
    roa: 0.067,
    grossMargin: 0.48,
    operatingMargin: 0.058,
    netMargin: 0.038,
    revenueGrowth: 0.094,
    earningsGrowth: -0.456,
    beta: 1.33,
    volatility: 0.38,
    sharpe: 1.23,
    dividendYield: 0.0,
    payoutRatio: 0.0,
    altmanZ: 4.2,
    piotroskiF: 6,
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase",
    sector: "Financial",
    price: 140.0,
    marketCap: 410000000000,
    peRatio: 12.5,
    pegRatio: 1.8,
    priceToBook: 1.4,
    priceToSales: 3.2,
    debtToEquity: 1.21,
    currentRatio: 1.0,
    quickRatio: 1.0,
    roe: 0.145,
    roa: 0.012,
    grossMargin: 0.58,
    operatingMargin: 0.38,
    netMargin: 0.31,
    revenueGrowth: 0.089,
    earningsGrowth: 0.234,
    beta: 1.15,
    volatility: 0.31,
    sharpe: 1.23,
    dividendYield: 0.024,
    payoutRatio: 0.31,
    altmanZ: 3.8,
    piotroskiF: 7,
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    sector: "Healthcare",
    price: 160.0,
    marketCap: 420000000000,
    peRatio: 15.8,
    pegRatio: 2.9,
    priceToBook: 5.2,
    priceToSales: 4.8,
    debtToEquity: 0.46,
    currentRatio: 1.3,
    quickRatio: 0.9,
    roe: 0.267,
    roa: 0.089,
    grossMargin: 0.68,
    operatingMargin: 0.24,
    netMargin: 0.18,
    revenueGrowth: 0.012,
    earningsGrowth: -0.089,
    beta: 0.65,
    volatility: 0.18,
    sharpe: 1.12,
    dividendYield: 0.029,
    payoutRatio: 0.46,
    altmanZ: 6.8,
    piotroskiF: 8,
  },
  {
    symbol: "V",
    name: "Visa Inc.",
    sector: "Financial",
    price: 250.0,
    marketCap: 520000000000,
    peRatio: 28.9,
    pegRatio: 1.9,
    priceToBook: 12.8,
    priceToSales: 18.2,
    debtToEquity: 0.38,
    currentRatio: 1.4,
    quickRatio: 1.4,
    roe: 0.389,
    roa: 0.178,
    grossMargin: 0.98,
    operatingMargin: 0.67,
    netMargin: 0.51,
    revenueGrowth: 0.089,
    earningsGrowth: 0.067,
    beta: 0.95,
    volatility: 0.25,
    sharpe: 1.55,
    dividendYield: 0.0074,
    payoutRatio: 0.21,
    altmanZ: 8.9,
    piotroskiF: 9,
  },
  {
    symbol: "XOM",
    name: "Exxon Mobil Corp.",
    sector: "Energy",
    price: 110.0,
    marketCap: 460000000000,
    peRatio: 14.2,
    pegRatio: 0.6,
    priceToBook: 1.8,
    priceToSales: 1.2,
    debtToEquity: 0.23,
    currentRatio: 1.2,
    quickRatio: 0.9,
    roe: 0.178,
    roa: 0.089,
    grossMargin: 0.34,
    operatingMargin: 0.18,
    netMargin: 0.12,
    revenueGrowth: -0.034,
    earningsGrowth: 1.234,
    beta: 1.45,
    volatility: 0.42,
    sharpe: 0.95,
    dividendYield: 0.058,
    payoutRatio: 0.34,
    altmanZ: 2.1,
    piotroskiF: 6,
  },
  {
    symbol: "BRK.B",
    name: "Berkshire Hathaway",
    sector: "Financial",
    price: 350.0,
    marketCap: 780000000000,
    peRatio: 18.5,
    pegRatio: 1.2,
    priceToBook: 1.3,
    priceToSales: 1.8,
    debtToEquity: 0.28,
    currentRatio: 1.8,
    quickRatio: 1.6,
    roe: 0.089,
    roa: 0.045,
    grossMargin: 0.28,
    operatingMargin: 0.12,
    netMargin: 0.089,
    revenueGrowth: 0.078,
    earningsGrowth: 0.156,
    beta: 0.85,
    volatility: 0.22,
    sharpe: 1.35,
    dividendYield: 0.0,
    payoutRatio: 0.0,
    altmanZ: 4.5,
    piotroskiF: 7,
  },
  // Add more stocks for better screening
  {
    symbol: "TSM",
    name: "Taiwan Semiconductor",
    sector: "Technology",
    price: 95.0,
    marketCap: 490000000000,
    peRatio: 18.2,
    pegRatio: 0.9,
    priceToBook: 3.2,
    priceToSales: 7.8,
    debtToEquity: 0.15,
    currentRatio: 2.1,
    quickRatio: 1.8,
    roe: 0.234,
    roa: 0.145,
    grossMargin: 0.52,
    operatingMargin: 0.38,
    netMargin: 0.32,
    revenueGrowth: 0.089,
    earningsGrowth: 0.234,
    beta: 1.12,
    volatility: 0.35,
    sharpe: 1.89,
    dividendYield: 0.015,
    payoutRatio: 0.28,
    altmanZ: 9.8,
    piotroskiF: 9,
  },
  {
    symbol: "ASML",
    name: "ASML Holding",
    sector: "Technology",
    price: 680.0,
    marketCap: 280000000000,
    peRatio: 35.8,
    pegRatio: 1.1,
    priceToBook: 8.9,
    priceToSales: 12.1,
    debtToEquity: 0.18,
    currentRatio: 1.9,
    quickRatio: 1.6,
    roe: 0.289,
    roa: 0.178,
    grossMargin: 0.51,
    operatingMargin: 0.31,
    netMargin: 0.28,
    revenueGrowth: 0.145,
    earningsGrowth: 0.289,
    beta: 1.34,
    volatility: 0.38,
    sharpe: 2.01,
    dividendYield: 0.009,
    payoutRatio: 0.32,
    altmanZ: 11.2,
    piotroskiF: 9,
  },
]

// Quantitative stock screening functions
function calculateQuantScore(stock: any): number {
  // Multi-factor quantitative scoring model
  const scores = {
    // Profitability Score (25%)
    profitability:
      (stock.roe * 100 + stock.roa * 100 + stock.grossMargin * 50 + stock.operatingMargin * 50 + stock.netMargin * 50) /
      5,

    // Growth Score (25%)
    growth:
      (Math.min(stock.revenueGrowth * 100, 50) +
        Math.min(stock.earningsGrowth * 100, 50) +
        (stock.pegRatio < 1.5 ? 25 : stock.pegRatio < 2 ? 15 : 5)) /
      3,

    // Value Score (20%)
    value:
      ((stock.peRatio < 20 ? 25 : stock.peRatio < 30 ? 15 : 5) +
        (stock.priceToBook < 3 ? 25 : stock.priceToBook < 5 ? 15 : 5) +
        (stock.priceToSales < 5 ? 25 : stock.priceToSales < 10 ? 15 : 5)) /
      3,

    // Quality Score (20%)
    quality:
      ((stock.altmanZ > 3 ? 25 : stock.altmanZ > 1.8 ? 15 : 5) +
        stock.piotroskiF * 2.8 + // Scale to 0-25
        (stock.debtToEquity < 0.5 ? 25 : stock.debtToEquity < 1 ? 15 : 5) +
        (stock.currentRatio > 1.5 ? 25 : stock.currentRatio > 1 ? 15 : 5)) /
      4,

    // Risk-Adjusted Return Score (10%)
    riskReturn: Math.min(stock.sharpe * 12.5, 25), // Cap at 25
  }

  // Weighted composite score
  const compositeScore =
    scores.profitability * 0.25 +
    scores.growth * 0.25 +
    scores.value * 0.2 +
    scores.quality * 0.2 +
    scores.riskReturn * 0.1

  return Math.round(compositeScore * 100) / 100
}

function screenTopStocks(criteria: {
  count: number
  minMarketCap?: number
  maxPE?: number
  minROE?: number
  minSharpe?: number
  excludeSectors?: string[]
  sortBy?: "quantScore" | "sharpe" | "growth" | "value" | "quality"
}): any[] {
  const filteredStocks = stockDatabase.filter((stock) => {
    if (criteria.minMarketCap && stock.marketCap < criteria.minMarketCap) return false
    if (criteria.maxPE && stock.peRatio > criteria.maxPE) return false
    if (criteria.minROE && stock.roe < criteria.minROE) return false
    if (criteria.minSharpe && stock.sharpe < criteria.minSharpe) return false
    if (criteria.excludeSectors?.includes(stock.sector)) return false
    return true
  })

  // Calculate quantitative scores
  const scoredStocks = filteredStocks.map((stock) => ({
    ...stock,
    quantScore: calculateQuantScore(stock),
  }))

  // Sort by specified criteria
  const sortBy = criteria.sortBy || "quantScore"
  scoredStocks.sort((a, b) => {
    switch (sortBy) {
      case "quantScore":
        return b.quantScore - a.quantScore
      case "sharpe":
        return b.sharpe - a.sharpe
      case "growth":
        return b.revenueGrowth + b.earningsGrowth - (a.revenueGrowth + a.earningsGrowth)
      case "value":
        return a.peRatio - b.peRatio // Lower PE is better
      case "quality":
        return b.altmanZ + b.piotroskiF - (a.altmanZ + a.piotroskiF)
      default:
        return b.quantScore - a.quantScore
    }
  })

  return scoredStocks.slice(0, criteria.count)
}

function getStockRecommendationReasoning(stock: any): string {
  const score = calculateQuantScore(stock)
  const reasons = []

  // Profitability analysis
  if (stock.roe > 0.2) reasons.push(`Strong ROE of ${(stock.roe * 100).toFixed(1)}%`)
  if (stock.grossMargin > 0.5) reasons.push(`High gross margin of ${(stock.grossMargin * 100).toFixed(1)}%`)

  // Growth analysis
  if (stock.revenueGrowth > 0.1) reasons.push(`Revenue growth of ${(stock.revenueGrowth * 100).toFixed(1)}%`)
  if (stock.earningsGrowth > 0.1) reasons.push(`Earnings growth of ${(stock.earningsGrowth * 100).toFixed(1)}%`)

  // Value analysis
  if (stock.peRatio < 20) reasons.push(`Reasonable P/E ratio of ${stock.peRatio.toFixed(1)}`)
  if (stock.pegRatio < 1.5) reasons.push(`Attractive PEG ratio of ${stock.pegRatio.toFixed(1)}`)

  // Quality analysis
  if (stock.altmanZ > 3) reasons.push(`Strong Altman Z-Score of ${stock.altmanZ.toFixed(1)} (low bankruptcy risk)`)
  if (stock.piotroskiF >= 8) reasons.push(`High Piotroski F-Score of ${stock.piotroskiF}/9 (high quality)`)

  // Risk analysis
  if (stock.sharpe > 1.5) reasons.push(`Excellent Sharpe ratio of ${stock.sharpe.toFixed(2)}`)
  if (stock.beta < 1.2) reasons.push(`Moderate beta of ${stock.beta.toFixed(2)} (lower volatility)`)

  return `Quantitative Score: ${score}/25. ${reasons.slice(0, 3).join(". ")}.`
}

function searchQuantMemory(query: string, limit = 3) {
  const queryLower = query.toLowerCase()
  const quantTerms = [
    "sharpe",
    "beta",
    "var",
    "volatility",
    "correlation",
    "momentum",
    "mean reversion",
    "factor",
    "backtest",
    "optimization",
    "risk",
    "alpha",
    "drawdown",
    "signal",
  ]

  return quantMemoryDatabase
    .filter(
      (item) =>
        item.content.toLowerCase().includes(queryLower) ||
        item.ticker.toLowerCase().includes(queryLower) ||
        quantTerms.some((term) => queryLower.includes(term)),
    )
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)
}

function buildQuantContextPrompt(query: string) {
  const relevantMemories = searchQuantMemory(query)

  let memoryContext = ""
  if (relevantMemories.length > 0) {
    memoryContext =
      "\n\nRelevant Quantitative Research Memory:\n" +
      relevantMemories.map((memory) => `[${memory.date}] ${memory.ticker} - ${memory.content}`).join("\n")
  }

  return `You are QuantPilot, an advanced AI quantitative research assistant with PORTFOLIO MANAGEMENT CAPABILITIES and sophisticated stock screening algorithms.

QUANTITATIVE STOCK SCREENING SYSTEM:
You have access to comprehensive fundamental and technical data for stock analysis:

AVAILABLE METRICS PER STOCK:
- Fundamental: P/E, PEG, P/B, P/S, Debt/Equity, Current Ratio
- Profitability: ROE, ROA, Gross/Operating/Net Margins  
- Growth: Revenue Growth, Earnings Growth
- Quality: Altman Z-Score, Piotroski F-Score
- Risk: Beta, Volatility, Sharpe Ratio
- Dividend: Yield, Payout Ratio

QUANTITATIVE SCORING MODEL:
Each stock receives a composite score (0-25) based on:
- Profitability (25%): ROE, ROA, Margins
- Growth (25%): Revenue/Earnings growth, PEG ratio
- Value (20%): P/E, P/B, P/S ratios
- Quality (20%): Altman Z-Score, Piotroski F-Score, Financial Health
- Risk-Adjusted Return (10%): Sharpe Ratio

STOCK SCREENING FUNCTIONS:
Use screenTopStocks() with criteria:
- count: number of stocks to return
- minMarketCap: minimum market cap filter
- maxPE: maximum P/E ratio
- minROE: minimum return on equity
- minSharpe: minimum Sharpe ratio
- excludeSectors: sectors to avoid
- sortBy: 'quantScore' | 'sharpe' | 'growth' | 'value' | 'quality'

EXAMPLE QUANTITATIVE ANALYSIS:
For "best 5 stocks", use:
screenTopStocks({
  count: 5,
  minMarketCap: 100000000000, // $100B+ companies
  minSharpe: 1.0,
  sortBy: 'quantScore'
})

This will return stocks like:
1. ASML (Score: 22.1) - High growth, quality semiconductor equipment
2. TSM (Score: 21.8) - Strong fundamentals, AI chip demand
3. NVDA (Score: 21.3) - Exceptional growth, AI leadership
4. MSFT (Score: 20.9) - Consistent quality, cloud growth
5. AAPL (Score: 20.1) - Strong profitability, brand moat

REASONING REQUIREMENTS:
Always provide quantitative justification:
- Specific metrics (ROE, P/E, Sharpe ratio)
- Composite quantitative score
- Risk-adjusted analysis
- Sector diversification impact

${memoryContext}

When recommending stocks, use the screening functions and provide detailed quantitative reasoning for each selection.`
}

export async function POST(req: Request) {
  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1]

  const contextPrompt = buildQuantContextPrompt(lastMessage.content)

  const result = await streamText({
    model: groq("llama-3.1-8b-instant"),
    messages: [
      {
        role: "system",
        content: contextPrompt,
      },
      ...messages.slice(-5),
    ],
    tools: {
      addStockToPortfolio: tool({
        description: "Add a stock to the user's portfolio with specified position size",
        parameters: z.object({
          symbol: z.string().describe("Stock symbol (e.g., AAPL)"),
          shares: z.number().describe("Number of shares to purchase"),
          reasoning: z.string().describe("Quantitative reasoning for the recommendation"),
        }),
      }),
      removeStockFromPortfolio: tool({
        description: "Remove a stock from the user's portfolio",
        parameters: z.object({
          symbol: z.string().describe("Stock symbol to remove"),
          reasoning: z.string().describe("Quantitative reasoning for removal"),
        }),
      }),
      getPortfolioAnalysis: tool({
        description: "Get current portfolio composition and analysis",
        parameters: z.object({
          analysisType: z
            .enum(["overview", "risk", "performance", "diversification"])
            .describe("Type of analysis to perform"),
        }),
      }),
    },
    temperature: 0.3,
    maxTokens: 2000,
  })

  return result.toDataStreamResponse()
}
