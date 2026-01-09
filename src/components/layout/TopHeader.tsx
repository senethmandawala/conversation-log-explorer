import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  ChevronRight,
  Building2
} from 'lucide-react';
import { Button, Dropdown, Avatar, Badge, Space } from 'antd';
import { motion } from 'framer-motion';
import { useModule } from '@/contexts/ModuleContext';
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
  const isPostCallAnalyzer = location.pathname.startsWith("/pca");
  const isGetStarted = location.pathname === "/" || location.pathname === "/get-started";
  const isInstances = location.pathname === "/instances";
  
  // Hide instance selector on getstarted and instances pages
  const shouldHideInstanceSelector = isGetStarted || isInstances;
  
  // Project/Instance state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const moduleTitle = isPostCallAnalyzer ? "Post Call Analyzer" : "Autopilot";
  const ModuleIcon = isPostCallAnalyzer ? PhoneCall : Bot;

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
      className="h-16 bg-gradient-to-r from-card via-card to-card/95 backdrop-blur-sm border-b border-border/30 px-6 flex items-center justify-between shadow-sm"
    >
      {/* Left side - Module indicator, Sidebar toggle, and Agent selector */}
      <div className="flex items-center gap-6">
        {/* Sidebar toggle */}
        <Button
          variant="outlined"
          shape="circle"
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

        {/* Instance selector - Hidden on getstarted and instances pages */}
        {!shouldHideInstanceSelector && (
          <Dropdown
            dropdownRender={(menu) => (
              <div className="w-80 bg-white rounded-lg shadow-lg border border-border/20">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => changeProject(project)}
                  >
                    <div className="project-image h-8 w-8 rounded bg-muted/50 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
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
              variant="outlined"
              className="h-10 px-4 rounded-xl border-border/60 hover:bg-muted/50 hover:border-border transition-all duration-200"
            >
              <div className="project-image h-6 w-6 rounded bg-muted/50 flex items-center justify-center mr-2">
                <Building2 className="h-3 w-3 text-muted-foreground" />
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
              <ChevronDown className="h-4 w-4 ml-2 text-muted-foreground" />
            </Button>
          </Dropdown>
        )}
      </div>

      {/* Right side - Language and User */}
      <div className="flex items-center gap-3">
        {/* Language selector */}
        <Button
          variant="outlined"
          className="h-10 px-3 rounded-xl border-border/60 hover:bg-muted/50 hover:border-border transition-all duration-200 flex items-center gap-2"
        >
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">EN</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>

        {/* User menu */}
        <Dropdown
          dropdownRender={(menu) => (
            <div className="w-56 bg-white rounded-lg shadow-lg border border-border/20">
              <div
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                <span>Profile</span>
              </div>
              <div
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>Settings</span>
              </div>
              <div className="border-t border-border/20" />
              <div
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </div>
            </div>
          )}
        >
          <Button
            variant="text"
            className="h-10 px-3 rounded-xl hover:bg-muted/50 transition-all duration-200 flex items-center gap-3"
          >
            <Avatar className="h-8 w-8 ring-2 ring-border/50">
              <div className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-sm font-semibold flex items-center justify-center h-full w-full">
                SA
              </div>
            </Avatar>
            <div className="hidden sm:block text-left">
              <p className="font-medium text-sm">super_admin</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </Dropdown>
      </div>
    </motion.header>
  );
}
