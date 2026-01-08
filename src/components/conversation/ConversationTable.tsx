import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Columns3, Settings2 } from "lucide-react";
import { ConversationRecord, ColumnDefinition } from "@/types/conversation";
import { StatusBadge, getResolutionVariant, getVdnSourceVariant } from "./StatusBadge";
import { cn } from "@/lib/utils";
import { getColumnDefinitionsAutopilot } from "@/utils/envConfig";

interface ConversationTableProps {
  data: ConversationRecord[];
  onView: (record: ConversationRecord) => void;
}

// Fallback columns if env config is not available
const fallbackColumns: ColumnDefinition[] = [
  { id: 'date', label: 'Date & Time', visible: true },
  { id: 'msisdn', label: 'MSISDN', visible: true },
  { id: 'category', label: 'Category', visible: true },
  { id: 'subCategory', label: 'Sub Category', visible: true },
  { id: 'resolution', label: 'Resolution', visible: true },
  { id: 'callDisReason', label: 'Disconnect Reason', visible: true },
  { id: 'uniqueID', label: 'Unique ID', visible: true },
  { id: 'summary', label: 'Summary', visible: false },
  { id: 'channel', label: 'Channel', visible: false },
  { id: 'department', label: 'Department', visible: false },
  { id: 'city', label: 'City', visible: false },
  { id: 'vdn', label: 'VDN', visible: false },
  { id: 'vdnSource', label: 'VDN Source', visible: true },
  { id: 'duration', label: 'Duration', visible: true },
];

// Get columns from env config or use fallback
const getDefaultColumns = (): ColumnDefinition[] => {
  const envColumns = getColumnDefinitionsAutopilot();
  if (envColumns && envColumns.length > 0) {
    return envColumns.map(col => ({
      id: col.def,
      label: col.label,
      visible: col.visible,
    }));
  }
  return fallbackColumns;
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

export function ConversationTable({ data, onView }: ConversationTableProps) {
  const [columns, setColumns] = useState<ColumnDefinition[]>(getDefaultColumns);

  const visibleColumns = columns.filter((col) => col.visible);

  const toggleColumn = (id: string) => {
    setColumns(
      columns.map((col) =>
        col.id === id ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const renderCell = (record: ConversationRecord, columnId: string) => {
    switch (columnId) {
      case 'date':
        return (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{record.date}</span>
            <span className="text-xs text-muted-foreground">{record.time}</span>
          </div>
        );
      case 'resolution':
        return (
          <StatusBadge
            label={record.resolution}
            variant={getResolutionVariant(record.resolution)}
          />
        );
      case 'vdnSource':
        return (
          <StatusBadge
            label={record.vdnSource || 'N/A'}
            variant={getVdnSourceVariant(record.vdnSource)}
          />
        );
      case 'subCategory':
      case 'department':
      case 'city':
      case 'vdn':
        return <span className="text-muted-foreground">{record[columnId] || 'N/A'}</span>;
      default:
        return <span>{record[columnId as keyof ConversationRecord] as string}</span>;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-xl border bg-card shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto custom-scrollbar">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border/50 bg-muted/30">
              {visibleColumns.map((col) => (
                <TableHead 
                  key={col.id} 
                  className="whitespace-nowrap font-semibold text-foreground/80 text-xs uppercase tracking-wider py-4"
                >
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="w-[60px] text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <Settings2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 bg-popover/95 backdrop-blur-lg border-border/50 shadow-lg animate-scale-in"
                  >
                    <div className="p-3">
                      <h4 className="mb-3 text-sm font-semibold flex items-center gap-2">
                        <Columns3 className="h-4 w-4 text-primary" />
                        Configure Columns
                      </h4>
                      <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                        {columns.map((col) => (
                          <label
                            key={col.id}
                            className={cn(
                              "flex items-center gap-3 py-2 px-2 cursor-pointer rounded-lg transition-all duration-200",
                              col.visible 
                                ? "bg-primary/10 hover:bg-primary/15" 
                                : "hover:bg-muted"
                            )}
                          >
                            <Checkbox
                              checked={col.visible}
                              onCheckedChange={() => toggleColumn(col.id)}
                              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <span className="text-sm">{col.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {data.map((record, index) => (
                <motion.tr
                  key={record.id}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: -20 }}
                  className={cn(
                    "group border-b border-border/30 transition-all duration-200",
                    "hover:bg-primary/[0.03] hover:shadow-[inset_3px_0_0_0_hsl(var(--primary))]"
                  )}
                >
                  {visibleColumns.map((col) => (
                    <TableCell 
                      key={col.id} 
                      className="whitespace-nowrap py-4 text-sm"
                    >
                      {renderCell(record, col.id)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right py-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-9 w-9 rounded-lg transition-all duration-200",
                          "opacity-0 group-hover:opacity-100",
                          "hover:bg-primary hover:text-primary-foreground",
                          "shadow-none hover:shadow-md"
                        )}
                        onClick={() => onView(record)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
