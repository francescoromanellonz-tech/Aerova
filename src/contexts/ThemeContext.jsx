/**
 * DEPRECATED, 2026-05-11
 *
 * Light/dark theme switching was removed when AEROVA went dark-mode only.
 * The original implementation is preserved at ThemeContext.jsx.bak in case
 * it needs to be revived.
 *
 * These shims exist solely so any stray `import { useTheme } from
 * '../contexts/ThemeContext'` fails loudly at runtime instead of silently
 * shipping a broken UI. Nothing in the app should be importing them.
 */

export const useTheme = () => {
  throw new Error(
    'useTheme is deprecated, AEROVA is dark-mode only as of 2026-05-11. ' +
    'Remove this import. See ThemeContext.jsx.bak for the original.'
  );
};

export const ThemeProvider = ({ children }) => children;

export default null;
