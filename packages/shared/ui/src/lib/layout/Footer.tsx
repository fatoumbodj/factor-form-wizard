import { Typography } from '@mui/material';
import Link from '@mui/material/Link';
import { Logo } from '../logo/Logo';

type Props = {
  logoPath: string;
}
export const Footer = ({logoPath}: Props) => {
   return (
      <Typography
        variant='body2'
        align='center'
        sx={[
          {
            color: 'error',
          },
        ]}
      >
        {'Copyright © '}
        <Link color='secondary.dark' href={''} target='_blank'>
          Talents Consulting
          <Logo path={logoPath} width='20%' />
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
   )
};