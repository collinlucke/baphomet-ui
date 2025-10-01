import { baseColors } from 'phantomartist';

export const baphColors = {
  primary: '#0B1828',
  secondary: '#146B68',
  tertiary: '#BFA081',
  accent: '#9F0001',
  quaternary: '#012c35',
  lightText: '#FFFFFF',
  darkText: '#040A0C',
  headerBackground: '#146B68'
};

// Color variations and tints
export const baphColorVariations = {
  primary: {
    50: '#F0F2F5', // Very light blue-gray
    100: '#D9DEE6', // Light blue-gray
    200: '#B8C3D1', // Medium-light blue-gray
    300: '#8A9BAE', // Medium blue-gray
    400: '#4A5F7A', // Dark blue-gray
    500: '#0B1828', // Base primary
    600: '#081320', // Darker primary
    700: '#060E18', // Very dark primary
    800: '#04090F', // Almost black
    900: '#020407' // Nearly black
  },
  secondary: {
    50: '#E6F7F6', // Very light teal
    100: '#B3E8E5', // Light teal
    200: '#80D9D4', // Medium-light teal
    300: '#4DCAC3', // Medium teal
    400: '#2AA39B', // Dark teal
    500: '#146B68', // Base secondary (darker for better contrast)
    600: '#125A57', // Darker secondary
    700: '#0F4A47', // Very dark teal
    800: '#0C3835', // Almost black teal
    900: '#081F1C' // Nearly black teal
  },
  tertiary: {
    50: '#F7F4F0', // Very light beige
    100: '#EEDECC', // Light beige
    200: '#E5C8A8', // Medium-light beige
    300: '#DCB184', // Medium beige
    400: '#D19B60', // Dark beige
    500: '#BFA081', // Base tertiary
    600: '#A68965', // Darker tertiary
    700: '#7D6748', // Very dark beige
    800: '#54442C', // Almost brown
    900: '#2B2216' // Nearly black brown
  },
  accent: {
    50: '#FEE6E6', // Very light red
    100: '#FBB3B3', // Light red
    200: '#F88080', // Medium-light red
    300: '#F54D4D', // Medium red
    400: '#F21A1A', // Bright red
    500: '#9F0001', // Base accent
    600: '#800001', // Darker accent
    700: '#600001', // Very dark red
    800: '#400000', // Almost black red
    900: '#200000' // Nearly black red
  }
};

// Additional bright and vibrant colors
export const baphVibrantColors = {
  primary: {
    300: '#8AB6FF', // Light vibrant blue
    500: '#4F86F7', // Base vibrant blue
    700: '#255AFF' // Dark vibrant blue
  },
  secondary: {
    300: '#75DAC7', // Light vibrant teal
    500: '#1ABC9C', // Base vibrant teal
    700: '#138F6E' // Dark vibrant teal
  },
  tertiary: {
    300: '#F7C873', // Light vibrant orange
    500: '#F39C12', // Base vibrant orange
    700: '#C9780E' // Dark vibrant orange
  },
  accent: {
    300: '#F48A6F', // Light vibrant red
    500: '#E74C3C', // Base vibrant red
    700: '#C0392B' // Dark vibrant red
  }
};

// Typography system - only app-specific styles
export const baphTypography = {
  // Predefined text styles
  styles: {
    // Headings
    h1: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '36px',
      fontWeight: 400, // regular
      lineHeight: 1.25,
      letterSpacing: '-0.025em'
    },
    h2: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '30px',
      fontWeight: 600, // semibold
      lineHeight: 1.25,
      letterSpacing: '-0.025em'
    },
    h3: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '24px',
      fontWeight: 600, // semibold
      lineHeight: 1.25,
      letterSpacing: 'normal'
    },
    h4: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '20px',
      fontWeight: 600, // semibold
      lineHeight: 1.25,
      letterSpacing: 'normal'
    },
    h5: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '18px',
      fontWeight: 600, // semibold
      lineHeight: 1.25,
      letterSpacing: 'normal'
    },
    h6: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '16px',
      fontWeight: 600, // semibold
      lineHeight: 1.25,
      letterSpacing: 'normal'
    },

    // Body text
    bodyLarge: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '18px',
      fontWeight: 400,
      lineHeight: 1.625,
      letterSpacing: 'normal'
    },
    body: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 'normal'
    },
    bodySmall: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 'normal'
    },

    // UI Elements - only custom styles not provided by phantomartist

    // Special styles
    hero: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '48px',
      fontWeight: 700, // bold
      lineHeight: 1.25,
      letterSpacing: '-0.025em'
    },
    subtitle: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '20px',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 'normal'
    },
    overline: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '12px',
      fontWeight: 600, // semibold
      lineHeight: 1,
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const
    }
  }
};

