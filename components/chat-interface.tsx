"use client"
import { useChat } from "@ai-sdk/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Bot,
  User,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Target,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Minus,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useState } from "react"
import type { QuantHolding } from "@/hooks/use-portfolio"

interface ChatInterfaceProps {
  onAddHolding?: (holding: Omit<QuantHolding, "value" | "weight" | "pnl" | "pnlPercent">) => void
  onRemoveHolding?: (symbol: string) => void
  holdings?: QuantHolding[]
}

// Enhanced stock database matching the API
const stockDatabase = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    price: 185.5,
    beta: 1.24,
    sharpe: 1.85,
    volatility: 0.28,
    quantScore: 20.1,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    sector: "Technology",
    price: 735.0,
    beta: 1.67,
    sharpe: 2.12,
    volatility: 0.45,
    quantScore: 21.3,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    sector: "Technology",
    price: 367.5,
    beta: 0.89,
    sharpe: 1.67,
    volatility: 0.24,
    quantScore: 20.9,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Technology",
    price: 140.0,
    beta: 1.05,
    sharpe: 1.45,
    volatility: 0.32,
    quantScore: 19.2,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    sector: "Consumer Discretionary",
    price: 155.9,
    beta: 1.33,
    sharpe: 1.23,
    volatility: 0.38,
    quantScore: 17.8,
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase",
    sector: "Financial",
    price: 140.0,
    beta: 1.15,
    sharpe: 1.23,
    volatility: 0.31,
    quantScore: 18.5,
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    sector: "Healthcare",
    price: 160.0,
    beta: 0.65,
    sharpe: 1.12,
    volatility: 0.18,
    quantScore: 19.8,
  },
  {
    symbol: "V",
    name: "Visa Inc.",
    sector: "Financial",
    price: 250.0,
    beta: 0.95,
    sharpe: 1.55,
    volatility: 0.25,
    quantScore: 18.9,
  },
  {
    symbol: "XOM",
    name: "Exxon Mobil Corp.",
    sector: "Energy",
    price: 110.0,
    beta: 1.45,
    sharpe: 0.95,
    volatility: 0.42,
    quantScore: 15.2,
  },
  {
    symbol: "BRK.B",
    name: "Berkshire Hathaway",
    sector: "Financial",
    price: 350.0,
    beta: 0.85,
    sharpe: 1.35,
    volatility: 0.22,
    quantScore: 18.1,
  },
  {
    symbol: "TSM",
    name: "Taiwan Semiconductor",
    sector: "Technology",
    price: 95.0,
    beta: 1.12,
    sharpe: 1.89,
    volatility: 0.35,
    quantScore: 21.8,
  },
  {
    symbol: "ASML",
    name: "ASML Holding",
    sector: "Technology",
    price: 680.0,
    beta: 1.34,
    sharpe: 2.01,
    volatility: 0.38,
    quantScore: 22.1,
  },
]

