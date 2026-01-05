import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { 
  ChevronDown, 
  Image as ImageIcon,
  Globe,
  User,
  Bot,
  PhoneCall,
  Settings,
  LogOut,
  UserCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useModule } from "@/contexts/ModuleContext";

export function TopHeader() {
  const location = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed } = useModule();
  const isPostCallAnalyzer = location.pathname === "/pca";
  
  const moduleTitle = isPostCallAnalyzer ? "Post Call Analyzer" : "Autopilot";
  const ModuleIcon = isPostCallAnalyzer ? PhoneCall : Bot;

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 bg-gradient-to-r from-card via-card to-card/95 backdrop-blur-sm border-b border-border/30 px-6 flex items-center justify-between shadow-sm"
    >
      {/* Left side - Module indicator, Sidebar toggle, and Agent selector */}
      <div className="flex items-center gap-6">
        {/* Sidebar toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-10 w-10 rounded-xl border-border/60 hover:bg-muted/50 hover:border-border transition-all duration-200"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>

        {/* Agent selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 px-4 rounded-xl border-border/60 hover:bg-muted/50 hover:border-border transition-all duration-200"
            >
              <ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Billing Agent</span>
              <ChevronDown className="h-4 w-4 ml-2 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Billing Agent</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <Badge variant="secondary" className="text-xs">Current</Badge>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                <User className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Support Agent</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Sales Agent</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right side - Language and User */}
      <div className="flex items-center gap-3">
        {/* Language selector */}
        <Button
          variant="outline"
          size="sm"
          className="h-10 px-3 rounded-xl border-border/60 hover:bg-muted/50 hover:border-border transition-all duration-200 flex items-center gap-2"
        >
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">EN</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 px-3 rounded-xl hover:bg-muted/50 transition-all duration-200 flex items-center gap-3"
            >
              <Avatar className="h-8 w-8 ring-2 ring-border/50">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-sm font-semibold">
                  SA
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="font-medium text-sm">super_admin</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="flex items-center gap-3">
              <UserCircle className="h-4 w-4 text-muted-foreground" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-3 text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
