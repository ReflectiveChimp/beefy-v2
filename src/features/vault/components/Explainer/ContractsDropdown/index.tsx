import { memo, useCallback, useRef, useState } from 'react';
import { Button } from '../../../../../components/Button';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ExpandMore } from '@repo/images/icons/mui/ExpandMore.svg';
import { ReactComponent as OpenInNewRounded } from '@repo/images/icons/mui/OpenInNewRounded.svg';
import { ClickAwayListener } from '@material-ui/core';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { Floating } from '../../../../../components/Floating';
import { css } from '@repo/styles/css';

interface ContractsDropdownProps {
  links: {
    label: string;
    link: string;
  }[];
}

const styles = {
  button: css.raw({
    textStyle: 'body',
    color: 'text.middle',
    padding: '2px 8px',
    justifyContent: 'space-between',
    gap: '4px',
    borderRadius: '4px',
    height: '28px',
  }),
  selectIcon: css.raw({
    height: '18px',
  }),
  selectOpenIcon: css.raw({
    transform: 'rotate(180deg)',
  }),
  dropdown: css.raw({
    padding: '2px 8px',
    backgroundColor: 'bayOfMany',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
  }),
  link: css.raw({
    textStyle: 'body',
    textDecoration: 'none',
    color: 'text.dark',
    minWidth: '106px',
    width: 'max-content',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    '&:hover': {
      cursor: 'pointer',
      color: 'text.white',
    },
  }),
};
const useStyles = legacyMakeStyles(styles);

export const ContractsDropdown = memo(function ContractsDropdown({
  links,
}: ContractsDropdownProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const anchorEl = useRef<HTMLButtonElement | null>(null);

  const handleChange = useCallback(() => {
    setOpen(value => !value);
  }, []);

  return (
    <>
      <Button css={css.raw(styles.button)} ref={anchorEl} onClick={handleChange}>
        {t('Contracts')}
        <ExpandMore className={css(styles.selectIcon, open && styles.selectOpenIcon)} />
      </Button>
      <Floating
        open={open}
        anchorEl={anchorEl}
        css={styles.dropdown}
        placement="bottom-end"
        display="flex"
        autoWidth={false}
        autoHeight={false}
      >
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <div>
            {links.map(({ label, link }) => (
              <a className={classes.link} key={label} href={link} target="_blank" rel="noopener">
                {label}
                <OpenInNewRounded fontSize="inherit" />
              </a>
            ))}
          </div>
        </ClickAwayListener>
      </Floating>
    </>
  );
});
