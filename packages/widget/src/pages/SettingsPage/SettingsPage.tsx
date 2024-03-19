import { Box, Container } from '@mui/material';
import { ColorSchemeButtonGroup } from './ColorSchemeButtonGroup';
import { EnabledToolsButton } from './EnabledToolsButton';
import { GasPriceSelect } from './GasPriceSelect';
import { LanguageSelect } from './LanguageSelect';
import { ResetSettingsButton } from './ResetSettingsButton';
import { RoutePrioritySelect } from './RoutePrioritySelect';
import { ShowDestinationWallet } from './ShowDestinationWallet';
import { SlippageInput } from './SlippageInput';

export const SettingsPage = () => {
  return (
    <Container disableGutters>
      <Box>
        <LanguageSelect />
        <RoutePrioritySelect />
        <Box sx={{ display: 'flex', alignItems: 'center' }} mt={2}>
          <Box pr={2} flex={1}>
            <SlippageInput />
          </Box>
          <GasPriceSelect />
        </Box>
      </Box>
      <ShowDestinationWallet />
      <Box>
        <EnabledToolsButton type="Bridges" />
        <EnabledToolsButton type="Exchanges" />
      </Box>
      <ResetSettingsButton />
    </Container>
  );
};
