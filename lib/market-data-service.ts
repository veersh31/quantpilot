// Real-time market data service with multiple data sources
export interface MarketDataPoint {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: number
  source: "iex" | "alpha_vantage" | "polygon" | "mock"
}

export interface MarketNews {
  id: string
  title: string
  summary: string
  source: string
  timestamp: number
  relevantSymbols: string[]
  sentiment: "positive" | "negative" | "neutral"
  impact: "high" | "medium" | "low"
}

export interface EconomicIndicator {
  name: string
  value: number
  change: number
  timestamp: number
  status: "high" | "low" | "neutral"
}

class MarketDataService {
  private wsConnections: Map<string, WebSocket> = new Map()
  private dataCache: Map<string, MarketDataPoint> = new Map()
  private subscribers: Map<string, Set<(data: MarketDataPoint) => void>> = new Map()
  private newsCache: MarketNews[] = []
  private economicData: Map<string, EconomicIndicator> = new Map()

  constructor() {
    this.initializeEconomicData()
    this.startMarketDataUpdates()
    this.startNewsUpdates()
  }

  private initializeEconomicData() {
    // Initialize with current values that will be updated
    this.economicData.set("VIX", {
      name: "VIX",
      value: 18.45,
      change: -1.23,
      timestamp: Date.now(),
      status: "low",
    })

    this.economicData.set("10Y_TREASURY", {
      name: "10Y Treasury",
      value: 4.25,
      change: 0.05,
      timestamp: Date.now(),
      status: "neutral",
    })

    this.economicData.set("DXY", {
      name: "DXY",
      value: 103.45,
      change: 0.12,
      timestamp: Date.now(),
      status: "neutral",
    })

    this.economicData.set("GOLD", {
      name: "Gold",
      value: 2045.3,
      change: 15.2,
      timestamp: Date.now(),
      status: "high",
    })
  }

