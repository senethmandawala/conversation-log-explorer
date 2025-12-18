import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Download, 
  Filter,
  Calendar,
  MessageSquare 
} from "lucide-react";
import { ConversationTable } from "@/components/conversation/ConversationTable";
import { ConversationDetailSheet } from "@/components/conversation/ConversationDetailSheet";
import { mockConversations, filterOptions } from "@/data/mockConversations";
import { ConversationRecord } from "@/types/conversation";
import { useAutopilot } from "@/contexts/AutopilotContext";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AutopilotConversations() {
  const navigate = useNavigate();
  const { selectedInstance } = useAutopilot();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<ConversationRecord | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedVdnSource, setSelectedVdnSource] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedResolution, setSelectedResolution] = useState<string>("");

  useEffect(() => {
    if (!selectedInstance) {
      navigate("/autopilot");
    }
  }, [selectedInstance, navigate]);

  if (!selectedInstance) {
    return null;
  }

  const filteredData = mockConversations.filter((record) => {
    const matchesSearch =
      searchQuery === "" ||
      record.msisdn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.uniqueID.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVdnSource = !selectedVdnSource || record.vdnSource === selectedVdnSource;
    const matchesCategory = !selectedCategory || record.category === selectedCategory;
    const matchesResolution = !selectedResolution || record.resolution === selectedResolution;

    return matchesSearch && matchesVdnSource && matchesCategory && matchesResolution;
  });

  const handleView = (record: ConversationRecord) => {
    setSelectedRecord(record);
    setSheetOpen(true);
  };

  const clearFilters = () => {
    setSelectedVdnSource("");
    setSelectedCategory("");
    setSelectedResolution("");
    setSearchQuery("");
  };

  const activeFiltersCount = [selectedVdnSource, selectedCategory, selectedResolution].filter(Boolean).length;

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold tracking-tight">
                  Conversation History
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  View and analyze all autopilot conversations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button 
                variant={filtersOpen ? "default" : "outline"} 
                size="sm" 
                className="gap-2 relative"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Filters Panel */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 bg-muted/30 rounded-lg border border-border/50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Search MSISDN / ID</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* VDN Source Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">VDN Source</label>
                    <Select value={selectedVdnSource} onValueChange={(value) => setSelectedVdnSource(value === "all" ? "" : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Sources" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        {filterOptions.vdnSources.map((source) => (
                          <SelectItem key={source.value} value={source.value}>{source.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {filterOptions.categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Date Range</label>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Calendar className="h-4 w-4" />
                      Select dates
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end mt-4 gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                  <Button size="sm">Apply Filters</Button>
                </div>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4"
          >
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredData.length}</span> conversations
            </p>
          </motion.div>

          {/* Table */}
          <ConversationTable data={filteredData} onView={handleView} />
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <ConversationDetailSheet
        record={selectedRecord}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
