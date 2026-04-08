import { Terminal, FeaturesGrid, EvolutionTimeline, BenchmarksSection, SetupWorkflow, SecuritySection, Footer, CopyButton } from '@/components';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-dark text-text-main overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center bg-repeat opacity-[0.03]" />

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="container px-4 mx-auto max-w-6xl relative z-10 flex flex-col items-center">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-8">
              Deploy repos to your server in <span className="text-neon-green inline-block">one command</span>.
              <br className="hidden md:block" /> No pain. No DevOps.
            </h1>
            <p className="text-lg md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
              VPS Ninja is a skill for Claude Code that configures your VPS, installs Dokploy, creates SSL domains, and sets up push-to-deploy automatically.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <CopyButton className="px-8 py-4 rounded-lg shadow-[0_0_20px_rgba(0,255,65,0.4)]" />
              <Link href="/benchmarks" className="px-8 py-4 bg-gray-900 border border-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 transition-all">
                See Benchmarks
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-500 font-mono">100% pass rate across all benchmarks · v3.1.1 · 20+ supported stacks</p>
          </div>

          <Terminal />
        </div>
      </section>

      {/* Evolution Timeline */}
      <EvolutionTimeline />

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Benchmarks Section */}
      <BenchmarksSection />

      {/* Setup Workflow */}
      {<SetupWorkflow />}

      {/* Security Section */}
      {<SecuritySection />}

      {/* Footer */}
      {<Footer />}
    </main>
  );
}
