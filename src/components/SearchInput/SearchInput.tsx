import { memo, useCallback, useMemo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';
import { ReactComponent as CloseRounded } from '@repo/images/icons/mui/CloseRounded.svg';
import { ReactComponent as Search } from '@repo/images/icons/mui/Search.svg';
import { BaseInput } from '../Input';

const useStyles = legacyMakeStyles(styles);

export type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};
export const SearchInput = memo(function SearchInput({ value, onChange }: SearchInputProps) {
  const { t } = useTranslation();
  const classes = useStyles();

  const handleChange = useCallback(
    e => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  const valueLength = value.length;
  const iconClass = classes.icon;
  const icon = useMemo(() => {
    return valueLength === 0 ? (
      <div className={iconClass}>
        <Search />
      </div>
    ) : (
      <button onClick={handleClear} className={iconClass}>
        <CloseRounded />
      </button>
    );
  }, [valueLength, handleClear, iconClass]);

  return (
    <BaseInput
      value={value}
      onChange={handleChange}
      fullWidth={true}
      endAdornment={icon}
      placeholder={t('OnRamp-SearchInput-Placeholder')}
    />
  );
});
