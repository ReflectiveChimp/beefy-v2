import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../vault/components/Card';
import { ReactComponent as CloseIcon } from '@repo/images/icons/mui/Close.svg';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../../../components/Button';
import { styled } from '@repo/styles/jsx';
import { CardIconButton } from '../../../../vault/components/Card/CardIconButton';
import { Chains } from './Chains';

export type ModalTvlProps = {
  close: () => void;
};

export const ModalTvl = memo<ModalTvlProps>(function ModalTvl({ close }: ModalTvlProps) {
  const { t } = useTranslation();

  return (
    <Card width="lg">
      <CardHeader>
        <CardTitle>{t('TVL-bychain')}</CardTitle>
        <CardIconButton onClick={close}>
          <CloseIcon />
        </CardIconButton>
      </CardHeader>
      <StyledCardContent>
        <Chains />
        <Button onClick={close} fullWidth={true}>
          {t('Close')}
        </Button>
      </StyledCardContent>
    </Card>
  );
});

const StyledCardContent = styled(CardContent, {
  base: {
    gap: '24px',
    minHeight: '200px',
    flexShrink: 1,
  },
});
