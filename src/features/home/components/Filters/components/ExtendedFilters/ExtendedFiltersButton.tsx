import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './Sidebar';
import { ExtendedFilters } from './ExtendedFilters';
import { styled } from '@repo/styles/jsx';
import { FilterButton, FilterTriggerButton } from '../FilterButton';
import { FloatingDropdown } from '../../../../../../components/Floating/FloatingDropdown';
import { FloatingProvider } from '../../../../../../components/Floating/FloatingProvider';

export type ExtendedFiltersButtonProps = {
  view: 'dropdown' | 'sidebar';
};

export const ExtendedFiltersButton = memo<ExtendedFiltersButtonProps>(
  function ExtendedFiltersButton({ view }) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = useCallback(() => {
      setIsOpen(false);
    }, [setIsOpen]);

    const handleOpen = useCallback(() => {
      setIsOpen(true);
    }, [setIsOpen]);

    if (view === 'dropdown') {
      return (
        <FloatingProvider open={isOpen} onChange={setIsOpen} placement="bottom-end" role="dialog">
          <FilterTriggerButton>{t('Filter-Btn')}</FilterTriggerButton>
          {isOpen && (
            <Dropdown>
              <ExtendedFilters desktopView={true} />
            </Dropdown>
          )}
        </FloatingProvider>
      );
    }

    return (
      <>
        <FilterButton onClick={handleOpen} fullWidth={true}>
          {t('Filter-Btn')}
        </FilterButton>
        <Sidebar open={isOpen} onClose={handleClose} />
      </>
    );
  }
);

const Dropdown = styled(FloatingDropdown, {
  base: {
    zIndex: 'dropdown',
    width: '350px',
    maxWidth: 'calc(100vw - 32px)',
    backgroundColor: 'background.contentPrimary',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0px 4px 24px 24px rgba(19, 17, 34, 0.16), 0px 2px 8px rgba(20, 18, 33, 0.2)',
  },
});
