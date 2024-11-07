import { memo } from 'react';
import { styled } from '@repo/styles/jsx';
import infoIcon from '@repo/images/icons/i.svg';
import { StatLoader } from '../../../../../components/StatLoader';

export type StatProps = {
  label: string;
  value: string;
  blurred?: boolean;
  loading?: boolean;
  onInfo?: () => void;
};

export const Stat = memo<StatProps>(function UserStat({
  label,
  value,
  onInfo,
  loading = false,
  blurred = false,
}) {
  return (
    <div>
      <Label>
        {label}{' '}
        {onInfo && (
          <button onClick={onInfo}>
            <img src={infoIcon} alt="More Info" />
          </button>
        )}
      </Label>
      <Value blurred={!loading && blurred}>
        {loading ? <StatLoader /> : blurred ? '$100' : value}
      </Value>
    </div>
  );
});

const Label = styled('div', {
  base: {
    textStyle: 'subline-lg',
    color: 'text.dark',
    display: 'inline-flex',
    gap: '4px',
  },
});

const Value = styled('div', {
  base: {
    textStyle: 'h2',
    color: 'text.light',
  },
  variants: {
    blurred: {
      true: {
        filter: 'blur(.5rem)',
        userSelect: 'none',
      },
    },
  },
});
