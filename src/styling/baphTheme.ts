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

// Typography system
export const baphTypography = {
  fontFamily: {
    primary: '"Montserrat", sans-serif',
    fallback: 'system-ui, -apple-system, sans-serif'
  },

  // Font weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },

  // Font sizes
  fontSize: {
    xs: '12px', // 0.75rem
    sm: '14px', // 0.875rem
    base: '16px', // 1rem
    lg: '18px', // 1.125rem
    xl: '20px', // 1.25rem
    '2xl': '24px', // 1.5rem
    '3xl': '30px', // 1.875rem
    '4xl': '36px', // 2.25rem
    '5xl': '48px', // 3rem
    '6xl': '60px', // 3.75rem
    '7xl': '72px' // 4.5rem
  },

  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  },

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

    // UI Elements
    menu: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '16px',
      fontWeight: 600, // semibold
      lineHeight: 1.5,
      letterSpacing: 'normal'
    },
    button: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '16px',
      fontWeight: 400, // regular
      lineHeight: 1,
      letterSpacing: '0.025em'
    },
    buttonSmall: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '14px',
      fontWeight: 400, // regular
      lineHeight: 1,
      letterSpacing: '0.025em'
    },
    buttonLarge: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '18px',
      fontWeight: 400, // regular
      lineHeight: 1,
      letterSpacing: '0.025em'
    },

    // Labels and captions
    label: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '14px',
      fontWeight: 500, // medium
      lineHeight: 1.25,
      letterSpacing: '0.025em'
    },
    caption: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.25,
      letterSpacing: '0.025em'
    },

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
      background: baphColors.secondary,
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
    }
  }
};

export const baphTheme = {
  colors: baphColors,
  variations: baphColorVariations,
  semantic: baphSemanticColors,
  typography: baphTypography,
  button: ({ kind }: { kind?: string; size?: string; iconOnly?: boolean }) => {
    if (kind === 'ghostOnDark') {
      return {
        color: baphSemanticColors.button.ghostOnDark.text,
        '&:hover': {
          backgroundColor: baphSemanticColors.button.ghostOnDark.hover
        },
        '&:active': {
          backgroundColor: baphSemanticColors.button.ghostOnDark.active
        }
      };
    }
    return {};
  }
};
