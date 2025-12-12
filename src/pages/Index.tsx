import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Download, Filter, Search, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Sparkles } from "lucide-react";
import { FilterDropdown, TextFilterContent, MultiSelectContent } from "@/components/conversation/FilterDropdown";
import { DateRangeFilter } from "@/components/conversation/DateRangeFilter";
import { ConversationTable } from "@/components/conversation/ConversationTable";
import { ConversationDetailSheet } from "@/components/conversation/ConversationDetailSheet";
import { EmptyState } from "@/components/conversation/EmptyState";
import { LoadingSkeleton } from "@/components/conversation/LoadingSkeleton";
import { mockConversations, filterOptions } from "@/data/mockConversations";
import { ConversationRecord, FilterState, DateRangeValue } from "@/types/conversation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const initialFilters: FilterState = {
  searchKey: '',
  vdnKey: '',
  msisdnKey: '',
  uniqueIdKey: '',
  selectedVdnSources: [],
  selectedCallTypes: [],
  selectedCategories: [],
  selectedSubCategories: [],
  dateRange: null,
};

export default function ConversationHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilters);
  const [selectedRecord, setSelectedRecord] = useState<ConversationRecord | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.searchKey) count++;
    if (appliedFilters.vdnKey) count++;
    if (appliedFilters.msisdnKey) count++;
    if (appliedFilters.uniqueIdKey) count++;
    if (appliedFilters.selectedVdnSources.length) count++;
    if (appliedFilters.selectedCallTypes.length) count++;
    if (appliedFilters.selectedCategories.length) count++;
    if (appliedFilters.selectedSubCategories.length) count++;
    if (appliedFilters.dateRange) count++;
    return count;
  }, [appliedFilters]);

  const filteredData = useMemo(() => {
    return mockConversations.filter((record) => {
      if (appliedFilters.searchKey) {
        const searchLower = appliedFilters.searchKey.toLowerCase();
        const matchesSearch = 
          record.summary.toLowerCase().includes(searchLower) ||
          record.category.toLowerCase().includes(searchLower) ||
          record.msisdn.includes(appliedFilters.searchKey);
        if (!matchesSearch) return false;
      }
      if (appliedFilters.vdnKey && !record.vdn?.includes(appliedFilters.vdnKey)) return false;
      if (appliedFilters.msisdnKey && !record.msisdn.includes(appliedFilters.msisdnKey)) return false;
      if (appliedFilters.uniqueIdKey && !record.uniqueID.toLowerCase().includes(appliedFilters.uniqueIdKey.toLowerCase())) return false;
      if (appliedFilters.selectedVdnSources.length && record.vdnSource && !appliedFilters.selectedVdnSources.includes(record.vdnSource)) return false;
      if (appliedFilters.selectedCallTypes.length && !appliedFilters.selectedCallTypes.includes(record.channel)) return false;
      if (appliedFilters.selectedCategories.length && !appliedFilters.selectedCategories.includes(record.category)) return false;
      if (appliedFilters.selectedSubCategories.length && record.subCategory && !appliedFilters.selectedSubCategories.includes(record.subCategory)) return false;
      return true;
    });
  }, [appliedFilters]);

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const headers = ['Date', 'Time', 'MSISDN', 'Category', 'Sub Category', 'Resolution', 'Unique ID', 'Duration'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map((r) => 
        [r.date, r.time, r.msisdn, r.category, r.subCategory || '', r.resolution, r.uniqueID, r.duration].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleViewRecord = (record: ConversationRecord) => {
    setSelectedRecord(record);
    setDetailSheetOpen(true);
  };

  const subCategoryOptions = useMemo(() => {
    if (filters.selectedCategories.length === 0) return [];
    return filters.selectedCategories.flatMap(
      (cat) => filterOptions.subCategories[cat as keyof typeof filterOptions.subCategories] || []
    );
  }, [filters.selectedCategories]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold tracking-tight text-foreground">
                        Conversation History
                      </h1>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        View and analyze all customer conversations
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="h-10 px-4 rounded-xl border-border/60 hover:bg-primary/5 hover:border-primary/50 transition-all duration-200"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button
                    variant={filtersOpen ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className={cn(
                      "h-10 px-4 rounded-xl relative transition-all duration-200",
                      filtersOpen 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "border-border/60 hover:bg-primary/5 hover:border-primary/50"
                    )}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    <AnimatePresence>
                      {activeFilterCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-2 -right-2"
                        >
                          <Badge
                            variant="destructive"
                            className="h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full shadow-lg"
                          >
                            {activeFilterCount}
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <>
                  <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <CollapsibleContent>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pb-6 border-b border-border/30 mb-6"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                          {/* Search by Keyword */}
                          <FilterDropdown
                            label="Search Keyword"
                            selectedValue={filters.searchKey}
                            onClear={() => updateFilter('searchKey', '')}
                          >
                            <TextFilterContent
                              label="Search keyword"
                              value={filters.searchKey}
                              onChange={(v) => updateFilter('searchKey', v)}
                              onApply={() => {}}
                              onClear={() => updateFilter('searchKey', '')}
                            />
                          </FilterDropdown>

                          {/* VDN */}
                          <FilterDropdown
                            label="VDN"
                            selectedValue={filters.vdnKey}
                            onClear={() => updateFilter('vdnKey', '')}
                          >
                            <TextFilterContent
                              label="VDN"
                              value={filters.vdnKey}
                              onChange={(v) => updateFilter('vdnKey', v)}
                              onApply={() => {}}
                              onClear={() => updateFilter('vdnKey', '')}
                            />
                          </FilterDropdown>

                          {/* MSISDN */}
                          <FilterDropdown
                            label="MSISDN"
                            selectedValue={filters.msisdnKey}
                            onClear={() => updateFilter('msisdnKey', '')}
                          >
                            <TextFilterContent
                              label="MSISDN"
                              value={filters.msisdnKey}
                              onChange={(v) => updateFilter('msisdnKey', v)}
                              onApply={() => {}}
                              onClear={() => updateFilter('msisdnKey', '')}
                            />
                          </FilterDropdown>

                          {/* Unique ID */}
                          <FilterDropdown
                            label="Unique ID"
                            selectedValue={filters.uniqueIdKey}
                            onClear={() => updateFilter('uniqueIdKey', '')}
                          >
                            <TextFilterContent
                              label="Unique ID"
                              value={filters.uniqueIdKey}
                              onChange={(v) => updateFilter('uniqueIdKey', v)}
                              onApply={() => {}}
                              onClear={() => updateFilter('uniqueIdKey', '')}
                            />
                          </FilterDropdown>

                          {/* VDN Source */}
                          <FilterDropdown
                            label="VDN Source"
                            selectedValue={filters.selectedVdnSources[0]}
                            plusCount={Math.max(0, filters.selectedVdnSources.length - 1)}
                            onClear={() => updateFilter('selectedVdnSources', [])}
                          >
                            <MultiSelectContent
                              options={filterOptions.vdnSources}
                              selected={filters.selectedVdnSources}
                              onChange={(v) => updateFilter('selectedVdnSources', v)}
                            />
                          </FilterDropdown>

                          {/* Call Type */}
                          <FilterDropdown
                            label="Type"
                            selectedValue={filters.selectedCallTypes[0]}
                            plusCount={Math.max(0, filters.selectedCallTypes.length - 1)}
                            onClear={() => updateFilter('selectedCallTypes', [])}
                          >
                            <MultiSelectContent
                              options={filterOptions.callTypes}
                              selected={filters.selectedCallTypes}
                              onChange={(v) => updateFilter('selectedCallTypes', v)}
                            />
                          </FilterDropdown>

                          {/* Category */}
                          <FilterDropdown
                            label="Category"
                            selectedValue={filters.selectedCategories[0]}
                            plusCount={Math.max(0, filters.selectedCategories.length - 1)}
                            onClear={() => {
                              updateFilter('selectedCategories', []);
                              updateFilter('selectedSubCategories', []);
                            }}
                          >
                            <MultiSelectContent
                              options={filterOptions.categories}
                              selected={filters.selectedCategories}
                              onChange={(v) => {
                                updateFilter('selectedCategories', v);
                                updateFilter('selectedSubCategories', []);
                              }}
                            />
                          </FilterDropdown>

                          {/* Sub Category */}
                          <FilterDropdown
                            label="Sub Category"
                            selectedValue={filters.selectedSubCategories[0]}
                            plusCount={Math.max(0, filters.selectedSubCategories.length - 1)}
                            onClear={() => updateFilter('selectedSubCategories', [])}
                            disabled={filters.selectedCategories.length === 0}
                          >
                            <MultiSelectContent
                              options={subCategoryOptions}
                              selected={filters.selectedSubCategories}
                              onChange={(v) => updateFilter('selectedSubCategories', v)}
                            />
                          </FilterDropdown>

                          {/* Date Range */}
                          <DateRangeFilter
                            value={filters.dateRange}
                            onChange={(v) => updateFilter('dateRange', v)}
                          />

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <Button 
                              onClick={handleSearch} 
                              className="flex-1 h-10 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              <Search className="h-4 w-4 mr-2" />
                              Search
                            </Button>
                            <AnimatePresence>
                              {activeFilterCount > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                >
                                  <Button 
                                    variant="outline" 
                                    onClick={handleClearFilters}
                                    className="h-10 w-10 p-0 rounded-xl hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-200"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    </CollapsibleContent>
                  </Collapsible>

                  {hasError ? (
                    <EmptyState
                      type="error"
                      message="Failed to load conversation history. Please try again."
                      onRetry={() => setHasError(false)}
                    />
                  ) : filteredData.length === 0 ? (
                    <EmptyState
                      type="no-data"
                      message="No conversations found matching your criteria. Try adjusting your filters."
                    />
                  ) : (
                    <>
                      <ConversationTable data={paginatedData} onView={handleViewRecord} />

                      {/* Enhanced Pagination */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-border/30"
                      >
                        <p className="text-sm text-muted-foreground">
                          Showing <span className="font-medium text-foreground">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                          <span className="font-medium text-foreground">{Math.min(currentPage * pageSize, filteredData.length)}</span> of{' '}
                          <span className="font-medium text-foreground">{filteredData.length}</span> results
                        </p>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="h-9 w-9 p-0 rounded-lg"
                          >
                            <ChevronsLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-9 w-9 p-0 rounded-lg"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          
                          <div className="flex items-center gap-1 mx-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }
                              
                              return (
                                <Button
                                  key={pageNum}
                                  variant={currentPage === pageNum ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={cn(
                                    "h-9 w-9 p-0 rounded-lg transition-all duration-200",
                                    currentPage === pageNum && "shadow-md"
                                  )}
                                >
                                  {pageNum}
                                </Button>
                              );
                            })}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-9 w-9 p-0 rounded-lg"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="h-9 w-9 p-0 rounded-lg"
                          >
                            <ChevronsRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ConversationDetailSheet
        record={selectedRecord}
        open={detailSheetOpen}
        onClose={() => setDetailSheetOpen(false)}
      />
    </div>
  );
}
