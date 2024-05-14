export interface ChainOrderProps {
  chainOrder: number[];
  availableChains: number[];
}

export interface ChainOrderState extends ChainOrderProps {
  initializeChains(
    chainIds: number[],
    maxChainToOrderConfig?: number,
  ): number[];
  setChain(chainId: number, maxChainToOrderConfig?: number): void;
}
