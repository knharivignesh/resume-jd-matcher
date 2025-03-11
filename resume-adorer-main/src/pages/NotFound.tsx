
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/30">
      <div className="text-center p-8 glass-morphism rounded-2xl max-w-md w-full animate-fade-in">
        <h1 className="text-8xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">404</h1>
        <p className="text-xl text-foreground mb-8">This page doesn't exist.</p>
        <Button 
          onClick={() => navigate('/')}
          className="px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Return Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
