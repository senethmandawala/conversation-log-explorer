import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CategoryNode } from "./CategoryStructure";

interface UpdateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isUpdatingChild: boolean;
  updatingCurrent: boolean;
  selectedNode?: CategoryNode;
  categories?: CategoryNode[];
  onSubmit: (data: { name: string; description: string }) => void;
}

export default function UpdateCategoryDialog({
  open,
  onOpenChange,
  isUpdatingChild,
  updatingCurrent,
  selectedNode,
  categories = [],
  onSubmit,
}: UpdateCategoryDialogProps) {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  useEffect(() => {
    if (open && updatingCurrent && selectedNode) {
      setCategoryName(selectedNode.name);
      setDescription(selectedNode.description);
    } else if (open && !updatingCurrent) {
      setCategoryName("");
      setDescription("");
    }
  }, [open, updatingCurrent, selectedNode]);

  const validateForm = () => {
    const newErrors: { name?: string; description?: string } = {};

    if (!categoryName.trim()) {
      newErrors.name = "Category name is required";
    } else if (categoryName.length > 100) {
      newErrors.name = "Category name is too long (max 100 characters)";
    } else {
      // Check if name already exists in siblings
      const sibilingsToCheck = updatingCurrent
        ? categories.filter((cat) => cat.name !== selectedNode?.name)
        : categories;
      
      if (sibilingsToCheck.some((cat) => cat.name === categoryName)) {
        newErrors.name = "Category name already exists";
      }
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length > 1000) {
      newErrors.description = "Description is too long (max 1000 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ name: categoryName, description });
      onOpenChange(false);
    }
  };

  const getTitle = () => {
    if (isUpdatingChild) return "Add Subcategory";
    if (updatingCurrent) return "Update Category";
    return "Add Main Category";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {isUpdatingChild && selectedNode && (
              <p className="text-sm text-muted-foreground">
                Parent Category: <span className="font-medium">{selectedNode.name}</span>
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter category description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={errors.description ? "border-destructive" : ""}
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {updatingCurrent ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
