import chibiAngelGirl from '../assets/images/characters/chibi_angel_girl.png';
import liebePortraitImg from '../assets/images/agip_team_portrait_1791132720649.jpg';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  handle: string;
  avatar: string;
  bio: string;
  contributions: string[];
  socialLinks?: {
    label: string;
    url: string;
  }[];
}

export const teamMembers: TeamMember[] = [
  {
    id: 'agip',
    name: 'AGIP',
    role: 'Artist & Creator / Owner',
    handle: '@agip_art',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Visual artist and creator behind the Tiny Realms character collection, digital illustrations, and hand-drawn character designs.',
    contributions: ['Character Design', 'Digital Illustration', 'Art Direction', 'Visual Identity'],
    socialLinks: [
      { label: 'xrp.cafe', url: 'https://xrp.cafe/id/collection/tinyrealms' },
      { label: 'X', url: 'https://x.com/hitoo_nft' },
      { label: 'Instagram', url: 'https://instagram.com' }
    ]
  },
  {
    id: 'liebe',
    name: 'LIEBE',
    role: 'Web Developer',
    handle: '@liebe_dev',
    avatar: liebePortraitImg,
    bio: 'Web developer and engineer building the Tiny Realms digital gallery, interactive web platform, on-chain integrations, and responsive user experiences.',
    contributions: ['Web Development', 'Frontend Architecture', 'Interactive Gallery', 'XRPL Integration'],
    socialLinks: [
      { label: 'GitHub', url: 'https://github.com' },
      { label: 'X', url: 'https://x.com/hitoo_nft' }
    ]
  },
  {
    id: 'kiko',
    name: 'KIKO',
    role: 'Visual Artist & Creator',
    handle: '@kiko_realms',
    avatar: chibiAngelGirl,
    bio: 'Visual artist and creator behind the Tiny Realms character collection, digital illustrations, and character designs.',
    contributions: ['Character Design', 'Digital Illustration', 'Visual Art', 'Creative Direction'],
    socialLinks: [
      { label: 'Discord', url: 'https://discord.com' },
      { label: 'X', url: 'https://x.com/hitoo_nft' }
    ]
  }
];
