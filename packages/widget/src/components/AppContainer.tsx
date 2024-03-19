import { Box, Container, ScopedCssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { PropsWithChildren } from 'react';
import { useWidgetConfig } from '../providers';
import type { WidgetVariant } from '../types';
import { ElementId, createElementId } from '../utils';

export const maxHeight = 680;

export const AppExpandedContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: WidgetVariant }>(({ variant }) => ({
  display: 'flex',
  alignItems: 'start',
  flex: 1,
}));

const RelativeContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: WidgetVariant }>(({ theme, variant }) => ({
  position: 'relative',
  boxSizing: 'content-box',
  width: '100%',
  minWidth: 284,
  background: theme.palette.background.default,
  overflow: 'auto',
  flex: 1,
  zIndex: 0,
  backgroundColor: 'transparent',
}));

const CssBaselineContainer = styled(ScopedCssBaseline, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: WidgetVariant }>(({ variant }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  overflowX: 'clip',
  margin: 0,
  width: '100%',
  overflowY: 'auto',
  height: '100%',
  background: 'transparent',
}));

export const FlexContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
});

export const AppContainer: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  // const ref = useRef<HTMLDivElement>(null);
  const { containerStyle, variant, elementId } = useWidgetConfig();
  return (
    <RelativeContainer
      sx={containerStyle}
      variant={variant}
      id={createElementId(ElementId.RelativeContainer, elementId)}
    >
      <CssBaselineContainer
        id={createElementId(ElementId.ScrollableContainer, elementId)}
        variant={variant}
        enableColorScheme
        // ref={ref}
      >
        <FlexContainer disableGutters>{children}</FlexContainer>
      </CssBaselineContainer>
      {/* <ScrollToLocation elementRef={ref} /> */}
    </RelativeContainer>
  );
};

// export const ScrollToLocation: React.FC<{
//   elementRef: RefObject<HTMLElement>;
// }> = ({ elementRef }) => {
//   const { pathname } = useLocation();
//   useLayoutEffect(() => {
//     elementRef.current?.scrollTo(0, 0);
//   }, [elementRef, pathname]);
//   return null;
// };
