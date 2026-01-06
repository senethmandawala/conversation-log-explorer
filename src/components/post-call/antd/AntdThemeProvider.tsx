import { ConfigProvider, theme } from "antd";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";

interface AntdThemeProviderProps {
  children: ReactNode;
}

// Custom Ant Design theme that matches the app's design tokens
export function AntdThemeProvider({ children }: AntdThemeProviderProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          // Primary colors
          colorPrimary: "hsl(226, 70%, 55%)",
          colorSuccess: "hsl(142, 71%, 45%)",
          colorWarning: "hsl(38, 92%, 50%)",
          colorError: "hsl(0, 84%, 60%)",
          colorInfo: "hsl(199, 89%, 48%)",
          
          // Border radius
          borderRadius: 12,
          borderRadiusLG: 16,
          borderRadiusSM: 8,
          
          // Font
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 14,
          
          // Background colors
          colorBgContainer: isDark ? "hsl(222, 47%, 8%)" : "hsl(0, 0%, 100%)",
          colorBgElevated: isDark ? "hsl(222, 47%, 10%)" : "hsl(0, 0%, 100%)",
          colorBgLayout: isDark ? "hsl(222, 47%, 6%)" : "hsl(210, 20%, 98%)",
          
          // Text colors
          colorText: isDark ? "hsl(210, 40%, 98%)" : "hsl(222, 47%, 11%)",
          colorTextSecondary: isDark ? "hsl(215, 20%, 65%)" : "hsl(215, 16%, 47%)",
          colorTextTertiary: isDark ? "hsl(215, 20%, 50%)" : "hsl(215, 16%, 60%)",
          
          // Border colors
          colorBorder: isDark ? "hsl(217, 33%, 17%)" : "hsl(214, 32%, 91%)",
          colorBorderSecondary: isDark ? "hsl(217, 33%, 20%)" : "hsl(214, 32%, 94%)",
          
          // Shadows
          boxShadow: "0 4px 6px -1px hsl(222 47% 11% / 0.1), 0 2px 4px -2px hsl(222 47% 11% / 0.1)",
          boxShadowSecondary: "0 10px 15px -3px hsl(222 47% 11% / 0.1), 0 4px 6px -4px hsl(222 47% 11% / 0.1)",
        },
        components: {
          Card: {
            headerBg: "transparent",
            colorBorderSecondary: isDark ? "hsl(217, 33%, 17%)" : "hsl(214, 32%, 91%)",
          },
          Table: {
            headerBg: isDark ? "hsl(217, 33%, 12%)" : "hsl(215, 20%, 97%)",
            rowHoverBg: isDark ? "hsl(226, 70%, 55%, 0.08)" : "hsl(226, 70%, 55%, 0.04)",
          },
          Tabs: {
            inkBarColor: "hsl(226, 70%, 55%)",
            itemSelectedColor: "hsl(226, 70%, 55%)",
            itemHoverColor: "hsl(226, 70%, 60%)",
          },
          Button: {
            primaryShadow: "0 2px 0 hsl(226, 70%, 45%)",
          },
          Statistic: {
            titleFontSize: 12,
            contentFontSize: 28,
          },
          Tag: {
            defaultBg: isDark ? "hsl(217, 33%, 17%)" : "hsl(215, 20%, 95%)",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
