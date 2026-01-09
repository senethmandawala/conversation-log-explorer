import { useEffect } from 'react';

const UserManagementRedirect = () => {
  useEffect(() => {
    // Get CAM URL from window.env_vars configuration
    if (window.env_vars && window.env_vars.camUrl) {
      window.location.href = window.env_vars.camUrl;
    } else {
      // Fallback if configuration is not available
      console.error('CAM URL not found in window.env_vars configuration');
      // You could redirect to a fallback page or show an error
      window.location.href = '/';
    }
  }, []);

  // Show a loading message while redirecting
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid #f3f3f3', 
        borderTop: '4px solid #1890ff', 
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ color: '#666', fontSize: '16px' }}>Redirecting to User Management...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserManagementRedirect;
