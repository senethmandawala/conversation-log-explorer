import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Download, Filter, Search, X } from "lucide-react";
import { FilterDropdown, TextFilterContent, MultiSelectContent } from "@/components/conversation/FilterDropdown";
import { DateRangeFilter } from "@/components/conversation/DateRangeFilter";
import { ConversationTable } from "@/components/conversation/ConversationTable";
import { ConversationDetailSheet } from "@/components/conversation/ConversationDetailSheet";
import { EmptyState } from "@/components/conversation/EmptyState";
import { LoadingSkeleton } from "@/components/conversation/LoadingSkeleton";
import { mockConversations, filterOptions } from "@/data/mockConversations";
import { ConversationRecord, FilterState, DateRangeValue } from "@/types/conversation";
import { Badge } from "@/components/ui/badge";

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
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Conversation History</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  View and analyze all customer conversations
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="h-9"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  variant={filtersOpen ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="h-9 relative"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <CollapsibleContent className="animate-fade-in">
                    <div className="pb-4 border-b mb-4">
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
                          <Button onClick={handleSearch} className="flex-1">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </Button>
                          {activeFilterCount > 0 && (
                            <Button variant="outline" onClick={handleClearFilters}>
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
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

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * pageSize + 1} to{' '}
                        {Math.min(currentPage * pageSize, filteredData.length)} of{' '}
                        {filteredData.length} results
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(1)}
                          disabled={currentPage === 1}
                        >
                          First
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <span className="text-sm px-2">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={currentPage === totalPages}
                        >
                          Last
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <ConversationDetailSheet
        record={selectedRecord}
        open={detailSheetOpen}
        onClose={() => setDetailSheetOpen(false)}
      />
    </div>
  );
}
