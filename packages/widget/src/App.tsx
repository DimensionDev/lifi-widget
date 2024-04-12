import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
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
import { RoutesExpanded } from './components/Routes';
import { useExpandableVariant, useNavigateBack } from './hooks';
import { useWidgetConfig } from './providers';
import { HiddenUI, type WidgetConfig, type WidgetProps } from './types';
import { ElementId, createElementId, navigationRoutes } from './utils';
import { useMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { useRouteExecutionStore } from './stores';

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
  deleteTransactions: () => void;
  isHome: boolean;
  isHistory: boolean;
  isSettings: boolean;
}

export const AppDefault = forwardRef((_, ref) => {
  const { t } = useTranslation();
  const { elementId, hiddenUI, containerRef } = useWidgetConfig();
  const expandable = useExpandableVariant();
  const { navigateBack, navigate } = useNavigateBack();

  const [open, setOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  const deleteRoutes = useRouteExecutionStore((store) => store.deleteRoutes);

  const isHome = useMatch('/');
  const isHistory = useMatch('/transaction-history');
  const isSettings = useMatch('/settings');

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
      isHistory: isHistory?.pathname.includes('/transaction-history'),
      isSettings: isSettings?.pathname.includes('/settings'),
      navigateToTransaction: handleNavigateToTransaction,
      navigateToSettings: handleNavigateToSettings,
      deleteTransactions: toggleDialog,
    }),
    [
      navigateBack,
      isHome,
      isHistory,
      isSettings,
      handleNavigateToSettings,
      handleNavigateToTransaction,
      toggleDialog,
    ],
  );

  return (
    <AppExpandedContainer
      id={createElementId(ElementId.AppExpandedContainer, elementId)}
    >
      <AppContainer>
        {!hiddenUI?.includes(HiddenUI.Header) ? <Header /> : null}
        <FlexContainer
          disableGutters
          id={createElementId(ElementId.FlexContainer, elementId)}
        >
          <AppRoutes />
        </FlexContainer>
        <Initializer />
      </AppContainer>
      <Dialog open={open} onClose={toggleDialog} container={containerRef}>
        <DialogTitle>{t('warning.title.deleteTransactionHistory')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('warning.message.deleteTransactionHistory')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog}>{t('button.cancel')}</Button>
          <Button
            variant="contained"
            onClick={() => deleteRoutes('completed')}
            autoFocus
          >
            {t('button.delete')}
          </Button>
        </DialogActions>
      </Dialog>
      {expandable ? <RoutesExpanded /> : null}
    </AppExpandedContainer>
  );
});
