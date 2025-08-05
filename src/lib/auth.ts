// import useStore from '@/lib/Zustand';
// import axiosInstance from '@/lib/axiosinstance';

// export const logoutUser = async (): Promise<void> => {
//   try {
//     // Attempt to logout from server
//         const { logout } = useStore()
//         logout();

//     await axiosInstance.post('/admin/logout');

//     localStorage.removeItem('id');

//     // Redirect to home page
//     window.location.href = '/';
//   } catch (error) {
//     // If server logout fails, still clear local state
//     const { logout } = useStore.getState();
//     logout();
//     localStorage.removeItem('id');

//     // Re-throw error so calling component can handle it
//     throw error;
//   }
// };

import useStore from '@/lib/Zustand';
import axiosInstance from '@/lib/axiosinstance';

export const logoutUser = async (): Promise<void> => {
  const { logout } = useStore.getState(); // ✅ safe outside React

  try {
    await axiosInstance.post('/admin/logout');

    // Clear local state
    logout();
    localStorage.removeItem('id');

    // Redirect to home page
    window.location.href = '/';
  } catch (error) {
    // Even if API fails, logout locally
    logout();
    localStorage.removeItem('id');

    throw error;
  }
};
