/**
 * Orbital Learn LMS
 * @author prashB2D (https://github.com/prashB2D)
 * @copyright 2025 Orbital Learn. All rights reserved.
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LMSProvider } from "./context/LMSContext";
import LMSModal from "./components/lms/LMSModal";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import OrbitalERP from "./pages/solutions/OrbitalERP.tsx";
import AiMlSolutions from "./pages/solutions/AiMlSolutions.tsx";
import EnterpriseApps from "./pages/solutions/EnterpriseApps.tsx";
import OrbitalLearnPage from "./pages/solutions/OrbitalLearnPage.tsx";
import TalentRepository from "./pages/solutions/TalentRepository.tsx";
import QuizLicense from "./pages/QuizLicense.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LMSProvider>
        <LMSModal />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Solution detail pages */}
            <Route path="/solutions/orbital-academic-erp" element={<OrbitalERP />} />
            <Route path="/solutions/ai-ml-solutions" element={<AiMlSolutions />} />
            <Route path="/solutions/enterprise-applications" element={<EnterpriseApps />} />
            <Route path="/solutions/orbital-learn" element={<OrbitalLearnPage />} />
            <Route path="/solutions/talent-repository" element={<TalentRepository />} />
            <Route path="/quiz-license" element={<QuizLicense />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LMSProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
