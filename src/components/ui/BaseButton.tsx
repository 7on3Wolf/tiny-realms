import React from 'react';

export type BaseButtonVariant =
  | 'primary'
  | 'secondary'
  | 'wood'
  | 'dark'
  | 'light'
  | 'accent'
  | 'gold'
  | 'outline'
  | 'ghost';

export interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual variant of the button:
   * - 'primary' / 'wood' (default): Rich Dark Oak Wood plaque with warm amber bevels and engraved highlights
   * - 'secondary' / 'light': Warm Honey/Birch Wood plaque
   * - 'accent' / 'gold': Polished Royal Gold Wood plaque with luminous edge
   * - 'dark': Ebony Deep Carved Wood
   * - 'outline': Carved Wooden Plank with inlaid gold border
   * - 'ghost': Minimal translucent wood plank
   * @default 'primary'
   */
  variant?: BaseButtonVariant;
  /**
   * Optional Icon element to display inside the button
   */
  icon?: React.ReactNode;
  /**
   * Position of the icon relative to text
   * @default 'right'
   */
  iconPosition?: 'left' | 'right';
  /**
   * Whether the button should stretch to full container width
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Size presets for natural width & padding
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Optional custom CSS class name
   */
  className?: string;
  /**
   * Dynamic button content (text, React nodes, etc.)
   */
  children?: React.ReactNode;
}

/**
 * Global Base Button Component (<BaseButton />)
 *
 * Distinctive, tactile carved wood plaque buttons with realistic grain gradients,
 * beveled top highlights, engraved bottom borders, and chisel letterpress shadows.
 */
