import type { Order } from '@lifi/sdk';
import { Orders } from '@lifi/sdk';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { FormControl, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle } from '../../components/Card';
import { Select } from '../../components/Select';
import { useSettings, useSettingsStore } from '../../stores';
import { useWidgetConfig } from '@lifi/widget/providers';

export const RoutePrioritySelect: React.FC = () => {
  const { t } = useTranslation();
  const { containerRef } = useWidgetConfig();
  const setValue = useSettingsStore((state) => state.setValue);
  const { routePriority } = useSettings(['routePriority']);
  const value = routePriority ?? '';

  return (
    <Card>
      <CardTitle>{t(`settings.routePriority`)}</CardTitle>
      <FormControl fullWidth>
        <Select
          MenuProps={{ elevation: 2, container: containerRef }}
          value={value}
          onChange={(event) =>
            setValue('routePriority', event.target.value as Order)
          }
          IconComponent={KeyboardArrowDownIcon}
          dense
        >
          {['RECOMMENDED', 'FASTEST'].map((order) => {
            const tag = t(`main.tags.${order.toLowerCase()}` as any);
            const tagName = `${tag[0]}${tag.slice(1).toLowerCase()}`;
            return (
              <MenuItem key={order} value={order}>
                {tagName}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Card>
  );
};
