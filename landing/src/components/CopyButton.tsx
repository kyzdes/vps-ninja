'use client';

import { useState } from 'react';
import { TerminalSquare, CheckCircle2 } from 'lucide-react';

export function CopyButton({ className = "" }: { className?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('please install skill from https://github.com/kyzdes/vps-ninja');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={`bg-neon-green text-black font-bold hover:bg-emerald-400 transition-all active:scale-95 flex items-center justify-center gap-2 ${className}`}
        >
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Install Command'}</span>
            {copied ? <CheckCircle2 className="w-5 h-5" /> : <TerminalSquare className="w-5 h-5" />}
        </button>
    );
}
