import React, { useEffect, useState } from "react";
import { Icon } from "./Icon";

const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || "http://127.0.0.1:8080";

type ServiceStatus = "ONLINE" | "OFFLINE" | "LOADING";

interface HealthData {
  status: string;
  timestamp: string;
  services?: {
    gateway?: { status: string };
    postgres?: { status: string; details?: { databaseUrl: string } };
    redis?: { status: string; connectionState: string };
    messageQueue?: { status: string; backlog?: Record<string, number> };
  };
}

export function GuidesDashboard({ onClose }: { onClose?: () => void }) {
  const [activeTab, setActiveTab] = useState<"walkthrough" | "task" | "plan">("walkthrough");
  const [health, setHealth] = useState<HealthData | null>(null);
  const [healthStatus, setHealthStatus] = useState<ServiceStatus>("LOADING");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  async function checkHealth() {
    try {
      setHealthStatus("LOADING");
      const res = await fetch(`${BACKEND_URL}/api/health`);
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
        setHealthStatus(data.status === "HEALTHY" ? "ONLINE" : "OFFLINE");
      } else {
        setHealthStatus("OFFLINE");
        setHealth(null);
      }
    } catch (e) {
      setHealthStatus("OFFLINE");
      setHealth(null);
    }
    setLastUpdated(new Date().toLocaleTimeString());
  }

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E0E10]/80 p-4 backdrop-blur-md transition-opacity duration-300">
      <div className="flex h-[90vh] w-full max-w-5xl flex-col rounded-3xl border border-aranyam-border bg-aranyam-bg text-aranyam-espresso shadow-2xl overflow-hidden relative">
        
        {/* Header Banner */}
        <div className="border-b border-aranyam-border bg-white px-6 py-4 flex items-center justify-between">
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-aranyam-gold">ATTNAM Labs · System Sanctuary</p>
            <h2 className="text-xl font-bold text-aranyam-espresso">Dev & Ops Operations Center</h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={checkHealth}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-aranyam-border bg-aranyam-surface hover:bg-aranyam-surfaceAlt text-aranyam-charcoal active:scale-95 transition"
              title="Refresh Health Status"
            >
              <Icon name="refresh" className="h-4 w-4" />
            </button>
            <button 
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-aranyam-crimsonLight text-aranyam-crimson hover:bg-aranyam-crimson hover:text-white active:scale-95 transition"
            >
              <Icon name="x" className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Grid View */}
        <div className="grid flex-1 grid-cols-1 lg:grid-cols-[280px_1fr] overflow-hidden">
          
          {/* Left Panel: Health Status & Tabs */}
          <div className="border-r border-aranyam-border bg-aranyam-surfaceAlt/30 p-5 flex flex-col gap-5 overflow-y-auto">
            
            {/* Health Monitor Card */}
            <div className="rounded-2xl border border-aranyam-border bg-white p-4 text-left shadow-sm">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-aranyam-gold">Live Health Monitor</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                  healthStatus === "ONLINE" 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : healthStatus === "LOADING" 
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${healthStatus === "ONLINE" ? "bg-green-500 animate-pulse" : healthStatus === "LOADING" ? "bg-yellow-500 animate-bounce" : "bg-red-500"}`} />
                  {healthStatus}
                </span>
              </div>

              {/* Status List */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-aranyam-charcoal">Express Gateway</span>
                  <span className={`font-bold ${health ? "text-green-600" : "text-red-500"}`}>
                    {health ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-aranyam-charcoal">PostgreSQL Replica</span>
                  <span className={`font-bold ${health?.services?.postgres?.status === "ONLINE" ? "text-green-600" : "text-red-500"}`}>
                    {health?.services?.postgres?.status || "OFFLINE"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-aranyam-charcoal">Upstash Redis</span>
                  <span className={`font-bold ${health?.services?.redis?.status === "ONLINE" ? "text-green-600" : "text-red-500"}`}>
                    {health?.services?.redis?.status || "OFFLINE"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-aranyam-charcoal">Sync Queue Worker</span>
                  <span className={`font-bold ${health?.services?.messageQueue?.status === "ACTIVE" ? "text-green-600" : "text-red-500"}`}>
                    {health?.services?.messageQueue?.status === "ACTIVE" ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>
              </div>

              {/* Queue backlog indicator */}
              {health?.services?.messageQueue?.backlog && (
                <div className="mt-4 border-t border-aranyam-border pt-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-aranyam-gold mb-1.5">BullMQ Active Backlog</p>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="rounded bg-aranyam-bg px-2 py-1 flex justify-between">
                      <span className="font-medium text-aranyam-charcoal">Waiting</span>
                      <span className="font-bold text-aranyam-espresso">{health.services.messageQueue.backlog.waiting || 0}</span>
                    </div>
                    <div className="rounded bg-aranyam-bg px-2 py-1 flex justify-between">
                      <span className="font-medium text-aranyam-charcoal">Active</span>
                      <span className="font-bold text-aranyam-espresso">{health.services.messageQueue.backlog.active || 0}</span>
                    </div>
                  </div>
                </div>
              )}

              <p className="mt-3 text-right text-[8px] font-bold text-aranyam-charcoal/40">Updated: {lastUpdated || "Never"}</p>
            </div>

            {/* Document Navigation Tabs */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-aranyam-gold text-left px-1">Guides & System Plans</span>
              
              <button
                onClick={() => setActiveTab("walkthrough")}
                className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-bold transition-all text-left ${
                  activeTab === "walkthrough"
                    ? "bg-aranyam-crimson text-white shadow-md shadow-aranyam-crimson/15"
                    : "bg-white border border-aranyam-border text-aranyam-charcoal hover:bg-aranyam-surface hover:text-aranyam-espresso"
                }`}
              >
                <Icon name="book" className="h-4.5 w-4.5" />
                <div className="leading-none">
                  <p className="text-[12px]">Testing & Local Run</p>
                  <p className="text-[8px] uppercase tracking-wider opacity-75 mt-1 font-semibold">walkthrough.md</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("task")}
                className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-bold transition-all text-left ${
                  activeTab === "task"
                    ? "bg-aranyam-crimson text-white shadow-md shadow-aranyam-crimson/15"
                    : "bg-white border border-aranyam-border text-aranyam-charcoal hover:bg-aranyam-surface hover:text-aranyam-espresso"
                }`}
              >
                <Icon name="activity" className="h-4.5 w-4.5" />
                <div className="leading-none">
                  <p className="text-[12px]">Checklist Progress</p>
                  <p className="text-[8px] uppercase tracking-wider opacity-75 mt-1 font-semibold">task.md</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("plan")}
                className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-bold transition-all text-left ${
                  activeTab === "plan"
                    ? "bg-aranyam-crimson text-white shadow-md shadow-aranyam-crimson/15"
                    : "bg-white border border-aranyam-border text-aranyam-charcoal hover:bg-aranyam-surface hover:text-aranyam-espresso"
                }`}
              >
                <Icon name="shield" className="h-4.5 w-4.5" />
                <div className="leading-none">
                  <p className="text-[12px]">Architecture Design</p>
                  <p className="text-[8px] uppercase tracking-wider opacity-75 mt-1 font-semibold">implementation_plan.md</p>
                </div>
              </button>
            </div>
          </div>

          {/* Right Panel: Content Reader */}
          <div className="bg-white p-6 md:p-8 overflow-y-auto text-left leading-relaxed text-aranyam-charcoal prose max-w-none">
            {activeTab === "walkthrough" && <WalkthroughContent />}
            {activeTab === "task" && <TaskContent />}
            {activeTab === "plan" && <PlanContent />}
          </div>

        </div>
      </div>
    </div>
  );
}

