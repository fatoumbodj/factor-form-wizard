import { PrimaryButton } from './PrimaryButton';

export default {
  title: 'Components/PrimaryButton',
  component: PrimaryButton,
  argTypes: {
    text: { control: 'text' },
    onClick: { action: 'clicked' },
    sx: { control: 'object' }
  },
};

export const Default = (args: any) => <PrimaryButton {...args} />;

Default.args = {
  text: 'Primary Button',
   sx: {
      fontSize: '23px',
      padding: '12px 24px',
    },
};
