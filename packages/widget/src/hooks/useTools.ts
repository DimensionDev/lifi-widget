import type { ToolsResponse } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { isItemAllowed, useLiFi, useWidgetConfig } from '../providers';
import { useSettingsStore } from '../stores';
import { useEffect } from 'react';

export const useTools = () => {
  const lifi = useLiFi();
  const { bridges, exchanges } = useWidgetConfig();
  const { data, isSuccess } = useQuery({
    queryKey: ['tools'],
    queryFn: async (): Promise<ToolsResponse> => {
      const tools = await lifi.getTools();
      return {
        bridges: tools.bridges.filter((bridge) =>
          isItemAllowed(bridge.key, bridges),
        ),
        exchanges: tools.exchanges.filter((exchange) =>
          isItemAllowed(exchange.key, exchanges),
        ),
      };
    },
    refetchInterval: 180000,
    staleTime: 180000,
  });

  useEffect(() => {
    if (isSuccess) {
      const { initializeTools } = useSettingsStore.getState();
      initializeTools(
        'Bridges',
        data.bridges.map((bridge) => bridge.key),
      );
      initializeTools(
        'Exchanges',
        data.exchanges.map((exchange) => exchange.key),
      );
    }
  }, [isSuccess, data]);

  return { tools: data };
};