/* Tab Contents rendered beautiful */

function WalkthroughContent() {
  return (
    <div className="space-y-6">
      <div className="border-b border-aranyam-border pb-4">
        <span className="rounded bg-aranyam-goldLight border border-aranyam-gold/20 px-2 py-0.5 text-[10px] font-bold text-aranyam-gold">walkthrough.md</span>
        <h1 className="text-2xl font-bold text-aranyam-espresso mt-2">Testing & Local Run Guide</h1>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs font-medium text-blue-700">
        💡 <strong>Quick Start:</strong> The application automatically detects if Firebase is offline and runs in sandboxed mode locally, allowing immediate database exploration.
      </div>

      <section className="space-y-3">
        <h3 className="text-base font-bold text-aranyam-espresso">1. Set Up Frontend</h3>
        <p className="text-xs">Navigate to the workspace root directory and boot up the Vite React application:</p>
        <pre className="rounded-xl bg-[#0E0E10] p-4 text-xs font-mono text-white overflow-x-auto">
{`cd c:\\ATTNAM\\Matrimony
npm install
npm run dev`}
        </pre>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-bold text-aranyam-espresso">2. Start Backend Sync Services</h3>
        <p className="text-xs">In a separate terminal, deploy the Express API gateway and local background synchronization services:</p>
        <pre className="rounded-xl bg-[#0E0E10] p-4 text-xs font-mono text-white overflow-x-auto">
{`cd c:\\ATTNAM\\Matrimony\\backend
npm install
npm run prisma:migrate
npm run dev`}
        </pre>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-bold text-aranyam-espresso">3. Verify Resilience Simulation</h3>
        <p className="text-xs">Run our simulated database outage program. It switches Postgres offline, queues profile data in Upstash Redis, and automatically writes the synchronized logs back when Postgres returns online:</p>
        <pre className="rounded-xl bg-[#0E0E10] p-4 text-xs font-mono text-white overflow-x-auto">
{`cd c:\\ATTNAM\\Matrimony\\backend
npm run simulate`}
        </pre>
      </section>
    </div>
  );
}

