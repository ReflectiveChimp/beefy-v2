import type { ChangeEvent, FocusEventHandler, MouseEventHandler } from 'react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { ReactComponent as SearchIcon } from '@repo/images/icons/mui/Search.svg';
import { ReactComponent as CloseRounded } from '@repo/images/icons/mui/CloseRounded.svg';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';
import { BaseInput } from '../Input';

const useStyles = legacyMakeStyles(styles);

interface SearchProps {
  handleSearchText: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  handleClearText: () => void;
  searchText: string;
  css?: CssStyles;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  minLength?: number;
}

export const Search = memo(function Search({
  handleSearchText,
  searchText,
  handleClearText,
  css: cssProp,
  onClick,
  onFocus,
  onBlur,
  minLength = 0,
}: SearchProps) {
  const { t } = useTranslation();
  const classes = useStyles();

  const valueLength = searchText.length;
  const iconClass = classes.icon;
  const icon = useMemo(() => {
    return valueLength === 0 ? (
      <div className={iconClass}>
        <SearchIcon />
      </div>
    ) : (
      <button onClick={handleClearText} className={iconClass}>
        <CloseRounded />
      </button>
    );
  }, [valueLength, iconClass, handleClearText]);

  return (
    <BaseInput
      onFocus={onFocus}
      onBlur={onBlur}
      className={css(cssProp)}
      value={searchText}
      onChange={handleSearchText}
      fullWidth={true}
      endAdornment={icon}
      placeholder={t('Filter-Search')}
      onClick={onClick}
      warning={minLength > 0 && valueLength > 0 && valueLength < minLength}
    />
  );
});
