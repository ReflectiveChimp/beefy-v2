import { type CSSProperties, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { LabelledCheckboxProps } from '../../../../../components/LabelledCheckbox';
import { LabelledCheckbox } from '../../../../../components/LabelledCheckbox';
import { styled } from '@repo/styles/jsx';

export type LineTogglesState = {
  average: boolean;
  movingAverage: boolean;
};

export type LineTogglesProps = {
  className?: string;
  toggles: LineTogglesState;
  onChange: (newToggles: LineTogglesState) => void;
};

export const LineToggles = memo<LineTogglesProps>(function LineToggles({ toggles, onChange }) {
  const { t } = useTranslation();
  const handleChange = useCallback<LineToggleProps['onChange']>(
    (key, nowChecked) => {
      onChange({ ...toggles, [key]: nowChecked });
    },
    [toggles, onChange]
  );

  return (
    <Toggles>
      <LineToggle
        checked={toggles.average}
        color="#4DB258"
        label={t('Average')}
        onChange={handleChange}
        toggle={'average'}
      />
      <LineToggle
        checked={toggles.movingAverage}
        color="#5C70D6"
        label={t('Moving-Average')}
        onChange={handleChange}
        toggle={'movingAverage'}
      />
    </Toggles>
  );
});

const Toggles = styled('div', {
  base: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
});

type LineToggleProps = {
  checked: boolean;
  color: string;
  label: string;
  toggle: keyof LineTogglesState;
  onChange: (key: keyof LineTogglesState, e: boolean) => void;
};

const LineToggle = memo<LineToggleProps>(function LineToggle({
  checked,
  color,
  label,
  toggle,
  onChange,
}) {
  const handleChange = useCallback<LabelledCheckboxProps['onChange']>(
    nowChecked => onChange(toggle, nowChecked),
    [toggle, onChange]
  );

  return (
    <LabelledCheckbox
      variant="dark"
      size="small"
      checked={checked}
      onChange={handleChange}
      label={<LineLabel style={{ '--line-color': color } as CSSProperties}>{label}</LineLabel>}
    />
  );
});

const LineLabel = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&::before': {
      content: '""',
      display: 'block',
      height: '2px',
      width: '12px',
      backgroundColor: 'var(--line-color, red)',
    },
  },
});