function TaskContent() {
  return (
    <div className="space-y-6">
      <div className="border-b border-aranyam-border pb-4">
        <span className="rounded bg-aranyam-goldLight border border-aranyam-gold/20 px-2 py-0.5 text-[10px] font-bold text-aranyam-gold">task.md</span>
        <h1 className="text-2xl font-bold text-aranyam-espresso mt-2">Checklist Progress Tracker</h1>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-aranyam-gold mb-2">Phase 1: Foundations & Architecture</h4>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked readOnly className="rounded border-aranyam-border text-aranyam-crimson focus:ring-aranyam-crimson" />
              <span className="line-through text-aranyam-charcoal/60">Analyze codebase and construct PostgreSQL schema replica with SyncAuditLog</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked readOnly className="rounded border-aranyam-border text-aranyam-crimson focus:ring-aranyam-crimson" />
              <span className="line-through text-aranyam-charcoal/60">Create design plan and checklist templates</span>
            </label>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-aranyam-gold mb-2">Phase 2: Frontend Dashboard UI</h4>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked readOnly className="rounded border-aranyam-border text-aranyam-crimson focus:ring-aranyam-crimson" />
              <span>Define premium documentation icons inside Icon.tsx</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked readOnly className="rounded border-aranyam-border text-aranyam-crimson focus:ring-aranyam-crimson" />
              <span>Implement dynamic GuidesDashboard component featuring health metrics</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked readOnly className="rounded border-aranyam-border text-aranyam-crimson focus:ring-aranyam-crimson" />
              <span>Hook dashboard entry buttons inside ProfileView (Mobile & Desktop)</span>
            </label>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-aranyam-gold mb-2">Phase 3: Resilience & Outage Verification</h4>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked readOnly className="rounded border-aranyam-border text-aranyam-crimson focus:ring-aranyam-crimson" />
              <span>Run Express API gateway and verify active queue polling</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked readOnly className="rounded border-aranyam-border text-aranyam-crimson focus:ring-aranyam-crimson" />
              <span>Validate offline caching of swipes and user profiles in Redis</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanContent() {
  return (
    <div className="space-y-6">
      <div className="border-b border-aranyam-border pb-4">
        <span className="rounded bg-aranyam-goldLight border border-aranyam-gold/20 px-2 py-0.5 text-[10px] font-bold text-aranyam-gold">implementation_plan.md</span>
        <h1 className="text-2xl font-bold text-aranyam-espresso mt-2">Architecture Design Plan</h1>
      </div>

      <p className="text-xs leading-relaxed">
        <strong>Aranyam</strong> connects Sri Lankan Tamil local and diaspora communities through an interest-aligned matrimony database. The system utilizes a dual-mode integration framework keeping application logic completely functional during upstream server outages.
      </p>

      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-aranyam-gold">Resilient Infrastructure Overview</h3>
        <div className="rounded-xl border border-aranyam-border bg-aranyam-surfaceAlt/40 p-4">
          <ul className="list-disc list-inside text-xs space-y-2">
            <li><strong>Express Gateway</strong>: Instantly acknowledges writes with 202 Accepted status and buffers payloads in BullMQ.</li>
            <li><strong>Upstash Redis Connection</strong>: Serves as a globally distributed serverless message broker with automatic exponential backoffs.</li>
            <li><strong>Sync Audit Logging</strong>: Tracks synchronizations and failures within the SyncAuditLog Postgres model.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-aranyam-gold">Cloud Deployment Schema</h3>
        <p className="text-xs">For live production systems on Railway, databases can be seamlessly migrated using connection strings:</p>
        <div className="rounded-xl bg-[#0E0E10] p-4 text-xs font-mono text-white overflow-x-auto">
{`# .env config
DATABASE_URL="postgresql://supabase_neon_postgres_url"
REDIS_URL="rediss://default:password@upstash_redis_url"`}
        </div>
      </section>
    </div>
  );
}
