import { type FC, memo, useCallback, useMemo, useState } from 'react';
import { StatSwitcher } from '../StatSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { useTranslation } from 'react-i18next';
import { AssetsCard } from '../AssetsCard';
import type { VaultEntity } from '../../../data/entities/vault';
import { PlatformsCard } from '../PlatformsCard';
import { css } from '@repo/styles/css';

interface DetailsProps {
  vaultId: VaultEntity['id'];
}

const detailsToComponent = {
  platform: PlatformsCard,
  assets: AssetsCard,
} as const satisfies Record<string, FC<DetailsProps>>;

type TabType = keyof typeof detailsToComponent;

const styles = {
  header: css.raw({
    sm: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    smDown: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '16px',
    },
  }),
  content: css.raw({
    gap: '16px',
  }),
};

export const Details = memo(function Details({ vaultId }: DetailsProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabType>('assets');

  const tabs = useMemo(() => {
    return { assets: t('Details-Assets'), platform: t('Details-Platform') };
  }, [t]);

  const onTabChange = useCallback(
    (newTab: string) => {
      setTab(newTab as TabType);
    },
    [setTab]
  );

  const DetailsComponent = detailsToComponent[tab];

  return (
    <Card>
      <CardHeader css={styles.header}>
        <CardTitle title={'Details'} />
        <StatSwitcher onChange={onTabChange} options={tabs} stat={tab} />
      </CardHeader>
      <CardContent css={styles.content}>
        <DetailsComponent vaultId={vaultId} />
      </CardContent>
    </Card>
  );
});
