// React equivalent of Angular ProjectSelectionService
import React from 'react';

class ProjectSelectionService {
  private selectedProject: any = null;
  private selectedModule: any = null;
  private projectListeners: ((project: any) => void)[] = [];
  private moduleListeners: ((module: any) => void)[] = [];

  constructor() {
    // Initialize with stored values
    this.selectedProject = this.getSelectedProjectFromStorage();
    this.selectedModule = this.getSelectedModuleFromStorage();
  }

  // Observable-like pattern for selected project
  getCurrentSelectedProject(): any {
    return this.selectedProject;
  }

  // Subscribe to project changes
  onProjectChange(callback: (project: any) => void): () => void {
    this.projectListeners.push(callback);
    return () => {
      const index = this.projectListeners.indexOf(callback);
      if (index > -1) {
        this.projectListeners.splice(index, 1);
      }
    };
  }

  // Change selected project
  changeSelectedProject(project: any) {
    this.selectedProject = project;
    this.saveSelectedProjectToStorage(project);
    // Notify all listeners
    this.projectListeners.forEach(listener => listener(project));
  }

  // Observable-like pattern for selected module
  getCurrentSelectedModule(): any {
    return this.selectedModule;
  }

  // Subscribe to module changes
  onModuleChange(callback: (module: any) => void): () => void {
    this.moduleListeners.push(callback);
    return () => {
      const index = this.moduleListeners.indexOf(callback);
      if (index > -1) {
        this.moduleListeners.splice(index, 1);
      }
    };
  }

  // Change selected module
  changeSelectedModule(module: any) {
    this.selectedModule = module;
    this.saveSelectedModuleToStorage(module);
    // Notify all listeners
    this.moduleListeners.forEach(listener => listener(module));
  }

  // Storage methods
  private saveSelectedProjectToStorage(project: any) {
    localStorage.setItem('selectedProject', JSON.stringify(project));
  }

  private getSelectedProjectFromStorage(): any {
    const storedProject = localStorage.getItem('selectedProject');
    return storedProject ? JSON.parse(storedProject) : null;
  }

  private saveSelectedModuleToStorage(module: any) {
    localStorage.setItem('selectedModule', JSON.stringify(module));
  }

  private getSelectedModuleFromStorage(): any {
    const storedModule = localStorage.getItem('selectedModule');
    return storedModule ? JSON.parse(storedModule) : null;
  }
}

// Create singleton instance
export const projectSelectionService = new ProjectSelectionService();

// Hook for React components
export const useProjectSelection = () => {
  const [selectedProject, setSelectedProject] = React.useState<any>(
    projectSelectionService.getCurrentSelectedProject()
  );
  const [selectedModule, setSelectedModule] = React.useState<any>(
    projectSelectionService.getCurrentSelectedModule()
  );

  React.useEffect(() => {
    // Subscribe to project changes
    const unsubscribeProject = projectSelectionService.onProjectChange((project) => {
      setSelectedProject(project);
    });

    // Subscribe to module changes
    const unsubscribeModule = projectSelectionService.onModuleChange((module) => {
      setSelectedModule(module);
    });

    return () => {
      unsubscribeProject();
      unsubscribeModule();
    };
  }, []);

  return {
    selectedProject,
    selectedModule,
    changeSelectedProject: projectSelectionService.changeSelectedProject.bind(projectSelectionService),
    changeSelectedModule: projectSelectionService.changeSelectedModule.bind(projectSelectionService)
  };
};
