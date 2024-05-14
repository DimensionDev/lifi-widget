/* eslint-disable react/no-array-index-key */
import type { Route } from '@lifi/sdk';
import { Collapse, Grow, Stack, Typography } from '@mui/material';
import { useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { RouteObject } from 'react-router-dom';
import { useRoutes as useDOMRoutes, useNavigate } from 'react-router-dom';
import { useRoutes } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { useSetExecutableRoute } from '../../stores';
import { ElementId, createElementId, navigationRoutes } from '../../utils';
import { ProgressToNextUpdate } from '../ProgressToNextUpdate';
import { RouteCard, RouteCardSkeleton, RouteNotFoundCard } from '../RouteCard';
import {
  CollapseContainer,
  Container,
  Header,
  ScrollableContainer,
} from './RoutesExpanded.style';

const timeout = { enter: 225, exit: 225, appear: 0 };

const routes: RouteObject[] = [
  {
    path: '/',
    element: true,
  },
];

export const RoutesExpanded = () => {
  const match = useDOMRoutes(routes);
  return (
    <CollapseContainer style={{ maxHeight: '100%' }}>
      <Collapse timeout={timeout} in={!!match} orientation="horizontal">
        <Grow timeout={timeout} in={!!match} mountOnEnter unmountOnExit>
          <div>
            <RoutesExpandedElement />
          </div>
        </Grow>
      </Collapse>
    </CollapseContainer>
  );
};

export const RoutesExpandedElement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setExecutableRoute = useSetExecutableRoute();
  const {
    subvariant,
    containerStyle,
    elementId,
    subTitleSize = 18,
  } = useWidgetConfig();
  const { isValid, isValidating } = useFormState();
  const {
    routes,
    isLoading,
    isFetching,
    isFetched,
    dataUpdatedAt,
    refetchTime,
    refetch,
  } = useRoutes();

  const handleRouteClick = (route: Route) => {
    if (isValid && !isValidating) {
      setExecutableRoute(route);
      navigate(navigationRoutes.transactionExecution, {
        state: { routeId: route.id },
      });
    }
  };

  const currentRoute = routes?.[0];

  const expanded = Boolean(
    currentRoute || isLoading || isFetching || isFetched,
  );

  const routeNotFound = !currentRoute && !isLoading && !isFetching && expanded;

  return (
    <Collapse timeout={timeout.enter} in={expanded} orientation="horizontal">
      <Grow timeout={timeout.enter} in={expanded} mountOnEnter unmountOnExit>
        <Container
          sx={containerStyle}
          id={createElementId(ElementId.RouteExpandedContainer, elementId)}
          enableColorScheme
        >
          <ScrollableContainer>
            <Header>
              <Typography
                fontSize={subTitleSize}
                lineHeight={`${subTitleSize + 4}px`}
                fontWeight="700"
                flex={1}
                noWrap
              >
                {subvariant === 'nft'
                  ? t('main.fromAmount')
                  : t('header.youGet')}
              </Typography>
              <ProgressToNextUpdate
                updatedAt={dataUpdatedAt || new Date().getTime()}
                timeToUpdate={refetchTime}
                isLoading={isFetching}
                onClick={() => refetch()}
                sx={{ p: 0 }}
              />
            </Header>
            <Stack direction="column" spacing={1.5} flex={1} paddingBottom={3}>
              {routeNotFound ? (
                <RouteNotFoundCard />
              ) : isLoading || (isFetching && !routes?.length) ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <RouteCardSkeleton key={index} />
                ))
              ) : (
                routes?.map((route: Route, index: number) => (
                  <RouteCard
                    className="routeCard"
                    key={route.id}
                    route={route}
                    onClick={() => handleRouteClick(route)}
                    active={index === 0}
                    expanded={routes?.length <= 2}
                  />
                ))
              )}
            </Stack>
          </ScrollableContainer>
        </Container>
      </Grow>
    </Collapse>
  );
};
