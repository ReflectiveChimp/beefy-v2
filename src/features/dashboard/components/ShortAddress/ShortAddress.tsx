import { memo, type MouseEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { formatAddressShort, formatDomain } from '../../../../helpers/format';
import { Tooltip } from '../../../../components/Tooltip';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { useBreakpoint } from '../../../../components/MediaQueries/useBreakpoint';

const useStyles = legacyMakeStyles(styles);

export type ShortAddressProps = {
  address: string;
  addressLabel?: string;
};

export const ShortAddress = memo(function ShortAddress({
  address,
  addressLabel,
}: ShortAddressProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [showCopied, setShowCopied] = useState<boolean>(false);
  const mdUp = useBreakpoint({ from: 'sm' });

  const handleCopyAddressToClipboard = useCallback<MouseEventHandler<HTMLDivElement>>(
    e => {
      if (e) {
        e.preventDefault();
      }
      navigator.clipboard
        .writeText(address)
        .then(() => setShowCopied(true))
        .catch(e => console.error(e));
    },
    [address, setShowCopied]
  );

  const shortAddressLabel = useMemo(() => {
    if (addressLabel) {
      return mdUp ? formatDomain(addressLabel, 20) : formatDomain(addressLabel);
    }

    return formatAddressShort(address);
  }, [addressLabel, address, mdUp]);

  useEffect(() => {
    if (showCopied) {
      const handle = setTimeout(() => {
        setShowCopied(false);
      }, 3000);
      return () => clearTimeout(handle);
    }
  }, [showCopied, setShowCopied]);

  if (address) {
    return (
      <Tooltip
        onTriggerClick={handleCopyAddressToClipboard}
        propagateTriggerClick={false}
        contentCss={styles.longAddress}
        triggerCss={styles.triggerClass}
        tooltipCss={styles.tooltipContent}
        children={<div className={classes.shortAddress}>{`(${shortAddressLabel})`}</div>}
        content={showCopied ? t('Clipboard-Copied') : address}
      />
    );
  }

  return null;
});
