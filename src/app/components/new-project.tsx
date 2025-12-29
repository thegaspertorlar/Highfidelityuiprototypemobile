import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Separator } from './ui/separator';
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Sparkles,
  HelpCircle,
  Users,
  Briefcase,
  Zap,
  DollarSign,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from './ui/utils';

interface TeamMember {
  id: number;
  name: string;
  avatar: string;
  role: string;
  compensationType: 'hourly' | 'monthly';
  costValue: number;
  allocationPercentage: number; // 0-100, percentage allocated to this project
  computedMonthlyCost: number;
}

interface VendorCost {
  id: number;
  name: string;
  monthlyCost: number;
}

interface FixedCost {
  id: number;
  name: string;
  cost: number;
}

interface Feature {
  id: number;
  name: string;
  complexity: 'Low' | 'Medium' | 'High';
  storyPoints: number;
}

interface Employee {
  id: number;
  name: string;
  avatar: string;
  role: string;
  compensationType: 'hourly' | 'monthly';
  rate: number;
  techStack: string[];
  availability: 'available' | 'busy' | 'offline';
}

interface NewProjectProps {
  onNavigate: (view: string) => void;
  onSaveProjectData: (data: {
    features: Feature[];
    teamMembers: TeamMember[];
    duration: number;
    projectName: string;
  }) => void;
  employees: Employee[];
}

