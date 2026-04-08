'use client';

import { motion } from 'framer-motion';
import { Terminal, Lock, Database, Rocket } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        title: 'Stack Detection Magic',
        description: 'Auto-detects Next.js, Django, Go, Docker. Finds the right port automatically.',
        icon: Terminal,
        colSpan: 'md:col-span-2 lg:col-span-1',
        animationContent: (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent opacity-0 translate-y-full transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
        )
    },
    {
        title: 'DNS & SSL Autopilot',
        description: 'Automatically creates A-records in Cloudflare (even knows about --no-proxy for Let\'s Encrypt).',
        icon: Lock,
        colSpan: 'md:col-span-2 lg:col-span-2',
        animationContent: (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-neon-amber to-transparent opacity-0 translate-y-full transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
        )
    },
    {
        title: 'Instant Databases',
        description: 'Need Postgres or Redis? Just type /vps db create postgres app-db. Done.',
        icon: Database,
        colSpan: 'md:col-span-2 lg:col-span-2',
        animationContent: (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-0 translate-y-full transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
        )
    },
    {
        title: 'GitHub App Auto-deploy',
        description: 'No manual webhooks. Push to main — code is in production instantly.',
        icon: Rocket,
        colSpan: 'md:col-span-2 lg:col-span-1',
        animationContent: (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 translate-y-full transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
        )
    }
];

export function FeaturesGrid() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.feature-card',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="py-24 relative overflow-hidden" ref={containerRef}>
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon-green/30 to-transparent" />

            <div className="container px-4 mx-auto max-w-6xl">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Under the Hood Magic</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        VPS Ninja handles the infrastructure complexity so you can focus on writing code.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className={`feature-card group relative bg-bg-gray/50 border border-gray-800/50 rounded-2xl p-8 overflow-hidden hover:bg-gray-800/80 transition-colors ${feature.colSpan}`}
                        >
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center mb-6 group-hover:border-neon-green/50 transition-colors">
                                    <feature.icon className="w-6 h-6 text-gray-400 group-hover:text-neon-green transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                            </div>
                            {feature.animationContent}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
