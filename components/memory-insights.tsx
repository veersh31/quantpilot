"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, FileText, Calendar, TrendingUp, Brain, Star } from "lucide-react"
import { useState } from "react"

const memoryData = [
  {
    id: 1,
    type: "research_note",
    title: "AAPL Q4 Earnings Analysis",
    content:
      "Strong iPhone 15 sales momentum, services revenue growth accelerating. Supply chain optimization showing results.",
    ticker: "AAPL",
    date: "2024-01-15",
    relevanceScore: 0.92,
    tags: ["earnings", "iphone", "services"],
  },
  {
    id: 2,
    type: "analyst_meeting",
    title: "NVDA Data Center Discussion",
    content: "Management confident about AI chip demand sustainability. New architecture roadmap through 2026.",
    ticker: "NVDA",
    date: "2024-01-12",
    relevanceScore: 0.88,
    tags: ["ai", "datacenter", "roadmap"],
  },
  {
    id: 3,
    type: "market_insight",
    title: "Tech Sector Rotation Analysis",
    content:
      "Institutional flows showing preference for profitable tech over growth. Quality metrics becoming more important.",
    ticker: "SECTOR",
    date: "2024-01-10",
    relevanceScore: 0.85,
    tags: ["sector", "rotation", "quality"],
  },
  {
    id: 4,
    type: "portfolio_note",
    title: "TSLA Position Sizing Review",
    content: "Reduced position by 25% due to valuation concerns and increased competition in EV space.",
    ticker: "TSLA",
    date: "2024-01-08",
    relevanceScore: 0.79,
    tags: ["position", "valuation", "ev"],
  },
  {
    id: 5,
    type: "research_note",
    title: "MSFT Azure Growth Trajectory",
    content: "Cloud infrastructure showing strong enterprise adoption. AI integration driving higher margins.",
    ticker: "MSFT",
    date: "2024-01-05",
    relevanceScore: 0.76,
    tags: ["cloud", "azure", "ai"],
  },
]

export function MemoryInsights() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  const filteredMemories = memoryData.filter((memory) => {
    const matchesSearch =
      memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.ticker.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || memory.type === selectedType
    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "research_note":
        return <FileText className="h-4 w-4" />
      case "analyst_meeting":
        return <TrendingUp className="h-4 w-4" />
      case "market_insight":
        return <Brain className="h-4 w-4" />
      case "portfolio_note":
        return <Star className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "research_note":
        return "bg-blue-100 text-blue-800"
      case "analyst_meeting":
        return "bg-green-100 text-green-800"
      case "market_insight":
        return "bg-purple-100 text-purple-800"
      case "portfolio_note":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Memory Bank
          </CardTitle>
          <CardDescription>
            Search through your research notes, meeting insights, and portfolio decisions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search memories by ticker, content, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("all")}
            >
              All Types
            </Button>
            <Button
              variant={selectedType === "research_note" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("research_note")}
            >
              Research Notes
            </Button>
            <Button
              variant={selectedType === "analyst_meeting" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("analyst_meeting")}
            >
              Meetings
            </Button>
            <Button
              variant={selectedType === "market_insight" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("market_insight")}
            >
              Market Insights
            </Button>
            <Button
              variant={selectedType === "portfolio_note" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("portfolio_note")}
            >
              Portfolio Notes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Memory Results */}
      <Card>
        <CardHeader>
          <CardTitle>Search Results ({filteredMemories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {filteredMemories.map((memory) => (
                <div key={memory.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(memory.type)}
                      <h3 className="font-semibold">{memory.title}</h3>
                      <Badge variant="outline">{memory.ticker}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(memory.type)}>{memory.type.replace("_", " ")}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-muted-foreground">
                          {(memory.relevanceScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{memory.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{memory.date}</span>
                    </div>
                    <div className="flex gap-1">
                      {memory.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
