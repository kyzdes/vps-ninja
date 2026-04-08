'use client';

import { Shield, Eye, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export function SecuritySection() {
    const securityFeatures = [
        {
            icon: Shield,
            title: 'Zero Credential Leakage',
            desc: 'servers.json is strictly gitignored. Passwords and API keys are masked locally. Nothing leaves your machine.'
        },
        {
            icon: Eye,
            title: 'Full Transparency',
            desc: 'Destructive commands like /vps destroy require manual confirmation. DNS operations show previews before applying.'
        },
        {
            icon: Cpu,
            title: 'Autonomous Execution',
            desc: '7 built-in reference guides mean Claude reads local context, not random web pages. Faster, cheaper, and 100% accurate.'
        }
    ];

    return (
        <section className="py-24 relative bg-gray-900 border-t border-gray-800">
            <div className="container px-4 mx-auto max-w-6xl">
                <div className="mb-20 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Built for Paranoia</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        We know giving an AI access to your servers is scary. That's why we built VPS Ninja like a fortress.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {securityFeatures.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="p-8 rounded-2xl border border-gray-800 bg-black shadow-lg"
                        >
                            <feature.icon className="w-10 h-10 text-neon-green mb-6" />
                            <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