export const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'right',
      fullWidth = false,
      className = '',
      type = 'button',
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    // Determine visual style variant - all designed as tactile carved wood plaques
    const variantClasses = {
      // 1. Classic Dark Oak Carved Wood Plaque (Default)
      primary:
        'bg-gradient-to-b from-[#7A4926] via-[#542F15] to-[#3A1D0B] text-[#F8EADA] border-t border-[#A86B3E] border-b-2 border-b-[#1C0D05] border-x border-[#48240D] shadow-[inset_0_1px_1px_rgba(255,210,140,0.35),inset_0_-1px_1px_rgba(0,0,0,0.5),0_3px_6px_rgba(0,0,0,0.35)] hover:from-[#8C532B] hover:via-[#613619] hover:to-[#45230E] hover:shadow-[inset_0_1px_1px_rgba(255,225,170,0.45),0_4px_10px_rgba(0,0,0,0.4)] active:from-[#3D1E0B] active:to-[#2A1306]',
      wood:
        'bg-gradient-to-b from-[#7A4926] via-[#542F15] to-[#3A1D0B] text-[#F8EADA] border-t border-[#A86B3E] border-b-2 border-b-[#1C0D05] border-x border-[#48240D] shadow-[inset_0_1px_1px_rgba(255,210,140,0.35),inset_0_-1px_1px_rgba(0,0,0,0.5),0_3px_6px_rgba(0,0,0,0.35)] hover:from-[#8C532B] hover:via-[#613619] hover:to-[#45230E] hover:shadow-[inset_0_1px_1px_rgba(255,225,170,0.45),0_4px_10px_rgba(0,0,0,0.4)] active:from-[#3D1E0B] active:to-[#2A1306]',

      // 2. Honey Birch / Warm Amber Wood Plaque
      secondary:
        'bg-gradient-to-b from-[#8C5D19] via-[#6E4210] to-[#4D2D09] text-[#FFE8C2] border-t border-[#D9A85C] border-b-2 border-b-[#261403] border-x border-[#5A350C] shadow-[inset_0_1px_1px_rgba(255,235,175,0.4),inset_0_-1px_1px_rgba(0,0,0,0.5),0_3px_6px_rgba(0,0,0,0.35)] hover:from-[#A06C1F] hover:via-[#7D4C13] hover:to-[#5A340B] hover:shadow-[inset_0_1px_1px_rgba(255,245,200,0.5),0_4px_10px_rgba(0,0,0,0.4)] active:from-[#3B1F05] active:to-[#241203]',
      light:
        'bg-gradient-to-b from-[#8C5D19] via-[#6E4210] to-[#4D2D09] text-[#FFE8C2] border-t border-[#D9A85C] border-b-2 border-b-[#261403] border-x border-[#5A350C] shadow-[inset_0_1px_1px_rgba(255,235,175,0.4),inset_0_-1px_1px_rgba(0,0,0,0.5),0_3px_6px_rgba(0,0,0,0.35)] hover:from-[#A06C1F] hover:via-[#7D4C13] hover:to-[#5A340B] active:from-[#3B1F05] active:to-[#241203]',

      // 3. Polished Royal Gold Wood Plaque
      accent:
        'bg-gradient-to-b from-[#A87220] via-[#855312] to-[#5C3607] text-[#FFF4D9] border-t border-[#F0CA78] border-b-2 border-b-[#291602] border-x border-[#6E420C] shadow-[inset_0_1px_1px_rgba(255,245,200,0.5),inset_0_-1px_1px_rgba(0,0,0,0.5),0_3px_8px_rgba(198,155,90,0.4)] hover:from-[#BA8027] hover:via-[#965E15] hover:to-[#6E4009] active:from-[#452504] active:to-[#2B1602]',
      gold:
        'bg-gradient-to-b from-[#A87220] via-[#855312] to-[#5C3607] text-[#FFF4D9] border-t border-[#F0CA78] border-b-2 border-b-[#291602] border-x border-[#6E420C] shadow-[inset_0_1px_1px_rgba(255,245,200,0.5),inset_0_-1px_1px_rgba(0,0,0,0.5),0_3px_8px_rgba(198,155,90,0.4)] hover:from-[#BA8027] hover:via-[#965E15] hover:to-[#6E4009] active:from-[#452504] active:to-[#2B1602]',

      // 4. Ebony Deep Carved Wood
      dark:
        'bg-gradient-to-b from-[#422513] via-[#2D170B] to-[#1C0D05] text-[#EAD8C3] border-t border-[#6B3F23] border-b-2 border-b-[#0D0502] border-x border-[#2A1408] shadow-[inset_0_1px_1px_rgba(255,200,140,0.25),inset_0_-1px_1px_rgba(0,0,0,0.6),0_3px_6px_rgba(0,0,0,0.45)] hover:from-[#502E18] hover:via-[#381D0F] hover:to-[#241107] active:from-[#180A04] active:to-[#0D0502]',

      // 5. Inlaid Wood Outline Plaque
      outline:
        'bg-[#3A1E0D]/60 backdrop-blur-xs text-[#F5EBDD] border-2 border-[#8C5D19] shadow-[inset_0_1px_1px_rgba(255,210,140,0.2),0_2px_6px_rgba(0,0,0,0.3)] hover:bg-[#522E14]/85 hover:border-[#C69B5A] hover:shadow-[0_3px_8px_rgba(0,0,0,0.4)] active:bg-[#2A1407]',

      // 6. Translucent Plank (Ghost)
      ghost:
        'bg-[#3A1E0D]/20 hover:bg-[#542F15]/60 text-[#F5EBDD] border border-transparent hover:border-[#7A4926]/60 active:bg-[#2A1407]',
    }[variant] || 'bg-gradient-to-b from-[#7A4926] via-[#542F15] to-[#3A1D0B] text-[#F8EADA] border-t border-[#A86B3E] border-b-2 border-b-[#1C0D05] border-x border-[#48240D]';

    // Size presets
    const sizeClasses = {
      sm: 'px-4 py-1.5 text-xs rounded-xl gap-1.5 min-h-[34px]',
      md: 'px-5 py-2 text-xs sm:text-sm rounded-xl gap-2 min-h-[40px]',
      lg: 'px-6 py-2.5 text-sm sm:text-base rounded-2xl gap-2.5 min-h-[46px]',
    }[size];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center font-hero-title font-bold uppercase tracking-wider
          transition-all duration-150 ease-out select-none cursor-pointer whitespace-nowrap
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B5A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C120B]
          ${fullWidth ? 'w-full' : 'w-auto'}
          ${sizeClasses}
          ${variantClasses}
          ${
            disabled
              ? 'opacity-50 cursor-not-allowed pointer-events-none shadow-none filter grayscale'
              : 'active:scale-[0.98]'
          }
          ${className}
        `.trim()}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <span className="inline-flex shrink-0 items-center justify-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{icon}</span>
        )}
        {children && <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{children}</span>}
        {icon && iconPosition === 'right' && (
          <span className="inline-flex shrink-0 items-center justify-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{icon}</span>
        )}
      </button>
    );
  }
);

BaseButton.displayName = 'BaseButton';

export default BaseButton;
