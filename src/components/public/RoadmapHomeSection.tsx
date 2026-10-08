import React from "react";

import bamboruImg from "../../assets/images/characters/bamboru.png";
import kumoImg from "../../assets/images/characters/kumo.png";
import brunkoImg from "../../assets/images/characters/brunko.png";
import kumo2Img from "../../assets/images/characters/kumo2.png";

import { BaseCard, CardImage } from "../ui/BaseCard";
import SectionHeader from "../common/SectionHeader";

interface RoadmapItem {
  milestone: string;
  image: string;
  characterNumber: number;
}

const roadmapItems: RoadmapItem[] = [
  {
    milestone: "50 MINTED",
    image: bamboruImg,
    characterNumber: 1,
  },
  {
    milestone: "100 MINTED",
    image: kumoImg,
    characterNumber: 2,
  },
  {
    milestone: "150 MINTED",
    image: brunkoImg,
    characterNumber: 3,
  },
  {
    milestone: "200 MINTED",
    image: kumo2Img,
    characterNumber: 4,
  },
];

/* =========================================================
   LOCK ICON
========================================================= */

const LockIcon: React.FC = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
      aria-hidden="true"
    >
      <path
        d="M7 10V7.5C7 4.46 9.24 2 12 2s5 2.46 5 5.5V10"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      <rect x="4.5" y="9" width="15" height="12" rx="2.5" fill="currentColor" />

      <circle cx="12" cy="15" r="1.5" fill="#E8D3A9" />

      <path
        d="M12 16.5V18"
        stroke="#E8D3A9"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

/* =========================================================
   ROADMAP CARD
========================================================= */

