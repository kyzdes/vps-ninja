'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TerminalSquare } from 'lucide-react';
import Link from 'next/link';
import { CopyButton } from './CopyButton';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

export function BenchmarksSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate progress bars
            gsap.utils.toArray('.progress-bar').forEach((bar: any, i) => {
                gsap.fromTo(
                    bar,
                    { width: '0%' },
                    {
                        width: bar.dataset.target,
                        duration: 1.5,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: bar,
                            start: 'top 85%',
                        }
                    }
                );
            });

            // Animate comparison cards
            gsap.fromTo(
                '.comparison-card',
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 75%',
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="py-24 relative bg-gray-900 border-y border-gray-800" ref={containerRef}>
            <div className="container px-4 mx-auto max-w-6xl">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">The Proof in the Numbers</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Naked Claude Code gives up 76% of the time. VPS Ninja finishes the job every time.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Card 1: Without Skill */}
                    <div className="comparison-card bg-black border border-gray-800 rounded-2xl p-8 relative overflow-hidden">
                        <h3 className="text-xl font-bold text-gray-400 mb-6 flex items-center">
                            <span className="w-3 h-3 rounded-full bg-red-500 mr-3" />
                            Claude <span className="text-gray-500 line-through mx-2">Without</span> Skill
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Pass Rate</span>
                                    <span className="text-red-500 font-mono">24%</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="progress-bar h-full bg-red-500/50" data-target="24%" />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Average Time</span>
                                    <span className="text-gray-300 font-mono">180.0s</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="progress-bar h-full bg-gray-600" data-target="100%" />
                                </div>
                            </div>

                            <ul className="text-sm text-gray-500 space-y-3 mt-8">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-0.5">✗</span>
                                    Googles API docs wasting tokens
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-0.5">✗</span>
                                    Fails Let's Encrypt due to CF Proxy
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-0.5">✗</span>
                                    Suggests manual webhook setup
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Card 2: With Skill */}
                    <div className="comparison-card bg-black border border-neon-green/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(0,255,65,0.05)]">
                        <div className="absolute top-0 inset-x-0 h-1 bg-neon-green" />

                        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                            <span className="w-3 h-3 rounded-full bg-neon-green mr-3 animate-pulse" />
                            Claude + VPS Ninja
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Pass Rate</span>
                                    <span className="text-neon-green font-mono font-bold">100%</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="progress-bar h-full bg-neon-green" data-target="100%" />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Average Time</span>
                                    <span className="text-neon-green font-mono font-bold">137.7s</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
                                    <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-bg-dark to-transparent z-10" />
                                    <div className="progress-bar h-full bg-neon-green/50" data-target="76%" />
                                </div>
                            </div>

                            <ul className="text-sm text-gray-300 space-y-3 mt-8">
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-green mt-0.5">✓</span>
                                    Reads built-in references instantly
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-green mt-0.5">✓</span>
                                    Automates --no-proxy DNS changes
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-green mt-0.5">✓</span>
                                    Leverages native GitHub App integration
                                </li>
                            </ul>
                        </div>

                        {/* CTA */}
                        <div className="relative z-10 flex flex-col sm:flex-row gap-4 mt-12 mb-8">
                            <CopyButton className="flex-1 text-lg py-4 px-8 rounded-xl" />
                            <Link href="/benchmarks" className="flex-1 bg-gray-900 border border-gray-700 text-white font-bold text-lg py-4 px-8 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center">
                                See Detailed Benchmarks
                            </Link>
                        </div>

                        {/* Background glowing SVG */}
                        <svg className="absolute bottom-0 right-0 opacity-10" width="200" height="200" viewBox="0 0 100 100">
                            <circle cx="90" cy="90" r="50" fill="none" stroke="var(--color-neon-green)" strokeWidth="1" />
                            <circle cx="90" cy="90" r="70" fill="none" stroke="var(--color-neon-green)" strokeWidth="0.5" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}
