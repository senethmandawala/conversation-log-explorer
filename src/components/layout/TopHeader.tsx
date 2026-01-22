import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  IconChevronDown, 
  IconPhoto,
  IconWorld,
  IconUser,
  IconRobot,
  IconPhone,
  IconSettings,
  IconLogout,
  IconUserCircle,
  IconChevronLeft,
  IconChevronRight,
  IconBuilding,
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarLeftCollapse,
  IconMenu2,
  IconSun,
  IconMoon
} from '@tabler/icons-react';
import { Button, Dropdown, Avatar, Badge, Divider } from 'antd';
import type { MenuProps } from 'antd';
import { motion } from 'framer-motion';
import { useModule } from '@/contexts/ModuleContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { projectSelectionService } from '@/services/projectSelectionService';

// Types for project/instance data
interface Project {
  id: string;
  name: string;
  company_name?: string;
  department_name?: string;
  project_name?: string;
  ref_code?: string;
}

export function TopHeader() {
  const location = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed } = useModule();
  const isMobile = useIsMobile();
  const isPostCallAnalyzer = location.pathname.startsWith("/pca");
  const isGetStarted = location.pathname === "/" || location.pathname === "/get-started";
  const isInstances = location.pathname === "/instances";

  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'EN');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    // Initialize dark class on mount
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
    return isDark;
  });
  
  // Show instance selector on all pages except getstarted
  const shouldHideInstanceSelector = isGetStarted;
  
  // Project/Instance state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const moduleTitle = isPostCallAnalyzer ? "Post Call Analyzer" : "Autopilot";
  const ModuleIcon = isPostCallAnalyzer ? IconPhone : IconRobot;

  const languageItems: MenuProps['items'] = [
    { key: 'EN', label: 'English' },
    { key: 'HI', label: 'Hindi' },
  ];

  const onLanguageClick: MenuProps['onClick'] = ({ key }) => {
    const next = String(key);
    setLanguage(next);
    localStorage.setItem('language', next);
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: next } }));
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Force page reload to apply theme changes properly
    window.location.reload();
  };

  // Load projects based on current module
  useEffect(() => {
    loadProjects();
  }, [location.pathname, location.search]); // Trigger on pathname and search params change

  const loadProjects = () => {
    setIsLoading(true);
    try {
      // Get user data from localStorage (similar to Angular version)
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        
        // Determine current module from URL and search params
        const currentPath = location.pathname;
        const searchParams = new URLSearchParams(location.search);
        let selectedModule = '';
        
        // Check for query parameters first (from instances page navigation)
        if (searchParams.has('departmentId')) {
          // This is PCA or Copilot
          if (currentPath.startsWith('/pca')) {
            selectedModule = 'pca';
          } else if (currentPath.startsWith('/copilot')) {
            selectedModule = 'copilot';
          }
        } else if (searchParams.has('project_id')) {
          // This is Autopilot
          selectedModule = 'autopilot';
        } else {
          // Fallback to pathname detection
          if (currentPath.startsWith('/pca')) {
            selectedModule = 'pca';
          } else if (currentPath.startsWith('/autopilot')) {
            selectedModule = 'autopilot';
          } else if (currentPath.startsWith('/copilot')) {
            selectedModule = 'copilot';
          }
        }
        
        
        if (selectedModule === 'pca' || selectedModule === 'copilot') {
          // For PCA/Copilot: Load departments with company names (matching Angular logic)
          const companyList = user.company_list || [];
          const departmentList = user.department_list || [];
          
          const departmentsWithCompany = departmentList.map((dept: any) => {
            const company = companyList.find((comp: any) => comp.company_id === dept.company_id);
            return {
              ...dept,
              company_name: company?.company_name || 'Unknown Company',
              name: dept.department_name || 'Unknown Department',
              id: dept.department_id || dept.id
            };
          });
          
          // Filter by module (matching Angular logic)
          const filteredDepartments = departmentsWithCompany.filter((dept: any) => 
            dept.ref_code?.toLowerCase().startsWith(selectedModule)
          );
          
          setProjects(filteredDepartments);
          
          // Set selected project based on URL parameter
          const searchParams = new URLSearchParams(location.search);
          const departmentId = searchParams.get('departmentId');
          if (departmentId) {
            const selectedDept = filteredDepartments.find(dept => dept.id === departmentId);
            if (selectedDept) {
              setSelectedProject(selectedDept);
              projectSelectionService.changeSelectedProject(selectedDept);
            }
          }
        } else if (selectedModule === 'autopilot') {
          // For Autopilot: Load autopilot projects (matching Angular logic)
          const autopilotProjects = user.autopilotProjectList || [];
          const formattedProjects = autopilotProjects.map((project: any) => ({
            ...project,
            name: project.project_name || project.name,
            id: project.project_id || project.id
          }));
          
          setProjects(formattedProjects);
          
          // Set selected project based on URL parameter
          const searchParams = new URLSearchParams(location.search);
          const projectId = searchParams.get('project_id');
          if (projectId) {
            const selectedProj = formattedProjects.find(proj => proj.id === projectId);
            if (selectedProj) {
              setSelectedProject(selectedProj);
              projectSelectionService.changeSelectedProject(selectedProj);
            }
          }
        }
        
        if (!selectedProject && projects.length > 0) {
          setSelectedProject(projects[0]);
          projectSelectionService.changeSelectedProject(projects[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeProject = (project: Project) => {
    setSelectedProject(project);
    
    projectSelectionService.changeSelectedProject(project);
    
    // Store in localStorage (similar to Angular project selection service)
    localStorage.setItem('selectedProject', JSON.stringify(project));
    
    // Get user data for department/company mapping (matching Angular logic)
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      const departmentList = user.department_list || [];
      const companyList = user.company_list || [];

      // Map departments with company names (matching Angular logic)
      const departmentsWithCompany = departmentList.map((dept: any) => {
        const company = companyList.find((comp: any) => comp.company_id === dept.company_id);
        return {
          ...dept,
          company_name: company?.company_name || 'Unknown Company'
        };
      });

      // Handle module-specific logic (matching Angular)
      const currentPath = location.pathname;
      if (currentPath.includes('/pca/dashboard')) {
        // Connect to alert notification websocket for PCA dashboard
        // TODO: Implement WebSocket connection logic here
      }
    }
    
    // Navigate to the appropriate module with the selected project
    const currentPath = location.pathname;
    if (currentPath.startsWith('/pca')) {
      // For PCA, navigate with departmentId
      window.location.href = `/pca?departmentId=${project.id}`;
    } else if (currentPath.startsWith('/autopilot')) {
      // For Autopilot, navigate with project_id
      window.location.href = `/autopilot?project_id=${project.id}`;
    } else if (currentPath.startsWith('/copilot')) {
      // For Copilot, navigate with departmentId
      window.location.href = `/copilot?departmentId=${project.id}`;
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-12 bg-gradient-to-r from-card via-card to-card/95 backdrop-blur-sm border-b border-border/30 px-1 md:px-2 flex items-center justify-between shadow-xs"
    >
      {/* Left side - Module indicator, Sidebar toggle, and Agent selector */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* Sidebar toggle */}
        <Button
          type="default"
          shape="circle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-10 w-10 rounded-md border-0 hover:bg-muted/50 hover:border-border transition-all duration-200 !bg-transparent"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isMobile ? (
            <IconMenu2 className="h-5 w-5 text-muted-foreground" />
          ) : sidebarCollapsed ? (
            <IconLayoutSidebarRightCollapse className="h-5 w-5 text-muted-foreground" />
          ) : (
            <IconLayoutSidebarLeftCollapse className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>

        {/* Mobile logo - visible only on mobile */}
        {isMobile && (
          <a href="/" className="cursor-pointer">
            <img 
              src="/src/assets/images/sense-ai-icon-transparent.svg" 
              alt="Sense AI" 
              className="h-7 w-7 me-3"
            />
          </a>
        )}

        {/* Instance selector - Hidden on getstarted and instances pages */}
        {!shouldHideInstanceSelector && (
          <Dropdown
            dropdownRender={(menu) => (
              <div className="w-80 bg-card rounded-md shadow-lg border border-border/20">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => changeProject(project)}
                  >
                    <div className="project-image h-8 w-8 rounded bg-muted/50 flex items-center justify-center">
                      <IconBuilding className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {isPostCallAnalyzer 
                          ? `${project.company_name} - ${project.department_name}`
                          : project.name
                        }
                      </div>
                      {isPostCallAnalyzer && (
                        <div className="text-xs text-muted-foreground">
                          {project.department_name}
                        </div>
                      )}
                    </div>
                    {selectedProject?.id === project.id && (
                      <Badge count="Current" size="small" />
                    )}
                  </div>
                ))}
                {projects.length === 0 && !isLoading && (
                  <div className="p-4 text-center text-muted-foreground">
                    No projects available
                  </div>
                )}
                {isLoading && (
                  <div className="p-4 text-center text-muted-foreground">
                    Loading projects...
                  </div>
                )}
              </div>
            )}
          >
            <Button
              type="default"
              className="h-10 px-2 rounded-md border-border/60 hover:bg-muted/50 hover:border-border transition-all duration-200 !bg-card"
            >
              <div className="project-image h-6 w-6 rounded bg-muted/50 flex items-center justify-center mr-1">
                <IconBuilding className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-content hidden md:block">
                <div className="project-name font-medium text-sm truncate">
                  {selectedProject ? (isPostCallAnalyzer ? selectedProject.company_name : selectedProject.name) : 'Select Project'}
                </div>
                {isPostCallAnalyzer && selectedProject && (
                  <div className="button-label text-xs text-muted-foreground">
                    {selectedProject.department_name}
                  </div>
                )}
              </div>
              <IconChevronDown className="h-4 w-4 ml-2 text-muted-foreground" />
            </Button>
          </Dropdown>
        )}
      </div>

      {/* Right side - Language and User */}
      <div className="flex items-center gap-0">
        {/* Language selector */}
        <Dropdown
          menu={{
            items: languageItems,
            selectable: true,
            selectedKeys: [language],
            onClick: onLanguageClick,
          }}
          trigger={['click']}
        >
          <Button
            type="text"
            className="wn-icon-btn-sm h-10 px-1 md:px-3 rounded-md border-0 hover:bg-muted/50 hover:border-border transition-all duration-200 flex items-center gap-1 md:gap-2"
          >
            <IconWorld className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium hidden md:inline">{language}</span>
            <IconChevronDown className="h-3 w-3 text-muted-foreground" />
          </Button>
        </Dropdown>

        <Divider orientation="vertical" />

        {/* User menu */}
        <Dropdown
          dropdownRender={(menu) => (
            <div className="w-56 bg-card rounded-md shadow-lg border border-border/20">
              <div
                className="flex items-center gap-2 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <IconUserCircle className="h-5 w-5 text-muted-foreground" />
                <span>Profile</span>
              </div>
              <div
                className="flex items-center gap-2 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <IconSettings className="h-5 w-5 text-muted-foreground" />
                <span>Settings</span>
              </div>
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDarkMode();
                }}
              >
                <div className="flex items-center gap-2">
                  {isDarkMode ? (
                    <IconMoon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <IconSun className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <div className={`w-10 h-5 rounded-full transition-colors ${isDarkMode ? 'bg-primary' : 'bg-muted'} relative`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isDarkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </div>
              <div className="border-t border-border/20" />
              <div
                className="flex items-center gap-2 p-3 cursor-pointer hover:bg-muted/50 transition-colors text-destructive"
              >
                <IconLogout className="h-5 w-5" />
                <span>Logout</span>
              </div>
            </div>
          )}
        >
          <Button
            type="text"
            className="h-10 px-1 md:px-3 transition-all duration-200 flex items-center gap-1 md:gap-2 !border-0 hover:!border-0 active:!border-0 focus:!border-0 focus-visible:!border-0 outline-none hover:outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 hover:bg-primary/50"
          >
            <Avatar className="h-7 w-7 md:h-8 md:w-8 ring-2 ring-border/50 bg-muted">
              <div className="text-primary text-sm font-semibold flex items-center justify-center h-full w-full">
                SA
              </div>
            </Avatar>
            <div className="hidden sm:block text-left">
              <p className="font-medium text-sm">John Doe</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <IconChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
          </Button>
        </Dropdown>
      </div>
    </motion.header>
  );
}