interface RoadmapCardProps {
  item: RoadmapItem;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ item }) => {
  return (
    <div
      className="
        group
        w-full
        max-w-[260px]
        sm:max-w-[285px]
        lg:max-w-[245px]
        xl:max-w-[265px]
      "
    >
      {/* Portrait Wrapper */}
      <div className="w-full aspect-[3/4]">
        <BaseCard
          aspectRatio="square"
          className="
            w-full
            h-full
            overflow-hidden
            transition-all
            duration-300
            group-hover:-translate-y-1
            group-hover:shadow-[0_16px_30px_rgba(0,0,0,0.38)]
          "
          contentClassName="
            relative
            w-full
            h-full
            p-3
            sm:p-4
            lg:p-4
            flex
            flex-col
            items-center
          "
        >
          {/* =================================================
              HEADER
          ================================================== */}

          <div
            className="
              relative
              z-20
              w-full
              shrink-0
              flex
              flex-col
              items-center
            "
          >
            {/* Milestone */}
            <div className="flex justify-center w-full">
              <div
                className="
                  inline-flex
                  items-center
                  justify-center
                  min-w-[135px]
                  sm:min-w-[150px]
                  px-4
                  py-1.5
                  bg-[#3A251A]
                  text-[#F8EEDB]
                  font-mono
                  font-bold
                  text-[10px]
                  sm:text-xs
                  tracking-[0.08em]
                  uppercase
                  shadow-[0_3px_5px_rgba(0,0,0,0.22)]
                "
              >
                {item.milestone}
              </div>
            </div>

            {/* Character Number */}
            <div
              className="
                flex
                items-center
                justify-center
                gap-2
                mt-3
                sm:mt-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-center
                  w-7
                  h-7
                  sm:w-8
                  sm:h-8
                  rounded-md
                  bg-[#382219]
                  text-[#F4E7CF]
                  shadow-[0_2px_3px_rgba(0,0,0,0.2)]
                  shrink-0
                "
              >
                <LockIcon />
              </div>

              <span
                className="
                  font-serif
                  font-bold
                  text-[#332017]
                  text-sm
                  sm:text-base
                  lg:text-[17px]
                  tracking-tight
                  whitespace-nowrap
                "
              >
                CHARACTER #{item.characterNumber}
              </span>
            </div>
          </div>

          {/* =================================================
              LARGE ARTWORK AREA
          ================================================== */}

          <div
            className="
              relative
              flex-1
              min-h-0
              w-full
              flex
              items-end
              justify-center
              mt-1
              sm:mt-2
              mb-0
              overflow-visible
            "
          >
            {/* Ground Shadow */}
            <div
              className="
                absolute
                bottom-2
                left-1/2
                -translate-x-1/2
                w-[68%]
                h-4
                rounded-full
                bg-[#4A2E1B]/20
                blur-md
                z-0
              "
              aria-hidden="true"
            />

            {/* Artwork */}
            <div
              className="
                relative
                z-10
                w-[118%]
                h-[118%]
                max-w-none
                flex
                items-end
                justify-center
                origin-bottom
              "
            >
              <CardImage
                src={item.image}
                alt={`Tiny Realms Character #${item.characterNumber}`}
                skeletonBorderRadius={10}
                className="
                  w-full
                  h-full
                  max-w-none
                  object-contain
                  select-none
                  pointer-events-none
                  filter
                  drop-shadow-[0_10px_12px_rgba(49,28,17,0.25)]
                  transition-transform
                  duration-500
                  group-hover:scale-[1.035]
                "
              />
            </div>
          </div>

          {/* =================================================
              BOTTOM DECORATION
          ================================================== */}

          <div
            className="
              relative
              z-20
              shrink-0
              flex
              justify-center
              pt-0
            "
          >
            <span
              className="
                block
                w-10
                sm:w-12
                h-[2px]
                rounded-full
                bg-[#806044]/40
              "
              aria-hidden="true"
            />
          </div>
        </BaseCard>
      </div>
    </div>
  );
};

/* =========================================================
   DESKTOP CONNECTOR
========================================================= */

const DesktopConnector: React.FC = () => {
  return (
    <div
      className="
        shrink-0
        flex
        items-center
        justify-center
        px-0.5
        xl:px-1
        pointer-events-none
      "
    >
      <svg
        className="w-5 h-5 xl:w-6 xl:h-6 text-[#C69B5A]/70"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M9 5l7 7-7 7"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

/* =========================================================
   MOBILE CONNECTOR
========================================================= */

const MobileDownArrow: React.FC = () => {
  return (
    <div
      className="
        flex
        justify-center
        items-center
        py-1.5
        pointer-events-none
      "
    >
      <svg
        className="w-4 h-4 text-[#C69B5A]/70 rotate-90"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M9 5l7 7-7 7"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

/* =========================================================
   FUTURE CARD
========================================================= */

const FutureCard: React.FC = () => {
  return (
    <div
      className="
        group
        w-full
        max-w-[260px]
        sm:max-w-[285px]
        lg:max-w-[245px]
        xl:max-w-[265px]
      "
    >
      <div className="w-full aspect-[3/4]">
        <BaseCard
          aspectRatio="square"
          className="
            w-full
            h-full
            overflow-hidden
            transition-all
            duration-300
            group-hover:-translate-y-1
            group-hover:shadow-[0_16px_30px_rgba(0,0,0,0.38)]
          "
          contentClassName="
            w-full
            h-full
            p-4
            flex
            flex-col
            items-center
            justify-center
            text-center
          "
        >
          {/* Continues */}
          <div
            className="
              inline-flex
              items-center
              justify-center
              px-5
              py-1.5
              bg-[#3A251A]
              text-[#F8EEDB]
              font-mono
              font-bold
              text-[10px]
              sm:text-xs
              tracking-[0.08em]
              uppercase
              shadow-[0_3px_5px_rgba(0,0,0,0.22)]
            "
          >
            CONTINUES
          </div>

          {/* Future */}
          <div
            className="
              flex
              flex-1
              flex-col
              items-center
              justify-center
            "
          >
            <span
              className="
                text-5xl
                sm:text-6xl
                text-[#8C5D19]
                font-serif
                leading-none
              "
            >
              ✦
            </span>

            <span
              className="
                mt-3
                font-mono
                text-[9px]
                sm:text-[10px]
                text-[#5A351E]
                tracking-[0.2em]
                uppercase
                font-bold
              "
            >
              FUTURE REALMS
            </span>
          </div>
        </BaseCard>
      </div>
    </div>
  );
};

/* =========================================================
   ROADMAP HOME SECTION
========================================================= */

export const RoadmapHomeSection: React.FC = () => {
  return (
    <section
      id="roadmap"
      className="
        w-full
        min-h-[100svh]
        bg-[#24170F]
        text-[#F5EBDD]
        snap-start
        snap-always
        flex
        flex-col
        justify-center
        py-8
        sm:py-10
        lg:py-12
        relative
        scroll-mt-12
        sm:scroll-mt-14
      "
      aria-label="Tiny Realms Roadmap Section"
    >
      {/* Background Glow */}
      <div
        className="
          absolute
          inset-0
          pointer-events-none
          select-none
          opacity-20
        "
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(198, 155, 90, 0.18), transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Main Container */}
      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          xl:px-10
          w-full
          relative
          z-10
        "
      >
        <div
          className="
            w-full
            bg-[#4E4B47]/95
            border
            border-[#696866]/50
            rounded-3xl
            p-5
            sm:p-7
            lg:p-9
            shadow-[0_20px_50px_rgba(10,5,2,0.55)]
            backdrop-blur-sm
          "
        >
          {/* Section Header */}
          <SectionHeader
            eyebrow="MILESTONES & JOURNEY"
            title="ROADMAP"
            subtitle="A visual progression of characters and lore unlocking as the collection expands."
            variant="dark"
            className="mb-5 sm:mb-7 lg:mb-9"
          />

          {/* =================================================
              DESKTOP ROADMAP
          ================================================== */}

          <div
            className="
              hidden
              lg:flex
              items-center
              justify-center
              w-full
              gap-1
              xl:gap-2
            "
          >
            {roadmapItems.map((item) => (
              <React.Fragment key={item.milestone}>
                <div className="flex-1 flex justify-center min-w-0">
                  <RoadmapCard item={item} />
                </div>

                <DesktopConnector />
              </React.Fragment>
            ))}

            {/* Future Card */}
            <div className="flex-1 flex justify-center min-w-0">
              <FutureCard />
            </div>
          </div>

          {/* =================================================
              MOBILE / TABLET ROADMAP
          ================================================== */}

          <div
            className="
              lg:hidden
              flex
              flex-col
              items-center
              w-full
            "
          >
            {roadmapItems.map((item) => (
              <React.Fragment key={`mobile-${item.milestone}`}>
                <RoadmapCard item={item} />

                <MobileDownArrow />
              </React.Fragment>
            ))}

            {/* Future Card */}
            <FutureCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapHomeSection;
