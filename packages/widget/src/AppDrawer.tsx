import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Drawer } from '@mui/material';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { AppDefault } from './App';
import { DrawerButton, DrawerButtonTypography } from './AppDrawer.style';
import type { WidgetDrawerContext } from './AppDrawerContext';
import { DrawerContext } from './AppDrawerContext';
import { AppProvider } from './AppProvider';
import type { WidgetConfig, WidgetProps, WidgetSubvariant } from './types';
import { HiddenUI } from './types';

export interface WidgetDrawer {
  isOpen(): void;
  toggleDrawer(): void;
  openDrawer(): void;
  closeDrawer(): void;
  navigateBack?: () => void;
  isHome?: boolean;
  navigateToTransaction?: () => void;
  navigateToSettings?: () => void;
}

export const AppDrawer = forwardRef<WidgetDrawer, WidgetProps>(
  ({ elementRef, open, onClose, integrator, config }, ref) => {
    const openRef = useRef(Boolean(open));
    const [drawerOpen, setDrawerOpen] = useState(Boolean(open));

    const toggleDrawer = useCallback(() => {
      setDrawerOpen((open) => {
        openRef.current = !open;
        return openRef.current;
      });
      if (!openRef.current) {
        onClose?.();
      }
    }, [onClose]);

    const openDrawer = useCallback(() => {
      setDrawerOpen(true);
      openRef.current = true;
    }, []);

    const closeDrawer = useCallback(() => {
      setDrawerOpen(false);
      openRef.current = false;
      onClose?.();
    }, [onClose]);

    useImperativeHandle(
      ref,
      () => ({
        isOpen: () => openRef.current,
        toggleDrawer,
        openDrawer,
        closeDrawer,
      }),
      [closeDrawer, openDrawer, toggleDrawer],
    );

    const widgetConfig: WidgetConfig = useMemo(
      () => ({
        ...config,
        integrator,
        containerStyle: {
          ...config?.containerStyle,
          height: '100%',
        },
      }),
      [config, integrator],
    );

    const drawerContext: WidgetDrawerContext = useMemo(
      () => ({
        closeDrawer,
      }),
      [closeDrawer],
    );

    return (
      <DrawerContext.Provider value={drawerContext}>
        <AppProvider config={widgetConfig}>
          {!widgetConfig.hiddenUI?.includes(HiddenUI.DrawerButton) ? (
            <DrawerButton
              variant="contained"
              onClick={toggleDrawer}
              open={drawerOpen}
              drawerProps={config?.containerStyle}
            >
              {drawerOpen ? (
                <KeyboardArrowRightIcon />
              ) : (
                <KeyboardArrowLeftIcon />
              )}
              <DrawerButtonText
                open={drawerOpen}
                subvariant={config?.subvariant}
              />
            </DrawerButton>
          ) : null}
          <Drawer
            ref={elementRef}
            anchor="right"
            open={drawerOpen}
            onClose={closeDrawer}
            BackdropProps={{
              sx: {
                backgroundColor: 'rgb(0 0 0 / 48%)',
                backdropFilter: 'blur(3px)',
              },
            }}
            PaperProps={{
              sx: {
                width: config?.containerStyle?.width ?? '100%',
                minWidth: config?.containerStyle?.minWidth ?? 360,
                maxWidth: config?.containerStyle?.maxWidth ?? 392,
              },
            }}
            keepMounted
          >
            <AppDefault />
          </Drawer>
        </AppProvider>
      </DrawerContext.Provider>
    );
  },
);

export const DrawerButtonText = ({
  open,
  subvariant,
}: {
  open: boolean;
  subvariant?: WidgetSubvariant;
}) => {
  const { t } = useTranslation();

  return (
    <DrawerButtonTypography>
      {open
        ? t('button.hide')
        : subvariant === 'nft'
        ? t('button.lifiCheckout')
        : t('button.lifiExchange')}
    </DrawerButtonTypography>
  );
};
