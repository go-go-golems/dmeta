import type { Preview } from '@storybook/react-vite';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'clim-black',
      values: [{ name: 'clim-black', value: '#050505' }],
    },
  },
};

export default preview;
