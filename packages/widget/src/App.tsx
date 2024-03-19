import { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react';
import type { WidgetDrawer } from './AppDrawer';
import { AppDrawer } from './AppDrawer';
import { AppProvider } from './AppProvider';
import { AppRoutes } from './AppRoutes';
import {
  AppContainer,
  AppExpandedContainer,
  FlexContainer,
} from './components/AppContainer';
import { Header } from './components/Header';
import { Initializer } from './components/Initializer';
import { PoweredBy } from './components/PoweredBy';
import { RoutesExpanded } from './components/Routes';
import { useExpandableVariant, useNavigateBack } from './hooks';
import { useWidgetConfig } from './providers';
import { HiddenUI, type WidgetConfig, type WidgetProps } from './types';
import { ElementId, createElementId, navigationRoutes } from './utils';
import { useMatch } from 'react-router-dom';

export const App = forwardRef<WidgetDrawer, WidgetProps>(
  ({ elementRef, open, onClose, integrator, ...other }, ref) => {
    const config: WidgetConfig = useMemo(
      () => ({ integrator, ...other, ...other.config }),
      [integrator, other],
    );
    return config?.variant !== 'drawer' ? (
      <AppProvider config={config}>
        <AppDefault ref={ref} />
      </AppProvider>
    ) : (
      <AppDrawer
        ref={ref}
        elementRef={elementRef}
        integrator={integrator}
        config={config}
        open={open}
        onClose={onClose}
      />
    );
  },
);

export interface AppDefaultRef {
  navigateBack: () => void;
  navigateToTransaction: () => void;
  navigateToSettings: () => void;
  isHome: boolean;
}

export const AppDefault = forwardRef((_, ref) => {
  const { elementId, hiddenUI } = useWidgetConfig();
  const expandable = useExpandableVariant();
  const { navigateBack, navigate } = useNavigateBack();

  const isHome = useMatch('/');

  const handleNavigateToTransaction = useCallback(() => {
    navigate(navigationRoutes.transactionHistory);
  }, [navigate]);

  const handleNavigateToSettings = useCallback(() => {
    navigate(navigationRoutes.settings);
  }, [navigate]);

  useImperativeHandle(
    ref,
    () => ({
      navigateBack,
      isHome: isHome?.pathname === '/',
      navigateToTransaction: handleNavigateToTransaction,
      navigateToSettings: handleNavigateToSettings,
    }),
    [
      navigateBack,
      isHome,
      handleNavigateToSettings,
      handleNavigateToTransaction,
    ],
  );

  return (
    <AppExpandedContainer
      id={createElementId(ElementId.AppExpandedContainer, elementId)}
    >
      <AppContainer>
        {!hiddenUI?.includes(HiddenUI.Header) ? <Header /> : null}
        <FlexContainer disableGutters>
          <AppRoutes />
        </FlexContainer>
        <Initializer />
      </AppContainer>
      {expandable ? <RoutesExpanded /> : null}
    </AppExpandedContainer>
  );
});
