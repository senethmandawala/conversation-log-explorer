import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderTree, List, ChevronRight, ChevronDown, Edit2, Trash2, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface CategoryNode {
  name: string;
  description: string;
  index: string;
  value: CategoryNode[];
}

interface CategoryStructureProps {
  categoryData: CategoryNode[];
  onCategoryDataUpdated: (data: CategoryNode[]) => void;
  onAddChild: (node: CategoryNode) => void;
  onEdit: (node: CategoryNode) => void;
  onDelete: (node: CategoryNode) => void;
}

export default function CategoryStructure({
  categoryData,
  onCategoryDataUpdated,
  onAddChild,
  onEdit,
  onDelete,
}: CategoryStructureProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const categoriesLimit = 4;

  const toggleNode = (index: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedNodes(newExpanded);
  };

  const hasChildren = (node: CategoryNode) => {
    return node.value && node.value.length > 0;
  };

  const CategoryItem = ({ node, depth = 0 }: { node: CategoryNode; depth?: number }) => {
    const isExpanded = expandedNodes.has(node.index);
    const nodeLevel = node.index.split('.').length;
    const canAddChild = nodeLevel <= categoriesLimit;

    return (
      <div className="space-y-1">
        <div className="grid grid-cols-12 gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group">
          {/* Category Name Column */}
          <div className="col-span-8 sm:col-span-9 xl:col-span-5 flex items-center gap-2" style={{ paddingLeft: `${depth * 20}px` }}>
            {hasChildren(node) ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => toggleNode(node.index)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            ) : (
              <div className="w-6" />
            )}
            {hasChildren(node) ? (
              isExpanded ? (
                <FolderTree className="h-4 w-4 text-primary" />
              ) : (
                <FolderTree className="h-4 w-4 text-primary" />
              )
            ) : (
              <List className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm">{node.name}</span>
          </div>

          {/* Description Column - Hidden on smaller screens */}
          <div className="hidden xl:block xl:col-span-5 self-center">
            <span className="text-sm text-muted-foreground">{node.description}</span>
          </div>

          {/* Actions Column */}
          <div className="col-span-4 sm:col-span-3 xl:col-span-2 flex items-center justify-end gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 xl:hidden">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{node.description}</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onAddChild(node)}
                  disabled={!canAddChild}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Child Category
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(node)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(node)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && hasChildren(node) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {node.value.map((child) => (
                <CategoryItem key={child.index} node={child} depth={depth + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-1 max-h-96 overflow-y-auto">
      {/* Header Row */}
      <div className="grid grid-cols-12 gap-2 mb-2 px-2 text-sm font-medium text-muted-foreground">
        <div className="col-span-8 sm:col-span-9 xl:col-span-5">Category Name</div>
        <div className="hidden xl:block xl:col-span-5">Description</div>
        <div className="col-span-4 sm:col-span-3 xl:col-span-2 text-end">Action</div>
      </div>

      {categoryData.map((node) => (
        <CategoryItem key={node.index} node={node} />
      ))}
    </div>
  );
}
