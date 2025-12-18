import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhoneCall, Bot, MessageSquare, ArrowRight, Book, Sparkles } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
  enabled: boolean;
  onClick: () => void;
  delay: number;
}

const ModuleCard = ({ title, description, icon: Icon, gradient, iconBg, enabled, onClick, delay }: ModuleCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={enabled ? { y: -4, scale: 1.02 } : {}}
    className="h-full"
  >
    <Card
      onClick={enabled ? onClick : undefined}
      className={`relative h-full p-6 border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden group transition-all duration-300 ${
        enabled 
          ? "cursor-pointer hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30" 
          : "opacity-50 cursor-not-allowed"
      }`}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`} />
      
      {/* Icon */}
      <div className={`relative w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
      
      {/* Content */}
      <div className="relative">
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
      </div>
      
      {/* Arrow */}
      <div className="relative flex justify-end mt-auto">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          enabled 
            ? "bg-primary/10 group-hover:bg-primary group-hover:text-white" 
            : "bg-muted"
        }`}>
          <ArrowRight className={`h-5 w-5 transition-transform duration-300 ${enabled ? "group-hover:translate-x-1" : ""}`} />
        </div>
      </div>
      
      {!enabled && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
          <span className="text-sm font-medium text-muted-foreground bg-background/80 px-3 py-1 rounded-full">
            Coming Soon
          </span>
        </div>
      )}
    </Card>
  </motion.div>
);

interface InfoCardProps {
  title: string;
  description: string;
  buttonText: string;
  disabled?: boolean;
  delay: number;
}

const InfoCard = ({ title, description, buttonText, disabled = true, delay }: InfoCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="p-5 border-border/50 bg-card/80 backdrop-blur-sm h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 h-full">
        <div>
          <h4 className="font-semibold text-foreground mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          variant="outline"
          disabled={disabled}
          className="shrink-0 rounded-xl border-border/60 hover:bg-primary/5 hover:border-primary/50"
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  </motion.div>
);

export default function GetStarted() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Post Call Analyzer",
      description: "Analyze call recordings with AI-powered insights to improve customer service quality and agent performance.",
      icon: PhoneCall,
      gradient: "bg-gradient-to-br from-blue-500/10 via-transparent to-transparent",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      enabled: true,
      route: "/post-call-analyzer",
    },
    {
      title: "Autopilot",
      description: "Automate customer interactions with intelligent AI agents that handle queries 24/7 with human-like responses.",
      icon: Bot,
      gradient: "bg-gradient-to-br from-purple-500/10 via-transparent to-transparent",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
      enabled: true,
      route: "/autopilot",
    },
    {
      title: "Copilot",
      description: "Real-time AI assistance for agents during live calls, providing suggestions and information on demand.",
      icon: MessageSquare,
      gradient: "bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent",
      iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      enabled: false,
      route: "/copilot",
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-blue-600 p-8 md:p-10 mb-8"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative flex items-center gap-4">
          <div className="hidden md:flex h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm items-center justify-center">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Welcome to Sense AI
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl">
              Transform your customer experience with AI-powered analytics, automation, and real-time assistance. 
              Choose a module below to get started.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {modules.map((module, index) => (
          <ModuleCard
            key={module.title}
            {...module}
            onClick={() => navigate(module.route)}
            delay={0.1 + index * 0.1}
          />
        ))}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InfoCard
          title="Documentation"
          description="Learn how to use Sense AI with our comprehensive guides and tutorials."
          buttonText="View Docs"
          delay={0.4}
        />
        <InfoCard
          title="Upgrade Plan"
          description="Unlock more features and increase your usage limits with premium plans."
          buttonText="View Plans"
          delay={0.5}
        />
      </div>
    </div>
  );
}
