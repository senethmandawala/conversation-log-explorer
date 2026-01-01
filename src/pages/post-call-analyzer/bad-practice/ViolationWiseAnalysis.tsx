import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Agent {
  name: string;
  percentage: number;
  progressPercentage: number;
}

interface ViolationData {
  violationType: string;
  distribution: string;
  distributionValue: number;
  affectedAgents: number;
  expanded?: boolean;
  agents: Agent[];
}

// Mock data
const mockViolationData: ViolationData[] = [
  {
    violationType: "Script Deviation",
    distribution: "35%",
    distributionValue: 35,
    affectedAgents: 12,
    agents: [
      { name: "John Smith", percentage: 45, progressPercentage: 45 },
      { name: "Sarah Johnson", percentage: 38, progressPercentage: 38 },
      { name: "Mike Wilson", percentage: 32, progressPercentage: 32 },
      { name: "Emily Davis", percentage: 28, progressPercentage: 28 },
    ],
  },
  {
    violationType: "Hold Time Exceeded",
    distribution: "28%",
    distributionValue: 28,
    affectedAgents: 8,
    agents: [
      { name: "David Brown", percentage: 52, progressPercentage: 52 },
      { name: "Lisa Anderson", percentage: 41, progressPercentage: 41 },
      { name: "Chris Martinez", percentage: 35, progressPercentage: 35 },
    ],
  },
  {
    violationType: "Tone Issues",
    distribution: "22%",
    distributionValue: 22,
    affectedAgents: 10,
    agents: [
      { name: "Mike Wilson", percentage: 48, progressPercentage: 48 },
      { name: "Jennifer Lee", percentage: 39, progressPercentage: 39 },
      { name: "Robert Taylor", percentage: 31, progressPercentage: 31 },
    ],
  },
  {
    violationType: "Compliance Issues",
    distribution: "15%",
    distributionValue: 15,
    affectedAgents: 5,
    agents: [
      { name: "Emily Davis", percentage: 55, progressPercentage: 55 },
      { name: "Thomas White", percentage: 42, progressPercentage: 42 },
    ],
  },
];

export default function ViolationWiseAnalysis() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ViolationData[]>(mockViolationData);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const toggleRowExpand = (violationType: string) => {
    setData(prev => prev.map(item =>
      item.violationType === violationType ? { ...item, expanded: !item.expanded } : item
    ));
  };

  const getDistributionColor = (value: number) => {
    if (value >= 30) return "bg-red-500/10 text-red-600 border-red-500/30";
    if (value >= 20) return "bg-amber-500/10 text-amber-600 border-amber-500/30";
    return "bg-green-500/10 text-green-600 border-green-500/30";
  };

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="mt-6">
      <h5 className="text-lg font-semibold mb-4">Violation-wise Analysis</h5>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No violation data available
        </div>
      ) : (
        <>
          <div className="border border-border/50 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Violation Type</TableHead>
                  <TableHead className="w-[20%]">Violation Proportion</TableHead>
                  <TableHead className="w-[20%]">Affected Agents</TableHead>
                  <TableHead className="text-center w-[10%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((violation, index) => (
                  <>
                    <motion.tr
                      key={violation.violationType}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/30 hover:bg-muted/20"
                    >
                      <TableCell>
                        <Badge variant="outline" className="bg-accent/50 text-accent-foreground border-accent">
                          {violation.violationType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getDistributionColor(violation.distributionValue)}>
                          {violation.distribution}
                        </Badge>
                      </TableCell>
                      <TableCell>{violation.affectedAgents}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleRowExpand(violation.violationType)}
                        >
                          {violation.expanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </motion.tr>

                    <AnimatePresence>
                      {violation.expanded && (
                        <motion.tr
                          key={`${violation.violationType}-expanded`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <TableCell colSpan={4} className="p-0">
                            <div className="p-4 bg-muted/20 border-t border-border/30">
                              <h6 className="font-semibold mb-3">
                                Agents with {violation.violationType}
                              </h6>
                              <div className="space-y-3">
                                {violation.agents.map((agent, agentIndex) => (
                                  <div key={agentIndex} className="space-y-1">
                                    <div className="flex justify-content-between items-center">
                                      <span className="font-medium text-sm">{agent.name}</span>
                                      <span className="text-sm text-muted-foreground">{agent.percentage}%</span>
                                    </div>
                                    <Progress value={agent.progressPercentage} className="h-1.5" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, data.length)} of {data.length} entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
