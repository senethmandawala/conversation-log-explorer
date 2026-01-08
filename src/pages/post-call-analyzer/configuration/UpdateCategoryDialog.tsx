import { useState, useEffect } from "react";
import { 
  Button, 
  Modal,
  Input, 
  Typography,
  Form,
  message
} from "antd";
import { CategoryNode } from "./CategoryStructure";

const { Text } = Typography;
const { TextArea } = Input;

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
  const [form] = Form.useForm();
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  useEffect(() => {
    if (open && updatingCurrent && selectedNode) {
      form.setFieldsValue({
        categoryName: selectedNode.name,
        description: selectedNode.description
      });
    } else if (open && !updatingCurrent) {
      form.resetFields();
    }
  }, [open, updatingCurrent, selectedNode, form]);

  const validateForm = () => {
    const values = form.getFieldsValue();
    const categoryName = values.categoryName || "";
    const description = values.description || "";
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

  const handleSubmit = () => {
    if (validateForm()) {
      const values = form.getFieldsValue();
      onSubmit({ name: values.categoryName, description: values.description });
      onOpenChange(false);
      form.resetFields();
      setErrors({});
    }
  };

  const getTitle = () => {
    if (isUpdatingChild) return "Add Subcategory";
    if (updatingCurrent) return "Update Category";
    return "Add Main Category";
  };

  return (
    <Modal 
      open={open} 
      onCancel={() => onOpenChange(false)}
      title={getTitle()}
      width={500}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            {updatingCurrent ? "Update" : "Add"}
          </Button>
        </div>
      }
    >
      <Form 
        form={form}
        layout="vertical"
        className="space-y-4 py-4"
      >
        {isUpdatingChild && selectedNode && (
          <div className="mb-4">
            <Text className="text-sm text-gray-600" style={{ fontFamily: 'Geist, sans-serif' }}>
              Parent Category: <span className="font-medium text-gray-900">{selectedNode.name}</span>
            </Text>
          </div>
        )}

        <Form.Item
          label="Category Name"
          name="categoryName"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name}
          rules={[{ required: true, message: "Category name is required" }]}
        >
          <Input 
            placeholder="Enter category name"
            className="font-geist"
            style={{ fontFamily: 'Geist, sans-serif' }}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          validateStatus={errors.description ? "error" : ""}
          help={errors.description}
          rules={[{ required: true, message: "Description is required" }]}
        >
          <TextArea
            placeholder="Enter category description"
            rows={4}
            className="font-geist"
            style={{ fontFamily: 'Geist, sans-serif' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
