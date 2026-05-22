import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Calculator from "./pages/Calculator";
import SettingsPage from "./pages/Settings";
import HistoryPage from "./pages/History";
import NotFound from "./pages/NotFound";
import { CalculatorProvider } from "./context/CalculatorContext";
import PasswordGate from "./components/PasswordGate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CalculatorProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Calculator />} />
            <Route path="/settings" element={<PasswordGate><SettingsPage /></PasswordGate>} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </CalculatorProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
