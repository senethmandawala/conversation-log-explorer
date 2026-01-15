import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ConversationRecord } from "@/types/conversation";
import { StatusBadge, getResolutionVariant, getVdnSourceVariant } from "./StatusBadge";
import { IconCalendar, IconClock, IconPhone, IconTag, IconFileText, IconBuilding, IconMapPin, IconHourglass, IconHash, IconAntenna, IconPhoneOff } from "@tabler/icons-react";

interface ConversationDetailSheetProps {
  record: ConversationRecord | null;
  open: boolean;
  onClose: () => void;
}

function DetailItem({ icon, label, value, delay = 0 }: { icon: React.ReactNode; label: string; value: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }} className="flex items-start gap-4 py-3">
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
        <div className="text-sm font-medium text-foreground">{value || <span className="text-muted-foreground">N/A</span>}</div>
      </div>
    </motion.div>
  );
}

export function ConversationDetailSheet({ record, open, onClose }: ConversationDetailSheetProps) {
  if (!record) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-background/95 backdrop-blur-lg border-l border-border/50">
        <SheetHeader className="pb-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <SheetTitle className="text-xl font-semibold flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <IconFileText className="h-5 w-5 text-primary" />
              </div>
              Conversation Details
            </SheetTitle>
          </motion.div>
        </SheetHeader>

        <div className="space-y-1">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl bg-muted/30 p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Resolution</span>
              <StatusBadge label={record.resolution} variant={getResolutionVariant(record.resolution)} />
            </div>
          </motion.div>

          <DetailItem icon={<IconCalendar className="h-5 w-5 text-primary" />} label="Date" value={record.date} delay={0.15} />
          <DetailItem icon={<IconClock className="h-5 w-5 text-primary" />} label="Time" value={record.time} delay={0.2} />
          <Separator className="my-4" />
          <DetailItem icon={<IconPhone className="h-5 w-5 text-primary" />} label="MSISDN" value={record.msisdn} delay={0.25} />
          <DetailItem icon={<IconHash className="h-5 w-5 text-primary" />} label="Unique ID" value={<code className="text-xs bg-muted px-2 py-1 rounded-md font-mono">{record.uniqueID}</code>} delay={0.3} />
          <Separator className="my-4" />
          <DetailItem icon={<IconTag className="h-5 w-5 text-primary" />} label="Category" value={record.category} delay={0.35} />
          <DetailItem icon={<IconTag className="h-5 w-5 text-primary" />} label="Sub Category" value={record.subCategory} delay={0.4} />
          <Separator className="my-4" />
          <DetailItem icon={<IconHourglass className="h-5 w-5 text-primary" />} label="Duration" value={record.duration} delay={0.45} />
          <DetailItem icon={<IconPhoneOff className="h-5 w-5 text-primary" />} label="Disconnect Reason" value={record.callDisReason} delay={0.5} />
          <DetailItem icon={<IconBuilding className="h-5 w-5 text-primary" />} label="Department" value={record.department} delay={0.55} />
          <DetailItem icon={<IconMapPin className="h-5 w-5 text-primary" />} label="City" value={record.city} delay={0.6} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
