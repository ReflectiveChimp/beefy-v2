import type { ReactNode } from 'react';
import { memo, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import type { ChainEntity } from '../../../../../data/entities/chain';
import { filteredVaultsActions } from '../../../../../data/reducers/filtered-vaults';
import { selectActiveChains, selectChainById } from '../../../../../data/selectors/chains';
import type {
  DropdownItemLabelProps,
  SelectedItemProps,
} from '../../../../../../components/LabeledMultiSelect';
import { LabeledMultiSelect } from '../../../../../../components/LabeledMultiSelect';
import { useTranslation } from 'react-i18next';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';
import { getNetworkSrc } from '../../../../../../helpers/networkSrc';
import { useSelectedChainIds } from './hooks';
import { NewBadge } from '../../../../../../components/Header/components/Badges/NewBadge';

const useStyles = legacyMakeStyles(styles);

const IconWithChain = memo(function IconWithChain({
  chainId,
  label,
  css: cssProp,
}: {
  chainId: ChainEntity['id'];
  label: string;
  css?: CssStyles;
}) {
  const classes = useStyles();
  const chain = useAppSelector(state => selectChainById(state, chainId));

  return (
    <div className={css(styles.iconWithChain, cssProp)}>
      <img
        alt=""
        src={getNetworkSrc(chainId)}
        width={24}
        height={24}
        className={classes.iconWithChainIcon}
      />
      {label}
      {chain.new ? <NewBadge css={styles.badgeMobile} spacer={false} /> : null}
    </div>
  );
});

const SelectedChain = memo(function SelectedChain({
  value,
  options,
  allSelected,
  allSelectedLabel,
  countSelectedLabel,
}: SelectedItemProps<ChainEntity['id']>) {
  const { t } = useTranslation();
  let label: string | ReactNode;

  if (allSelected && allSelectedLabel) {
    label = t(allSelectedLabel);
  } else if (value.length === 1) {
    const chainId = value[0];
    label = (
      <IconWithChain
        chainId={chainId}
        label={options[chainId]!}
        css={styles.iconWithChainSelected}
      />
    );
  } else if (countSelectedLabel) {
    label = t(countSelectedLabel, { count: value.length });
  } else {
    label = 'missing label';
  }

  return <>{label}</>;
});

const ChainDropdownItemLabel = memo(function DropdownItem({
  label,
  value,
}: DropdownItemLabelProps<ChainEntity['id']>) {
  return <IconWithChain chainId={value} label={label} />;
});

export type ChainDropdownFilterProps = {
  css?: CssStyles;
};
export const ChainDropdownFilter = memo(function ChainDropdownFilter({
  css: cssProp,
}: ChainDropdownFilterProps) {
  const dispatch = useAppDispatch();
  const activeChains = useAppSelector(selectActiveChains);
  const selectedChainIds = useSelectedChainIds();
  const { t } = useTranslation();

  const handleChange = useCallback(
    (selected: ChainEntity['id'][]) => {
      dispatch(
        filteredVaultsActions.setChainIds(selected.length === activeChains.length ? [] : selected)
      );
    },
    [dispatch, activeChains]
  );

  const options: Partial<Record<ChainEntity['id'], string>> = useMemo(() => {
    return Object.fromEntries(activeChains.map(chain => [chain.id, chain.name]));
  }, [activeChains]);

  return (
    <LabeledMultiSelect<ChainEntity['id']>
      label={t('Filter-Chain')}
      onChange={handleChange}
      value={selectedChainIds}
      options={options}
      sortOptions="label"
      selectCss={cssProp}
      SelectedItemComponent={SelectedChain}
      DropdownItemLabelComponent={ChainDropdownItemLabel}
    />
  );
});
