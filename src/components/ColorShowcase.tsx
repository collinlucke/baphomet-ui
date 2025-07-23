import React from 'react';
import {
  baphColors,
  baphColorVariations,
  baphSemanticColors,
  baphTypography
} from '../styling/baphTheme';
import { Button } from '@collinlucke/phantomartist';

export const StylesShowcase: React.FC = () => {
  return (
    <div css={styles.container}>
      <h1 css={styles.title}>Baphomet Design System</h1>

      {/* Typography Section */}
      <section css={styles.section}>
        <h2 css={styles.sectionTitle}>Typography</h2>
        <div css={styles.typographyGrid}>
          <div css={styles.typographyCard}>
            <h3 css={styles.cardTitle}>Headings</h3>
            <div css={styles.typographySamples}>
              <h1 css={baphTypography.styles.h1}>
                h1 - Heading 1 - 36px Regular
              </h1>
              <h2 css={baphTypography.styles.h2}>
                h2 - Heading 2 - 30px Semibold
              </h2>
              <h3 css={baphTypography.styles.h3}>
                h3 - Heading 3 - 24px Semibold
              </h3>
              <h4 css={baphTypography.styles.h4}>
                h4 - Heading 4 - 20px Semibold
              </h4>
              <h5 css={baphTypography.styles.h5}>
                h5 - Heading 5 - 18px Semibold
              </h5>
              <h6 css={baphTypography.styles.h6}>
                h6 - Heading 6 - 16px Semibold
              </h6>
            </div>
          </div>

          <div css={styles.typographyCard}>
            <h3 css={styles.cardTitle}>Body Text</h3>
            <div css={styles.typographySamples}>
              <p css={baphTypography.styles.bodyLarge}>
                bodyLarge - Body Large - 18px Regular with relaxed line height
                for better readability in longer form content.
              </p>
              <p css={baphTypography.styles.body}>
                body - Body - 16px Regular with normal line height. This is the
                standard body text used throughout the application.
              </p>
              <p css={baphTypography.styles.bodySmall}>
                bodySmall - Body Small - 14px Regular with normal line height
                for secondary content and captions.
              </p>
            </div>
          </div>

          <div css={styles.typographyCard}>
            <h3 css={styles.cardTitle}>UI Elements</h3>
            <div css={styles.typographySamples}>
              <div css={baphTypography.styles.menu}>
                menu - Menu Text - 16px Semibold
              </div>
              <div css={baphTypography.styles.button}>
                button - Button Text - 16px Regular
              </div>
              <div css={baphTypography.styles.buttonSmall}>
                buttonSmall - Button Small - 14px Regular
              </div>
              <div css={baphTypography.styles.buttonLarge}>
                buttonLarge - Button Large - 18px Regular
              </div>
              <div css={baphTypography.styles.label}>
                label - Label - 14px Medium
              </div>
              <div css={baphTypography.styles.caption}>
                caption - Caption - 12px Regular
              </div>
            </div>
          </div>

          <div css={styles.typographyCard}>
            <h3 css={styles.cardTitle}>Special Styles</h3>
            <div css={styles.typographySamples}>
              <div css={baphTypography.styles.hero}>
                hero - Hero - 48px Bold
              </div>
              <div css={baphTypography.styles.subtitle}>
                subtitle - Subtitle - 20px Regular
              </div>
              <div css={baphTypography.styles.overline}>
                overline - Overline - 12px Semibold Uppercase
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Colors */}
      <section css={styles.section}>
        <h2 css={styles.sectionTitle}>Color Palette</h2>
        <div css={styles.colorGrid}>
          <div css={styles.colorCard}>
            <div
              css={[
                styles.colorSwatch,
                { backgroundColor: baphColors.primary }
              ]}
            />
            <h3 css={styles.colorName}>Primary</h3>
            <p css={styles.colorValue}>{baphColors.primary}</p>
            <p css={styles.colorDescription}>Main UI elements, text, borders</p>
          </div>

          <div css={styles.colorCard}>
            <div
              css={[
                styles.colorSwatch,
                { backgroundColor: baphColors.secondary }
              ]}
            />
            <h3 css={styles.colorName}>Secondary</h3>
            <p css={styles.colorValue}>{baphColors.secondary}</p>
            <p css={styles.colorDescription}>Headers, buttons, highlights</p>
          </div>

          <div css={styles.colorCard}>
            <div
              css={[
                styles.colorSwatch,
                { backgroundColor: baphColors.tertiary }
              ]}
            />
            <h3 css={styles.colorName}>Tertiary</h3>
            <p css={styles.colorValue}>{baphColors.tertiary}</p>
            <p css={styles.colorDescription}>Backgrounds, subtle elements</p>
          </div>

          <div css={styles.colorCard}>
            <div
              css={[styles.colorSwatch, { backgroundColor: baphColors.accent }]}
            />
            <h3 css={styles.colorName}>Accent</h3>
            <p css={styles.colorValue}>{baphColors.accent}</p>
            <p css={styles.colorDescription}>CTAs, alerts, emphasis</p>
          </div>
        </div>
      </section>

      {/* Color Variations */}
      <section css={styles.section}>
        <h2 css={styles.sectionTitle}>Color Variations</h2>
        <div css={styles.variationsGrid}>
          {Object.entries(baphColorVariations).map(
            ([colorName, variations]) => (
              <div key={colorName} css={styles.variationGroup}>
                <h3 css={styles.variationTitle}>
                  {colorName.charAt(0).toUpperCase() + colorName.slice(1)}
                </h3>
                <div css={styles.variationSwatches}>
                  {Object.entries(variations).map(([weight, color]) => (
                    <div key={weight} css={styles.variationSwatch}>
                      <div
                        css={[styles.smallSwatch, { backgroundColor: color }]}
                      />
                      <span css={styles.weightLabel}>{weight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Semantic Colors Demo */}
      <section css={styles.section}>
        <h2 css={styles.sectionTitle}>Button System</h2>
        <div css={styles.semanticDemo}>
          {/* Button Kinds */}
          <div css={styles.buttonDemoGroup}>
            <h3 css={styles.demoGroupTitle}>Button Kinds</h3>
            <div css={styles.buttonGroup}>
              <Button kind="primary">Primary Button</Button>
              <Button kind="secondary">Secondary Button</Button>
              <Button kind="tertiary">Tertiary Button</Button>
              <Button kind="ghost">Ghost Button</Button>
            </div>
          </div>

          {/* Button Sizes */}
          <div css={styles.buttonDemoGroup}>
            <h3 css={styles.demoGroupTitle}>Button Sizes</h3>
            <div css={styles.buttonSizeGroup}>
              <div css={styles.sizeDemo}>
                <span css={styles.sizeLabel}>Small</span>
                <div css={styles.buttonGroup}>
                  <Button kind="primary" size="small">
                    Primary Small
                  </Button>
                  <Button kind="secondary" size="small">
                    Secondary Small
                  </Button>
                  <Button kind="ghost" size="small">
                    Ghost Small
                  </Button>
                </div>
              </div>

              <div css={styles.sizeDemo}>
                <span css={styles.sizeLabel}>Medium</span>
                <div css={styles.buttonGroup}>
                  <Button kind="primary" size="medium">
                    Primary Medium
                  </Button>
                  <Button kind="secondary" size="medium">
                    Secondary Medium
                  </Button>
                  <Button kind="ghost" size="medium">
                    Ghost Medium
                  </Button>
                </div>
              </div>

              <div css={styles.sizeDemo}>
                <span css={styles.sizeLabel}>Large (Default)</span>
                <div css={styles.buttonGroup}>
                  <Button kind="primary" size="large">
                    Primary Large
                  </Button>
                  <Button kind="secondary" size="large">
                    Secondary Large
                  </Button>
                  <Button kind="ghost" size="large">
                    Ghost Large
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Icon Buttons */}
          <div css={styles.buttonDemoGroup}>
            <h3 css={styles.demoGroupTitle}>Icon Buttons</h3>
            <div css={styles.buttonGroup}>
              <Button kind="primary" iconOnly icon="→">
                Icon Only
              </Button>
              <Button kind="secondary" icon="★">
                With Icon
              </Button>
              <Button kind="ghost" icon="♦">
                Ghost + Icon
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Background Colors Demo */}
      <section css={styles.section}>
        <h2 css={styles.sectionTitle}>Background Colors</h2>
        <div css={styles.semanticDemo}>
          <div css={styles.backgroundDemo}>
            <div
              css={[
                styles.bgSample,
                { backgroundColor: baphSemanticColors.background.primary }
              ]}
            >
              <p css={{ color: baphSemanticColors.text.primary }}>
                Primary Background
              </p>
            </div>
            <div
              css={[
                styles.bgSample,
                { backgroundColor: baphSemanticColors.background.secondary }
              ]}
            >
              <p css={{ color: baphSemanticColors.text.primary }}>
                Secondary Background
              </p>
            </div>
            <div
              css={[
                styles.bgSample,
                { backgroundColor: baphSemanticColors.background.dark }
              ]}
            >
              <p css={{ color: baphSemanticColors.text.onDark }}>
                Dark Background
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: baphSemanticColors.background.primary
  },
  title: {
    ...baphTypography.styles.h1,
    color: baphSemanticColors.text.primary,
    textAlign: 'center' as const,
    marginBottom: '3rem'
  },
  section: {
    marginBottom: '4rem'
  },
  sectionTitle: {
    ...baphTypography.styles.h3,
    color: baphSemanticColors.text.primary,
    marginBottom: '2rem'
  },
  colorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem'
  },
  colorCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${baphSemanticColors.border.light}`,
    textAlign: 'center' as const
  },
  colorSwatch: {
    width: '100%',
    height: '100px',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: `1px solid ${baphSemanticColors.border.light}`
  },
  colorName: {
    ...baphTypography.styles.h5,
    color: baphSemanticColors.text.primary,
    margin: '0 0 0.5rem 0'
  },
  colorValue: {
    ...baphTypography.styles.body,
    color: baphSemanticColors.text.secondary,
    fontFamily: 'monospace',
    margin: '0 0 0.5rem 0'
  },
  colorDescription: {
    ...baphTypography.styles.bodySmall,
    color: baphSemanticColors.text.secondary,
    margin: 0,
    fontStyle: 'italic'
  },
  variationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  variationGroup: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${baphSemanticColors.border.light}`
  },
  variationTitle: {
    ...baphTypography.styles.h5,
    color: baphSemanticColors.text.primary,
    marginBottom: '1rem'
  },
  variationSwatches: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem'
  },
  variationSwatch: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.25rem'
  },
  smallSwatch: {
    width: '30px',
    height: '30px',
    borderRadius: '4px',
    border: `1px solid ${baphSemanticColors.border.light}`
  },
  weightLabel: {
    ...baphTypography.styles.caption,
    color: baphSemanticColors.text.secondary
  },
  semanticDemo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap' as const
  },
  buttonDemoGroup: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${baphSemanticColors.border.light}`,
    marginBottom: '1rem'
  },
  demoGroupTitle: {
    ...baphTypography.styles.h4,
    color: baphSemanticColors.text.primary,
    marginBottom: '1.5rem',
    borderBottom: `2px solid ${baphSemanticColors.border.light}`,
    paddingBottom: '0.5rem'
  },
  buttonSizeGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem'
  },
  sizeDemo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem'
  },
  sizeLabel: {
    ...baphTypography.styles.label,
    color: baphSemanticColors.text.secondary,
    fontWeight: 600
  },
  backgroundDemo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  bgSample: {
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center' as const,
    border: `1px solid ${baphSemanticColors.border.light}`
  },
  typographyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem'
  },
  typographyCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${baphSemanticColors.border.light}`
  },
  cardTitle: {
    ...baphTypography.styles.h4,
    color: baphSemanticColors.text.primary,
    marginBottom: '1.5rem',
    borderBottom: `2px solid ${baphSemanticColors.border.light}`,
    paddingBottom: '0.5rem'
  },
  typographySamples: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem'
  }
};