export const baphScrollbarStyles = {
  sbTrackColor: baseColors.secondary[400],
  sbThumbColor: baseColors.secondary[700],
  sbSize: '5px'
};

// Semantic color mappings
export const baphSemanticColors = {
  background: {
    primary: '#FFFFFF', // White background
    secondary: baphColorVariations.tertiary[50], // Very light beige
    tertiary: baphColorVariations.primary[50], // Very light blue-gray
    dark: baphColors.primary, // Dark blue-gray
    accent: baphColorVariations.accent[50] // Very light red
  },
  text: {
    primary: baphColors.primary, // Dark blue-gray
    secondary: baphColorVariations.primary[400], // Medium blue-gray
    light: baphColors.lightText, // Existing light text
    dark: baphColors.darkText, // Existing dark text
    accent: baphColors.accent, // Red accent
    onDark: '#FFFFFF' // White text on dark backgrounds
  },
  border: {
    light: baphColorVariations.primary[200], // Light blue-gray
    medium: baphColorVariations.primary[300], // Medium blue-gray
    dark: baphColors.primary, // Dark blue-gray
    accent: baphColors.accent // Red accent
  },
  button: {
    primary: {
      background: baphColors.primary,
      text: '#FFFFFF',
      hover: baphColorVariations.secondary[600],
      active: baphColorVariations.secondary[700]
    },
    secondary: {
      background: baphColors.tertiary,
      text: baphColors.primary,
      hover: baphColorVariations.tertiary[600],
      active: baphColorVariations.tertiary[700]
    },
    accent: {
      background: baphColors.accent,
      text: '#FFFFFF',
      hover: baphColorVariations.accent[600],
      active: baphColorVariations.accent[700]
    },
    ghost: {
      background: 'transparent',
      text: baphColors.secondary,
      hover: baphColorVariations.secondary[50],
      active: baphColorVariations.secondary[100]
    },
    ghostOnDark: {
      background: 'transparent',
      text: baphColors.lightText,
      hover: 'rgba(255, 255, 255, 0.1)',
      active: 'rgba(255, 255, 255, 0.2)'
    },
    outline: {
      background: 'transparent',
      text: baphColors.secondary,
      border: `1px solid ${baphColors.secondary}`
    }
  }
};

export const baphTheme = {
  colors: baphColors,
  variations: baphColorVariations,
  semantic: baphSemanticColors,
  typography: baphTypography,
  button: ({ variant }: { variant?: string }) => {
    const btn = baphSemanticColors.button;
    // Only return color-related styles, let baseTheme handle the rest
    return variant
      ? {
          primary: {
            backgroundColor: btn.primary.background,
            color: btn.primary.text,
            '&:hover': { backgroundColor: btn.primary.hover },
            '&:active': { backgroundColor: btn.primary.active }
          },
          secondary: {
            backgroundColor: btn.secondary.background,
            color: btn.secondary.text,
            '&:hover': { backgroundColor: btn.secondary.hover },
            '&:active': { backgroundColor: btn.secondary.active }
          },
          accent: {
            backgroundColor: btn.accent.background,
            color: btn.accent.text,
            '&:hover': { backgroundColor: btn.accent.hover },
            '&:active': { backgroundColor: btn.accent.active }
          },
          ghost: {
            backgroundColor: btn.ghost.background,
            color: btn.ghost.text,
            '&:hover': { backgroundColor: btn.ghost.hover },
            '&:active': { backgroundColor: btn.ghost.active }
          },
          ghostOnDark: {
            backgroundColor: btn.ghostOnDark.background,
            color: btn.ghostOnDark.text,
            '&:hover': { backgroundColor: btn.ghostOnDark.hover },
            '&:active': { backgroundColor: btn.ghostOnDark.active }
          },
          outline: {
            backgroundColor: 'transparent',
            color: btn.secondary.text,
            border: `1px solid white`
            // border: `1px solid ${btn.secondary.text}`
          }
        }[variant]
      : {};
  }
};