export function ChatInterface({ onAddHolding, onRemoveHolding, holdings = [] }: ChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    onToolCall: ({ toolCall }) => {
      if (toolCall.toolName === "addStockToPortfolio") {
        const { symbol, shares } = toolCall.args
        const stockData = stockDatabase.find((s) => s.symbol === symbol)

        if (stockData && onAddHolding) {
          const newHolding = {
            symbol: stockData.symbol,
            name: stockData.name,
            shares: shares,
            purchasePrice: stockData.price,
            currentPrice: stockData.price,
            beta: stockData.beta,
            sharpe: stockData.sharpe,
            volatility: stockData.volatility,
            sector: stockData.sector,
          }
          onAddHolding(newHolding)
        }
      } else if (toolCall.toolName === "removeStockFromPortfolio") {
        const { symbol } = toolCall.args
        if (onRemoveHolding) {
          onRemoveHolding(symbol)
        }
      } else if (toolCall.toolName === "getPortfolioAnalysis") {
        // Portfolio analysis is handled by returning current holdings data
        return {
          holdings: holdings.map((h) => ({
            symbol: h.symbol,
            weight: h.weight,
            pnl: h.pnl,
            sector: h.sector,
            beta: h.beta,
            sharpe: h.sharpe,
          })),
          totalValue: holdings.reduce((sum, h) => sum + h.value, 0),
          totalPnL: holdings.reduce((sum, h) => sum + h.pnl, 0),
        }
      }
    },
  })

  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  const quantQueries = [
    "Screen the top 5 stocks by quantitative score",
    "Find the highest Sharpe ratio stocks to add",
    "What's the lowest quality stock in my portfolio?",
    "Add defensive stocks with beta < 1.0",
    "Remove stocks with P/E ratio > 30",
    "Find undervalued growth stocks (PEG < 1.5)",
    "Add dividend aristocrats with yield > 2%",
    "Screen for quality stocks (Piotroski F-Score ≥ 8)",
  ]

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  // Update the renderToolCall function to show quantitative metrics
  const renderToolCall = (toolCall: any) => {
    switch (toolCall.toolName) {
      case "addStockToPortfolio":
        const stockInfo = stockDatabase.find((s) => s.symbol === toolCall.args.symbol)
        return (
          <div className="mt-3 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Plus className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-800 dark:text-green-200">Portfolio Action: Stock Added</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <strong>Symbol:</strong> {toolCall.args.symbol}
                </p>
                <p>
                  <strong>Shares:</strong> {toolCall.args.shares.toLocaleString()}
                </p>
                <p>
                  <strong>Value:</strong> ${(toolCall.args.shares * (stockInfo?.price || 0)).toLocaleString()}
                </p>
              </div>
              {stockInfo && (
                <div>
                  <p>
                    <strong>Quant Score:</strong> {stockInfo.quantScore}/25
                  </p>
                  <p>
                    <strong>Sharpe Ratio:</strong> {stockInfo.sharpe}
                  </p>
                  <p>
                    <strong>Beta:</strong> {stockInfo.beta}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-3 p-2 bg-green-100 dark:bg-green-900 rounded text-xs">
              <strong>AI Reasoning:</strong> {toolCall.args.reasoning}
            </div>
          </div>
        )
      case "removeStockFromPortfolio":
        return (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Minus className="h-4 w-4 text-red-600" />
              <span className="font-semibold text-red-800 dark:text-red-200">Portfolio Action: Stock Removed</span>
            </div>
            <div className="text-sm text-red-700 dark:text-red-300">
              <p>
                <strong>Symbol:</strong> {toolCall.args.symbol}
              </p>
              <p>
                <strong>Reasoning:</strong> {toolCall.args.reasoning}
              </p>
            </div>
          </div>
        )
      case "getPortfolioAnalysis":
        return (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-800 dark:text-blue-200">Portfolio Analysis</span>
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p>Analysis Type: {toolCall.args.analysisType}</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="h-[650px] flex flex-col shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="border-b bg-muted/30 backdrop-blur-sm">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              QuantPilot AI Assistant
              <Badge variant="outline" className="ml-auto">
                Portfolio Management Enabled
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4 max-h-[500px]">
              <div className="space-y-4 min-h-0">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium mb-2">Welcome to QuantPilot AI</p>
                    <p className="text-sm mb-4">
                      I can analyze markets, recommend stocks, and directly modify your portfolio.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Plus className="h-3 w-3 text-green-600" />
                        <span>Add Stocks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Minus className="h-3 w-3 text-red-600" />
                        <span>Remove Stocks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3 text-blue-600" />
                        <span>Analyze Portfolio</span>
                      </div>
                    </div>
                  </div>
                )}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-3 max-w-[90%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div className="flex-shrink-0">
                        {message.role === "user" ? (
                          <User className="h-8 w-8 p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full" />
                        ) : (
                          <Bot className="h-8 w-8 p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full" />
                        )}
                      </div>
                      <div
                        className={`p-3 rounded-lg break-words overflow-wrap-anywhere max-w-none relative group ${
                          message.role === "user"
                            ? "bg-blue-600 dark:bg-blue-700 text-white"
                            : "bg-muted/50 dark:bg-muted/80 text-foreground border backdrop-blur-sm"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(message.content, message.id)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}

                        {copiedMessageId === message.id && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Copied!
                          </div>
                        )}

                        <div className="whitespace-pre-wrap text-sm leading-relaxed max-w-full overflow-hidden prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown
                            components={{
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                              li: ({ children }) => <li className="mb-1">{children}</li>,
                              code: ({ node, inline, className, children, ...props }) => {
                                if (inline) {
                                  return (
                                    <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono" {...props}>
                                      {children}
                                    </code>
                                  )
                                }
                                return (
                                  <div className="my-4">
                                    <div className="bg-slate-900 dark:bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto">
                                      <pre className="text-sm font-mono whitespace-pre-wrap">
                                        <code {...props}>{children}</code>
                                      </pre>
                                    </div>
                                  </div>
                                )
                              },
                              pre: ({ children }) => <div className="my-4">{children}</div>,
                              h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-muted-foreground/30 pl-4 italic my-2">
                                  {children}
                                </blockquote>
                              ),
                              table: ({ children }) => (
                                <div className="overflow-x-auto my-4">
                                  <table className="min-w-full border-collapse border border-muted">{children}</table>
                                </div>
                              ),
                              th: ({ children }) => (
                                <th className="border border-muted px-2 py-1 bg-muted font-semibold text-left">
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => <td className="border border-muted px-2 py-1">{children}</td>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>

                        {/* Render tool calls */}
                        {message.toolInvocations?.map((toolCall, index) => (
                          <div key={index}>{renderToolCall(toolCall)}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <Bot className="h-8 w-8 p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full" />
                    <div className="bg-muted/50 p-3 rounded-lg backdrop-blur-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t bg-muted/30 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask me to analyze, recommend, or modify your portfolio..."
                  disabled={isLoading}
                  className="flex-1 bg-background"
                />
                <Button type="submit" disabled={isLoading} className="px-6">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Portfolio Actions & Context */}
      <div className="space-y-6">
        {/* Quick AI Actions */}
        <Card className="shadow-lg bg-gradient-to-br from-card to-card/50 border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-4 w-4" />
              AI Portfolio Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[300px] overflow-y-auto">
            {quantQueries.map((query, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left h-auto p-3 text-xs hover:bg-muted/50"
                onClick={() => {
                  const syntheticEvent = {
                    preventDefault: () => {},
                    target: { value: query },
                  } as any
                  handleInputChange(syntheticEvent)
                  handleSubmit(syntheticEvent)
                }}
              >
                {query}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Portfolio Status */}
        <Card className="shadow-lg bg-gradient-to-br from-card to-card/50 border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-4 w-4" />
              Portfolio Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Holdings</span>
              <Badge variant="outline">{holdings.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Value</span>
              <span className="font-semibold">${holdings.reduce((sum, h) => sum + h.value, 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">AI Recommendations</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Live Signals */}
        <Card className="shadow-lg bg-gradient-to-br from-card to-card/50 border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-4 w-4" />
              AI Signals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                <Badge variant="outline" className="text-xs">
                  BUY SIGNAL
                </Badge>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">Healthcare sector underweight</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Ask AI to add JNJ or PFE</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <Badge variant="outline" className="text-xs">
                  REBALANCE
                </Badge>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Tech concentration high</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Consider diversification</p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <Badge variant="outline" className="text-xs">
                  RISK ALERT
                </Badge>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">High volatility detected</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Ask AI to analyze risk</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
