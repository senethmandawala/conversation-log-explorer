import { motion } from "framer-motion";
import { 
  ChevronDown, 
  Image as ImageIcon,
  Globe,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 bg-card border-b border-border/50 px-6 flex items-center justify-between"
    >
      {/* Left side - Agent selector */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-xl border-border/60"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 px-4 rounded-xl border-border/60 hover:bg-muted"
            >
              <ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Billing Agent</span>
              <ChevronDown className="h-4 w-4 ml-2 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem>Billing Agent</DropdownMenuItem>
            <DropdownMenuItem>Support Agent</DropdownMenuItem>
            <DropdownMenuItem>Sales Agent</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right side - Language and User */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="h-10 w-10 rounded-full border-border/60 hover:bg-muted"
        >
          <span className="text-sm font-medium">EN</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 px-3 rounded-xl hover:bg-muted flex items-center gap-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  SA
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm hidden sm:inline">super_admin</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
