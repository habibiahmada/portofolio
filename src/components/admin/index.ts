/**
 * Lazy-loaded admin components
 * 
 * This module exports all heavy admin components with dynamic imports
 * to reduce initial bundle size and improve performance.
 * 
 * All components are configured with ssr: false to prevent server-side rendering
 * and include loading skeletons for better user experience.
 */

// Chart components
export {
  LazyChart,
  LazyBarChart,
  LazyLineChart,
  LazyPieChart,
  ChartSkeleton,
} from './LazyCharts';

// Animation components
export {
  LazyLottieAnimation,
  LazyMotion,
  LazyAnimatePresence,
  LazySpringAnimation,
  AnimationSkeleton,
} from './LazyAnimations';

// Editor components
export {
  LazyTiptapEditor,
  LazyMonacoEditor,
  LazyMarkdownEditor,
  EditorSkeleton,
} from './LazyEditor';

// PDF viewer components
export {
  LazyPDFDocument,
  LazyPDFPage,
  LazyPDFPreview,
  LazyPDFThumbnail,
  LazyPDFJSViewer,
  PDFSkeleton,
} from './LazyPDF';
