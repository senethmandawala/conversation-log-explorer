import { useState } from "react";
import { 
  Button, 
  Typography, 
  Space, 
  Dropdown, 
  Tooltip,
  Row,
  Col
} from "antd";
import { 
  IconFolder, 
  IconList, 
  IconChevronRight, 
  IconChevronDown, 
  IconEdit, 
  IconTrash, 
  IconPlus, 
  IconDots,
  IconInfoCircle
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

const { Text } = Typography;

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

    const dropdownItems = [
      {
        key: 'add-child',
        label: 'Add Child Category',
        icon: <IconPlus />,
        disabled: !canAddChild,
        onClick: () => onAddChild(node)
      },
      {
        key: 'edit',
        label: 'Edit',
        icon: <IconEdit />,
        onClick: () => onEdit(node)
      },
      {
        key: 'delete',
        label: 'Delete',
        icon: <IconTrash />,
        onClick: () => onDelete(node),
        danger: true
      }
    ];

    return (
      <div className="space-y-1">
        <Row 
          gutter={[8, 8]} 
          align="middle" 
          className="p-2 rounded-lg hover:bg-gray-50 transition-colors group"
          style={{ marginLeft: `${depth * 20}px` }}
        >
          {/* Category Name Column */}
          <Col xs={24} sm={16} xl={12}>
            <Space size="small">
              {hasChildren(node) ? (
                <Button
                  type="text"
                  size="small"
                  icon={isExpanded ? <IconChevronDown /> : <IconChevronRight />}
                  onClick={() => toggleNode(node.index)}
                  style={{ 
                    width: 24, 
                    height: 24, 
                    padding: 0,
                    color: '#6b7280'
                  }}
                />
              ) : (
                <div style={{ width: 24 }} />
              )}
              {hasChildren(node) ? (
                <IconFolder style={{ color: '#3b82f6', fontSize: 16 }} />
              ) : (
                <IconList style={{ color: '#6b7280', fontSize: 16 }} />
              )}
              <Text style={{ fontSize: '14px', fontFamily: 'Geist, sans-serif' }}>{node.name}</Text>
            </Space>
          </Col>

          {/* Description Column - Hidden on smaller screens */}
          <Col xs={0} xl={10} className="hidden xl:block">
            <Text type="secondary" style={{ fontSize: '12px', fontFamily: 'Geist, sans-serif', textAlign: 'left', lineHeight: '1.2' }}>
              {node.description}
            </Text>
          </Col>

          {/* Actions Column - Three dots - Always visible */}
          <Col xs={24} sm={8} xl={2} className="flex justify-end">
            <Dropdown
              menu={{ items: dropdownItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button
                type="text"
                size="small"
                icon={<IconDots />}
                style={{ color: '#6b7280' }}
              />
            </Dropdown>
          </Col>
        </Row>

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
    <div className="space-y-1" style={{ maxHeight: '24rem', overflowY: 'auto' }}>
      {/* Header Row */}
      <Row 
        gutter={[8, 8]} 
        className="mb-2 px-2"
        style={{ fontSize: '14px', fontWeight: 500, color: '#6b7280', fontFamily: 'Geist, sans-serif' }}
      >
        <Col xs={24} sm={16} xl={12}>Category Name</Col>
        <Col xs={0} xl={10} className="hidden xl:block">Description</Col>
        <Col xs={24} sm={8} xl={2}>Action</Col>
      </Row>

      {categoryData.map((node) => (
        <CategoryItem key={node.index} node={node} />
      ))}
    </div>
  );
}
