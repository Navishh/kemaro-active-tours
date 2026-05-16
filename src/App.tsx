import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Sports from "./pages/categories/Sports.tsx";
import Leisure from "./pages/categories/Leisure.tsx";
import Volunteering from "./pages/categories/Volunteering.tsx";
import Customize from "./pages/Customize.tsx";
import Cursor from "./components/luxury/fx/Cursor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Cursor />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/categories/sports" element={<Sports />} />
          <Route path="/categories/leisure" element={<Leisure />} />
          <Route path="/categories/volunteering" element={<Volunteering />} />
          <Route path="/customize" element={<Customize />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
