import { type ChangeEventHandler, memo, useCallback, useMemo } from 'react';
import { InputBase } from '@material-ui/core';
import { styles } from './styles';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import { selectBridgeFormState } from '../../../../../data/selectors/bridge';
import { css, type CssStyles } from '@repo/styles/css';
import { bridgeActions } from '../../../../../data/reducers/wallet/bridge';
import { isAddress } from 'viem';
import { selectChainById } from '../../../../../data/selectors/chains';
import {
  LabelledCheckbox,
  type LabelledCheckboxProps,
} from '../../../../../../components/LabelledCheckbox';

type ReceiverSelectorProps = {
  css?: CssStyles;
};

export const ReceiverSelector = memo(function ReceiverSelector({
  css: cssProp,
}: ReceiverSelectorProps) {
  const dispatch = useAppDispatch();
  const { receiverAddress, receiverIsDifferent, to } = useAppSelector(selectBridgeFormState);
  const chain = useAppSelector(state => selectChainById(state, to));
  const addressError = useMemo(() => {
    if (receiverIsDifferent) {
      if (!receiverAddress) {
        return 'Address is required';
      }
      if (!isAddress(receiverAddress, { strict: true })) {
        return 'Invalid address';
      }
    }
    return undefined;
  }, [receiverIsDifferent, receiverAddress]);
  const handleAddressChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => {
      dispatch(bridgeActions.setReceiverAddress(e.target.value));
    },
    [dispatch]
  );
  const handleReceiverToggle = useCallback<LabelledCheckboxProps['onChange']>(
    checked => {
      dispatch(bridgeActions.setReceiverIsDifferent(checked));
    },
    [dispatch]
  );

  return (
    <div className={css(styles.group, cssProp)}>
      <LabelledCheckbox
        checkboxCss={styles.checkbox}
        labelCss={styles.label}
        iconCss={styles.check}
        checkedIconCss={styles.checkedIcon}
        label={`My ${chain.name} address is different`}
        checked={receiverIsDifferent}
        onChange={handleReceiverToggle}
      />
      {receiverIsDifferent ? (
        <InputBase
          className={css(styles.input)}
          value={receiverAddress || ''}
          onChange={handleAddressChange}
          error={addressError !== undefined}
          placeholder="0x...."
        />
      ) : null}
    </div>
  );
});
