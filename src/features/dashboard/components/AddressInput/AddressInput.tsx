import { CircularProgress, InputBase } from '@material-ui/core';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { ReactComponent as CloseRounded } from '@repo/images/icons/mui/CloseRounded.svg';
import { ReactComponent as Search } from '@repo/images/icons/mui/Search.svg';
import {
  type ChangeEvent,
  type KeyboardEvent,
  memo,
  type MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';
import { isMaybeDomain, isValidAddress } from '../../../../helpers/addresses';
import { FloatingError } from './FloatingError';
import { useResolveDomain } from '../../../data/hooks/resolver';
import {
  isFulfilledStatus,
  isPendingStatus,
  isRejectedStatus,
} from '../../../data/reducers/wallet/resolver-types';

const useStyles = legacyMakeStyles(styles);

export const AddressInput = memo(function AddressInput({ css: cssProp }: { css?: CssStyles }) {
  const [userInput, setUserInput] = useState<string>('');
  const [inputMode, setInputMode] = useState<'address' | 'domain'>('address');
  const resolverStatus = useResolveDomain(inputMode === 'domain' ? userInput : '');
  const [isDomainValid, setIsDomainValid] = useState<boolean>(false);
  const [isDomainResolving, setIsDomainResolving] = useState<boolean>(false);
  const [hasFocus, setHasFocus] = useState<boolean>(false);
  const { t } = useTranslation();
  const anchorEl = useRef<HTMLInputElement>();
  const history = useHistory();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      if (isMaybeDomain(input)) {
        setInputMode('domain');
      } else {
        setInputMode('address');
      }
      setUserInput(input);
    },
    [setUserInput, setInputMode]
  );

  const handleClear = useCallback(() => {
    setUserInput('');
    setInputMode('address');
  }, []);

  const isAddressValid = useMemo(() => {
    return inputMode === 'address' && isValidAddress(userInput);
  }, [inputMode, userInput]);

  const isValid = useMemo(() => isAddressValid || isDomainValid, [isAddressValid, isDomainValid]);

  const handleGoToDashboardOnEnterKey = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' && isValid) {
        history.push(`/dashboard/${userInput}`);
        handleClear();
      }
    },
    [userInput, handleClear, history, isValid]
  );

  const handleFocus = useCallback(() => {
    setHasFocus(true);
  }, [setHasFocus]);

  const handleBlur = useCallback(() => {
    setHasFocus(false);
  }, [setHasFocus]);

  useEffect(() => {
    if (isMaybeDomain(userInput)) {
      setInputMode('domain');
    } else {
      setInputMode('address');
    }
  }, [userInput, setInputMode]);

  useEffect(() => {
    if (inputMode === 'domain') {
      if (isFulfilledStatus(resolverStatus)) {
        setIsDomainValid(true);
        setIsDomainResolving(false);
      } else if (isRejectedStatus(resolverStatus)) {
        setIsDomainValid(false);
        setIsDomainResolving(false);
      } else {
        setIsDomainValid(false);
        setIsDomainResolving(true);
      }
    } else {
      setIsDomainValid(false);
      setIsDomainResolving(false);
    }
  }, [inputMode, resolverStatus, setIsDomainValid, setIsDomainResolving]);

  return (
    <>
      <InputBase
        ref={anchorEl}
        className={css(styles.search, cssProp, userInput.length !== 0 && styles.active)}
        value={userInput}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        fullWidth={true}
        onKeyPress={handleGoToDashboardOnEnterKey}
        endAdornment={
          <GoToDashboardButton
            domainResolving={isDomainResolving}
            isValid={isValid}
            userInput={userInput}
            handleClear={handleClear}
            inputMode={inputMode}
          />
        }
        placeholder={t('Dashboard-SearchInput-Placeholder')}
      />
      {hasFocus &&
      !isValid &&
      userInput.length > 0 &&
      !isPendingStatus(resolverStatus) &&
      !isFulfilledStatus(resolverStatus) ? (
        <FloatingError
          userInput={userInput}
          anchorRef={anchorEl as MutableRefObject<HTMLInputElement>}
          inputMode={inputMode}
          isAddressValid={isAddressValid}
          isDomainValid={isDomainValid}
          isDomainResolving={isDomainResolving}
        />
      ) : null}
    </>
  );
});

interface GoToDashboardButtonProps {
  isValid: boolean;
  userInput: string;
  handleClear: () => void;
  domainResolving: boolean;
  inputMode: 'address' | 'domain';
}

const GoToDashboardButton = memo(function GoToDashboardButton({
  isValid,
  userInput,
  handleClear,
  domainResolving,
  inputMode,
}: GoToDashboardButtonProps) {
  const classes = useStyles();

  if (domainResolving && inputMode === 'domain')
    return (
      <div className={classes.flex}>
        <CircularProgress
          disableShrink={true}
          thickness={4}
          size={23}
          className={css(styles.loader, styles.disabledIcon)}
        />
      </div>
    );

  if (isValid) {
    return (
      <Link
        onClick={handleClear}
        className={css(styles.icon, styles.activeIcon)}
        aria-disabled={isValid}
        to={`/dashboard/${userInput}`}
      >
        <Search />
      </Link>
    );
  }

  if (userInput.length !== 0) {
    return (
      <button onClick={handleClear} className={css(styles.icon, styles.activeIcon)}>
        <CloseRounded />
      </button>
    );
  }

  return (
    <div className={css(styles.icon, styles.disabledIcon)}>
      <Search />
    </div>
  );
});
