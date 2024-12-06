import { memo, useCallback } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import type { VaultEntity } from '../../../data/entities/vault';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { ReactComponent as BookmarkBorder } from '@repo/images/icons/mui/BookmarkBorder.svg';
import { ReactComponent as Bookmark } from '@repo/images/icons/mui/Bookmark.svg';
import { savedVaultsActions } from '../../../data/reducers/saved-vaults';
import { selectIsVaultIdSaved } from '../../../data/selectors/saved-vaults';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';
import { Button } from '../../../../components/Button';

const useStyles = legacyMakeStyles(styles);

interface SaveButtonProps {
  vaultId: VaultEntity['id'];
  css?: CssStyles;
}

export const SaveButton = memo(function SaveButton({ vaultId, css: cssProp }: SaveButtonProps) {
  const classes = useStyles();

  const dispatch = useAppDispatch();

  const isSaved = useAppSelector(state => selectIsVaultIdSaved(state, vaultId));

  const handleSave = useCallback(() => {
    dispatch(savedVaultsActions.setSavedVaultIds(vaultId));
  }, [dispatch, vaultId]);

  return (
    <Button borderless={true} css={css.raw(styles.shareButton, cssProp)} onClick={handleSave}>
      {isSaved ? (
        <Bookmark className={classes.icon} />
      ) : (
        <BookmarkBorder className={classes.icon} />
      )}
    </Button>
  );
});
