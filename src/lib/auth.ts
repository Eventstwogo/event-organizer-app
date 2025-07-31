import useStore from '@/lib/Zustand';
import axiosInstance from '@/lib/axiosinstance';

export const logoutUser = async (): Promise<void> => {
  try {
    // Attempt to logout from server
    await axiosInstance.post('/api/v1/auth/logout');
    
    // Clear Zustand store
    const { logout } = useStore.getState();
    logout();
    
    // Clear localStorage
    localStorage.removeItem('id');
    
    // Redirect to home page
    window.location.href = '/';
  } catch (error) {
    // If server logout fails, still clear local state
    const { logout } = useStore.getState();
    logout();
    localStorage.removeItem('id');
    
    // Re-throw error so calling component can handle it
    throw error;
  }
};