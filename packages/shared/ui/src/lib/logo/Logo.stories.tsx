import { Logo } from './Logo';

export default {
  title: 'Components/Logo',
  component: Logo,
  argTypes: {
    path: { control: 'text' },
    width: {control: 'text'},
    height: {control: 'text'},
  },
};

export const Default = (args: any) => <Logo {...args} />;

Default.args = {
  path: 'https://talentsconsult.com/wp-content/uploads/2022/03/logo-talents-consulting-flat.png',
  width: '50',
  height: '50'
};
