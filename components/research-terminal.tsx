"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Code, Database, TrendingUp, Brain, Search } from "lucide-react"

const researchNotes = [
  {
    id: 1,
    title: "AAPL Earnings Deep Dive Q4 2024",
    author: "John Smith",
    date: "2024-01-15",
    tags: ["earnings", "fundamental", "aapl"],
    summary: "Strong iPhone 15 cycle driving revenue growth. Services segment showing accelerating momentum...",
    rating: "BUY",
    targetPrice: 200,
  },
  {
    id: 2,
    title: "Tech Sector Rotation Analysis",
    author: "Sarah Chen",
    date: "2024-01-12",
    tags: ["sector", "rotation", "quantitative"],
    summary: "Factor analysis suggests rotation from growth to value within tech. Quality metrics becoming...",
    rating: "NEUTRAL",
    targetPrice: null,
  },
  {
    id: 3,
    title: "NVDA AI Chip Demand Sustainability",
    author: "Mike Johnson",
    date: "2024-01-10",
    tags: ["nvda", "ai", "semiconductor"],
    summary: "Channel checks indicate sustained enterprise AI adoption. New Blackwell architecture...",
    rating: "BUY",
    targetPrice: 850,
  },
]

const codeSnippets = [
  {
    id: 1,
    title: "Fama-French 5-Factor Model",
    language: "Python",
    author: "Quant Team",
    date: "2024-01-14",
    code: `import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

def fama_french_5factor(returns, factors):
    """
    Estimate Fama-French 5-factor model
    """
    model = LinearRegression()
    model.fit(factors, returns)
    
    alpha = model.intercept_
    betas = model.coef_
    r_squared = model.score(factors, returns)
    
    return {
        'alpha': alpha,
        'market_beta': betas[0],
        'smb_beta': betas[1],
        'hml_beta': betas[2],
        'rmw_beta': betas[3],
        'cma_beta': betas[4],
        'r_squared': r_squared
    }`,
  },
  {
    id: 2,
    title: "VaR Calculation with Monte Carlo",
    language: "Python",
    author: "Risk Team",
    date: "2024-01-13",
    code: `import numpy as np
from scipy import stats

def monte_carlo_var(returns, portfolio_value, confidence_level=0.95, num_simulations=10000):
    """
    Calculate VaR using Monte Carlo simulation
    """
    mean_return = np.mean(returns)
    std_return = np.std(returns)
    
    # Generate random scenarios
    random_returns = np.random.normal(mean_return, std_return, num_simulations)
    
    # Calculate portfolio values
    portfolio_values = portfolio_value * (1 + random_returns)
    portfolio_changes = portfolio_values - portfolio_value
    
    # Calculate VaR
    var = np.percentile(portfolio_changes, (1 - confidence_level) * 100)
    
    return abs(var)`,
  },
]

export function ResearchTerminal() {
  const [searchQuery, setSearchQuery] = useState("")
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: "",
  })

  const filteredNotes = researchNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      {/* Search and Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Research Terminal
          </CardTitle>
          <CardDescription>Centralized research repository with version control and collaboration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search research notes, code, or data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              New Research Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Research Content */}
      <Tabs defaultValue="research-notes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="research-notes">Research Notes</TabsTrigger>
          <TabsTrigger value="code-library">Code Library</TabsTrigger>
          <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
        </TabsList>

        <TabsContent value="research-notes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredNotes.map((note) => (
                    <Card key={note.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{note.title}</CardTitle>
                            <CardDescription>
                              By {note.author} • {note.date}
                            </CardDescription>
                          </div>
                          {note.rating && (
                            <Badge
                              className={
                                note.rating === "BUY"
                                  ? "bg-green-100 text-green-800"
                                  : note.rating === "SELL"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {note.rating}
                              {note.targetPrice && ` $${note.targetPrice}`}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{note.summary}</p>
                        <div className="flex gap-2">
                          {note.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Create Research Note</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Research note title..."
                      value={newNote.title}
                      onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Write your research analysis..."
                      className="min-h-[200px]"
                      value={newNote.content}
                      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      placeholder="earnings, fundamental, aapl"
                      value={newNote.tags}
                      onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                    />
                  </div>
                  <Button className="w-full">Save Research Note</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="code-library" className="space-y-4">
          <div className="space-y-4">
            {codeSnippets.map((snippet) => (
              <Card key={snippet.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        {snippet.title}
                      </CardTitle>
                      <CardDescription>
                        {snippet.language} • By {snippet.author} • {snippet.date}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      Copy Code
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{snippet.code}</code>
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="data-sources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Market Data Feeds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Bloomberg Terminal</span>
                  <Badge className="bg-green-100 text-green-800">ACTIVE</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Refinitiv Eikon</span>
                  <Badge className="bg-green-100 text-green-800">ACTIVE</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>IEX Cloud</span>
                  <Badge className="bg-green-100 text-green-800">ACTIVE</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Alpha Vantage</span>
                  <Badge className="bg-yellow-100 text-yellow-800">LIMITED</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Alternative Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Satellite Imagery</span>
                  <Badge className="bg-green-100 text-green-800">ACTIVE</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Social Sentiment</span>
                  <Badge className="bg-green-100 text-green-800">ACTIVE</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Credit Card Spending</span>
                  <Badge className="bg-yellow-100 text-yellow-800">TRIAL</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Web Scraping</span>
                  <Badge className="bg-green-100 text-green-800">ACTIVE</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Factor Models</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Fama-French 5-Factor</span>
                  <Badge className="bg-green-100 text-green-800">PROD</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Barra Risk Model</span>
                  <Badge className="bg-green-100 text-green-800">PROD</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Custom Momentum</span>
                  <Badge className="bg-yellow-100 text-yellow-800">DEV</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ML Models</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">LSTM Price Prediction</span>
                  <Badge className="bg-green-100 text-green-800">PROD</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Random Forest Classifier</span>
                  <Badge className="bg-green-100 text-green-800">PROD</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Transformer Model</span>
                  <Badge className="bg-yellow-100 text-yellow-800">BETA</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Models</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Monte Carlo VaR</span>
                  <Badge className="bg-green-100 text-green-800">PROD</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">GARCH Volatility</span>
                  <Badge className="bg-green-100 text-green-800">PROD</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Copula Models</span>
                  <Badge className="bg-yellow-100 text-yellow-800">DEV</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
