import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { PbuiCommandLine } from './PbuiCommandLine';

const meta = {
  title: 'Generic/CLIM/PbuiCommandLine',
  component: PbuiCommandLine,
} satisfies Meta<typeof PbuiCommandLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Editable: Story = {
  args: { value: 'FILTER-DIETARY vegetarian' },
  render: () => {
    const [value, setValue] = useState('FILTER-DIETARY vegetarian');
    const [result, setResult] = useState('Type a command and press Enter.');
    return (
      <div className="bg-clim-bg font-mono">
        <PbuiCommandLine value={value} result={result} onChange={setValue} onSubmit={(next) => setResult(`submitted ${next}`)} />
      </div>
    );
  },
};
