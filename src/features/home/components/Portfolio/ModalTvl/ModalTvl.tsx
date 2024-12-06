import { IconButton } from '@material-ui/core';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { forwardRef, memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../vault/components/Card';
import { ReactComponent as CloseIcon } from '@repo/images/icons/mui/Close.svg';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';
import { selectActiveChainIds, selectChainById } from '../../../../data/selectors/chains';
import type { ChainEntity } from '../../../../data/entities/chain';
import { selectTvlByChain } from '../../../../data/selectors/tvl';
import { type BigNumber } from 'bignumber.js';
import { formatLargeUsd } from '../../../../../helpers/format';
import { ContentLoading } from '../../../../../components/ContentLoading';
import { Button } from '../../../../../components/Button';
import { useAppSelector } from '../../../../../store';
import { orderBy } from 'lodash-es';
import { getNetworkSrc } from '../../../../../helpers/networkSrc';
import { entries } from '../../../../../helpers/object';

const useStyles = legacyMakeStyles(styles);

export type ModalTvlProps = {
  close: () => void;
};

const _ModalTvl = forwardRef<HTMLDivElement, ModalTvlProps>(function ModalTvl({ close }, ref) {
  const classes = useStyles();
  const { t } = useTranslation();
  const tvls = useAppSelector(selectTvlByChain);
  const activeChainIds = useAppSelector(selectActiveChainIds);

  const sortedTvls = useMemo(() => {
    return orderBy(
      entries(tvls)
        .filter((entry): entry is [ChainEntity['id'], BigNumber] => !!(entry && entry[1]))
        .filter(([chainId]) => activeChainIds.includes(chainId))
        .map(([chainId, tvl]) => ({
          chainId,
          tvl,
        })),
      e => e.tvl.toNumber(),
      'desc'
    );
  }, [tvls, activeChainIds]);

  return (
    <div className={classes.holder} ref={ref} tabIndex={-1}>
      <Card css={styles.card}>
        <CardHeader css={styles.header}>
          <CardTitle titleCss={styles.title} title={t('TVL-bychain')} />
          <IconButton className={classes.closeIcon} onClick={close} aria-label="settings">
            <CloseIcon color="#D0D0DA" />
          </IconButton>
        </CardHeader>
        <CardContent css={styles.content}>
          <div className={classes.gridScroller}>
            <div className={classes.grid}>
              {sortedTvls.map(item => (
                <Chain key={item.chainId} chainId={item.chainId} tvl={item.tvl} />
              ))}
            </div>
          </div>
          <Button onClick={close} fullWidth={true} css={styles.closeButton}>
            {t('Close')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
});

export const ModalTvl = memo<ModalTvlProps>(_ModalTvl);

type ChainProps = {
  chainId: ChainEntity['id'];
  tvl: BigNumber;
};
const Chain = memo(function Chain({ chainId, tvl }: ChainProps) {
  const classes = useStyles();
  const chain = useAppSelector(state => selectChainById(state, chainId));

  return (
    <div className={classes.chain}>
      <img className={classes.chainLogo} alt={chain.id} src={getNetworkSrc(chain.id)} />
      <div>
        <div className={classes.chainText}>{chain.name}</div>
        <>
          {tvl ? (
            <div className={classes.chainValue}>{formatLargeUsd(tvl)}</div>
          ) : (
            <ContentLoading />
          )}
        </>
      </div>
    </div>
  );
});
