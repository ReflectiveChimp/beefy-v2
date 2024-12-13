import { memo, useCallback, useRef, useState } from 'react';
import { Button } from '../../../../../../components/Button';
import { useTranslation } from 'react-i18next';
import { ExtendedFilters } from './ExtendedFilters';
import { Dropdown } from '../../../../../../components/Dropdown';

export const ExtendedFiltersButtonDropdown = memo(function ExtendedFiltersButtonDropdown() {
  const { t } = useTranslation();
  const anchorEl = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return (
    <>
      <Button variant="filter" size="sm" ref={anchorEl} onClick={handleOpen} active={isOpen}>
        {t('Filter-Btn')}
      </Button>
      <Dropdown anchorEl={anchorEl} open={isOpen} onClose={handleClose} placement="bottom-end">
        <ExtendedFilters desktopView={true} />
      </Dropdown>
    </>
  );
});
