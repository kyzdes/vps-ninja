'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const milestones = [
    {
        version: 'v1',
        title: 'Initial Release',
        description: 'Basic deploy and DB management. Claude often "googled" Dokploy docs, wasting tokens and finding outdated versions.',
        color: 'border-gray-600',
        iconColor: 'bg-gray-600',
        textColor: 'text-gray-400',
        glow: 'shadow-none'
    },
    {
        version: 'v2',
        title: 'The Dokploy v0.27+ Fix',
        description: 'Adapted to breaking changes (environmentId). Improved bash scripts with error handling and hardcore security (UFW + swap).',
        color: 'border-blue-500',
        iconColor: 'bg-blue-500',
        textColor: 'text-blue-400',
        glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]'
    },
    {
        version: 'v3',
        title: 'The Ultimate DevOps AI',
        description: 'Zero-Hallucination Docs, GitHub App Mastery, Let\'s Encrypt --no-proxy fix, and built-in MCP server. 100% Pass Rate.',
        color: 'border-emerald-500',
        iconColor: 'bg-emerald-500',
        textColor: 'text-emerald-400',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
        features: [
            '6 built-in reference guides',
            'Native Dokploy + GitHub App integration',
            'Automated --no-proxy Cloudflare toggle',
            'Bundled MCP server for fresh docs'
        ]
    },
    {
        version: 'v3.1.1',
        title: 'Battle-Tested & Secure',
        description: '9 production bugs fixed. 4-tier fallback chain, command injection fix, complete Zod schema compliance, --dry-run mode.',
        color: 'border-neon-green',
        iconColor: 'bg-neon-green',
        textColor: 'text-neon-green',
        glow: 'shadow-[0_0_30px_rgba(0,255,65,0.8)]',
        current: true,
        features: [
            '4-tier deploy fallback: GitHub App → git → PAT → Docker',
            'Security: injection fix, SSHPASS env, quote escaping',
            '--dry-run, --server flags, resource warnings',
            'All API fields verified against Dokploy Zod schemas'
        ]
    }
];

export function EvolutionTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const successRef = useRef<HTMLDivElement>(null);
    const checkRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate central line
            gsap.fromTo(
                lineRef.current,
                { scaleY: 0 },
                {
                    scaleY: 1,
                    transformOrigin: 'top center',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top center',
                        end: 'bottom center',
                        scrub: true,
                    }
                }
            );

            // Animate items
            gsap.utils.toArray('.timeline-item').forEach((item: any, i) => {
                gsap.fromTo(
                    item,
                    { opacity: 0, x: i % 2 === 0 ? 50 : -50 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 75%',
                        }
                    }
                );
            });

            // Success animation at the end of the line
            gsap.fromTo(
                successRef.current,
                { opacity: 0, scale: 0.5, y: 20 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'bottom center',
                        toggleActions: 'play reverse play reverse',
                    }
                }
            );

            if (checkRef.current) {
                // Approximate length of the checkmark path is around 25
                gsap.fromTo(
                    checkRef.current,
                    { strokeDasharray: 30, strokeDashoffset: 30 },
                    {
                        strokeDashoffset: 0,
                        duration: 0.5,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'bottom center',
                            toggleActions: 'play reverse play reverse',
                        }
                    }
                );
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="py-24 relative bg-black" ref={containerRef}>
            <div className="container px-4 mx-auto max-w-5xl">
                <div className="mb-20 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Evolution of Ninja</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        How we reached a 100% Pass Rate by fixing AI deployment hallucinations.
                    </p>
                </div>

                <div className="relative">
                    {/* Background Line */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-1 bg-gray-900 transform md:-translate-x-1/2 rounded-full" />

                    {/* Animated Line */}
                    <div
                        ref={lineRef}
                        className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-600 via-blue-500 via-emerald-500 to-neon-green transform md:-translate-x-1/2 rounded-full z-0"
                    />

                    <div className="space-y-16 pb-24">
                        {milestones.map((item, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <div key={item.version} className={`timeline-item relative flex flex-col md:flex-row items-start md:items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>

                                    {/* Timeline Dot (hidden on mobile) */}
                                    <div className={`hidden md:block absolute left-[16px] md:left-1/2 w-3 h-3 rounded-full transform -translate-x-1/2 mt-6 md:mt-0 z-10 ${item.iconColor} ${item.glow}`} />

                                    {/* Content */}
                                    <div className={`ml-12 md:ml-0 md:w-1/2 ${isEven ? 'md:pl-16' : 'md:pr-16 text-left md:text-right'}`}>
                                        <div className={`inline-block px-3 py-1 rounded-full border ${item.color} ${item.textColor} text-sm font-mono mb-4`}>
                                            {item.version}
                                        </div>
                                        <h3 className={`text-2xl font-bold mb-3 ${item.current ? 'text-white' : 'text-gray-200'}`}>
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed mb-4">
                                            {item.description}
                                        </p>

                                        {item.features && (
                                            <ul className={`space-y-2 mt-4 text-sm ${isEven ? 'text-left' : 'text-left md:text-right'}`}>
                                                {item.features.map((feature, i) => (
                                                    <li key={i} className="flex items-center md:justify-end gap-2 text-gray-300">
                                                        {!isEven && <span className="text-neon-green">✓</span>}
                                                        <span>{feature}</span>
                                                        {isEven && <span className="text-neon-green">✓</span>}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Success Animation at the bottom (hidden on mobile) */}
                    <div ref={successRef} className="hidden md:flex absolute left-[20px] md:left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 flex-col items-center justify-center opacity-0 z-20">
                        <div className="w-16 h-16 bg-black rounded-full border-2 border-neon-green flex items-center justify-center shadow-[0_0_30px_rgba(0,255,65,0.5)]">
                            <svg className="w-8 h-8 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path ref={checkRef} strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="absolute top-20 whitespace-nowrap text-neon-green font-bold tracking-widest text-sm uppercase shadow-neon-green mix-blend-screen">
                            Version 3.1.1
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
