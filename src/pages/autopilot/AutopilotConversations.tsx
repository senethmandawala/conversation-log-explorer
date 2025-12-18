import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, RefreshCcw } from "lucide-react";
import { ConversationTable } from "@/components/conversation/ConversationTable";
import { ConversationDetailSheet } from "@/components/conversation/ConversationDetailSheet";
import { FilterDropdown, MultiSelectContent } from "@/components/conversation/FilterDropdown";
import { mockConversations, filterOptions } from "@/data/mockConversations";
import { ConversationRecord } from "@/types/conversation";

export default function AutopilotConversations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<ConversationRecord | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedVdnSources, setSelectedVdnSources] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filteredData = mockConversations.filter((record) => {
    const matchesSearch =
      searchQuery === "" ||
      record.msisdn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.uniqueID.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVdnSource = selectedVdnSources.length === 0 || selectedVdnSources.includes(record.vdnSource || "");
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(record.category);

    return matchesSearch && matchesVdnSource && matchesCategory;
  });

  const handleView = (record: ConversationRecord) => {
    setSelectedRecord(record);
    setSheetOpen(true);
  };

  const clearFilters = () => {
    setSelectedVdnSources([]);
    setSelectedCategories([]);
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-foreground mb-2">Conversation History</h2>
        <p className="text-muted-foreground text-sm">View and analyze all autopilot conversations</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-4 border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by MSISDN, Category, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <FilterDropdown
                label="VDN Source"
                selectedValue={selectedVdnSources[0]}
                plusCount={selectedVdnSources.length > 1 ? selectedVdnSources.length - 1 : 0}
                onClear={() => setSelectedVdnSources([])}
              >
                <MultiSelectContent
                  options={filterOptions.vdnSources}
                  selected={selectedVdnSources}
                  onChange={setSelectedVdnSources}
                />
              </FilterDropdown>
              <FilterDropdown
                label="Category"
                selectedValue={selectedCategories[0]}
                plusCount={selectedCategories.length > 1 ? selectedCategories.length - 1 : 0}
                onClear={() => setSelectedCategories([])}
              >
                <MultiSelectContent
                  options={filterOptions.categories}
                  selected={selectedCategories}
                  onChange={setSelectedCategories}
                />
              </FilterDropdown>
              <Button variant="outline" size="sm" onClick={clearFilters} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Clear
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredData.length}</span> conversations
        </p>
      </motion.div>

      {/* Table */}
      <ConversationTable data={filteredData} onView={handleView} />

      {/* Detail Sheet */}
      <ConversationDetailSheet
        record={selectedRecord}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
