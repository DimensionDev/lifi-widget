import type { BoxProps, Theme } from '@mui/material';
import { Box, useMediaQuery } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { ReverseTokensButton } from '../components/ReverseTokensButton';
import { SelectTokenButton } from '../components/SelectTokenButton';
import { FormKey, useWidgetConfig } from '../providers';
import { DisabledUI, HiddenUI } from '../types';

export const SelectChainAndToken: React.FC<BoxProps> = (props) => {
  const { disabledUI, hiddenUI, subvariant } = useWidgetConfig();

  const hiddenReverse =
    subvariant === 'refuel' ||
    disabledUI?.includes(DisabledUI.FromToken) ||
    disabledUI?.includes(DisabledUI.ToToken) ||
    hiddenUI?.includes(HiddenUI.ToToken);

  const hiddenToToken =
    subvariant === 'nft' || hiddenUI?.includes(HiddenUI.ToToken);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} {...props}>
      <SelectTokenButton formType="from" compact={false} />
      {!hiddenToToken ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          m={!hiddenReverse ? -1.125 : 1}
        >
          {!hiddenReverse ? <ReverseTokensButton vertical /> : null}
        </Box>
      ) : null}
      {!hiddenToToken ? (
        <SelectTokenButton formType="to" compact={false} />
      ) : null}
    </Box>
  );
};
