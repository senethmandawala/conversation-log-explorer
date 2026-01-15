import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { InstanceSelector } from "@/components/post-call/InstanceSelector";
import AutopilotInstanceSelector from "@/pages/autopilot/AutopilotInstanceSelector/AutopilotInstanceSelector";
import { Card, Typography } from "antd";
import { IconDatabase, IconRobot, IconMessage } from "@tabler/icons-react";

const { Title, Text } = Typography;

// Use the same Instance interface as PostCallAnalyzer
interface Instance {
  id: string;
  name: string;
}

interface ExtendedInstance extends Instance {
  desc?: string;
  img?: string;
  departmentId?: string;
  project_id?: string;
  channels?: string;
  companyId?: any;
  tenantId?: any;
  subtenantId?: any;
}

interface User {
  company_list: Array<{
    company_id: any;
    company_name: string;
  }>;
  department_list: Array<{
    company_id: any;
    department_id: string;
    department_name: string;
    description: string;
    ref_code: string;
    tenant_id: any;
    sub_tenant_id: any;
  }>;
  autopilotProjectList: Array<{
    project_id: string;
    project_name: string;
    description: string;
    channels: string;
  }>;
}

const Instances = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const moduleType = searchParams.get('module') || '';

  const gotoInstance = (item: ExtendedInstance) => {
    let userString = localStorage.getItem('user');
    let user: User | null = null;
    
    if (userString) {
      user = JSON.parse(userString);
      
      if (!user) return;

      let companyList = user.company_list;
      let departmentList = user.department_list;

      if (moduleType === 'pca' || moduleType === 'copilot') {
        departmentList = departmentList.map((dept) => {
          const company = companyList.find((comp) => comp.company_id === dept.company_id);
          return {
            ...dept,
            company_name: company?.company_name || ''
          };
        });

        let modules = departmentList.filter((e) => e.ref_code.toLowerCase().startsWith(moduleType));

        let filteredDepartments = modules.filter((department) => 
          department.tenant_id === item.tenantId &&
          department.sub_tenant_id === item.subtenantId &&
          department.company_id === item.companyId && 
          department.department_id === item.departmentId 
        );

        if (moduleType === 'pca') {
          navigate(`/pca?departmentId=${item.departmentId}`);
        } else if (moduleType === 'copilot') {
          navigate(`/copilot?departmentId=${item.departmentId}`);
        }
      } else if (moduleType === 'autopilot') {
        // Use query parameters like Angular example
        navigate(`/autopilot?project_id=${item.project_id}`);
      }
    }
  };

  const getModuleIcon = () => {
    switch (moduleType) {
      case 'pca':
        return <IconDatabase />;
      case 'autopilot':
        return <IconRobot />;
      case 'copilot':
        return <IconMessage />;
      default:
        return <IconDatabase />;
    }
  };

  const getModuleGradient = () => {
    switch (moduleType) {
      case 'pca':
        return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      case 'autopilot':
        return 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)';
      case 'copilot':
        return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      default:
        return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
    }
  };

  const getModuleTitle = () => {
    switch (moduleType) {
      case 'pca':
        return 'Post Call Analyzer';
      case 'autopilot':
        return 'Autopilot';
      case 'copilot':
        return 'Copilot';
      default:
        return 'Instances';
    }
  };

  const loadModules = () => {
    let userString = localStorage.getItem('user');
    let user: User | null = null;
    
    if (userString) {
      user = JSON.parse(userString);
      
      if (!user) return [];

      let companyList = user.company_list;
      let departmentList = user.department_list;

      departmentList = departmentList.map((dept) => {
        const company = companyList.find((comp) => comp.company_id === dept.company_id);
        return {
          ...dept,
          company_name: company?.company_name || ''
        };
      });

      if (moduleType === 'pca' || moduleType === 'copilot') {
        let modules = departmentList.filter((e) => e.ref_code.toLowerCase().startsWith(moduleType));
        return modules.map((e) => ({
          id: e.department_id,
          name: e.department_name
        }));
      } else if (moduleType === 'autopilot') {
        let modules = user.autopilotProjectList;
        return modules.map((e) => ({
          id: e.project_id,
          name: e.project_name
        }));
      }
    }
    return [];
  };

  const instances = loadModules();

  return (
    <div className="space-y-6">
      {/* Instance Selector */}
      <AnimatePresence mode="wait">
        <motion.div
          key="selector"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {moduleType === 'autopilot' ? (
              <AutopilotInstanceSelector onSelectInstance={(instance) => {
                const item: ExtendedInstance = {
                  id: instance.id,
                  name: instance.name,
                  desc: instance.description,
                  img: "",
                  project_id: instance.id,
                  channels: instance.channels
                };
                gotoInstance(item);
              }} />
            ) : (
              <InstanceSelector
                instances={instances}
                onSelectInstance={(instance) => {
                  // Find the full department data from localStorage
                  let userString = localStorage.getItem('user');
                  let user: User | null = null;
                  
                  if (userString) {
                    user = JSON.parse(userString);
                    
                    if (user) {
                      let departmentList = user.department_list;
                      let department = departmentList.find((dept) => dept.department_id === instance.id);
                      
                      if (department) {
                        const item: ExtendedInstance = {
                          id: instance.id,
                          name: instance.name,
                          desc: department.description,
                          img: "",
                          departmentId: instance.id,
                          channels: "",
                          companyId: department.company_id,
                          tenantId: department.tenant_id,
                          subtenantId: department.sub_tenant_id
                        };
                        gotoInstance(item);
                      }
                    }
                  }
                }}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Instances;
