import { Github, Twitter, TerminalSquare } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-black py-16 border-t border-gray-800">
            <div className="container px-4 mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <TerminalSquare className="text-neon-green w-6 h-6" />
                            VPS Ninja
                        </h2>
                        <p className="text-gray-400 max-w-sm mb-6">
                            The ultimate DevOps skill for Claude Code. Stop managing infrastructure, start shipping products.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://github.com/kyzdes/vps-ninja" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                                <Github className="w-6 h-6" />
                                <span className="sr-only">GitHub</span>
                            </a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors">
                                <Twitter className="w-6 h-6" />
                                <span className="sr-only">Twitter</span>
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4 tracking-wider uppercase text-sm">Resources</h3>
                        <ul className="space-y-3">
                            <li><a href="https://github.com/kyzdes/vps-ninja#quick-start" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-neon-green transition-colors text-sm">Documentation</a></li>
                            <li><a href="https://dokploy.com/docs" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-neon-green transition-colors text-sm">Dokploy Docs</a></li>
                            <li><a href="https://github.com/kyzdes/vps-ninja#supported-stacks" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-neon-green transition-colors text-sm">Supported Stacks</a></li>
                            <li><a href="/benchmarks" className="text-gray-400 hover:text-neon-green transition-colors text-sm">Benchmarks</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4 tracking-wider uppercase text-sm">Community</h3>
                        <ul className="space-y-3">
                            <li><a href="https://github.com/kyzdes/vps-ninja/issues" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-neon-green transition-colors text-sm">GitHub Issues</a></li>
                            <li><a href="https://github.com/kyzdes/vps-ninja/discussions" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-neon-green transition-colors text-sm">Discussions</a></li>
                            <li><a href="https://github.com/kyzdes/vps-ninja#contributing" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-neon-green transition-colors text-sm">Contributing</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} VPS Ninja. Released under the MIT License.
                    </p>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                        Made with <span className="text-red-500">❤️</span> for the Claude Code community.
                    </p>
                </div>
            </div>
        </footer>
    );
}
