import { Box, ScopedCssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import { maxHeight } from '../AppContainer';

export const CollapseContainer = styled(Box)(({ theme }) => ({
  zIndex: 0,
}));

export const ScrollableContainer = styled(Box)({
  overflowY: 'auto',
  height: '100%',
  width: '100%',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: '0 8px',
  '::-webkit-scrollbar': {
    display: 'none',
  },
});

export const Container = styled(ScopedCssBaseline)(({ theme }) => ({
  backgroundColor: 'transparent',
  overflow: 'auto',
  width: 276,
  display: 'flex',
  flexDirection: 'column',
}));

export const Header = styled(Box)(({ theme }) => ({
  backgroundColor: 'transparent',
  backdropFilter: 'blur(12px)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: theme.spacing(1.5),
  position: 'sticky',
  top: 0,
  zIndex: 1200,
}));
