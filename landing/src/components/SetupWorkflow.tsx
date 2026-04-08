'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';

const steps = [
    {
        num: '01',
        title: 'Install Skill',
        cmd: 'please install skill from https://github.com/kyzdes/vps-ninja',
        desc: 'Ask Claude to install the skill — it clones the repo and symlinks it automatically.'
    },
    {
        num: '02',
        title: 'Setup Server',
        cmd: '/vps setup <server-ip> <root-password>',
        desc: 'SSH in, install Dokploy, configure firewall, swap, fail2ban. One command.'
    },
    {
        num: '03',
        title: 'Deploy App',
        cmd: '/vps deploy github.com/user/app --domain app.example.com',
        desc: 'Detect stack, create project, set env vars, DNS + SSL, deploy. Auto-deploy on push.'
    }
];

function CodeBlock({ cmd, showDollar }: { cmd: string, showDollar: boolean }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(cmd);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            onClick={handleCopy}
            className="bg-black border border-gray-800 rounded-md p-4 mb-6 font-mono text-sm text-neon-green flex items-center justify-between group/code cursor-pointer hover:border-gray-700 transition-colors"
            title="Click to copy"
        >
            <div className="overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden flex-1 mr-4">
                {showDollar && <span className="text-gray-500 select-none mr-2">$</span>}
                {cmd}
            </div>
            <button className="text-gray-500 group-hover/code:text-white transition-colors flex-shrink-0" aria-label="Copy to clipboard">
                {copied ? <CheckCircle2 className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4" />}
            </button>
        </div>
    );
}

export function SetupWorkflow() {
    return (
        <section className="py-24 relative overflow-hidden bg-black">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

            <div className="container px-4 mx-auto max-w-6xl">
                <div className="mb-20 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Start Coding, Stop Ops</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        3 steps to turn Claude into your dedicated DevOps engineer.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: i * 0.2 }}
                            className="relative p-8 rounded-2xl border border-gray-800 bg-bg-gray/30 hover:bg-gray-800/50 transition-colors group"
                        >
                            <div className="text-6xl font-bold text-gray-800/50 absolute top-4 right-4 -z-10 group-hover:text-neon-green/10 transition-colors">
                                {step.num}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-6">
                                <span className="text-neon-green mr-2">{step.num}.</span>
                                {step.title}
                            </h3>

                            <CodeBlock cmd={step.cmd} showDollar={step.num !== '01'} />

                            <p className="text-gray-400 leading-relaxed text-sm">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
