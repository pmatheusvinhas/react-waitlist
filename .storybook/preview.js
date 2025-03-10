import { initialize, mswLoader } from 'msw-storybook-addon';
import { handlers } from './mocks';

// Initialize MSW
initialize({
  onUnhandledRequest: 'bypass',
});

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    msw: {
      handlers: handlers,
    },
    a11y: {
      // Optional a11y configuration
      config: {
        rules: [
          {
            // You can disable specific rules for certain elements
            // For example, if you have a lot of SVGs without labels
            id: 'svg-img-alt',
            selector: 'svg',
            enabled: false,
          },
        ],
      },
      // Optional options
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
    },
  },
  loaders: [mswLoader],
};

export default preview; 