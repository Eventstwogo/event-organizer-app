"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import { useEffect,useState } from "react";
interface ClientProvidersProps {
  children: React.ReactNode;
}

const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white text-center px-4">
        <p className="text-lg font-semibold">
          This admin panel is available only on tablet or desktop.
        </p>
      </div>
    );
  }
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
};

export default ClientProviders;