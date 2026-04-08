'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const terminalLines = [
    { text: '> /vps deploy github.com/user/my-app --domain app.com', type: 'command' },
    { text: '[VPS Ninja] 🔍 Stack detected: Next.js 14, Port 3000', type: 'info' },
    { text: '[Dokploy] 📦 Creating application app-user-my-app...', type: 'process' },
    { text: '[Cloudflare] 🌐 Created DNS record app.com -> 45.x.x.x', type: 'success' },
    { text: '[Dokploy] 🔒 Issued SSL certificate (Let\'s Encrypt)', type: 'success' },
    { text: '[Dokploy] 🚀 Deploying application...', type: 'process' },
    { text: 'Deploy complete! 🎉\nURL: https://app.com\nAuto-deploy: Active via GitHub App', type: 'done' }
];

export function Terminal() {
    const [lines, setLines] = useState<number>(0);
    const [typing, setTyping] = useState('');

    useEffect(() => {
        let currentLine = 0;

        // Typewriter for first line
        const typeCmd = async () => {
            const cmd = terminalLines[0].text;
            for (let i = 0; i <= cmd.length; i++) {
                setTyping(cmd.slice(0, i));
                await new Promise(r => setTimeout(r, 40));
            }
            setLines(1);

            // Sequence the rest
            const sequence = async () => {
                for (let i = 1; i < terminalLines.length; i++) {
                    await new Promise(r => setTimeout(r, i === terminalLines.length - 1 ? 1200 : 600));
                    setLines(prev => prev + 1);
                }
            };
            sequence();
        };

        setTimeout(typeCmd, 1000);
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden border border-gray-800 bg-black shadow-2xl shadow-neon-green/10 font-mono text-sm leading-relaxed">
            {/* Terminal Header */}
            <div className="flex items-center px-4 py-3 bg-gray-900 border-b border-gray-800">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="mx-auto text-xs text-gray-400">claude-vps-ninja</div>
            </div>

            {/* Terminal Body */}
            <div className="p-4 sm:p-6 min-h-[300px] flex flex-col space-y-2">
                <div className="text-neon-green">
                    {typing}
                    {lines === 0 && <span className="animate-pulse bg-neon-green w-2 h-4 inline-block ml-1 align-middle" />}
                </div>

                {terminalLines.slice(1, lines).map((line, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`
              ${line.type === 'info' ? 'text-blue-400' : ''}
              ${line.type === 'process' ? 'text-gray-400' : ''}
              ${line.type === 'success' ? 'text-neon-green' : ''}
              ${line.type === 'done' ? 'text-white font-bold whitespace-pre-line mt-4' : ''}
            `}
                    >
                        {line.text}
                    </motion.div>
                ))}
                {lines > 0 && lines < terminalLines.length && (
                    <span className="animate-pulse bg-gray-500 w-2 h-4 inline-block mt-1" />
                )}
            </div>
        </div>
    );
}
