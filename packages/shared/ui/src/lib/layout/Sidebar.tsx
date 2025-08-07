import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CircularProgress, Drawer, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, SvgIconProps } from '@mui/material';
import { MenuLabel } from './MenuLabel';
import { GroupRouteParamsType, RouteParams, SingleRouteParams, SingleRouteParamsType, UserInfo } from '@leasing/domain';
import { Logo } from '../logo/Logo';

type Props = {
  routes: Array<RouteParams>,
  routeSelected: string;
  logoPath: string;
  currentUser: UserInfo;
  isLoading: boolean;
  onNavigate: (route: string) => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  onOpenPasswordDialog: () => void;
};

export const Sidebar = ({
  routes,
  routeSelected,
  logoPath,
  currentUser,
  isLoading,
  onNavigate,
  onLogout,
  onOpenProfile,
  onOpenPasswordDialog
}: Props) => {
  const firstname = currentUser?.firstname ?? '';
  const lastname = currentUser?.lastname ?? '';

  const displayName = `${firstname} ${lastname}`.trim() ?? 'Utilisateur inconnu';

  const avatarLetter = firstname?.charAt(0)?.toUpperCase() || '?';
  const email = currentUser?.email || 'email@example.com';

  const handleNavigation = (route: string) => {
    onNavigate(route);
  };

  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes: Array<RouteParams>) => {

    const renderNav = (name: string, key: number, renderFn: (key: number) => React.ReactNode) => {
      return (
        <React.Fragment key={key} >
          <List
            component='nav'
            dense
            disablePadding
            sx={{ width: '100%', bgcolor: 'background.paper', paddingX: '10px', paddingY: '5px' }}
            subheader={
              <ListSubheader component='div' id='nested-list-subheader'>
                {name}
              </ListSubheader>
            }
          >
            {renderFn(key)}
          </List>
        </React.Fragment>
      )
    }

    const renderNavItem = (item: SingleRouteParams, key: number) => {
      return (
        <ListItemButton
          key={key}
          selected={item.path === routeSelected}
          onClick={() => handleNavigation(item.path)}
          sx={{
            borderRadius: 1,
            border: '1px solid transparent',
            mb: 0.5,
            '&:hover': {
              backgroundColor: 'primary.light',
              borderColor: 'primary.main',
            },
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'white',
              borderColor: 'primary.main',
              '& .MuiListItemIcon-root': {
                color: 'white',
              },
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
          }}
        >
          {item.icon && (
            <ListItemIcon sx={{ minWidth: 26 }}>
              {React.cloneElement(item.icon as React.ReactElement<SvgIconProps>, { fontSize: 'small' })}
            </ListItemIcon>
          )}
          <ListItemText primary={item.name} />
        </ListItemButton>
      )
    }

    return routes.map((params, key1) => {
      if (params.tag === SingleRouteParamsType) {
        return renderNav(params.name, key1, (key) => renderNavItem(params, key))
      } else if (params.tag === GroupRouteParamsType) {
        const items = params.items;
        const groupName = params.groupName;
        return renderNav(groupName, key1, (key) => items && items
          .filter(item => !!item.menu)
          .map((item, key2) => renderNavItem(item, key * 10 + key2))
        )
      } 
      return;
    });
  };

  return (
    <Drawer
      variant='permanent'
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
          width: '300px'
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Logo path={logoPath} width='60%' />
          <span
            style={{
              display: 'inline-block',
              wordBreak: 'break-word',
              whiteSpace: 'normal',
              maxWidth: '150px',
              fontSize: '20',
              fontWeight: 'bold'
            }}
          >
            Crédit Bail
          </span>
        </span>
      </Box>
      <Divider />
      {createLinks(routes)}
      <Divider />
      <Stack
        direction='column'
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'flex-start',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction='row' spacing={1} alignItems='center'>
          <Avatar sx={{ width: 36, height: 36 }}>{avatarLetter}</Avatar>
          {isLoading ? (
            <>
              <CircularProgress size={28} />
              <Typography variant='caption'>
                Chargement des données utilisateur
              </Typography>
            </>
          ) : (
            <>
              <Typography variant='body2' sx={{ fontWeight: 500 }}>
                {displayName}
              </Typography>
              <Box sx={{ ml: 'auto' }}>
                <MenuLabel
                  onLogout={onLogout}
                  onOpenProfile={onOpenProfile}
                  onOpenPasswordDialog={onOpenPasswordDialog} />
              </Box>
            </>
          )}
        </Stack>

        <Stack direction='row' spacing={1} alignItems='center'>
          <Typography
            variant='caption'
            sx={{
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'normal',
            }}
          >
            {email}
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={{ marginBottom: 5 }} />
    </Drawer>
  );
};