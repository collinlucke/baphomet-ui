/**
 * Baphomet-UI Accessibility Setup
 *
 * This file sets up contrast analysis for the Baphomet application
 * using PhantomArtist design system utilities.
 */

// import {
//   ScopedContrastAnalysis,
//   analyzeLiveComponent,
//   scanPageContrast
//   getContrastRatio,
//   checkWCAGCompliance
// } from 'phantomartist';
// import { baphColors } from '../styling/baphTheme';

// Define Baphomet-specific color combinations
// const baphometColorCombinations: ScopedContrastAnalysis.ColorCombination[] = [
//   // Header combinations
//   {
//     name: 'Header Logo',
//     fg: baphColors.lightText,
//     bg: baphColors.headerBackground,
//     component: 'Heading'
//   },
//   {
//     name: 'Header Navigation',
//     fg: baphColors.lightText,
//     bg: baphColors.headerBackground,
//     component: 'Heading'
//   },

//   // Button combinations
//   {
//     name: 'Primary Button',
//     fg: '#FFFFFF',
//     bg: baphColors.secondary,
//     component: 'Button'
//   },
//   {
//     name: 'Secondary Button',
//     fg: baphColors.secondary,
//     bg: '#FFFFFF',
//     component: 'Button'
//   },

//   // Home page combinations
//   {
//     name: 'Hero Text',
//     fg: baphColors.lightText,
//     bg: baphColors.primary,
//     component: 'HomePage'
//   },
//   {
//     name: 'Feature Icons',
//     fg: baphColors.secondary,
//     bg: '#FFFFFF',
//     component: 'HomePage'
//   },

//   // General text combinations
//   { name: 'Body Text', fg: '#333333', bg: '#FFFFFF', component: 'Global' },
//   {
//     name: 'Light Text',
//     fg: baphColors.lightText,
//     bg: baphColors.primary,
//     component: 'Global'
//   }
// ];

// Page-specific combinations
// const pageColorCombinations = {
//   home: [
//     {
//       name: 'Hero Background',
//       fg: baphColors.lightText,
//       bg: baphColors.primary,
//       component: 'HomePage'
//     },
//     {
//       name: 'Welcome Text',
//       fg: baphColors.lightText,
//       bg: baphColors.primary,
//       component: 'HomePage'
//     },
//     {
//       name: 'Feature Cards',
//       fg: '#333333',
//       bg: '#FFFFFF',
//       component: 'HomePage'
//     },
//     {
//       name: 'Feature Icons',
//       fg: baphColors.secondary,
//       bg: '#F5F5F5',
//       component: 'HomePage'
//     },
//     {
//       name: 'CTA Section',
//       fg: baphColors.lightText,
//       bg: baphColors.primary,
//       component: 'HomePage'
//     }
//   ],
//   login: [
//     {
//       name: 'Form Background',
//       fg: '#333333',
//       bg: '#FFFFFF',
//       component: 'LoginForm'
//     },
//     {
//       name: 'Input Labels',
//       fg: '#666666',
//       bg: '#FFFFFF',
//       component: 'LoginForm'
//     },
//     {
//       name: 'Login Button',
//       fg: '#FFFFFF',
//       bg: baphColors.secondary,
//       component: 'LoginForm'
//     }
//   ]
// };

// // Create browser console functions for Baphomet-UI
// const baphometAnalysis = ScopedContrastAnalysis.createConsoleAnalysisFunctions(
//   baphometColorCombinations
// );

// // Add Baphomet-specific analysis functions
// const analyzePage = (
//   pageName: string
// ): ScopedContrastAnalysis.AnalysisResult => {
//   const lowerPageName = pageName.toLowerCase();
//   const pageCombos =
//     pageColorCombinations[lowerPageName as keyof typeof pageColorCombinations];

//   if (!pageCombos) {
//     console.log(`No predefined color combinations found for ${pageName} page`);
//     console.log(
//       'Available pages:',
//       Object.keys(pageColorCombinations).join(', ')
//     );
//     return { total: 0, passing: 0, issues: [] };
//   }

