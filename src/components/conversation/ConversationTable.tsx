import { useState } from "react";
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
import { Eye, Columns3 } from "lucide-react";
import { ConversationRecord, ColumnDefinition } from "@/types/conversation";
import { StatusBadge, getResolutionVariant, getVdnSourceVariant } from "./StatusBadge";

interface ConversationTableProps {
  data: ConversationRecord[];
  onView: (record: ConversationRecord) => void;
}

const defaultColumns: ColumnDefinition[] = [
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

export function ConversationTable({ data, onView }: ConversationTableProps) {
  const [columns, setColumns] = useState<ColumnDefinition[]>(defaultColumns);

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
          <div>
            <div className="font-medium">{record.date}</div>
            <div className="text-xs text-muted-foreground">{record.time}</div>
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
        return record[columnId] || 'N/A';
      default:
        return record[columnId as keyof ConversationRecord] as string;
    }
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {visibleColumns.map((col) => (
              <TableHead key={col.id} className="whitespace-nowrap">
                {col.label}
              </TableHead>
            ))}
            <TableHead className="w-[50px] text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Columns3 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-popover">
                  <div className="p-2">
                    <h4 className="mb-2 text-sm font-medium">Configure Columns</h4>
                    {columns.map((col) => (
                      <label
                        key={col.id}
                        className="flex items-center gap-2 py-1 cursor-pointer hover:bg-muted rounded px-1"
                      >
                        <Checkbox
                          checked={col.visible}
                          onCheckedChange={() => toggleColumn(col.id)}
                        />
                        <span className="text-sm">{col.label}</span>
                      </label>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record) => (
            <TableRow key={record.id}>
              {visibleColumns.map((col) => (
                <TableCell key={col.id} className="whitespace-nowrap">
                  {renderCell(record, col.id)}
                </TableCell>
              ))}
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onView(record)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
