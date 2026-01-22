import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import type { ThemeConfig } from "antd";
import tokensJson from "./theme/tokens.json";
import { MainLayout } from "./components/layout/MainLayout";
import { ModuleProvider } from "./contexts/ModuleContext";
import { AutopilotProvider } from "./contexts/AutopilotContext";
import { PostCallProvider } from "./contexts/PostCallContext";
import { DateProvider } from "./contexts/DateContext";
import Index from "./pages/Index";
import GetStarted from "./pages/GetStarted";
import Instances from "./pages/Instances";
import PostCallAnalyzer from "./pages/PostCallAnalyzer";
import Autopilot from "./pages/autopilot/Autopilot";
import Copilot from "./pages/Copilot";
import UserManagementRedirect from "./pages/UserManagementRedirect";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const designTokens = tokensJson as {
  colors: {
    primary: string;
    bgContainer: string;
    bgLayout: string;
    border: string;
    borderSecondary: string;
    textBody: string;
    textMuted: string;
    textLink: string;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    fontSizeXS: number;
  };
  controlHeight: {
    sm: number;
    md: number;
    lg: number;
  };
  shadow: {
    default: string;
    secondary: string;
  };
};

const antTheme: ThemeConfig = {
  token: {
    colorPrimary: designTokens.colors.primary,
    colorBgContainer: designTokens.colors.bgContainer,
    colorBgLayout: designTokens.colors.bgLayout,
    colorBorder: designTokens.colors.border,
    colorBorderSecondary: designTokens.colors.borderSecondary,

    borderRadius: designTokens.radius.md,
    borderRadiusLG: designTokens.radius.lg,
    borderRadiusSM: designTokens.radius.sm,

    fontFamily: designTokens.typography.fontFamily,
    fontSize: designTokens.typography.fontSize,

    colorText: designTokens.colors.textBody,
    colorTextSecondary: designTokens.colors.textMuted,
    colorTextTertiary: designTokens.colors.textMuted,

    controlHeight: designTokens.controlHeight.md,
    controlHeightLG: designTokens.controlHeight.lg,
    controlHeightSM: designTokens.controlHeight.sm,

    boxShadow: designTokens.shadow.default,
    boxShadowSecondary: designTokens.shadow.secondary,
  },
  components: {
    Card: {
      headerBg: "transparent",
      paddingLG: 20,
      borderRadiusLG: designTokens.radius.lg,
    },
    Button: {
      borderRadius: designTokens.radius.md,
      controlHeight: designTokens.controlHeight.md,
      paddingContentHorizontal: 16,
    },
    Input: {
      borderRadius: designTokens.radius.md,
      controlHeight: designTokens.controlHeight.md,
      colorBgContainer: designTokens.colors.bgLayout,
    },
    Select: {
      borderRadius: designTokens.radius.md,
      controlHeight: designTokens.controlHeight.md,
    },
    Table: {
      headerBg: designTokens.colors.bgLayout,
      headerColor: "#475569",
      rowHoverBg: designTokens.colors.bgLayout,
      borderColor: designTokens.colors.border,
      borderRadius: designTokens.radius.lg,
    },
    Menu: {
      itemBorderRadius: designTokens.radius.md,
      itemMarginInline: 8,
    },
    Tabs: {
      itemSelectedColor: designTokens.colors.primary,
      inkBarColor: designTokens.colors.primary,
    },
    Modal: {
      borderRadiusLG: designTokens.radius.lg,
    },
    Drawer: {
      borderRadiusLG: designTokens.radius.lg,
    },
  },
};

// Helper to convert hex to HSL for CSS variables
const hexToHSL = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0 0% 0%";
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

// Set only primary color and radius from tokens (these don't change with dark mode)
if (typeof document !== 'undefined') {
  const root = document.documentElement;
  root.style.setProperty('--primary', hexToHSL(designTokens.colors.primary));
  root.style.setProperty('--radius', `${designTokens.radius.lg / 16}rem`);
}

const App = () => (
  <ConfigProvider theme={antTheme}>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ModuleProvider>
        <AutopilotProvider>
        <PostCallProvider>
        <DateProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<GetStarted />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/instances" element={<Instances />} />
            <Route path="/pca" element={<PostCallAnalyzer />} />
            <Route path="/autopilot" element={<Autopilot />} />
            <Route path="/copilot" element={<Copilot />} />
            <Route path="/user-management" element={<UserManagementRedirect />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
        </DateProvider>
        </PostCallProvider>
        </AutopilotProvider>
        </ModuleProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ConfigProvider>
);

export default App;
