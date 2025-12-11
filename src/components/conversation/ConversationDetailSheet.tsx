import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ConversationRecord } from "@/types/conversation";
import { StatusBadge, getResolutionVariant, getVdnSourceVariant } from "./StatusBadge";
import { Separator } from "@/components/ui/separator";

interface ConversationDetailSheetProps {
  record: ConversationRecord | null;
  open: boolean;
  onClose: () => void;
}

export function ConversationDetailSheet({
  record,
  open,
  onClose,
}: ConversationDetailSheetProps) {
  if (!record) return null;

  const detailGroups = [
    {
      title: 'Basic Information',
      items: [
        { label: 'Date', value: record.date },
        { label: 'Time', value: record.time },
        { label: 'MSISDN', value: record.msisdn },
        { label: 'Unique ID', value: record.uniqueID },
        { label: 'Channel', value: record.channel },
      ],
    },
    {
      title: 'Classification',
      items: [
        { label: 'Category', value: record.category },
        { label: 'Sub Category', value: record.subCategory || 'N/A' },
        { label: 'Department', value: record.department || 'N/A' },
      ],
    },
    {
      title: 'Call Details',
      items: [
        { label: 'Duration', value: record.duration },
        { label: 'VDN', value: record.vdn || 'N/A' },
        { label: 'City', value: record.city || 'N/A' },
        { label: 'Disconnect Reason', value: record.callDisReason },
      ],
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Conversation Details</SheetTitle>
          <SheetDescription>
            Conversation ID: {record.uniqueID}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status Badges */}
          <div className="flex items-center gap-3">
            <StatusBadge
              label={record.resolution}
              variant={getResolutionVariant(record.resolution)}
              size="md"
            />
            <StatusBadge
              label={record.vdnSource || 'N/A'}
              variant={getVdnSourceVariant(record.vdnSource)}
              size="md"
            />
          </div>

          {/* Summary */}
          {record.summary && (
            <div>
              <h4 className="text-sm font-medium mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                {record.summary}
              </p>
            </div>
          )}

          <Separator />

          {/* Detail Groups */}
          {detailGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-medium mb-3">{group.title}</h4>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