//   return ScopedContrastAnalysis.analyzeColorCombinations(
//     pageCombos,
//     `${pageName} Page`
//   );
// };

// // Quick accessibility check function
// const checkColors = (fg: string, bg: string, context?: string) => {
//   ScopedContrastAnalysis.quickAudit(fg, bg, context);
// };

// // New live analysis functions for Baphomet UI
// const analyzeComponent = (componentName: string) => {
//   console.log(`🔍 Analyzing live component: ${componentName}`);
//   ScopedContrastAnalysis.analyzeSmartComponent(componentName);
// };

// const analyzeLive = (selector: string, name?: string) => {
//   console.log(`🔍 Analyzing live elements: ${selector}`);
//   analyzeLiveComponent(selector, name || selector);
// };

// const scanPage = () => {
//   console.log('🔍 Scanning entire page for contrast issues...');
//   scanPageContrast();
// };

// const contrastCheck = (fg: string, bg: string) => {
//   const ratio = getContrastRatio(fg, bg);
//   const compliance = checkWCAGCompliance(fg, bg);

//   console.log(`🎨 Contrast Check`);
//   console.log(`Colors: ${fg} on ${bg}`);
//   console.log(`Ratio: ${ratio.toFixed(1)}:1`);
//   console.log(`WCAG AA: ${compliance.passesAA ? '✅' : '❌'}`);
//   console.log(`WCAG AAA: ${compliance.passesAAA ? '✅' : '❌'}`);

//   return compliance;
// };

// // Type-safe window extensions
// declare global {
//   interface Window {
//     analyzePage?: typeof analyzePage;
//     checkColors?: typeof checkColors;
//     analyzeComponent?: typeof analyzeComponent;
//     analyzeLive?: typeof analyzeLive;
//     scanPage?: typeof scanPage;
//     contrastCheck?: typeof contrastCheck;
//     baphAnalysis?: ReturnType<
//       typeof ScopedContrastAnalysis.createConsoleAnalysisFunctions
//     >;
//   }
// }

// // Make Baphomet-specific functions available globally
// if (typeof window !== 'undefined') {
//   try {
//     window.analyzePage = analyzePage;
//     window.checkColors = checkColors;
//     window.analyzeComponent = analyzeComponent;
//     window.analyzeLive = analyzeLive;
//     window.scanPage = scanPage;
//     window.contrastCheck = contrastCheck;
//     window.baphAnalysis = baphometAnalysis;

//     console.log('🎨 Baphomet-UI Accessibility Analysis Ready!');
//     console.log('📖 Available functions:');
//     console.log('  ═══ PREDEFINED ANALYSIS ═══');
//     console.log(
//       '  • analyzeFullSystem() - Analyze all Baphomet color combinations'
//     );
//     console.log(
//       '  • analyzeComponent("ComponentName") - Analyze specific predefined component'
//     );
//     console.log('  • analyzePage("PageName") - Analyze specific page');
//     console.log('  ═══ LIVE ANALYSIS ═══');
//     console.log(
//       '  • analyzeComponent("ComponentName") - Auto-detect and analyze live component'
//     );
//     console.log(
//       '  • analyzeLive(".css-selector", "Name") - Analyze specific selector'
//     );
//     console.log('  • scanPage() - Scan entire page for contrast issues');
//     console.log('  • contrastCheck("#fg", "#bg") - Quick color contrast check');
//     console.log('  ═══ LEGACY ═══');
//     console.log('  • checkColors("#fg", "#bg", "context") - Quick color check');
//   } catch (error) {
//     console.warn('⚠️ Could not attach Baphomet analysis functions:', error);
//   }
// }

// export {
//   baphometColorCombinations,
//   pageColorCombinations,
//   baphometAnalysis,
//   analyzePage,
//   checkColors,
//   analyzeComponent,
//   analyzeLive,
//   scanPage,
//   contrastCheck
// };
