import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Search, X, Filter } from 'lucide-react';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';

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

interface EmployeesProps {
  employees: Employee[];
  onUpdateEmployees: (employees: Employee[]) => void;
}

// Extract unique roles and tech stacks
const getUniqueRoles = (employees: Employee[]) => {
  return Array.from(new Set(employees.map(e => e.role))).sort();
};

const getUniqueTechStacks = (employees: Employee[]) => {
  const allTech = employees.flatMap(e => e.techStack);
  return Array.from(new Set(allTech)).sort();
};

export function Employees({ employees }: EmployeesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const uniqueRoles = getUniqueRoles(employees);
  const uniqueTechStacks = getUniqueTechStacks(employees);

  // Filter employees
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAvailability = !selectedAvailability || employee.availability === selectedAvailability;
    const matchesRole = !selectedRole || employee.role === selectedRole;
    const matchesTech = !selectedTech || employee.techStack.includes(selectedTech);

    return matchesSearch && matchesAvailability && matchesRole && matchesTech;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-emerald-500';
      case 'busy':
        return 'bg-amber-500';
      case 'offline':
        return 'bg-slate-400';
      default:
        return 'bg-slate-400';
    }
  };

  const clearAllFilters = () => {
    setSelectedAvailability(null);
    setSelectedRole(null);
    setSelectedTech(null);
  };

  const activeFiltersCount = [selectedAvailability, selectedRole, selectedTech].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 pr-12 h-12 text-base border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
            showFilters || activeFiltersCount > 0
              ? 'bg-indigo-100 text-indigo-600'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white">
              <CardContent className="pt-5 pb-5 space-y-4">
                {/* Availability Filter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      Availability
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['available', 'busy', 'offline'].map((status) => (
                      <motion.button
                        key={status}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedAvailability(selectedAvailability === status ? null : status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedAvailability === status
                            ? status === 'available'
                              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                              : status === 'busy'
                              ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                              : 'bg-slate-500 text-white shadow-lg'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            selectedAvailability === status
                              ? 'bg-white'
                              : getAvailabilityColor(status)
                          }`} />
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Role Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Role
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueRoles.slice(0, 6).map((role) => (
                      <motion.button
                        key={role}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedRole(selectedRole === role ? null : role)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          selectedRole === role
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
                        }`}
                      >
                        {role}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Tech Stack
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueTechStacks.slice(0, 8).map((tech) => (
                      <motion.button
                        key={tech}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          selectedTech === tech
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-300'
                        }`}
                      >
                        {tech}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearAllFilters}
                    className="w-full py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear all filters
                  </motion.button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Pills */}
      {activeFiltersCount > 0 && !showFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedAvailability && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
            >
              <span className="capitalize">{selectedAvailability}</span>
              <button onClick={() => setSelectedAvailability(null)}>
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
          {selectedRole && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
            >
              <span>{selectedRole}</span>
              <button onClick={() => setSelectedRole(null)}>
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
          {selectedTech && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
            >
              <span>{selectedTech}</span>
              <button onClick={() => setSelectedTech(null)}>
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Results Count */}
      {(searchQuery || activeFiltersCount > 0) && (
        <div className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-900">{filteredEmployees.length}</span> of {employees.length} team members
        </div>
      )}

      {/* Employee Cards */}
      <div className="space-y-3">
        {filteredEmployees.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No team members found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-indigo-600 text-sm font-medium hover:text-indigo-700"
                >
                  Clear all filters
                </button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredEmployees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              layout
            >
              <Card className="hover:shadow-md transition-all">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-indigo-200">
                        {employee.avatar}
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${getAvailabilityColor(
                          employee.availability
                        )} rounded-full border-2 border-white shadow`}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-slate-900 font-semibold truncate mb-0.5">
                        {employee.name}
                      </h3>
                      <p className="text-slate-500 text-sm truncate">{employee.role}</p>
                      
                      {/* Rate */}
                      <div className="mt-2 inline-flex items-baseline gap-1 bg-indigo-50 rounded-lg px-3 py-1">
                        <span className="text-indigo-600 font-mono font-semibold text-sm">
                          €{employee.rate}
                        </span>
                        <span className="text-indigo-500 text-xs">
                          {employee.compensationType === 'hourly' ? '/hr' : '/mo'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  {employee.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                      {employee.techStack.slice(0, 3).map((tech, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="bg-slate-50 text-slate-600 border-slate-200 text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {employee.techStack.length > 3 && (
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-slate-500 border-slate-200 text-xs"
                        >
                          +{employee.techStack.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
