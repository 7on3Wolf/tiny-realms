import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlus } from 'react-icons/fi';
import { Artwork } from '../types';
import { BaseCard, CardMedia, CardTitle, CardAction } from './ui/BaseCard';
import BaseButton from './ui/BaseButton';

export interface ArtworkCardProps {
  artwork?: Artwork;
  title?: string;
  id?: string;
  status?: 'available' | 'sold_out' | 'coming_soon';
  variant?: string;
  showActions?: boolean;
}

/**
 * Global Base Artwork Card
 *
 * Implements the 3-element spec using global BaseCard:
 * 1. SLOT GAMBAR (Empty clean 1:1 image slot ready for future images)
 * 2. JUDUL (Carved chiseled calligraphy ink title)
 * 3. BASE BUTTON (Carved wooden button)
 */
export default function ArtworkCard({
  artwork,
  title,
  id,
  status = 'available',
}: ArtworkCardProps) {
  const cardId = artwork?.id || id || 'preview';
  const cardTitle = artwork?.title || title || 'Artwork Title';
  const cardStatus = (
    artwork?.status === 'Sold'
      ? 'sold_out'
      : artwork?.status === 'Reserved'
      ? 'coming_soon'
      : status
  ) as 'available' | 'sold_out' | 'coming_soon';

  const buttonText =
    cardStatus === 'sold_out'
      ? 'Sold Out'
      : cardStatus === 'coming_soon'
      ? 'Reserved'
      : 'View';

  return (
    <BaseCard
      id={`artwork-card-${cardId}`}
      interactive
      status={cardStatus}
      className="group w-full"
    >
      {/* 1. SLOT GAMBAR (Seamless transparent artwork blending with parchment) */}
      <Link
        to={`/artwork/${cardId}`}
        className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C5D19] border-0 bg-transparent"
        aria-label={`View ${cardTitle}`}
      >
        <CardMedia
          src={artwork?.image}
          alt={cardTitle}
          status={cardStatus}
        />
      </Link>

      {/* 2. JUDUL (Chiseled Ink Engraved Title) */}
      <Link
        to={`/artwork/${cardId}`}
        className="block focus:outline-none w-full"
      >
        <CardTitle title={cardTitle} status={cardStatus} />
      </Link>

      {/* 3. BASE BUTTON (Carved Wooden Plaque Button) */}
      <CardAction className="mt-auto pt-1 pb-1">
        <Link to={`/artwork/${cardId}`} className="inline-flex justify-center focus:outline-none">
          <BaseButton
            variant="wood"
            size="sm"
            icon={<FiArrowRight className="w-3.5 h-3.5 text-[#FFE3B3]" />}
            iconPosition="right"
            disabled={cardStatus === 'sold_out'}
            aria-label={`View details for ${cardTitle}`}
          >
            {buttonText}
          </BaseButton>
        </Link>
      </CardAction>
    </BaseCard>
  );
}
