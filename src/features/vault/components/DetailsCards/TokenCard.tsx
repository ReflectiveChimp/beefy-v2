import { legacyMakeStyles } from '@repo/helpers/mui';
import { useTranslation } from 'react-i18next';
import { fetchAddressBookAction } from '../../../data/actions/tokens';
import type { ChainEntity } from '../../../data/entities/chain';
import type { TokenEntity } from '../../../data/entities/token';
import { isTokenErc20, isTokenNative } from '../../../data/entities/token';
import { selectChainById } from '../../../data/selectors/chains';
import {
  selectIsAddressBookLoaded,
  selectShouldInitAddressBook,
} from '../../../data/selectors/data-loader';
import { selectIsTokenLoaded, selectTokenById } from '../../../data/selectors/tokens';
import { styles } from './styles';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { AssetsImage } from '../../../../components/AssetsImage';
import { selectBridgeByIdIfKnown } from '../../../data/selectors/bridges';
import { BridgeTag, NativeTag } from '../BridgeTag';
import { explorerTokenUrl } from '../../../../helpers/url';
import { PriceWithChange } from '../../../../components/PriceWithChange/PriceWithChange';
import { IconButtonLink } from '../../../../components/IconButtonLink/IconButtonLink';
import { ReactComponent as Code } from '@repo/images/icons/mui/Code.svg';
import { ReactComponent as Link } from '@repo/images/icons/mui/Link.svg';
import { ReactComponent as DocsIcon } from '../../../../images/icons/navigation/docs.svg';
import { memo, useEffect } from 'react';

const useStyles = legacyMakeStyles(styles);

function TokenCardDisplay({ token }: { token: TokenEntity }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const chain = useAppSelector(state => selectChainById(state, token.chainId));
  const isErc20 = isTokenErc20(token);
  const isNative = isTokenNative(token) || (isErc20 && token.bridge === 'native');
  const bridge = useAppSelector(state =>
    isErc20 && token.bridge && !isNative ? selectBridgeByIdIfKnown(state, token.bridge) : undefined
  );

  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <div className={classes.assetIconSymbol}>
          <AssetsImage
            assetSymbols={[token.symbol]}
            chainId={chain.id}
            size={24}
            css={styles.assetIcon}
          />
          <div className={classes.assetSymbol}>{token.symbol}</div>
        </div>
        <div className={classes.assetLinks}>
          {token.website && (
            <IconButtonLink
              Icon={Link}
              text={t('Token-Site')}
              href={token.website}
              css={styles.assetWebsite}
              textCss={styles.assetLinkText}
            />
          )}
          {isErc20 && (
            <IconButtonLink
              Icon={Code}
              href={explorerTokenUrl(chain, token.address)}
              text={t('Token-Contract')}
              css={styles.assetContract}
              textCss={styles.assetLinkText}
            />
          )}
          {token.documentation && (
            <IconButtonLink
              Icon={DocsIcon}
              href={token.documentation}
              text={t('Token-Docs')}
              css={styles.assetDocumentation}
              textCss={styles.assetLinkText}
            />
          )}
        </div>
        <div className={classes.assetBridgePrice}>
          {isNative ? (
            <NativeTag chain={chain} css={styles.assetBridge} />
          ) : bridge ? (
            <BridgeTag bridge={bridge} chain={chain} css={styles.assetBridge} />
          ) : null}
          <PriceWithChange oracleId={token.oracleId} css={styles.assetPrice} />
        </div>
      </div>
      <div className={classes.description}>
        {token.description ? token.description : t('Token-NoDescrip')}
      </div>
    </div>
  );
}

function TokenCardComponent({
  chainId,
  tokenId,
}: {
  chainId: ChainEntity['id'];
  tokenId: TokenEntity['id'];
}) {
  const tokenLoaded = useAppSelector(
    state =>
      (selectIsAddressBookLoaded(state, chainId) && selectIsTokenLoaded(state, chainId, tokenId)) ||
      false
  );
  const token = useAppSelector(state =>
    tokenLoaded ? selectTokenById(state, chainId, tokenId) : null
  );
  const shouldInitAddressBook = useAppSelector(state =>
    selectShouldInitAddressBook(state, chainId)
  );
  // initialize addressbook
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (shouldInitAddressBook) {
      dispatch(fetchAddressBookAction({ chainId: chainId }));
    }
  }, [dispatch, chainId, shouldInitAddressBook]);

  // sometimes we have mooX tokens in the asset list
  // so we never know if a token will ever load or not
  // see: vault beets-sound-of-moosic
  if (!tokenLoaded || !token) {
    return <></>;
  }

  return <TokenCardDisplay token={token} />;
}

export const TokenCard = memo(TokenCardComponent);
