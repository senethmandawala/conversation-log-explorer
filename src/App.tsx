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
    text: string;
    textSecondary: string;
    textTertiary: string;
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

    colorText: designTokens.colors.text,
    colorTextSecondary: designTokens.colors.textSecondary,
    colorTextTertiary: designTokens.colors.textTertiary,

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
