import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiInstagram } from 'react-icons/fi';
import { RiTwitterXFill } from 'react-icons/ri';
import { TINY_REALMS_CONFIG } from '../services/xrplHolderService';

/**
 * Footer Component
 *
 * Styled in rich, deep dark roasted espresso chocolate palette (#140C07 / #1A0E08)
 * with warm timber borders and clean contrast typography.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#140C07] text-[#CDBCA8] border-t border-[#3D2214] relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-8 border-b border-[#3D2214]/80">
          {/* Brand Info */}
          <div className="md:col-span-5">
            <h3 className="font-hero-title font-black text-xl sm:text-2xl text-[#F5EBDD] tracking-wider uppercase mb-2">
              TINY REALMS
            </h3>
            <p className="text-xs sm:text-sm text-[#CDBCA8] leading-relaxed max-w-sm font-sans mb-4">
              Hand-drawn character universe from Indonesia on the XRP Ledger. Small world, big imagination.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#F5EBDD] mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link to="/#about" className="text-[#CDBCA8] hover:text-[#F5EBDD] transition-colors">
                  About the Realm
                </Link>
              </li>
              <li>
                <Link to="/collection" className="text-[#CDBCA8] hover:text-[#F5EBDD] transition-colors">
                  Art Gallery
                </Link>
              </li>
              <li>
                <Link to="/#roadmap" className="text-[#CDBCA8] hover:text-[#F5EBDD] transition-colors">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link to="/holders" className="text-[#CDBCA8] hover:text-[#F5EBDD] transition-colors">
                  Holders Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/info" className="text-[#CDBCA8] hover:text-[#F5EBDD] transition-colors">
                  Project Info & Lore
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Channels */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#F5EBDD] mb-3">
              Marketplace & Social
            </h4>
            <div className="flex flex-wrap gap-2">
              <a
                href={TINY_REALMS_CONFIG.xrpCafeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22130B] hover:bg-[#341D12] border border-[#3D2214] hover:border-[#C69B5A]/60 text-xs font-semibold text-[#F5EBDD] transition-colors group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#7FAF45]" />
                <span className="text-[#F5EBDD] font-bold">xrp.cafe</span>
                <FiArrowUpRight className="w-3 h-3 text-[#C69B5A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href="https://x.com/hitoo_nft"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22130B] hover:bg-[#341D12] border border-[#3D2214] hover:border-[#C69B5A]/60 text-xs font-semibold text-[#F5EBDD] transition-colors group"
              >
                <RiTwitterXFill className="w-3.5 h-3.5 text-[#F5EBDD] group-hover:text-[#C69B5A] transition-colors" />
                <span>@hitoo_nft</span>
                <FiArrowUpRight className="w-3 h-3 text-[#C69B5A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22130B] hover:bg-[#341D12] border border-[#3D2214] hover:border-[#C69B5A]/60 text-xs font-semibold text-[#F5EBDD] transition-colors"
              >
                <FiInstagram className="w-3.5 h-3.5 text-[#C69B5A]" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-[#CDBCA8]">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-xs text-[#CDBCA8]">
            <span className="font-bold text-[#F5EBDD]">TINY REALMS</span>
            <span>•</span>
            <span>© {currentYear}</span>
            <span>•</span>
            <span>Designed & Developed by <strong className="text-[#F5EBDD]">LIEBE</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