export function NewProject({ onNavigate, onSaveProjectData, employees }: NewProjectProps) {
  const [projectName, setProjectName] = useState('E-Commerce Platform Redesign');
  const [clientName, setClientName] = useState('');
  const [duration, setDuration] = useState(6);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [requirements, setRequirements] = useState('');
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([
    { id: 1, name: 'AWS Infrastructure', cost: 2500 },
    { id: 2, name: 'SaaS Licenses', cost: 800 },
  ]);
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { 
      id: 1, 
      name: 'Sarah Johnson', 
      avatar: 'SJ',
      role: 'Frontend Developer', 
      compensationType: 'monthly',
      costValue: 5500,
      allocationPercentage: 100,
      computedMonthlyCost: 5500 // Monthly: 5500 * (100/100) = 5500
    },
    { 
      id: 2, 
      name: 'Michael Chen', 
      avatar: 'MC',
      role: 'Backend Developer', 
      compensationType: 'hourly',
      costValue: 90,
      allocationPercentage: 100,
      computedMonthlyCost: 14400 // Hourly: 90 * 160 * (100/100) = 14400
    },
    { 
      id: 3, 
      name: 'Emma Williams', 
      avatar: 'EW',
      role: 'Project Manager', 
      compensationType: 'monthly',
      costValue: 6000,
      allocationPercentage: 60,
      computedMonthlyCost: 3600 // Monthly: 6000 * (60/100) = 3600
    },
  ]);

  const [vendorCosts, setVendorCosts] = useState<VendorCost[]>([
    { id: 1, name: 'AWS Infrastructure', monthlyCost: 2500 },
    { id: 2, name: 'SaaS Licenses', monthlyCost: 800 },
  ]);

  const [features, setFeatures] = useState<Feature[]>([
    { id: 1, name: 'User Authentication System', complexity: 'High', storyPoints: 13 },
    { id: 2, name: 'Product Catalog', complexity: 'Medium', storyPoints: 8 },
    { id: 3, name: 'Payment Gateway Integration', complexity: 'High', storyPoints: 13 },
    { id: 4, name: 'Admin Dashboard', complexity: 'Medium', storyPoints: 5 },
  ]);

  // Available employees from the company pool
  const availableEmployees = employees.map(emp => ({ name: emp.name, avatar: emp.avatar }));

  // Available roles
  const availableRoles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'UI/UX Designer',
    'DevOps Engineer',
    'Project Manager',
    'QA Engineer',
    'Mobile Developer',
    'Data Engineer',
  ];

  // Calculate computed monthly cost based on compensation type and allocation percentage
  // Based on: 1 month = 20 days = 4 weeks = 160 hours, 1 day = 8 hours
  const calculateMonthlyCost = (member: TeamMember) => {
    let fullMonthlyCost: number;
    
    if (member.compensationType === 'monthly') {
      // Monthly salary - use directly
      fullMonthlyCost = member.costValue;
    } else {
      // Hourly rate - calculate full month cost: hourlyRate * 160 hours
      fullMonthlyCost = member.costValue * 160;
    }
    
    // Apply allocation percentage
    return fullMonthlyCost * (member.allocationPercentage / 100);
  };

  // Calculate total monthly burn rate
  const calculateMonthlyBurnRate = () => {
    const laborCost = teamMembers.reduce((total, member) => {
      return total + member.computedMonthlyCost;
    }, 0);

    const vendorCost = vendorCosts.reduce((total, vendor) => total + vendor.monthlyCost, 0);

    return {
      labor: laborCost,
      vendor: vendorCost,
      total: laborCost + vendorCost,
    };
  };

  // Calculate capacity vs demand
  const calculateCapacity = () => {
    const totalManHours = teamMembers.reduce((total, member) => {
      // Full month = 160 hours, apply allocation percentage
      const hoursPerMonth = 160 * (member.allocationPercentage / 100);
      const totalHours = hoursPerMonth * duration;
      return total + totalHours;
    }, 0);

    const requiredEffort = features.reduce((sum, feature) => sum + feature.storyPoints * 8, 0); // Story points * 8 hours

    return {
      capacity: totalManHours,
      demand: requiredEffort,
      isHighRisk: requiredEffort > totalManHours,
      utilizationRate: totalManHours > 0 ? (requiredEffort / totalManHours) * 100 : 0
    };
  };

  const addTeamMember = () => {
    setTeamMembers([
      ...teamMembers,
      { 
        id: Date.now(), 
        name: '', 
        avatar: '',
        role: '', 
        compensationType: 'hourly', // Default to hourly
        costValue: 0,
        allocationPercentage: 100,
        computedMonthlyCost: 0
      },
    ]);
  };

  const removeTeamMember = (id: number) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };

  const updateTeamMember = (id: number, field: string, value: any) => {
    setTeamMembers(
      teamMembers.map((m) => {
        if (m.id === id) {
          let updated = { ...m };
          
          if (field === 'employee') {
            // When employee is selected, auto-fill their data from employee list
            const employee = employees.find((e) => e.name === value);
            if (employee) {
              updated = { 
                ...updated, 
                name: employee.name, 
                avatar: employee.avatar,
                role: employee.role,
                compensationType: employee.compensationType,
                costValue: employee.rate,
              };
            }
          } else if (field === 'compensationType') {
            // When compensation type changes, convert cost value
            const oldType = m.compensationType;
            const newType = value as 'hourly' | 'monthly';
            
            if (oldType !== newType && m.costValue > 0) {
              if (newType === 'hourly') {
                // Monthly → Hourly: divide by 160
                updated = { ...updated, compensationType: newType, costValue: m.costValue / 160 };
              } else {
                // Hourly → Monthly: multiply by 160
                updated = { ...updated, compensationType: newType, costValue: m.costValue * 160 };
              }
            } else {
              updated = { ...updated, compensationType: newType };
            }
          } else if (field === 'role') {
            updated = { ...updated, role: value };
          } else {
            updated = { ...updated, [field]: value };
          }
          
          // Recalculate computed monthly cost
          updated.computedMonthlyCost = calculateMonthlyCost(updated);
          
          return updated;
        }
        return m;
      })
    );
  };

  const addVendorCost = () => {
    setVendorCosts([
      ...vendorCosts,
      { id: Date.now(), name: '', monthlyCost: 0 },
    ]);
  };

  const removeVendorCost = (id: number) => {
    setVendorCosts(vendorCosts.filter((v) => v.id !== id));
  };

  const updateVendorCost = (id: number, field: string, value: any) => {
    setVendorCosts(
      vendorCosts.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const addFeature = () => {
    setFeatures([
      ...features,
      { id: Date.now(), name: '', complexity: 'Medium', storyPoints: 1 },
    ]);
  };

  const removeFeature = (id: number) => {
    setFeatures(features.filter((f) => f.id !== id));
  };

  const updateFeature = (id: number, field: string, value: any) => {
    setFeatures(
      features.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const addFixedCost = () => {
    setFixedCosts([
      ...fixedCosts,
      { id: Date.now(), name: '', cost: 0 },
    ]);
  };

  const removeFixedCost = (id: number) => {
    setFixedCosts(fixedCosts.filter((fc) => fc.id !== id));
  };

  const updateFixedCost = (id: number, field: string, value: any) => {
    setFixedCosts(
      fixedCosts.map((fc) => (fc.id === id ? { ...fc, [field]: value } : fc))
    );
  };

  const hasHighComplexity = features.some((f) => f.complexity === 'High');
  const burnRate = calculateMonthlyBurnRate();

  // Fibonacci sequence for story points
  const fibonacciOptions = [1, 2, 3, 5, 8, 13];

  const handleGenerateEstimate = () => {
    // Save project data before navigating
    onSaveProjectData({
      features,
      teamMembers,
      duration,
      projectName,
    });
    onNavigate('results');
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'Frontend':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'Backend':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'PM':
        return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
      case 'Fullstack':
        return 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100';
      case 'Designer':
        return 'bg-pink-100 text-pink-700 hover:bg-pink-100';
      case 'DevOps':
        return 'bg-amber-100 text-amber-700 hover:bg-amber-100';
      default:
        return 'bg-slate-100 text-slate-700 hover:bg-slate-100';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-slate-900 mb-1">Resource-Driven Project Estimation</h1>
        <p className="text-slate-500">Define your team, timeline, and scope for accurate cost projections aligned with PMI/COCOMO standards.</p>
      </div>

      {/* Step 1: Project Basics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Project Constraints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-name">Client Name</Label>
            <Input
              id="client-name"
              placeholder="e.g., Acme Corporation"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Project Duration (Months)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Enhanced Resource Allocator */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-slate-900">Enhanced Resource Allocator</CardTitle>
            </div>
            <Button onClick={addTeamMember} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-4 text-slate-500">Employee Name</th>
                  <th className="text-left py-3 px-4 text-slate-500">Role</th>
                  <th className="text-left py-3 px-4 text-slate-500">Compensation Type</th>
                  <th className="text-left py-3 px-4 text-slate-500">Cost Input</th>
                  <th className="text-left py-3 px-4 text-slate-500">Project Allocation (%)</th>
                  <th className="text-right py-3 px-4 text-slate-500">Monthly Cost</th>
                  <th className="text-right py-3 px-4 text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {member.avatar && (
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-medium">
                            {member.avatar}
                          </div>
                        )}
                        <Select
                          value={member.name}
                          onValueChange={(value) => updateTeamMember(member.id, 'employee', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableEmployees.map((emp) => (
                              <SelectItem key={emp.name} value={emp.name}>
                                {emp.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Select
                        value={member.role}
                        onValueChange={(value) => updateTeamMember(member.id, 'role', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4">
                      <Select
                        value={member.compensationType}
                        onValueChange={(value: 'hourly' | 'monthly') =>
                          updateTeamMember(member.id, 'compensationType', value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">€</span>
                        <Input
                          type="number"
                          placeholder="0"
                          value={member.costValue || ''}
                          onChange={(e) =>
                            updateTeamMember(member.id, 'costValue', parseFloat(e.target.value) || 0)
                          }
                          className="w-28"
                        />
                        <span className="text-slate-400 text-xs">
                          {member.compensationType === 'hourly' ? '/hr' : '/mo'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="100"
                          value={member.allocationPercentage || ''}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            const clamped = Math.min(Math.max(value, 0), 100);
                            updateTeamMember(member.id, 'allocationPercentage', clamped);
                          }}
                          className="w-20"
                        />
                        <span className="text-slate-600">%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono text-slate-400">
                        €{member.computedMonthlyCost.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-50"
                        onClick={() => removeTeamMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-indigo-50 border-t-2 border-indigo-200">
                  <td colSpan={5} className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900">Total Monthly Burn Rate</span>
                      <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                        Labor: €{burnRate.labor.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </Badge>
                    </div>
                  </td>
                  <td colSpan={2} className="py-4 px-4 text-right">
                    {/* Removed total burn rate display */}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Step 3: Fixed Costs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-600" />
                <CardTitle className="text-slate-900">Fixed Costs</CardTitle>
              </div>
              <p className="text-slate-500 text-sm mt-1">One-time expenses (licenses, infrastructure setup, etc.)</p>
            </div>
            <Button onClick={addFixedCost} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Fixed Cost
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {fixedCosts.map((fixedCost) => (
            <div key={fixedCost.id} className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-7 space-y-2">
                <Label className="text-slate-500">Cost Name</Label>
                <Input
                  placeholder="e.g., Vercel Subscription"
                  value={fixedCost.name}
                  onChange={(e) => updateFixedCost(fixedCost.id, 'name', e.target.value)}
                />
              </div>
              <div className="col-span-4 space-y-2">
                <Label className="text-slate-500">Amount</Label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">€</span>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={fixedCost.cost || ''}
                    onChange={(e) => updateFixedCost(fixedCost.id, 'cost', parseFloat(e.target.value) || 0)}
                  />
                  <span className="text-slate-400 text-xs">/mo</span>
                </div>
              </div>
              <div className="col-span-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 hover:bg-red-50"
                  onClick={() => removeFixedCost(fixedCost.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
          
          {fixedCosts.length > 0 && (
            <div className="pt-3 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-900 font-medium">Total Fixed Costs</span>
                <span className="font-mono text-indigo-600 font-semibold">
                  €{fixedCosts.reduce((sum, fc) => sum + fc.cost, 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mo
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Step 4: Scope Definition */}
      <div>
        <h2 className="text-slate-900 mb-4">Scope Definition</h2>
        <p className="text-slate-500 mb-4">Story points are used for risk management, not for direct cost calculation.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-900">Feature List</CardTitle>
            <Button onClick={addFeature} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {features.map((feature) => (
            <div key={feature.id} className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-5 space-y-2">
                <Label className="text-slate-500">Feature Name</Label>
                <Input
                  placeholder="Feature description"
                  value={feature.name}
                  onChange={(e) => updateFeature(feature.id, 'name', e.target.value)}
                />
              </div>
              <div className="col-span-3 space-y-2">
                <Label className="text-slate-500">Complexity</Label>
                <Select
                  value={feature.complexity}
                  onValueChange={(value) => updateFeature(feature.id, 'complexity', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3 space-y-2">
                <Label className="text-slate-500">Story Points (Fibonacci)</Label>
                <Select
                  value={feature.storyPoints.toString()}
                  onValueChange={(value) => updateFeature(feature.id, 'storyPoints', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fibonacciOptions.map((points) => (
                      <SelectItem key={points} value={points.toString()}>
                        {points}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 hover:bg-red-50"
                  onClick={() => removeFeature(feature.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={() => onNavigate('dashboard')}>
          Cancel
        </Button>
        <Button
          onClick={handleGenerateEstimate}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Financial Projections
        </Button>
      </div>
    </div>
  );
}