  private async fetchRealTimePrice(symbol: string): Promise<MarketDataPoint | null> {
    try {
      // Skip IEX Cloud since it's not working
      // 1. Try Alpha Vantage first (you have a key)
      if (process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY) {
        try {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY}`,
          )
          if (response.ok) {
            const data = await response.json()
            const quote = data["Global Quote"]
            if (quote && quote["05. price"]) {
              return {
                symbol,
                price: Number.parseFloat(quote["05. price"]),
                change: Number.parseFloat(quote["09. change"]),
                changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
                volume: Number.parseInt(quote["06. volume"]),
                timestamp: Date.now(),
                source: "alpha_vantage",
              }
            }
          }
        } catch (error) {
          console.log(`Alpha Vantage error for ${symbol}:`, error)
        }
      }

      // 2. Try Polygon.io (you have a key)
      if (process.env.NEXT_PUBLIC_POLYGON_KEY) {
        try {
          const response = await fetch(
            `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apikey=${process.env.NEXT_PUBLIC_POLYGON_KEY}`,
          )
          if (response.ok) {
            const data = await response.json()
            if (data.results && data.results.length > 0) {
              const result = data.results[0]
              return {
                symbol,
                price: result.c,
                change: result.c - result.o,
                changePercent: ((result.c - result.o) / result.o) * 100,
                volume: result.v,
                timestamp: Date.now(),
                source: "polygon",
              }
            }
          }
        } catch (error) {
          console.log(`Polygon error for ${symbol}:`, error)
        }
      }

      // 3. Fallback to realistic mock data with actual market movement patterns
      return this.generateRealisticMockData(symbol)
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error)
      return this.generateRealisticMockData(symbol)
    }
  }

  private generateRealisticMockData(symbol: string): MarketDataPoint {
    // Get base prices for major stocks
    const basePrices: Record<string, number> = {
      AAPL: 185.5,
      NVDA: 735.0,
      MSFT: 367.5,
      GOOGL: 140.0,
      AMZN: 155.9,
      TSLA: 245.0,
      JPM: 140.0,
      JNJ: 160.0,
      V: 250.0,
      XOM: 110.0,
      "BRK.B": 350.0,
      TSM: 95.0,
      ASML: 680.0,
      SPY: 475.6,
      QQQ: 384.2,
      VIX: 18.45,
    }

    const basePrice = basePrices[symbol] || 100

    // Create realistic intraday movement
    const now = new Date()
    const marketOpen = new Date(now)
    marketOpen.setHours(9, 30, 0, 0)

    const minutesSinceOpen = Math.max(0, (now.getTime() - marketOpen.getTime()) / (1000 * 60))

    // Simulate intraday volatility pattern (higher at open/close)
    const volatilityMultiplier = symbol === "VIX" ? 0.15 : ["TSLA", "NVDA"].includes(symbol) ? 0.08 : 0.04

    const timeVolatility = Math.sin((minutesSinceOpen / 390) * Math.PI) * 0.5 + 0.5
    const randomMovement = (Math.random() - 0.5) * volatilityMultiplier * timeVolatility

    const currentPrice = basePrice * (1 + randomMovement)
    const change = currentPrice - basePrice
    const changePercent = (change / basePrice) * 100

    return {
      symbol,
      price: Number(currentPrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      timestamp: Date.now(),
      source: "mock",
    }
  }

  private async fetchMarketNews(): Promise<MarketNews[]> {
    try {
      // Use your NewsAPI key
      if (process.env.NEXT_PUBLIC_NEWS_API_KEY) {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=(stock%20market%20OR%20earnings%20OR%20fed%20OR%20nasdaq%20OR%20sp500)&sortBy=publishedAt&pageSize=10&language=en&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`,
        )
        if (response.ok) {
          const data = await response.json()
          if (data.articles) {
            return data.articles.map((article: any, index: number) => ({
              id: `news_${Date.now()}_${index}`,
              title: article.title,
              summary: article.description || article.title,
              source: article.source.name,
              timestamp: new Date(article.publishedAt).getTime(),
              relevantSymbols: this.extractSymbolsFromText(article.title + " " + (article.description || "")),
              sentiment: this.analyzeSentiment(article.title + " " + (article.description || "")),
              impact: this.assessImpact(article.title),
            }))
          }
        }
      }

      // Fallback to realistic mock news
      return this.generateMockNews()
    } catch (error) {
      console.error("Error fetching news:", error)
      return this.generateMockNews()
    }
  }

  private extractSymbolsFromText(text: string): string[] {
    const symbols = ["AAPL", "NVDA", "MSFT", "GOOGL", "AMZN", "TSLA", "JPM", "JNJ", "V", "XOM"]
    return symbols.filter(
      (symbol) => text.toUpperCase().includes(symbol) || text.toUpperCase().includes(this.getCompanyName(symbol)),
    )
  }

  private getCompanyName(symbol: string): string {
    const names: Record<string, string> = {
      AAPL: "APPLE",
      NVDA: "NVIDIA",
      MSFT: "MICROSOFT",
      GOOGL: "GOOGLE",
      AMZN: "AMAZON",
      TSLA: "TESLA",
      JPM: "JPMORGAN",
      JNJ: "JOHNSON",
      V: "VISA",
      XOM: "EXXON",
    }
    return names[symbol] || symbol
  }

  private analyzeSentiment(text: string): "positive" | "negative" | "neutral" {
    const positiveWords = ["growth", "profit", "beat", "strong", "bullish", "upgrade", "buy"]
    const negativeWords = ["loss", "decline", "miss", "weak", "bearish", "downgrade", "sell"]

    const lowerText = text.toLowerCase()
    const positiveCount = positiveWords.filter((word) => lowerText.includes(word)).length
    const negativeCount = negativeWords.filter((word) => lowerText.includes(word)).length

    if (positiveCount > negativeCount) return "positive"
    if (negativeCount > positiveCount) return "negative"
    return "neutral"
  }

  private assessImpact(title: string): "high" | "medium" | "low" {
    const highImpactWords = ["fed", "earnings", "merger", "acquisition", "bankruptcy", "lawsuit"]
    const mediumImpactWords = ["guidance", "forecast", "analyst", "rating", "target"]

    const lowerTitle = title.toLowerCase()
    if (highImpactWords.some((word) => lowerTitle.includes(word))) return "high"
    if (mediumImpactWords.some((word) => lowerTitle.includes(word))) return "medium"
    return "low"
  }

  private generateMockNews(): MarketNews[] {
    const mockNews = [
      {
        title: "Fed Signals Potential Rate Cuts in 2024 Following Inflation Data",
        summary: "Federal Reserve officials hint at possible rate reductions as inflation shows signs of cooling",
        relevantSymbols: ["SPY", "QQQ", "AAPL", "MSFT"],
        impact: "high" as const,
      },
      {
        title: "NVIDIA Announces New AI Chip Architecture for Data Centers",
        summary: "Company unveils next-generation GPU technology targeting enterprise AI workloads",
        relevantSymbols: ["NVDA", "AMD", "INTC"],
        impact: "high" as const,
      },
      {
        title: "Tech Earnings Season Preview: High Expectations Set",
        summary: "Analysts expect strong performance from major technology companies this quarter",
        relevantSymbols: ["AAPL", "GOOGL", "MSFT", "AMZN"],
        impact: "medium" as const,
      },
    ]

    return mockNews.map((news, index) => ({
      id: `mock_news_${Date.now()}_${index}`,
      title: news.title,
      summary: news.summary,
      source: "Market Wire",
      timestamp: Date.now() - index * 3600000, // Stagger by hours
      relevantSymbols: news.relevantSymbols,
      sentiment: this.analyzeSentiment(news.title + " " + news.summary),
      impact: news.impact,
    }))
  }

  private startMarketDataUpdates() {
    // Update market data every 5 seconds during market hours
    setInterval(async () => {
      const symbols = ["AAPL", "NVDA", "MSFT", "GOOGL", "AMZN", "TSLA", "SPY", "QQQ", "VIX"]

      for (const symbol of symbols) {
        const data = await this.fetchRealTimePrice(symbol)
        if (data) {
          this.dataCache.set(symbol, data)
          this.notifySubscribers(symbol, data)
        }
      }

      // Update economic indicators
      this.updateEconomicIndicators()
    }, 5000)
  }

  private startNewsUpdates() {
    // Update news every 5 minutes
    setInterval(async () => {
      const news = await this.fetchMarketNews()
      this.newsCache = news
    }, 300000)

    // Initial load
    this.fetchMarketNews().then((news) => {
      this.newsCache = news
    })
  }

  private updateEconomicIndicators() {
    // Update VIX with realistic movement
    const vix = this.economicData.get("VIX")
    if (vix) {
      const change = (Math.random() - 0.5) * 2 // ±1 point movement
      vix.value = Math.max(10, Math.min(50, vix.value + change))
      vix.change = change
      vix.timestamp = Date.now()
      vix.status = vix.value < 20 ? "low" : vix.value > 30 ? "high" : "neutral"
    }

    // Update other indicators similarly
    const treasury = this.economicData.get("10Y_TREASURY")
    if (treasury) {
      const change = (Math.random() - 0.5) * 0.1
      treasury.value = Math.max(3, Math.min(6, treasury.value + change))
      treasury.change = change
      treasury.timestamp = Date.now()
    }
  }

  private notifySubscribers(symbol: string, data: MarketDataPoint) {
    const subscribers = this.subscribers.get(symbol)
    if (subscribers) {
      subscribers.forEach((callback) => callback(data))
    }
  }

  // Public API
  public subscribe(symbol: string, callback: (data: MarketDataPoint) => void): () => void {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set())
    }
    this.subscribers.get(symbol)!.add(callback)

    // Send current data immediately if available
    const currentData = this.dataCache.get(symbol)
    if (currentData) {
      callback(currentData)
    } else {
      // Fetch initial data
      this.fetchRealTimePrice(symbol).then((data) => {
        if (data) {
          this.dataCache.set(symbol, data)
          callback(data)
        }
      })
    }

    // Return unsubscribe function
    return () => {
      this.subscribers.get(symbol)?.delete(callback)
    }
  }

  public getCurrentPrice(symbol: string): MarketDataPoint | null {
    return this.dataCache.get(symbol) || null
  }

  public getMarketNews(): MarketNews[] {
    return this.newsCache
  }

  public getEconomicIndicators(): EconomicIndicator[] {
    return Array.from(this.economicData.values())
  }

  public getMarketIndices(): MarketDataPoint[] {
    return ["SPY", "QQQ", "VIX"].map((symbol) => this.dataCache.get(symbol) || this.generateRealisticMockData(symbol))
  }
}

// Singleton instance
export const marketDataService = new MarketDataService()
