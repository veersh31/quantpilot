"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, Globe, Clock } from "lucide-react"

const marketData = {
  indices: [
    { name: "S&P 500", value: 4756.5, change: 0.85, changePercent: 0.018 },
    { name: "NASDAQ", value: 14845.12, change: -23.45, changePercent: -0.158 },
    { name: "DOW", value: 37248.35, change: 156.22, changePercent: 0.421 },
  ],
  news: [
    {
      id: 1,
      title: "Fed Signals Potential Rate Cuts in 2024",
      source: "Reuters",
      time: "2 hours ago",
      impact: "high",
      relevantTickers: ["SPY", "QQQ", "AAPL", "MSFT"],
    },
    {
      id: 2,
      title: "NVIDIA Announces New AI Chip Architecture",
      source: "Bloomberg",
      time: "4 hours ago",
      impact: "high",
      relevantTickers: ["NVDA", "AMD", "INTC"],
    },
    {
      id: 3,
      title: "Tech Earnings Season Preview: High Expectations",
      source: "CNBC",
      time: "6 hours ago",
      impact: "medium",
      relevantTickers: ["AAPL", "GOOGL", "MSFT", "AMZN"],
    },
    {
      id: 4,
      title: "Oil Prices Surge on Middle East Tensions",
      source: "WSJ",
      time: "8 hours ago",
      impact: "medium",
      relevantTickers: ["XOM", "CVX", "COP"],
    },
  ],
  economicIndicators: [
    { name: "VIX", value: 18.45, change: -1.23, status: "low" },
    { name: "10Y Treasury", value: 4.25, change: 0.05, status: "neutral" },
    { name: "DXY", value: 103.45, change: 0.12, status: "neutral" },
    { name: "Gold", value: 2045.3, change: 15.2, status: "high" },
  ],
}

export function MarketData() {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high":
        return "text-red-600"
      case "low":
        return "text-green-600"
      case "neutral":
        return "text-slate-600"
      default:
        return "text-slate-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Market Indices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Market Overview
          </CardTitle>
          <CardDescription>Real-time market indices and key indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketData.indices.map((index) => (
              <div key={index.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{index.name}</h3>
                  {index.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="text-2xl font-bold mb-1">{index.value.toLocaleString()}</div>
                <div className={`text-sm ${index.change > 0 ? "text-green-600" : "text-red-600"}`}>
                  {index.change > 0 ? "+" : ""}
                  {index.change} ({index.changePercent > 0 ? "+" : ""}
                  {index.changePercent}%)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Economic Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Economic Indicators</CardTitle>
          <CardDescription>Key economic metrics affecting portfolio decisions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {marketData.economicIndicators.map((indicator) => (
              <div key={indicator.name} className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm mb-1">{indicator.name}</h4>
                <div className={`text-lg font-bold ${getStatusColor(indicator.status)}`}>{indicator.value}</div>
                <div className={`text-xs ${indicator.change > 0 ? "text-green-600" : "text-red-600"}`}>
                  {indicator.change > 0 ? "+" : ""}
                  {indicator.change}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market News */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Market-Moving News
          </CardTitle>
          <CardDescription>Latest news affecting your portfolio holdings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketData.news.map((news) => (
              <div key={news.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm">{news.title}</h3>
                  <Badge className={getImpactColor(news.impact)}>{news.impact} impact</Badge>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    {news.source}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {news.time}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {news.relevantTickers.map((ticker) => (
                    <Badge key={ticker} variant="outline" className="text-xs">
                      {ticker}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
