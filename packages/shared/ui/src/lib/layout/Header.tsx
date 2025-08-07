
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { MenuLabel } from "./MenuLabel";
import { UserInfo } from "@leasing/domain";
import { HeaderBreadcrumbs } from './HeaderBreadcrumbs';

type Props = {
  brand: string;
  currentUser: UserInfo;
  isLoading: boolean;
  onLogout: () => void;
  onOpenProfile: () => void;
  onOpenPasswordDialog: () => void;
}
export const Header = ({
  brand,
  currentUser,
  isLoading,
  onLogout,
  onOpenProfile,
  onOpenPasswordDialog
}: Props) => {
  const displayName = `${currentUser?.firstname ?? ''} ${currentUser?.lastname ?? ''}`;
  const role = currentUser?.role ?? '';

  return (
    <Stack
      direction='row'
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '100%' },
        pt: 1.5,
        pb: 3,
      }}
      spacing={2}
    >
      <HeaderBreadcrumbs text={brand} />

      <Stack direction='row' sx={{ gap: 1, paddingRight: '15px' }}>
        <Stack direction='row' spacing={1} alignItems='center'>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'primary.main',
              borderRadius: 1,
              px: 2,
              py: 1,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'background.paper',
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={16} />
                <Typography>Chargement des données utilisateur</Typography>
              </>
            ) : currentUser && (
              <>
                <Typography variant='body2' sx={{ fontWeight: 700 }}>
                  {displayName.trim() || 'Utilisateur inconnu'}
                </Typography>
                <Typography variant='body2' sx={{ fontWeight: 500 }}>
                  ({role})
                </Typography>
              </>
            )}
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <MenuLabel
              onLogout={onLogout}
              onOpenProfile={onOpenProfile}
              onOpenPasswordDialog={onOpenPasswordDialog}
            />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};