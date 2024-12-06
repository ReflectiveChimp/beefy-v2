import { memo, useCallback } from 'react';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';

export type CardTabProps = {
  selected: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: string) => void;
  css?: CssStyles;
  highlight?: string;
};

export const CardsTabs = memo(function CardsTabs({
  selected,
  options,
  onChange,
  css: cssProp,
  highlight,
}: CardTabProps) {
  return (
    <div className={css(styles.tabs, cssProp)}>
      {options.map(({ value, label }) => (
        <Tab
          key={value}
          label={label}
          value={value}
          onChange={onChange}
          selected={selected === value}
          highlight={highlight === value}
        />
      ))}
    </div>
  );
});

type TabProps = {
  value: string;
  label: string;
  onChange: (selected: string) => void;
  selected: boolean;
  css?: CssStyles;
  highlight?: boolean;
};
const Tab = memo(function Tab({
  value,
  label,
  onChange,
  selected,
  highlight,
  css: cssProp,
}: TabProps) {
  const handleClick = useCallback(() => {
    onChange(value);
  }, [value, onChange]);

  return (
    <button
      className={css(
        styles.tab,
        cssProp,
        selected && styles.selectedTab,
        highlight && styles.highlightTab
      )}
      onClick={handleClick}
    >
      {label}
    </button>
  );
});
