"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, Globe, Clock, Activity } from "lucide-react"
import {
  marketDataService,
  type MarketDataPoint,
  type MarketNews,
  type EconomicIndicator,
} from "@/lib/market-data-service"

export function RealTimeMarketData() {
  const [indices, setIndices] = useState<MarketDataPoint[]>([])
  const [news, setNews] = useState<MarketNews[]>([])
  const [economicIndicators, setEconomicIndicators] = useState<EconomicIndicator[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Subscribe to market indices
    const unsubscribeFunctions: (() => void)[] = []

    const subscribeToSymbol = (symbol: string) => {
      const unsubscribe = marketDataService.subscribe(symbol, (data) => {
        setIndices((prev) => {
          const updated = prev.filter((item) => item.symbol !== symbol)
          return [...updated, data].sort((a, b) => a.symbol.localeCompare(b.symbol))
        })
        setLastUpdate(new Date())
        setIsConnected(true)
      })
      unsubscribeFunctions.push(unsubscribe)
    }

    // Subscribe to major indices
    ;["SPY", "QQQ", "VIX"].forEach(subscribeToSymbol)

    // Update news and economic indicators
    const updateInterval = setInterval(() => {
      setNews(marketDataService.getMarketNews())
      setEconomicIndicators(marketDataService.getEconomicIndicators())
    }, 10000) // Update every 10 seconds

    // Initial load
    setNews(marketDataService.getMarketNews())
    setEconomicIndicators(marketDataService.getEconomicIndicators())

    return () => {
      unsubscribeFunctions.forEach((unsubscribe) => unsubscribe())
      clearInterval(updateInterval)
    }
  }, [])

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 dark:text-green-400"
      case "negative":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high":
        return "text-red-600 dark:text-red-400"
      case "low":
        return "text-green-600 dark:text-green-400"
      case "neutral":
        return "text-slate-600 dark:text-slate-400"
      default:
        return "text-slate-600 dark:text-slate-400"
    }
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className={`h-4 w-4 ${isConnected ? "text-green-500" : "text-red-500"}`} />
          <span className="text-sm text-muted-foreground">{isConnected ? "Live Data Connected" : "Connecting..."}</span>
          <span className="text-xs text-muted-foreground">Last update: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Market Indices */}
      <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Live Market Overview
          </CardTitle>
          <CardDescription>Real-time market indices and key indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {indices.map((index) => (
              <div key={index.symbol} className="p-4 border rounded-lg bg-gradient-to-r from-background to-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">
                    {index.symbol === "SPY" ? "S&P 500" : index.symbol === "QQQ" ? "NASDAQ" : index.symbol}
                  </h3>
                  {index.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="text-2xl font-bold mb-1">{index.price.toFixed(2)}</div>
                <div
                  className={`text-sm flex items-center gap-2 ${index.change > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  <span>
                    {index.change > 0 ? "+" : ""}
                    {index.change.toFixed(2)}
                  </span>
                  <span>
                    ({index.changePercent > 0 ? "+" : ""}
                    {index.changePercent.toFixed(2)}%)
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Vol: {index.volume.toLocaleString()} • {index.source.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Economic Indicators */}
      <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Live Economic Indicators</CardTitle>
          <CardDescription>Key economic metrics affecting portfolio decisions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {economicIndicators.map((indicator) => (
              <div key={indicator.name} className="p-3 border rounded-lg bg-gradient-to-r from-background to-muted/20">
                <h4 className="font-medium text-sm mb-1">{indicator.name}</h4>
                <div className={`text-lg font-bold ${getStatusColor(indicator.status)}`}>
                  {indicator.value.toFixed(2)}
                </div>
                <div className={`text-xs ${indicator.change > 0 ? "text-green-600" : "text-red-600"}`}>
                  {indicator.change > 0 ? "+" : ""}
                  {indicator.change.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">{formatTime(indicator.timestamp)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Market News */}
      <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Live Market News
          </CardTitle>
          <CardDescription>Latest market-moving news affecting your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {news.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Loading latest market news...</p>
              </div>
            ) : (
              news.slice(0, 5).map((newsItem) => (
                <div
                  key={newsItem.id}
                  className="p-4 border rounded-lg hover:bg-muted/20 transition-colors bg-gradient-to-r from-background to-muted/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm line-clamp-2">{newsItem.title}</h3>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge className={getImpactColor(newsItem.impact)} variant="secondary">
                        {newsItem.impact}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{newsItem.summary}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {newsItem.source}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(newsItem.timestamp)}
                      </div>
                      <div className={`flex items-center gap-1 ${getSentimentColor(newsItem.sentiment)}`}>
                        <span className="capitalize">{newsItem.sentiment}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {newsItem.relevantSymbols.slice(0, 3).map((ticker) => (
                        <Badge key={ticker} variant="outline" className="text-xs">
                          {ticker}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
