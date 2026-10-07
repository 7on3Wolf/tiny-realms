import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import HomeArtworkCarousel from '../components/public/HomeArtworkCarousel';
import HomeGalleryMarquee from '../components/public/HomeGalleryMarquee';
import { useApp } from '../context/AppContext';
import ArtworkCard from '../components/ArtworkCard';
import BaseButton from '../components/ui/BaseButton';
import AboutHomeSection from '../components/public/AboutHomeSection';
import RoadmapHomeSection from '../components/public/RoadmapHomeSection';
import HolderHomeSection from '../components/public/HolderHomeSection';
import TeamHomeSection from '../components/public/TeamHomeSection';
import Footer from '../components/Footer';
import { ArtworkGridSkeleton } from '../components/common/Skeletons';
import SectionHeader from '../components/common/SectionHeader';

export default function Home() {
  const { publishedArtworks, collections } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.title = 'Tiny Realms — Anime Art';

    const scrollToHash = () => {
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  // Display published artworks preview (max 8 for 1-viewport fit)
  const collectionPreview = useMemo(() => {
    return publishedArtworks.slice(0, 8);
  }, [publishedArtworks]);

  return (
    <main
      id="home"
      className="w-full bg-[#4E4B47] focus:outline-none"
    >
      {/* 1. HERO SECTION */}
      <HomeArtworkCarousel />

      {/* 2. UNIFIED ABOUT SECTION */}
      <AboutHomeSection />

      {/* 3. ROADMAP SECTION */}
      <RoadmapHomeSection />

      {/* 4. COLLECTION PREVIEW SECTION */}
      <section
        id="collection"
        className="w-full bg-[#4E4B47] text-[#F5EBDD] min-h-[100svh] snap-start snap-always flex flex-col justify-start pt-14 sm:pt-16 lg:pt-20 pb-10 sm:pb-16 relative scroll-mt-12 sm:scroll-mt-14"
        aria-label="Artworks Collections Section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 w-full relative z-10 flex flex-col justify-start">
          {/* Clean Section Title */}
          <SectionHeader
            eyebrow="DIGITAL CATALOG"
            title="COLLECTION"
            subtitle="Explore unique hand-drawn anime character collections and digital collectibles."
            variant="dark"
          />

          {/* Artworks Grid - 4x2 layout (4 across, 2 down), max 8 items */}
          {isLoading ? (
            <ArtworkGridSkeleton count={8} />
          ) : collectionPreview.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5 xs:gap-4 sm:gap-5 lg:gap-6 w-full mx-auto">
              {collectionPreview.map((artwork) => (
                <div key={artwork.id} className="flex flex-col">
                  <ArtworkCard artwork={artwork} variant="chocolate" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-14 text-center bg-[#24170F]/50 rounded-2xl border border-[#5A351E] p-8 max-w-lg mx-auto">
              <p className="font-hero-title font-bold text-base text-[#F5EBDD] uppercase tracking-wide">
                No Artworks Currently Listed
              </p>
              <p className="text-xs text-[#CDBCA8] mt-1.5 leading-relaxed font-mono">
                Collection items will appear here once published from the Studio Admin Panel.
              </p>
            </div>
          )}

          {/* Action Button: "View" */}
          <div className="mt-6 sm:mt-10 flex justify-center">
            <Link to="/collection" className="focus:outline-none" data-track-click="Klik Tombol View Full Collection">
              <BaseButton
                variant="wood"
                size="md"
                icon={<FiArrowRight className="w-4 h-4 text-[#FFE3B3]" />}
                iconPosition="right"
              >
                View Full Collection
              </BaseButton>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. GALLERY EXHIBITION SECTION */}
      <section
        id="gallery"
        className="w-full bg-black text-[#F5EBDD] min-h-[100svh] snap-start snap-always flex flex-col justify-start pt-14 sm:pt-16 lg:pt-20 pb-10 sm:pb-16 relative scroll-mt-12 sm:scroll-mt-14 overflow-hidden"
        aria-label="Gallery Collections Exhibition"
      >
        {/* Soft Ambient Warm Hearth Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,155,90,0.08)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 w-full relative z-10 flex flex-col justify-start">
          <SectionHeader
            eyebrow="LIVING EXHIBITION"
            title="GALLERY"
            subtitle="A continuous tapestry of living characters, legends, and enchanted artifacts across the Tiny Realms."
            variant="dark"
          />
        </div>

        {/* Dual-Direction Continuous Marquee */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 overflow-hidden">
          <HomeGalleryMarquee collections={collections} artworks={publishedArtworks} />
        </div>
      </section>

      {/* 7. HOLDER SECTION */}
      <HolderHomeSection />

      {/* 8. TEAM SECTION */}
      <TeamHomeSection />

      {/* 9. FOOTER SNAP SECTION */}
      <section id="footer" className="w-full bg-black text-[#F5EBDD] snap-start snap-always relative">
        <Footer />
      </section>
    </main>
  );
}
