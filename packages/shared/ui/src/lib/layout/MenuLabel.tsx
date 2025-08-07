import React from "react";
import { Button, ListItemIcon, ListItemText, Menu } from "@mui/material";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MuiMenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import styled from "@emotion/styled";
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';


const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
    margin: '2px 0',
    border: '1px solid',
    borderColor: '#e7d3ed',
    borderRadius: 6,
    '&:hover': {
        backgroundColor: '#e7d3ed',
        borderColor: '#8c1aab',
    },
}));


type Props = { 
  onLogout: () => void;
  onOpenProfile?: () => void;
  onOpenPasswordDialog?: () => void;
};

export const MenuLabel = ({
  onLogout,
  onOpenProfile,
  onOpenPasswordDialog
}: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        variant='outlined'
        size='small'
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ padding: '5px', minWidth: 'auto' }}
      >
        <MoreVertRoundedIcon fontSize='inherit' sx={{ fontSize: 16 }} />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onOpenProfile?.();
          }}
        >
          Profil
        </MenuItem>
        <Divider />
        <MenuItem onClick={onOpenPasswordDialog}>Modifier Mot de passe</MenuItem>
        <Divider />
        <MenuItem onClick={onLogout}>
          <ListItemText>Déconnexion</ListItemText>
          <ListItemIcon sx={{ ml: 'auto', minWidth: 0 }}>
            <LogoutRoundedIcon fontSize='small' />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </>
  );
};
