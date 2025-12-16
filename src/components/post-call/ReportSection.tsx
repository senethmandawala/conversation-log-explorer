import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ZoomIn, Maximize2, HelpCircle, PackageOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ReportSectionProps {
  id: string;
  title: string;
  description: string;
  hasChart?: boolean;
  hasFilter?: boolean;
  note?: string;
}

export const ReportSection = ({ title, description, hasChart, hasFilter, note }: ReportSectionProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-start gap-2">
          <div className="w-1 h-6 bg-primary rounded-full mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Information about {title}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {hasFilter && (
            <Button variant="outline" size="sm" className="text-xs">
              Total Calls <span className="ml-1 px-1.5 py-0.5 bg-muted rounded text-muted-foreground">0</span>
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Today
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-muted/50 mb-4">
            <PackageOpen className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">No Content Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Looks like there are no records yet. Try selecting a different date or range of dates.
          </p>
        </div>

        {note && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            <span className="text-primary">Note:</span> {note.replace("Note: ", "")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
