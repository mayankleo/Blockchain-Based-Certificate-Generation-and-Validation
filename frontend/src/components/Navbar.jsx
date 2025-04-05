import { useWallet } from '../utils/WalletContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';

const navLinks = [
    { to: "/", icon: "", text: "Home" },
    { to: "/register", icon: "", text: "Register" },
    { to: "/login", icon: "", text: "Login" },
    { to: "/verify", icon: "", text: "Verify" },
    { to: "/user-dashboard", icon: "", text: "User Dashboard" },
    { to: "/admin-dashboard", icon: "", text: "Institute Dashboard" },
    { to: "/superuser-dashboard", icon: "", text: "SuperUser Dashboard" },
];

function Navbar() {
    const { walletAddress, isConnected, connectWallet, disconnectWallet } = useWallet();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-[#080d1e]/90 backdrop-blur-lg border-b border-white/10 shadow-[0_0_15px_rgba(0,191,255,0.1)]">
            <div className="w-full px-4">
                <div className="flex items-center justify-between gap-12 h-16">
                    {/* Logo and Title */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="relative">
                            {/* Blockchain Icon */}
                            <div className="w-10 h-10 relative">
                                {/* Outer Ring */}
                                <div className="absolute inset-0 rounded-full border-2 border-[#00BFFF]/30 animate-spin-slow"></div>
                                {/* Inner Ring */}
                                <div className="absolute inset-1 rounded-full border-2 border-[#8A2BE2]/30 animate-spin-slow-reverse"></div>
                                {/* Center Circle */}
                                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                </div>
                                {/* Connecting Lines */}
                                <div className="absolute inset-0">
                                    {[...Array(4)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-0.5 h-4 bg-gradient-to-b from-[#00BFFF] to-[#8A2BE2]"
                                            style={{
                                                top: '50%',
                                                left: '50%',
                                                transform: `rotate(${i * 90}deg) translateY(-8px)`,
                                                transformOrigin: 'center'
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                            {/* Glow Effect */}
                            <div className="absolute -inset-2 bg-gradient-to-r from-[#00BFFF]/20 to-[#8A2BE2]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center space-x-1">
                                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2]">GenVely</h1>
                                <span className="text-xs px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#00BFFF]/10 to-[#8A2BE2]/10 text-[#00BFFF] border border-[#00BFFF]/20">BETA</span>
                            </div>
                            <span className="text-xs text-gray-400 tracking-wider">Blockchain Certificates</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links & Wallet */}
                    <div className="hidden xl:flex items-center space-x-6">
                        {navLinks.map(({ to, icon, text }) => (
                            <Link
                                key={to}
                                to={to}
                                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 group relative"
                            >
                                <span className={`text-xl animate-${icon === "🏠" ? "pulse" : icon === "📦" ? "float" : "spin"}-slow`}>
                                    {icon}
                                </span>
                                <span className="font-medium group-hover:scale-105 transition-transform">
                                    {text}
                                </span>
                                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] group-hover:w-full transition-all duration-300"></div>
                            </Link>
                        ))}

                        {/* Wallet Connection */}
                        <div className="ml-4">
                            {isConnected ? (
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                                        <span className="text-sm text-gray-300">
                                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={disconnectWallet}
                                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-4 py-1.5 rounded-lg border border-red-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={connectWallet}
                                    className="bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] text-white px-4 py-1.5 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,191,255,0.3)] hover:scale-105"
                                >
                                    Connect Wallet
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="xl:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <XIcon className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="xl:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map(({ to, text }) => (
                            <Link
                                key={to}
                                to={to}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                            >
                                {text}
                            </Link>
                        ))}
                    </div>
                    {/* Wallet Connection in Mobile Menu */}
                    <div className="pt-4 pb-3 border-t border-white/10 px-5">
                        {isConnected ? (
                             <div className="flex flex-col items-start space-y-2">
                                 <div className="bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 w-full">
                                     <span className="text-sm text-gray-300 block truncate">
                                         {walletAddress}
                                     </span>
                                 </div>
                                 <button
                                     onClick={() => {
                                         disconnectWallet();
                                         setIsMobileMenuOpen(false);
                                     }}
                                     className="w-full text-left bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-3 py-2 rounded-md text-base font-medium border border-red-500/30 transition-all duration-300"
                                 >
                                     Disconnect Wallet
                                 </button>
                             </div>
                        ) : (
                            <button
                                onClick={() => {
                                    connectWallet();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] text-white px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,191,255,0.3)]"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar; 