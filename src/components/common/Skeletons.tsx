import Skeleton from 'react-loading-skeleton';

/**
 * Reusable Skeleton Loaders powered by react-loading-skeleton
 * Styled with Tiny Realms' dark fantasy aesthetic (warm wood, chocolate, and gold shimmer)
 */

/**
 * Skeleton for Artwork Cards in Grid / Marquee
 */
export function ArtworkCardSkeleton() {
  return (
    <div className="bg-[#4A2D1A] rounded-2xl border border-[#5A351E] overflow-hidden shadow-md p-3 flex flex-col">
      <div className="w-full aspect-square rounded-xl overflow-hidden mb-3">
        <Skeleton height="100%" borderRadius={12} />
      </div>
      <div className="space-y-2 flex-1">
        <div className="flex justify-between items-center">
          <Skeleton width={90} height={18} borderRadius={6} />
          <Skeleton width={45} height={18} borderRadius={12} />
        </div>
        <Skeleton width="65%" height={14} borderRadius={4} />
        <div className="pt-2 border-t border-[#5A351E]/60 flex items-center justify-between">
          <Skeleton width={50} height={12} borderRadius={4} />
          <Skeleton width={70} height={14} borderRadius={6} />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of Artwork Skeletons
 */
export function ArtworkGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ArtworkCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for Collection Cards
 */
export function CollectionCardSkeleton() {
  return (
    <div className="bg-[#4A2D1A] rounded-2xl border border-[#5A351E] overflow-hidden shadow-md flex flex-col">
      <div className="w-full aspect-video">
        <Skeleton height="100%" />
      </div>
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <Skeleton width={120} height={20} borderRadius={6} />
          <Skeleton width={55} height={18} borderRadius={10} />
        </div>
        <Skeleton count={2} height={12} borderRadius={4} />
        <div className="pt-3 mt-auto border-t border-[#5A351E]/50 flex items-center justify-between">
          <Skeleton width={60} height={12} />
          <Skeleton width={80} height={14} />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of Collection Skeletons
 */
export function CollectionGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CollectionCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for Artwork / Gallery Detail page
 */
export function ArtworkDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Skeleton width={140} height={28} borderRadius={8} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Artwork Image Box */}
        <div className="lg:col-span-7 bg-[#4A2D1A] rounded-2xl border border-[#5A351E] p-4 shadow-lg">
          <div className="w-full aspect-square rounded-xl overflow-hidden">
            <Skeleton height="100%" borderRadius={12} />
          </div>
        </div>

        {/* Right: Details & Meta */}
        <div className="lg:col-span-5 bg-[#4A2D1A] rounded-2xl border border-[#5A351E] p-6 shadow-lg space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton width={80} height={22} borderRadius={12} />
              <Skeleton width={60} height={22} borderRadius={12} />
            </div>
            <Skeleton width="80%" height={32} borderRadius={6} />
            <Skeleton width="40%" height={16} borderRadius={4} />
          </div>

          <div className="p-4 rounded-xl bg-[#24170F]/60 border border-[#5A351E] space-y-2">
            <Skeleton width="30%" height={12} />
            <Skeleton width="60%" height={26} borderRadius={6} />
          </div>

          <div className="space-y-2">
            <Skeleton width="40%" height={16} />
            <Skeleton count={3} height={14} borderRadius={4} />
          </div>

          <div className="pt-4 border-t border-[#5A351E] space-y-3">
            <Skeleton height={46} borderRadius={12} />
            <Skeleton height={46} borderRadius={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Admin Dashboard KPI Stats
 */
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl bg-[#4A2D1A] border border-[#5A351E] shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton width={70} height={14} borderRadius={4} />
            <Skeleton width={90} height={28} borderRadius={6} />
          </div>
          <div className="w-12 h-12 rounded-xl overflow-hidden">
            <Skeleton height="100%" borderRadius={12} />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for Admin Table Rows
 */
export function AdminTableRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-[#5A351E]/40">
          <td className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                <Skeleton height="100%" borderRadius={8} />
              </div>
              <div className="space-y-1.5 flex-1">
                <Skeleton width="70%" height={16} borderRadius={4} />
                <Skeleton width="40%" height={12} borderRadius={4} />
              </div>
            </div>
          </td>
          <td className="p-4 hidden sm:table-cell">
            <Skeleton width={80} height={16} borderRadius={6} />
          </td>
          <td className="p-4">
            <Skeleton width={60} height={20} borderRadius={12} />
          </td>
          <td className="p-4 hidden md:table-cell">
            <Skeleton width={70} height={16} borderRadius={4} />
          </td>
          <td className="p-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <Skeleton width={32} height={32} borderRadius={8} />
              <Skeleton width={32} height={32} borderRadius={8} />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

/**
 * Skeleton for Team Members Cards
 */
export function TeamMemberSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[#4A2D1A] rounded-2xl border border-[#5A351E] p-5 text-center flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
            <Skeleton circle height="100%" />
          </div>
          <Skeleton width={110} height={20} borderRadius={6} className="mb-1" />
          <Skeleton width={75} height={14} borderRadius={4} className="mb-3" />
          <Skeleton width="85%" height={12} count={2} borderRadius={4} />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
