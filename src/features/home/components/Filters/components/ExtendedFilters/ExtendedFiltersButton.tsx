import { memo, type MutableRefObject, useCallback, useRef, useState } from 'react';
import { type CssStyles } from '@repo/styles/css';
import { Button } from '../../../../../../components/Button';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './Sidebar';
import { ExtendedFilters } from './ExtendedFilters';
import { Dropdown } from '../../../../../../components/Dropdown';

export type ExtendedFiltersButtonProps = {
  desktopView: boolean;
  css?: CssStyles;
};
export const ExtendedFiltersButton = memo(function ExtendedFiltersButton({
  desktopView,
  css: cssProp,
}: ExtendedFiltersButtonProps) {
  const { t } = useTranslation();
  const anchorEl = useRef<HTMLButtonElement>();
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return (
    <>
      <Button
        css={cssProp}
        variant="filter"
        size="sm"
        ref={anchorEl as MutableRefObject<HTMLButtonElement>}
        onClick={handleOpen}
        active={isOpen}
      >
        {t('Filter-Btn')}
      </Button>
      {desktopView ? (
        <Dropdown
          anchorEl={anchorEl as MutableRefObject<HTMLButtonElement>}
          open={isOpen}
          onClose={handleClose}
          placement="bottom-end"
        >
          <ExtendedFilters desktopView={true} />
        </Dropdown>
      ) : (
        <Sidebar open={isOpen} onClose={handleClose} />
      )}
    </>
  );
});
