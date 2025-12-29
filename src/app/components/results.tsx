import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Sparkles, Download, Share2, TrendingUp, Lightbulb, FileText } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface ResultsProps {
  onNavigate: (view: string) => void;
  projectData: {
    features: Array<{
      id: number;
      name: string;
      complexity: 'Low' | 'Medium' | 'High';
      storyPoints: number;
    }>;
    teamMembers: Array<{
      id: number;
      name: string;
      role: string;
      compensationType: 'hourly' | 'monthly';
      costValue: number;
      daysPerWeek: number;
      computedMonthlyCost: number;
    }>;
    duration: number;
    projectName: string;
  } | null;
}

export function Results({ onNavigate, projectData }: ResultsProps) {
  if (!projectData) {
    return <div className="space-y-6 max-w-7xl">No project data available.</div>;
  }

  // Mock data based on resource-driven calculations
  const projectDuration = projectData.duration; // months
  const monthlyBurnRate = projectData.teamMembers.reduce((acc, member) => acc + member.computedMonthlyCost, 0); // €18,640/month from inputs

  const laborCostPerMonth = projectData.teamMembers.reduce((acc, member) => acc + member.computedMonthlyCost, 0);
  const vendorCostPerMonth = 3300;

  // Calculate three estimation scenarios (PMI/COCOMO approach)
  const baseCost = monthlyBurnRate * projectDuration; // Optimistic: If everything goes perfectly
  const realisticCost = baseCost * 1.15; // Realistic: Includes 15% overhead/inefficiency
  const pessimisticCost = baseCost * 1.30; // Pessimistic: Includes 30% contingency buffer

  // Detailed breakdown for each scenario
  const getBreakdown = (totalCost: number, multiplier: number) => {
    const personnelCost = laborCostPerMonth * projectDuration * multiplier;
    const infrastructureCost = vendorCostPerMonth * projectDuration;
    const contingencyCost = totalCost - personnelCost - infrastructureCost;

    return {
      personnel: personnelCost,
      infrastructure: infrastructureCost,
      contingency: contingencyCost,
      total: totalCost,
    };
  };

  const optimisticBreakdown = getBreakdown(baseCost, 1.0);
  const realisticBreakdown = getBreakdown(realisticCost, 1.15);
  const pessimisticBreakdown = getBreakdown(pessimisticCost, 1.30);

  // Burn-up chart data (cumulative cost over 6 months)
  const burnUpData = Array.from({ length: 7 }, (_, i) => ({
    month: i === 0 ? 'Start' : `M${i}`,
    optimistic: baseCost * (i / 6),
    realistic: realisticCost * (i / 6),
    pessimistic: pessimisticCost * (i / 6),
  }));

  // Resource distribution by role
  const resourceDistribution = [
    { role: 'Frontend Developer', cost: 33000, color: '#3B82F6' },
    { role: 'Backend Developer', cost: 37440, color: '#10B981' },
    { role: 'Project Manager', cost: 21600, color: '#8B5CF6' },
    { role: 'Vendor & Tools', cost: 19800, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-slate-900 mb-1">Financial Projections & Risk Analysis</h1>
          <p className="text-slate-500">Resource-driven cost estimation aligned with PMI/COCOMO global standards</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>
        </div>
      </div>

      {/* Three-Card Layout: Optimistic / Realistic / Pessimistic */}
      <div>
        <h2 className="text-slate-900 mb-4">Three-Point Estimation (Global Standards)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Optimistic (Lean Model) */}
          <Card className="border-green-200 bg-green-50/50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Optimistic</Badge>
                <span className="text-slate-400">Best Case</span>
              </div>
              <CardTitle className="text-slate-900 mt-2">Base Cost</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-mono text-green-600 mb-2">€{baseCost.toLocaleString()}</div>
                <p className="text-slate-600">If everything goes perfectly. No delays, no scope creep, ideal team velocity.</p>
              </div>
              <div className="pt-3 border-t border-green-200 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Personnel:</span>
                  <span className="font-mono">€{optimisticBreakdown.personnel.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Infrastructure:</span>
                  <span className="font-mono">€{optimisticBreakdown.infrastructure.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Risk Factor:</span>
                  <span className="text-green-600">0%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Realistic (Standard Model) - HIGHLIGHTED */}
          <Card className="border-indigo-300 border-2 bg-indigo-50 hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className="bg-indigo-600 text-white hover:bg-indigo-600">Realistic</Badge>
                <span className="text-slate-500">⭐ Recommended</span>
              </div>
              <CardTitle className="text-slate-900 mt-2">Efficiency Adjusted</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-mono text-indigo-600 mb-2">€{realisticCost.toLocaleString()}</div>
                <p className="text-slate-700">Includes 15% overhead for meetings, code reviews, testing, and typical inefficiencies.</p>
              </div>
              <div className="pt-3 border-t border-indigo-200 space-y-2 text-sm">
                <div className="flex justify-between text-slate-700">
                  <span>Personnel:</span>
                  <span className="font-mono">€{realisticBreakdown.personnel.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Infrastructure:</span>
                  <span className="font-mono">€{realisticBreakdown.infrastructure.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Overhead:</span>
                  <span className="text-indigo-600">+15%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Pessimistic (Risk Model) */}
          <Card className="border-red-200 bg-red-50/50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Pessimistic</Badge>
                <span className="text-slate-400">Worst Case</span>
              </div>
              <CardTitle className="text-slate-900 mt-2">Risk Loaded</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-mono text-red-600 mb-2">€{pessimisticCost.toLocaleString()}</div>
                <p className="text-slate-600">Includes 30% contingency buffer for scope changes, technical debt, and unexpected delays.</p>
              </div>
              <div className="pt-3 border-t border-red-200 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Personnel:</span>
                  <span className="font-mono">€{pessimisticBreakdown.personnel.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Infrastructure:</span>
                  <span className="font-mono">€{pessimisticBreakdown.infrastructure.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Buffer:</span>
                  <span className="text-red-600">+€{pessimisticBreakdown.contingency.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Detailed Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-4 text-slate-500">Cost Category</th>
                  <th className="text-right py-3 px-4 text-slate-500">Monthly Cost</th>
                  <th className="text-right py-3 px-4 text-slate-500">Total Cost (6mo)</th>
                  <th className="text-right py-3 px-4 text-slate-500">% of Budget</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-slate-900">Personnel</div>
                      <div className="text-slate-500 text-sm">3 team members (mixed allocation)</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-900">
                    €{laborCostPerMonth.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-900">
                    €{realisticBreakdown.personnel.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                      {((realisticBreakdown.personnel / realisticBreakdown.total) * 100).toFixed(1)}%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-slate-900">Infrastructure/Vendors</div>
                      <div className="text-slate-500 text-sm">AWS, SaaS licenses</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-900">
                    €{vendorCostPerMonth.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-900">
                    €{realisticBreakdown.infrastructure.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                      {((realisticBreakdown.infrastructure / realisticBreakdown.total) * 100).toFixed(1)}%
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-slate-900">Contingency Reserves</div>
                      <div className="text-slate-500 text-sm">15% overhead buffer (realistic model)</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-900">
                    €{((realisticBreakdown.contingency / projectDuration)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-900">
                    €{realisticBreakdown.contingency.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {((realisticBreakdown.contingency / realisticBreakdown.total) * 100).toFixed(1)}%
                    </Badge>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-indigo-50 border-t-2 border-indigo-200">
                  <td className="py-4 px-4 text-slate-900">
                    Total Project Cost
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-indigo-600">
                    €{monthlyBurnRate.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-indigo-600">
                    €{realisticBreakdown.total.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Badge className="bg-indigo-600 text-white hover:bg-indigo-600">
                      100%
                    </Badge>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Project Scope Summary (Read-Only) */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-slate-900">Project Scope Summary</CardTitle>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Reference Only</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-200">
              <span className="text-slate-900">Total Story Points</span>
              <Badge className="bg-blue-600 text-white hover:bg-blue-600 text-lg px-3 py-1">
                {projectData.features.reduce((sum, f) => sum + f.storyPoints, 0)} SP
              </Badge>
            </div>

            <div className="bg-white rounded-lg border border-blue-100 p-4">
              <h4 className="text-slate-900 mb-3">Features Breakdown</h4>
              <div className="space-y-3">
                {projectData.features.map((feature) => (
                  <div key={feature.id} className="flex items-center justify-between pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <div className="text-slate-900">{feature.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          className={
                            feature.complexity === 'High' 
                              ? 'bg-red-100 text-red-700 hover:bg-red-100' 
                              : feature.complexity === 'Medium'
                              ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                              : 'bg-green-100 text-green-700 hover:bg-green-100'
                          }
                        >
                          {feature.complexity}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-blue-600">{feature.storyPoints} SP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-3">
              <p className="text-slate-500 text-sm italic">
                <strong>Note:</strong> Story points shown above are for reference and velocity tracking purposes only. 
                Cost estimation is purely resource-driven (Time × Resources) and not directly calculated from story points.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Burn-up Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-900">Cumulative Cost Projection</CardTitle>
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={burnUpData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" />
                  <YAxis
                    stroke="#64748B"
                    tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => `€${value.toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="optimistic"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Optimistic"
                    dot={{ fill: '#10B981', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="realistic"
                    stroke="#4F46E5"
                    strokeWidth={3}
                    name="Realistic (Recommended)"
                    dot={{ fill: '#4F46E5', r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pessimistic"
                    stroke="#EF4444"
                    strokeWidth={2}
                    name="Pessimistic"
                    dot={{ fill: '#EF4444', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resource Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900">Resource Distribution by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resourceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ role, percent }) =>
                      `${role.split(' ')[0]} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="cost"
                  >
                    {resourceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `€${value.toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {resourceDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-600">{item.role}</span>
                  </div>
                  <span className="font-mono text-slate-900">€{item.cost.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Budget Guardian */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-slate-900">AI Budget Guardian</CardTitle>
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Optimization Insights</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <h4 className="text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">💰</span>
                Cost Optimization Opportunity
              </h4>
              <p className="text-slate-700 mb-3">
                I analyzed your resource mix. You are using <strong>Michael Chen (Backend Developer)</strong> at €90/hr for 4 days/week. 
                Changing their allocation to <strong>3 days/week</strong> and adding a Junior Backend Developer at €55/hr for 2 days/week could save you approximately <strong className="text-green-600">€4,500</strong> with minimal impact on velocity.
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Apply Suggestion
                </Button>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Velocity Analysis
              </h4>
              <p className="text-slate-700">
                Based on your team's skill mix and allocation pattern, the expected velocity is <strong>18-22 story points per sprint</strong>. 
                Your 120 story points can realistically be delivered in <strong>6-7 two-week sprints</strong> (3-3.5 months), suggesting you may have budgeted conservatively for a 6-month timeline.
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-amber-100">
              <h4 className="text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Risk Mitigation
              </h4>
              <p className="text-slate-700">
                Your Project Manager (Emma Williams) is allocated only 3 days/week. For a 6-month project with high-complexity features, consider increasing to <strong>4 days/week</strong> to reduce coordination overhead and improve on-time delivery probability by approximately 15%.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
        <Button variant="outline" onClick={() => onNavigate('new-project')}>
          Adjust Parameters
        </Button>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={() => onNavigate('dashboard')}>
            Save as Draft
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Approve & Create Project
          </Button>
        </div>
      </div>
    </div>
  );
}