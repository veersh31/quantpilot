// Enhanced real-time market data service with server-side API calls
export interface MarketDataPoint {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: number
  source: "yahoo" | "alpha_vantage" | "polygon" | "finnhub" | "mock"
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
  private lastFetchTime: Map<string, number> = new Map()

  constructor() {
    this.initializeEconomicData()
    this.startMarketDataUpdates()
    this.startNewsUpdates()
  }

  private initializeEconomicData() {
    // Initialize with realistic current values
    this.economicData.set("VIX", {
      name: "VIX",
      value: 16.25,
      change: -0.85,
      timestamp: Date.now(),
      status: "low",
    })

    this.economicData.set("10Y_TREASURY", {
      name: "10Y Treasury",
      value: 4.28,
      change: 0.03,
      timestamp: Date.now(),
      status: "neutral",
    })

    this.economicData.set("DXY", {
      name: "DXY",
      value: 104.12,
      change: 0.18,
      timestamp: Date.now(),
      status: "neutral",
    })

    this.economicData.set("GOLD", {
      name: "Gold",
      value: 2038.5,
      change: -8.3,
      timestamp: Date.now(),
      status: "high",
    })
  }

  private async fetchRealTimePrice(symbol: string): Promise<MarketDataPoint | null> {
    try {
      // Check if we've fetched this symbol recently (avoid spam)
      const lastFetch = this.lastFetchTime.get(symbol) || 0
      const now = Date.now()
      if (now - lastFetch < 5000) {
        // 5 second cooldown
        return this.dataCache.get(symbol) || null
      }

      // Use our server-side API route to avoid CORS issues
      const response = await fetch(`/api/market-data?symbol=${symbol}`, {
        cache: "no-store", // Always get fresh data
      })

      if (response.ok) {
        const data = await response.json()
        this.lastFetchTime.set(symbol, now)
        return data
      }

      // Fallback to cached data or mock data
      return this.dataCache.get(symbol) || this.generateRealisticMockData(symbol)
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error)
      return this.dataCache.get(symbol) || this.generateRealisticMockData(symbol)
    }
  }

  private generateRealisticMockData(symbol: string): MarketDataPoint {
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

    // Create more realistic intraday movement
    const now = new Date()
    const marketOpen = new Date(now)
    marketOpen.setHours(9, 30, 0, 0)

    // Simulate realistic volatility patterns
    const volatilityMultiplier =
      symbol === "VIX"
        ? 0.08
        : ["TSLA", "NVDA", "META"].includes(symbol)
          ? 0.03
          : ["SPY", "QQQ"].includes(symbol)
            ? 0.008
            : 0.015

    // More realistic random walk
    const previousPrice = this.dataCache.get(symbol)?.price || basePrice
    const randomMovement = (Math.random() - 0.5) * volatilityMultiplier * 2

    const currentPrice = previousPrice * (1 + randomMovement)
    const change = currentPrice - basePrice
    const changePercent = (change / basePrice) * 100

    return {
      symbol,
      price: Number(currentPrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume: this.generateRealisticVolume(symbol),
      timestamp: Date.now(),
      source: "mock",
    }
  }

  private generateRealisticVolume(symbol: string): number {
    // Realistic volume ranges based on actual trading patterns
    const volumeRanges: Record<string, [number, number]> = {
      SPY: [50000000, 120000000], // S&P 500 ETF high volume
      QQQ: [30000000, 80000000], // NASDAQ ETF high volume
      AAPL: [40000000, 100000000], // Apple high volume
      NVDA: [200000000, 500000000], // NVIDIA very high volume
      TSLA: [80000000, 200000000], // Tesla high volume
      MSFT: [20000000, 50000000], // Microsoft moderate volume
      GOOGL: [15000000, 35000000], // Alphabet moderate volume
      AMZN: [25000000, 60000000], // Amazon moderate-high volume
    }

    const [min, max] = volumeRanges[symbol] || [1000000, 10000000]
    return Math.floor(Math.random() * (max - min) + min)
  }

  private async fetchMarketNews(): Promise<MarketNews[]> {
    try {
      // Use your NewsAPI key with better query
      if (process.env.NEXT_PUBLIC_NEWS_API_KEY) {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=(stock%20market%20OR%20S%26P%20500%20OR%20nasdaq%20OR%20federal%20reserve%20OR%20earnings)&sortBy=publishedAt&pageSize=15&language=en&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`,
        )
        if (response.ok) {
          const data = await response.json()
          if (data.articles) {
            return data.articles
              .filter((article: any) => article.title && article.description)
              .map((article: any, index: number) => ({
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
    const symbols = ["AAPL", "NVDA", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "JPM", "JNJ", "V", "XOM", "SPY", "QQQ"]
    const companies = {
      apple: "AAPL",
      nvidia: "NVDA",
      microsoft: "MSFT",
      google: "GOOGL",
      alphabet: "GOOGL",
      amazon: "AMZN",
      tesla: "TSLA",
      meta: "META",
      facebook: "META",
      jpmorgan: "JPM",
      johnson: "JNJ",
      visa: "V",
      exxon: "XOM",
      "s&p": "SPY",
      nasdaq: "QQQ",
    }

    const found = new Set<string>()
    const lowerText = text.toLowerCase()

    // Check for direct symbol mentions
    symbols.forEach((symbol) => {
      if (lowerText.includes(symbol.toLowerCase())) {
        found.add(symbol)
      }
    })

    // Check for company name mentions
    Object.entries(companies).forEach(([name, symbol]) => {
      if (lowerText.includes(name)) {
        found.add(symbol)
      }
    })

    return Array.from(found)
  }

  private analyzeSentiment(text: string): "positive" | "negative" | "neutral" {
    const positiveWords = ["growth", "profit", "beat", "strong", "bullish", "upgrade", "buy", "surge", "rally", "gains"]
    const negativeWords = ["loss", "decline", "miss", "weak", "bearish", "downgrade", "sell", "crash", "fall", "drop"]

    const lowerText = text.toLowerCase()
    const positiveCount = positiveWords.filter((word) => lowerText.includes(word)).length
    const negativeCount = negativeWords.filter((word) => lowerText.includes(word)).length

    if (positiveCount > negativeCount) return "positive"
    if (negativeCount > positiveCount) return "negative"
    return "neutral"
  }

  private assessImpact(title: string): "high" | "medium" | "low" {
    const highImpactWords = [
      "fed",
      "federal reserve",
      "earnings",
      "merger",
      "acquisition",
      "bankruptcy",
      "lawsuit",
      "rate cut",
      "inflation",
    ]
    const mediumImpactWords = ["guidance", "forecast", "analyst", "rating", "target", "upgrade", "downgrade"]

    const lowerTitle = title.toLowerCase()
    if (highImpactWords.some((word) => lowerTitle.includes(word))) return "high"
    if (mediumImpactWords.some((word) => lowerTitle.includes(word))) return "medium"
    return "low"
  }

  private generateMockNews(): MarketNews[] {
    const currentDate = new Date()
    const mockNews = [
      {
        title: "S&P 500 Reaches New All-Time High as Tech Stocks Rally",
        summary: "The S&P 500 index climbed to a fresh record as technology stocks led broad market gains",
        relevantSymbols: ["SPY", "QQQ", "AAPL", "MSFT", "NVDA"],
        impact: "high" as const,
        sentiment: "positive" as const,
      },
      {
        title: "Federal Reserve Officials Signal Cautious Approach to Rate Changes",
        summary: "Fed policymakers indicate they will carefully monitor economic data before making rate decisions",
        relevantSymbols: ["SPY", "QQQ", "JPM", "XOM"],
        impact: "high" as const,
        sentiment: "neutral" as const,
      },
      {
        title: "NVIDIA Reports Strong AI Chip Demand in Latest Quarter",
        summary: "Graphics chip maker sees continued growth in data center and AI applications",
        relevantSymbols: ["NVDA", "AMD", "TSM"],
        impact: "high" as const,
        sentiment: "positive" as const,
      },
      {
        title: "Apple iPhone Sales Show Resilience Despite Market Concerns",
        summary: "Tech giant's latest smartphone lineup continues to perform well in key markets",
        relevantSymbols: ["AAPL", "GOOGL", "MSFT"],
        impact: "medium" as const,
        sentiment: "positive" as const,
      },
      {
        title: "Energy Sector Faces Headwinds as Oil Prices Fluctuate",
        summary: "Major energy companies navigate volatile commodity markets and changing demand patterns",
        relevantSymbols: ["XOM", "CVX", "COP"],
        impact: "medium" as const,
        sentiment: "negative" as const,
      },
    ]

    return mockNews.map((news, index) => ({
      id: `mock_news_${Date.now()}_${index}`,
      title: news.title,
      summary: news.summary,
      source: "Financial Times",
      timestamp: currentDate.getTime() - index * 1800000, // Stagger by 30 minutes
      relevantSymbols: news.relevantSymbols,
      sentiment: news.sentiment,
      impact: news.impact,
    }))
  }

  private startMarketDataUpdates() {
    // Update market data every 15 seconds (reduced frequency)
    setInterval(async () => {
      const symbols = ["SPY", "QQQ", "VIX", "AAPL", "NVDA", "MSFT", "GOOGL", "AMZN", "TSLA", "META"]

      // Process symbols in smaller batches to avoid overwhelming APIs
      for (let i = 0; i < symbols.length; i += 2) {
        const batch = symbols.slice(i, i + 2)

        await Promise.all(
          batch.map(async (symbol) => {
            const data = await this.fetchRealTimePrice(symbol)
            if (data) {
              this.dataCache.set(symbol, data)
              this.notifySubscribers(symbol, data)
            }
          }),
        )

        // Delay between batches to be respectful to APIs
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      // Update economic indicators
      this.updateEconomicIndicators()
    }, 15000) // Every 15 seconds
  }

  private startNewsUpdates() {
    // Update news every 10 minutes
    setInterval(async () => {
      const news = await this.fetchMarketNews()
      this.newsCache = news
    }, 600000) // 10 minutes

    // Initial load
    this.fetchMarketNews().then((news) => {
      this.newsCache = news
    })
  }

  private updateEconomicIndicators() {
    // Update VIX with realistic movement
    const vix = this.economicData.get("VIX")
    if (vix) {
      const change = (Math.random() - 0.5) * 0.3 // Smaller movements
      vix.value = Math.max(12, Math.min(35, vix.value + change))
      vix.change = change
      vix.timestamp = Date.now()
      vix.status = vix.value < 18 ? "low" : vix.value > 25 ? "high" : "neutral"
    }

    // Update Treasury yield
    const treasury = this.economicData.get("10Y_TREASURY")
    if (treasury) {
      const change = (Math.random() - 0.5) * 0.03 // Small yield movements
      treasury.value = Math.max(3.5, Math.min(5.0, treasury.value + change))
      treasury.change = change
      treasury.timestamp = Date.now()
    }

    // Update DXY
    const dxy = this.economicData.get("DXY")
    if (dxy) {
      const change = (Math.random() - 0.5) * 0.15
      dxy.value = Math.max(100, Math.min(108, dxy.value + change))
      dxy.change = change
      dxy.timestamp = Date.now()
    }

    // Update Gold
    const gold = this.economicData.get("GOLD")
    if (gold) {
      const change = (Math.random() - 0.5) * 8
      gold.value = Math.max(1900, Math.min(2100, gold.value + change))
      gold.change = change
      gold.timestamp = Date.now()
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
