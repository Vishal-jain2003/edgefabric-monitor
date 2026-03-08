import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OperationsProvider } from "./context/OperationsContext";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import CacheExplorer from "./pages/CacheExplorer";
import ClusterNodes from "./pages/ClusterNodes";
import Metrics from "./pages/Metrics";
import Replication from "./pages/Replication";
import Persistence from "./pages/Persistence";
import Gossip from "./pages/Gossip";
import Rebalancer from "./pages/Rebalancer";
import TrafficControl from "./pages/TrafficControl";
import Security from "./pages/Security";
import ChaosTest from "./pages/ChaosTest";
import McpAgent from "./pages/McpAgent";
import Cicd from "./pages/Cicd";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <OperationsProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/cache" element={<CacheExplorer />} />
              <Route path="/nodes" element={<ClusterNodes />} />
              <Route path="/metrics" element={<Metrics />} />
              <Route path="/replication" element={<Replication />} />
              <Route path="/persistence" element={<Persistence />} />
              <Route path="/gossip" element={<Gossip />} />
              <Route path="/rebalancer" element={<Rebalancer />} />
              <Route path="/traffic" element={<TrafficControl />} />
              <Route path="/security" element={<Security />} />
              <Route path="/chaos" element={<ChaosTest />} />
              <Route path="/agent" element={<McpAgent />} />
              <Route path="/cicd" element={<Cicd />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </OperationsProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
