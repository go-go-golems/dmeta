import type { Preview } from '@storybook/react-vite';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'deli-warm-white',
      values: [
        { name: 'deli-warm-white', value: '#FAF8F5' },
        { name: 'deli-surface', value: '#FFFFFF' },
        { name: 'deli-dark', value: '#2C2520' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420, margin: '0 auto', minHeight: '100dvh' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
