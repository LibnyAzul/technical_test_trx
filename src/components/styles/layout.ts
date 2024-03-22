import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const drawerWidth = 240;

export const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open'
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `-${drawerWidth}px`,
  ...((open ?? false) && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
}));

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...((open ?? false) && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end'
}));

export const DrawerFooter = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'fixed',
  bottom: 0,
  textAlign: 'center',
  paddingBottom: 10,
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar
}));