import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiTag, FiActivity, FiExternalLink, FiArrowRight, FiShield } from 'react-icons/fi';
import { siteInfo } from '../data/siteInfo';
import BaseButton from '../components/ui/BaseButton';

/**
 * Info / About Page
 *
 * Designed with rich storybook dark fantasy aesthetic, zero static pill tags,
 * chiseled wood accents, and high-readability layout across all devices.
 */
export default function Info() {
  const { label, title, tagline, aboutText, publicSale, ongoing, priceRange } = siteInfo;

  useEffect(() => {
    document.title = 'About & Lore — Tiny Realms';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <main id="info" className="flex-1 w-full py-8 sm:py-12 lg:py-16 bg-[#696866] text-[#F5EBDD]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation / Return Link */}
        <div className="mb-6 sm:mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#CDBCA8] hover:text-[#F5EBDD] transition-colors group"
            aria-label="Return to home page"
          >
            <FiArrowLeft className="w-3.5 h-3.5 text-[#C69B5A] group-hover:-translate-x-1 transition-transform" />
            <span>RETURN TO HOME</span>
          </Link>
        </div>

        {/* ======================================================== */}
        {/* SECTION A: PAGE INTRODUCTION & HEADER                     */}
        {/* ======================================================== */}
        <header className="pb-8 sm:pb-12 border-b border-[#5A351E]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#D9A85C] uppercase mb-2">
            <span>{label}</span>
            <span aria-hidden="true" className="text-[#8C5D19]">·</span>
            <span>XRPL ADVENTURE</span>
          </div>

          <h1 className="font-hero-title font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#F5EBDD] uppercase">
            {title}
          </h1>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-[#E8DCCB] font-medium leading-relaxed max-w-3xl">
            {tagline}
          </p>
        </header>

        {/* ======================================================== */}
        {/* SECTION B: ABOUT TINY REALMS LORE                         */}
        {/* ======================================================== */}
        <section
          aria-labelledby="about-heading"
          className="py-10 sm:py-14 border-b border-[#5A351E]"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="md:col-span-4">
              <span className="font-mono text-xs font-bold tracking-widest text-[#C69B5A] uppercase block mb-1">
                01 // ORIGIN & WORLD
              </span>
              <h2
                id="about-heading"
                className="font-hero-title font-bold text-xl sm:text-2xl text-[#F5EBDD] uppercase tracking-wide"
              >
                About Tiny Realms
              </h2>
            </div>

            <div className="md:col-span-8 p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#24170F]/90 border border-[#5A351E] shadow-xl space-y-4 text-sm sm:text-base text-[#D4C3B2] leading-relaxed">
              {aboutText.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION C: RELEASE SCHEDULE & MARKETPLACE                 */}
        {/* ======================================================== */}
        <section
          aria-labelledby="public-sale-heading"
          className="py-10 sm:py-14 border-b border-[#5A351E]"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="md:col-span-4">
              <span className="font-mono text-xs font-bold tracking-widest text-[#C69B5A] uppercase block mb-1">
                02 // RELEASE SCHEDULE
              </span>
              <h2
                id="public-sale-heading"
                className="font-hero-title font-bold text-xl sm:text-2xl text-[#F5EBDD] uppercase tracking-wide"
              >
                Public Release
              </h2>
            </div>

            <div className="md:col-span-8">
              <div className="bg-[#24170F]/90 border border-[#5A351E] rounded-3xl p-6 sm:p-8 shadow-xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
                  <div className="p-4 rounded-2xl bg-[#1A0E07] border border-[#3D2214]">
                    <span className="text-[#CDBCA8] uppercase block mb-2 flex items-center gap-1.5 text-[11px] font-bold">
                      <FiCalendar className="w-3.5 h-3.5 text-[#C69B5A]" />
                      Launch Date
                    </span>
                    <span className="font-bold text-[#F5EBDD] text-sm sm:text-base block">
                      {publicSale.date}
                    </span>
                    <span className="text-[11px] text-[#CDBCA8]/70 mt-1 block">
                      {publicSale.notes}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1A0E07] border border-[#3D2214]">
                    <span className="text-[#CDBCA8] uppercase block mb-2 flex items-center gap-1.5 text-[11px] font-bold">
                      <FiTag className="w-3.5 h-3.5 text-[#C69B5A]" />
                      Platform
                    </span>
                    <a
                      href="https://xrp.cafe/id/collection/tinyrealms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#D9A85C] hover:text-[#F5EBDD] text-sm sm:text-base inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>{publicSale.platform}</span>
                      <FiExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <span className="text-[11px] text-[#CDBCA8]/70 mt-1 block">
                      XRPL Primary Market
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1A0E07] border border-[#3D2214]">
                    <span className="text-[#CDBCA8] uppercase block mb-2 flex items-center gap-1.5 text-[11px] font-bold">
                      <FiActivity className="w-3.5 h-3.5 text-[#7FAF45]" />
                      Catalogue
                    </span>
                    <span className="font-bold text-[#7FAF45] text-sm sm:text-base block">
                      {publicSale.status}
                    </span>
                    <span className="text-[11px] text-[#CDBCA8]/70 mt-1 block">
                      Active Live Trading
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION D: SPECIFICATIONS                                 */}
        {/* ======================================================== */}
        <section
          aria-labelledby="specs-heading"
          className="py-10 sm:py-14 border-b border-[#5A351E]"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="md:col-span-4">
              <span className="font-mono text-xs font-bold tracking-widest text-[#C69B5A] uppercase block mb-1">
                03 // LEDGER ARCHITECTURE
              </span>
              <h2
                id="specs-heading"
                className="font-hero-title font-bold text-xl sm:text-2xl text-[#F5EBDD] uppercase tracking-wide"
              >
                Specifications
              </h2>
            </div>

            <div className="md:col-span-8">
              <div className="bg-[#24170F]/90 border border-[#5A351E] rounded-3xl p-6 sm:p-8 space-y-3.5 font-mono text-xs shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#3D2214] gap-1">
                  <span className="text-[#CDBCA8]">Token Standard</span>
                  <span className="font-bold text-[#F5EBDD]">XLS-20 (Native XRPL Token)</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#3D2214] gap-1">
                  <span className="text-[#CDBCA8]">Total Editions</span>
                  <span className="font-bold text-[#F5EBDD]">1 of 1 (Strictly Unique)</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#3D2214] gap-1">
                  <span className="text-[#CDBCA8]">Price Range</span>
                  <span className="font-bold text-[#F5EBDD]">
                    {priceRange.floor} – {priceRange.ceiling} {priceRange.currency}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#3D2214] gap-1">
                  <span className="text-[#CDBCA8]">Ongoing Series</span>
                  <span className="font-bold text-[#D9A85C]">{ongoing ? 'Active' : 'Completed'}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-1">
                  <span className="text-[#CDBCA8]">Network Fees</span>
                  <span className="font-bold text-[#7FAF45]">~0.000012 XRP (Near Zero)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION E: ROADMAP CALLOUT                                */}
        {/* ======================================================== */}
        <section aria-labelledby="roadmap-notice-heading" className="py-10 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="md:col-span-4">
              <span className="font-mono text-xs font-bold tracking-widest text-[#C69B5A] uppercase block mb-1">
                04 // FUTURE PLANS
              </span>
              <h2
                id="roadmap-notice-heading"
                className="font-hero-title font-bold text-xl sm:text-2xl text-[#F5EBDD] uppercase tracking-wide"
              >
                Project Roadmap
              </h2>
            </div>

            <div className="md:col-span-8">
              <div className="bg-[#1A0E07] border border-[#5A351E] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
                <h3 className="font-hero-title font-bold text-lg sm:text-xl uppercase text-[#F5EBDD] mb-2 tracking-wide">
                  Roadmap Milestone Journey
                </h3>
                <p className="text-xs sm:text-sm text-[#CDBCA8] leading-relaxed mb-6 max-w-xl">
                  Explore the complete visual roadmap detailing unlockable character chronicles, collector holder perks, and expanded world lore.
                </p>
                <Link to="/#roadmap" className="inline-block focus:outline-none">
                  <BaseButton
                    variant="wood"
                    size="md"
                    icon={<FiArrowRight className="w-4 h-4 text-[#FFE3B3]" />}
                    iconPosition="right"
                  >
                    View Roadmap on Home
                  </BaseButton>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
