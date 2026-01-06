import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Trophy, Users, TrendingUp } from "lucide-react";

interface CandidateResult {
  name: string;
  party: string;
  votes: number;
  percentage: number;
}

interface ResultsChartProps {
  results: CandidateResult[];
  totalVotes: number;
  electionTitle: string;
}

const COLORS = [
  "#FF9933", // Saffron
  "#138808", // Green
  "#000080", // Navy Blue
  "#9333EA", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
];

export default function ResultsChart({ results, totalVotes, electionTitle }: ResultsChartProps) {
  const sortedResults = [...results].sort((a, b) => b.votes - a.votes);
  const winner = sortedResults[0];

  const pieData = results.map((r, i) => ({
    name: r.name,
    value: r.votes,
    party: r.party,
    color: COLORS[i % COLORS.length],
  }));

  const barData = results.map((r, i) => ({
    name: r.name.split(" ")[0],
    votes: r.votes,
    percentage: r.percentage,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* Winner Announcement */}
      {winner && winner.votes > 0 && (
        <Card className="glass-card border-2 border-[#FF9933]/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF9933]/10 via-transparent to-[#138808]/10" />
          <CardContent className="relative p-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#FF9933] to-[#138808] flex items-center justify-center mb-4 shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Leading Candidate</p>
            <h2 className="text-2xl font-bold mb-1">{winner.name}</h2>
            <p className="text-muted-foreground">{winner.party}</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">
                  {winner.percentage.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Vote Share</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold">{winner.votes.toLocaleString("en-IN")}</p>
                <p className="text-xs text-muted-foreground">Total Votes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalVotes.toLocaleString("en-IN")}</p>
              <p className="text-xs text-muted-foreground">Total Votes Cast</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{results.length}</p>
              <p className="text-xs text-muted-foreground">Candidates</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Vote Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ payload }) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold">{data.name}</p>
                            <p className="text-sm text-muted-foreground">{data.party}</p>
                            <p className="text-sm font-medium">{data.value.toLocaleString("en-IN")} votes</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span>{entry.name.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Vote Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 12 }} />
                  <Tooltip
                    content={({ payload }) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold">{data.name}</p>
                            <p className="text-sm">{data.votes.toLocaleString("en-IN")} votes</p>
                            <p className="text-sm text-muted-foreground">{data.percentage.toFixed(1)}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Detailed Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedResults.map((candidate, index) => (
              <div
                key={candidate.name}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? "bg-gradient-to-br from-[#FF9933] to-[#138808]" : "bg-muted-foreground/50"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{candidate.name}</p>
                  <p className="text-sm text-muted-foreground">{candidate.party}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{candidate.votes.toLocaleString("en-IN")}</p>
                  <p className="text-sm text-muted-foreground">{candidate.percentage.toFixed(1)}%</p>
                </div>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${candidate.percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
