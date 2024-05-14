import { Box } from '@mui/material';
import type { FC } from 'react';
import { useRef } from 'react';
import { useWatch } from 'react-hook-form';
import {
  useChain,
  useDebouncedWatch,
  useTokenBalances,
  useTokenSearch,
} from '../../hooks';
import {
  FormKey,
  FormKeyHelper,
  useWallet,
  useWidgetConfig,
} from '../../providers';
import type { TokenAmount } from '../../types';
import { TokenNotFound } from './TokenNotFound';
import { VirtualizedTokenList } from './VirtualizedTokenList';
import type { TokenListProps } from './types';
import { useTokenSelect } from './useTokenSelect';
import type { ChainId } from '@lifi/sdk';

const maskTokenAddresses: Partial<Record<ChainId, string>> = {
  1: '0x69af81e73A73B40adF4f3d4223Cd9b1ECE623074',
  56: '0x2eD9a5C8C13b93955103B9a7C167B67Ef4d568a3',
  137: '0x2B9E7ccDF0F4e5B24757c1E1a80e311E34Cb10c7',
  80001: '0xF8935Df67cAB7BfcA9532D1Ac2088C5c39b995b5',
};

const nativeTokenAddress = '0x0000000000000000000000000000000000000000';

export function isSameAddress(
  address?: string | null | undefined,
  otherAddress?: string | null | undefined,
): boolean {
  if (!address || !otherAddress) {
    return false;
  }
  return address.toLowerCase() === otherAddress.toLowerCase();
}

export const TokenList: FC<TokenListProps> = ({
  formType,
  height,
  onClick,
}) => {
  const parentRef = useRef<HTMLUListElement | null>(null);
  const { account } = useWallet();
  const [selectedChainId] = useWatch({
    name: [FormKeyHelper.getChainKey(formType)],
  });
  const [tokenSearchFilter]: string[] = useDebouncedWatch(
    [FormKey.TokenSearchFilter],
    320,
  );

  const { chain, isLoading: isChainLoading } = useChain(selectedChainId);

  const {
    tokens: chainTokens,
    tokensWithBalance,
    isLoading: isTokensLoading,
    isBalanceLoading,
    featuredTokens,
  } = useTokenBalances(selectedChainId);

  let filteredTokens = (tokensWithBalance ??
    chainTokens ??
    []) as TokenAmount[];
  const searchFilter =
    tokenSearchFilter?.replaceAll('$', '')?.toUpperCase() ?? '';
  filteredTokens = tokenSearchFilter
    ? filteredTokens.filter(
        (token) =>
          token.name.toUpperCase().includes(searchFilter) ||
          token.symbol.toUpperCase().includes(searchFilter) ||
          token.address.toUpperCase().includes(searchFilter),
      )
    : filteredTokens;

  const tokenSearchEnabled =
    !isTokensLoading &&
    !filteredTokens.length &&
    !!tokenSearchFilter &&
    !!selectedChainId;

  const { token: searchedToken, isLoading: isSearchedTokenLoading } =
    useTokenSearch(selectedChainId, tokenSearchFilter, tokenSearchEnabled);

  const isLoading =
    isTokensLoading ||
    isChainLoading ||
    (tokenSearchEnabled && isSearchedTokenLoading);

  const tokens = filteredTokens.length
    ? filteredTokens
    : searchedToken
    ? [searchedToken]
    : filteredTokens;

  const sortedTokens =
    tokenSearchFilter === 'MASK'
      ? tokens.sort((tokenA, tokenB) => {
          const isNativeTokenA = isSameAddress(
            tokenA.address,
            nativeTokenAddress,
          );
          if (isNativeTokenA) {
            return -1;
          }
          const isNativeTokenZ = isSameAddress(
            tokenB.address,
            nativeTokenAddress,
          );
          if (isNativeTokenZ) {
            return 1;
          }

          const maskAddress = maskTokenAddresses[tokenA.chainId];
          // mask token with position value
          const isMaskTokenA = isSameAddress(tokenA.address, maskAddress);
          if (isMaskTokenA) {
            return -1;
          }
          const isMaskTokenZ = isSameAddress(tokenB.address, maskAddress);
          if (isMaskTokenZ) {
            return 1;
          }

          return 0;
        })
      : tokens;

  const handleTokenClick = useTokenSelect(formType, onClick);

  return (
    <Box ref={parentRef} style={{ height, overflow: 'auto' }}>
      {!tokens.length && !isLoading ? (
        <TokenNotFound formType={formType} />
      ) : null}
      <VirtualizedTokenList
        tokens={sortedTokens}
        featuredTokensLength={featuredTokens?.length}
        scrollElementRef={parentRef}
        chainId={selectedChainId}
        chain={chain}
        isLoading={isLoading}
        isBalanceLoading={isBalanceLoading}
        showBalance={account.isActive}
        showFeatured={!tokenSearchFilter}
        onClick={handleTokenClick}
      />
    </Box>
  );
};
