import { Artwork, ArtistProfile } from '../types';

/**
 * Artworks catalog initialized with Tiny Realms NFT collection.
 * Additional NFTs can be created and managed via the Admin Panel.
 */
export const artworksData: Artwork[] = [
  {
    id: 'art_mirelle_tr001',
    code: 'TR-001',
    title: 'MIRELLE',
    description: 'MIRELLE - 1-of-1 Digital Anime Character Artwork from Tiny Realms.',
    image: '/characters/chibi_angel_girl.png',
    dimensions: '1920 x 1920 px',
    category: 'Digital Character',
    status: 'Available',
    published: true,
    collectionId: 'tiny_realms_s1',
    collection: 'Tiny Realms',
    year: 2026,
    nftUrl: 'https://xrp.cafe/id/nft/000813889FDDB303F4D190BF5716718781749FA510E4152',
    tags: ['anime', 'character', 'mirelle', 'tinyrealms', 'nft'],
    createdAt: '2026-10-05T08:22:00.000Z',
    updatedAt: '2026-10-05T08:22:00.000Z',
  },
];

export const artistProfileData: ArtistProfile = {
  name: 'AGIP',
  handle: '@agip_art',
  role: 'Digital Illustrator & Creator',
  bio: 'Exploring whimsical anime realms, storybook characters, and vibrant digital illustrations with rich narrative textures.',
  statement: 'Each character in Tiny Realms holds a quiet story waiting to be uncovered in everyday moments.',
  avatar: '',
  location: 'Indonesia / Digital Realms',
  socialLinks: [
    { label: 'X (Twitter)', url: 'https://x.com/hitoo_nft', platform: 'x' },
    { label: 'Instagram', url: 'https://instagram.com', platform: 'instagram' },
    { label: 'xrp.cafe', url: 'https://xrp.cafe/id/collection/tinyrealms', platform: 'website' },
  ],
  stats: [
    { label: 'Series', value: '1' },
    { label: 'Editions', value: '1-of-1' },
    { label: 'Chain', value: 'XRPL / Digital' },
  ],
};

export const artistProfile = artistProfileData;
