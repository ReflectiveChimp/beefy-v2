import { memo, type MutableRefObject, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Floating } from '../../../../../components/Floating';
import { css } from '@repo/styles/css';

const dropdownCss = css.raw({
  textStyle: 'body.med',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: 'text.dark',
  padding: '6px 12px',
  backgroundColor: 'background.content',
  border: '2px solid {colors.bayOfMany}',
  borderRadius: '8px',
  marginTop: '4px',
  minWidth: '250px',
  zIndex: 'tooltip',
});

interface FloatingErrorProps {
  userInput: string;
  inputMode: 'address' | 'domain';
  isAddressValid: boolean;
  isDomainValid: boolean;
  isDomainResolving: boolean;
  anchorRef: RefObject<HTMLInputElement> | MutableRefObject<HTMLInputElement>;
}

export const FloatingError = memo(function FloatingError({
  userInput,
  inputMode,
  isAddressValid,
  isDomainValid,
  isDomainResolving,
  anchorRef,
}: FloatingErrorProps) {
  const { t } = useTranslation();

  if (!isDomainResolving && inputMode === 'domain') {
    return (
      <Floating
        open={!isDomainValid}
        placement="bottom-start"
        anchorEl={anchorRef}
        css={dropdownCss}
        display="flex"
        autoWidth={false}
      >
        <div>{t('Dashboard-SearchInput-Invalid-Domain')}</div>
      </Floating>
    );
  }

  if (inputMode === 'address' && userInput.toLowerCase().startsWith('0x')) {
    return (
      <Floating
        open={!isAddressValid}
        placement="bottom-start"
        anchorEl={anchorRef}
        css={dropdownCss}
        display="flex"
        autoWidth={false}
      >
        <div>{t('Dashboard-SearchInput-Invalid-Address')}</div>
      </Floating>
    );
  }

  return null;
});
