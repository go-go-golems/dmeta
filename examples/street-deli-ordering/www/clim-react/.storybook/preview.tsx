import type { Preview } from '@storybook/react-vite';
import '../src/styles/clim.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'clim-black',
      values: [{ name: 'clim-black', value: '#000000' }],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
