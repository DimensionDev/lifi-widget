export enum ElementId {
  AppExpandedContainer = 'widget-app-expanded-container',
  Header = 'widget-header',
  RelativeContainer = 'widget-relative-container',
  ScrollableContainer = 'widget-scrollable-container',
  RouteExpandedContainer = 'widget-route-expanded-container',
  HeaderAppBar = 'widget-header-app-bar',
  FlexContainer = 'widget-header-flex-container',
  HistoryContainer = 'widget-history-container',
  settingsListContainer = 'widget-settings-list-container',
}

export const createElementId = (ElementId: ElementId, elementId: string) =>
  elementId ? `${ElementId}-${elementId}` : ElementId;
