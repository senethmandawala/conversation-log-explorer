export interface MockUser {
  company_list: Array<{
    company_id: string;
    company_name: string;
  }>;
  department_list: Array<{
    company_id: string;
    department_id: string;
    department_name: string;
    description: string;
    ref_code: string;
    tenant_id: string;
    sub_tenant_id: string;
  }>;
  autopilotProjectList: Array<{
    project_id: string;
    project_name: string;
    description: string;
    channels: string;
  }>;
}

export const mockUser: MockUser = {
  company_list: [
    { company_id: "5", company_name: "Tigo" },
    { company_id: "comp2", company_name: "Service Inc" },
    { company_id: "comp3", company_name: "Global Solutions" }
  ],
  department_list: [
    {
      company_id: "5",
      department_id: "14",
      department_name: "TigoBolivia",
      description: "Demo purpose",
      ref_code: "PCADemo1",
      tenant_id: "2",
      sub_tenant_id: "4"
    },
    {
      company_id: "comp2",
      department_id: "dept3",
      department_name: "Technical Support",
      description: "Provides technical assistance and troubleshooting",
      ref_code: "pca_tech",
      tenant_id: "tenant2",
      sub_tenant_id: "sub1"
    },
    {
      company_id: "comp2",
      department_id: "dept4",
      department_name: "Customer Service",
      description: "General customer service operations",
      ref_code: "copilot_service",
      tenant_id: "tenant2",
      sub_tenant_id: "sub2"
    },
    {
      company_id: "comp3",
      department_id: "dept5",
      department_name: "Help Desk",
      description: "IT help desk and internal support",
      ref_code: "copilot_help",
      tenant_id: "tenant3",
      sub_tenant_id: "sub1"
    }
  ],
  autopilotProjectList: [
    {
      project_id: "proj1",
      project_name: "Customer Support Bot",
      description: "Handles general customer inquiries and FAQs",
      channels: "Voice, Chat"
    },
    {
      project_id: "proj2",
      project_name: "Sales Assistant",
      description: "Guides customers through product selection",
      channels: "Chat, WhatsApp"
    },
    {
      project_id: "proj3",
      project_name: "Technical Support",
      description: "Provides technical troubleshooting assistance",
      channels: "Voice"
    },
    {
      project_id: "proj4",
      project_name: "Billing Inquiries",
      description: "Handles billing questions and payment issues",
      channels: "Voice, Chat"
    },
    {
      project_id: "proj5",
      project_name: "Onboarding Assistant",
      description: "Helps new users get started with the platform",
      channels: "Chat"
    }
  ]
};

// Function to initialize mock user data in localStorage
export const initializeMockUser = () => {
  if (typeof window !== 'undefined' && !localStorage.getItem('user')) {
    localStorage.setItem('user', JSON.stringify(mockUser));
  }
};
