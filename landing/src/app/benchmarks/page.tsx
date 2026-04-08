'use client';

import { ArrowLeft, Clock, Activity, Zap, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const evals = [
    {
        id: 1,
        title: 'Deploy Next.js App',
        prompt: '/vps deploy github.com/kyzdes/my-nextjs-app --domain app.kyzdes.com',
        withSkill: { time: '152.0s', tokens: '62,852', score: '6/6 (100%)' },
        withoutSkill: { time: '165.7s', tokens: '38,666', score: '1/6 (17%)' },
        assertions: [
            { name: 'Does NOT use WebSearch/WebFetch for docs', ninja: true, naked: true },
            { name: 'Reads deploy-guide.md / stack-detection.md', ninja: true, naked: false },
            { name: 'Does NOT suggest GitHub webhooks', ninja: true, naked: false },
            { name: 'Mentions GitHub App auto-deploy', ninja: true, naked: false },
            { name: 'Uses environmentId for app creation', ninja: true, naked: false },
            { name: 'Creates DNS with --no-proxy', ninja: true, naked: false },
        ]
    },
    {
        id: 2,
        title: 'Auto-Deploy Troubleshooting',
        prompt: 'My app deployed earlier stopped updating when I push to main. How do I fix auto-deploy? Maybe I need to set up a webhook?',
        withSkill: { time: '101.5s', tokens: '41,685', score: '4/4 (100%)' },
        withoutSkill: { time: '205.3s', tokens: '41,231', score: '1/4 (25%)' },
        assertions: [
            { name: 'Does NOT suggest adding webhook', ninja: true, naked: false },
            { name: 'Explains GitHub App handles auto-deploy', ninja: true, naked: false },
            { name: 'Suggests checking: GitHub App, autoDeploy, branch', ninja: true, naked: false },
            { name: 'Does NOT search the web', ninja: true, naked: true },
        ]
    },
    {
        id: 3,
        title: 'Setup VPS',
        prompt: '/vps setup <server-ip> <root-password>',
        withSkill: { time: '159.6s', tokens: '47,298', score: '4/4 (100%)' },
        withoutSkill: { time: '168.9s', tokens: '38,015', score: '1/4 (25%)' },
        assertions: [
            { name: 'Reads setup-guide.md', ninja: true, naked: false },
            { name: 'Does NOT search the web', ninja: true, naked: true },
            { name: 'Attempts SSH connection via skill scripts', ninja: true, naked: false },
            { name: 'Asks user to create admin + provide API key', ninja: true, naked: false },
        ]
    }
];

export default function BenchmarksPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-neon-green selection:text-black pt-24 pb-32">
            <div className="container px-4 mx-auto max-w-5xl">
                <Link href="/" className="inline-flex items-center text-gray-400 hover:text-neon-green mb-12 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-green/30 bg-neon-green/10 text-neon-green text-sm font-mono mb-6">
                        <Activity className="w-4 h-4" />
                        v3.1 Performance Data
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        The Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-400">Doesn't Lie</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                        We ran Claude Sonnet 4.6 through identical DevOps scenarios with and without VPS Ninja v3.1. Here is the raw, unedited benchmark data showing why "naked" AI struggles with modern infrastructure.
                    </p>
                </motion.div>

                {/* Global Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24"
                >
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/5 rounded-full blur-3xl group-hover:bg-neon-green/10 transition-colors" />
                        <ShieldAlert className="w-8 h-8 text-neon-green mb-4" />
                        <div className="text-gray-400 text-sm font-mono mb-2">Overall Pass Rate</div>
                        <div className="flex items-baseline gap-4">
                            <span className="text-5xl font-bold">100%</span>
                            <span className="text-xl text-gray-500 line-through">24%</span>
                        </div>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
                        <Clock className="w-8 h-8 text-blue-400 mb-4" />
                        <div className="text-gray-400 text-sm font-mono mb-2">Average Time</div>
                        <div className="flex items-baseline gap-4">
                            <span className="text-5xl font-bold">137s</span>
                            <span className="text-xl text-gray-500 line-through">180s</span>
                        </div>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors" />
                        <Zap className="w-8 h-8 text-purple-400 mb-4" />
                        <div className="text-gray-400 text-sm font-mono mb-2">Average Tokens</div>
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-bold">50.6K</span>
                            <span className="text-xl text-gray-500">vs 39.3K</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">More tokens due to reading docs, offset by faster completion.</div>
                    </div>
                </motion.div>

                {/* Detailed Evals */}
                <div className="space-y-16">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <Activity className="text-neon-green" />
                        Per-Eval Breakdown
                    </h2>

                    {evals.map((e, index) => (
                        <motion.div
                            key={e.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-black border border-gray-800 rounded-3xl overflow-hidden"
                        >
                            {/* Eval Header */}
                            <div className="p-8 border-b border-gray-800 bg-gray-900/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-md text-xs font-mono font-bold">Eval {e.id}</span>
                                    <h3 className="text-2xl font-bold">{e.title}</h3>
                                </div>
                                <div className="bg-black/50 p-4 rounded-lg font-mono text-sm text-gray-300 border border-gray-800">
                                    <span className="text-neon-green">&gt;</span> {e.prompt}
                                </div>
                            </div>

                            {/* Data comparison */}
                            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-800">
                                {/* Ninja Side */}
                                <div className="p-8 bg-black relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-neon-green" />
                                    <div className="flex justify-between items-center mb-8">
                                        <h4 className="text-xl font-bold text-neon-green flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5" />
                                            VPS Ninja
                                        </h4>
                                        <span className="font-mono text-xl font-bold text-white">{e.withSkill.score}</span>
                                    </div>

                                    <div className="flex gap-6 mb-8 text-sm font-mono border-b border-gray-800 pb-6">
                                        <div>
                                            <span className="text-gray-500 block mb-1">Time</span>
                                            <span className="text-white">{e.withSkill.time}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block mb-1">Tokens</span>
                                            <span className="text-white">{e.withSkill.tokens}</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-4">
                                        {e.assertions.map((a, i) => (
                                            <li key={i} className="flex gap-3 text-sm">
                                                {a.ninja ?
                                                    <CheckCircle2 className="w-5 h-5 text-neon-green shrink-0" /> :
                                                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                                                }
                                                <span className={a.ninja ? 'text-gray-300' : 'text-gray-500 line-through'}>{a.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Naked Claude Side */}
                                <div className="p-8 bg-gray-950 relative opacity-70 hover:opacity-100 transition-opacity">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-700" />
                                    <div className="flex justify-between items-center mb-8">
                                        <h4 className="text-xl font-bold text-gray-400 flex items-center gap-2">
                                            <XCircle className="w-5 h-5" />
                                            Naked Claude
                                        </h4>
                                        <span className="font-mono text-xl font-bold text-gray-400">{e.withoutSkill.score}</span>
                                    </div>

                                    <div className="flex gap-6 mb-8 text-sm font-mono border-b border-gray-800 pb-6">
                                        <div>
                                            <span className="text-gray-500 block mb-1">Time</span>
                                            <span className="text-gray-400">{e.withoutSkill.time}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block mb-1">Tokens</span>
                                            <span className="text-gray-400">{e.withoutSkill.tokens}</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-4">
                                        {e.assertions.map((a, i) => (
                                            <li key={i} className="flex gap-3 text-sm">
                                                {a.naked ?
                                                    <CheckCircle2 className="w-5 h-5 text-gray-500 shrink-0" /> :
                                                    <XCircle className="w-5 h-5 text-red-500/50 shrink-0" />
                                                }
                                                <span className={a.naked ? 'text-gray-400' : 'text-gray-600'}>{a.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="mt-24 p-8 border border-gray-800 rounded-2xl bg-gray-900/50 text-center">
                    <h3 className="text-xl font-bold mb-4">Why does naked AI fail?</h3>
                    <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Without VPS Ninja, Claude attempts to "Google" its way through deployments. It finds outdated Dokploy v0.20 tutorials, doesn't know about Let's Encrypt <code className="text-neon-green">--no-proxy</code> requirements for Cloudflare, and assumes you need complex GitHub Webhooks instead of native GitHub Apps. VPS Ninja removes the guesswork by injecting hardcoded, battle-tested DevOps knowledge directly into its context window.
                    </p>
                </div>
            </div>
        </div>
    );
}
