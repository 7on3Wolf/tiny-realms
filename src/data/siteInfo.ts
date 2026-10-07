export interface PublicSaleConfig {
  date: string | null;
  time: string | null;
  status: 'Upcoming' | 'Ongoing' | 'Ended';
  platform?: string;
  notes?: string;
}

export interface OngoingEventConfig {
  status: 'active' | 'none';
  title?: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

export interface PriceRangeConfig {
  from: string | null;
  to: string | null;
  currency: string;
  isAnnounced: boolean;
  notes?: string;
  floor?: string | null;
  ceiling?: string | null;
}

export interface SiteInfoConfig {
  label: string;
  title: string;
  tagline: string;
  description: string;
  aboutText: string[];
  publicSale: PublicSaleConfig;
  ongoing: OngoingEventConfig;
  priceRange: PriceRangeConfig;
}

export const siteInfo: SiteInfoConfig = {
  label: 'INFO',
  title: 'TINY REALMS',
  tagline: 'Small world. Big imagination.',
  description:
    'I’m one of the two people behind Tiny Realms, and I’m from Indonesia. Tiny Realms is a project built by two people who share the same passion for creating and bringing cute characters to life on the XRP Ledger.',
  aboutText: [
    'I’m one of the two people behind Tiny Realms, and I’m from Indonesia. Tiny Realms is actually a project built by two people who share the same passion for creating and bringing cute characters to life.',
    'I discovered XRP and XRPL around 2 years ago, more or less. At first, I was simply curious and wanted to learn more about the XRPL space. Over time, I found the community and started creating and sharing my own artwork here.',
    'That’s where Tiny Realms started to grow.',
    'Tiny Realms began with a simple idea: creating cute little characters, giving each one their own personality and theme, and sharing them with people who enjoy the art.',
    'Most of the characters you see are hand-drawn by me. I really enjoy drawing every day, experimenting with different themes, outfits, characters, and little stories. Sometimes I just get an idea in my head and start drawing it.',
    'Behind Tiny Realms, there are two of us working together. We each have our own part in the project, and we’re slowly building Tiny Realms together, one idea at a time.',
    'There’s still a lot we want to explore — more characters, more stories, more creative ideas, and hopefully more ways to involve the people who support us.',
    'We’re still learning and growing, especially since we’re relatively new to the XRPL space. But we’re truly grateful to everyone who has supported Tiny Realms along the way.',
    'Thank you for being part of our journey.',
    'This is only the beginning.'
  ],
  publicSale: {
    date: null,
    time: null,
    status: 'Upcoming',
    platform: 'xrp.cafe',
    notes: 'Schedule will be announced.'
  },
  ongoing: {
    status: 'none',
    title: undefined,
    startDate: null,
    endDate: null,
    description: 'No ongoing public event.'
  },
  priceRange: {
    from: null,
    to: null,
    currency: 'XRP',
    isAnnounced: false,
    notes: 'Price information will be announced.'
  }
};
