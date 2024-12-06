import { memo } from 'react';
import { styles } from './styles';
import { useAppSelector } from '../../../../../../store';
import { selectChainById } from '../../../../../data/selectors/chains';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { formatLargeUsd } from '../../../../../../helpers/format';
import type { ChainEntity } from '../../../../../data/entities/chain';
import {
  selectTreasuryBalanceByChainId,
  selectTreasuryBalanceByMMId,
} from '../../../../../data/selectors/treasury';

import { Assets, MMAssets } from '../Assets';
import { css } from '@repo/styles/css';
import { ExplorerLinks } from '../../../ExplorerLinks';
import { getNetworkSrc } from '../../../../../../helpers/networkSrc';
import { getPartnerSrc } from '../../../../../../helpers/partnerSrc';
import { Tooltip } from '../../../../../../components/Tooltip';
import { BasicTooltipContent } from '../../../../../../components/Tooltip/BasicTooltipContent';
import { useTranslation } from 'react-i18next';

const useStyles = legacyMakeStyles(styles);

interface ChainHoldingProps {
  chainId: ChainEntity['id'];
}

interface MMHoldingProps {
  mmId: string;
}

export const ChainHolding = memo(function ChainHolding({ chainId }: ChainHoldingProps) {
  const totalUsd = useAppSelector(state => selectTreasuryBalanceByChainId(state, chainId));

  const classes = useStyles();
  const chain = useAppSelector(state => selectChainById(state, chainId));

  return (
    <div className={classes.container}>
      <div className={css(styles.title, styles[`headerNetwork-${chainId}`])}>
        <div className={classes.nameContainer}>
          <img className={classes.icon} src={getNetworkSrc(chainId)} alt={chainId} />
          <div className={classes.chainName}>{chain.name}</div>
          <ExplorerLinks chainId={chainId} />
        </div>
        <div className={classes.usdValue}>{formatLargeUsd(totalUsd)}</div>
      </div>
      <Assets chainId={chainId} />
    </div>
  );
});

export const MMHolding = memo(function MMHolding({ mmId }: MMHoldingProps) {
  const classes = useStyles();
  const { t } = useTranslation();

  const totalUsd = useAppSelector(state => selectTreasuryBalanceByMMId(state, mmId));
  return (
    <div className={classes.container}>
      <div className={css(styles.title, styles[`headerMM-${mmId.toLowerCase()}`])}>
        <div className={classes.mmNameContainer}>
          <img className={classes.icon} src={getPartnerSrc(mmId.toLowerCase())} alt={mmId} />
          <div className={classes.mmName}>{mmId}</div>
          <Tooltip
            content={<BasicTooltipContent title={t('MarketMaker-Managed')} />}
            placement="top"
          >
            <div className={classes.marketMakerAnnotation}>MM</div>
          </Tooltip>
        </div>
        <div className={classes.usdValue}>{formatLargeUsd(totalUsd)}</div>
      </div>
      <MMAssets mmId={mmId} />
    </div>
  );
});
