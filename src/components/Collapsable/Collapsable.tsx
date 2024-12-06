import { legacyMakeStyles } from '@repo/helpers/mui';
import { ReactComponent as ExpandLess } from '@repo/images/icons/mui/ExpandLess.svg';
import { ReactComponent as ExpandMore } from '@repo/images/icons/mui/ExpandMore.svg';
import { css, type CssStyles } from '@repo/styles/css';
import type { ReactNode } from 'react';
import { memo, useCallback, useState } from 'react';
import { Button } from '../Button';
import { styles } from './styles';
import { Collapse } from '../Collapse';

interface CollapsableProps {
  openByDefault?: boolean;
  children: ReactNode;
  containerCss?: CssStyles;
  titleCss?: CssStyles;
  title: string;
}

const useStyles = legacyMakeStyles(styles);

export const Collapsable = memo(function Collapsable({
  openByDefault = false,
  children,
  containerCss,
  titleCss,
  title,
}: CollapsableProps) {
  const [open, setOpen] = useState<boolean>(openByDefault);

  const classes = useStyles();

  const handleCollapse = useCallback(() => {
    setOpen(prevStatus => !prevStatus);
  }, []);

  return (
    <div className={css(containerCss, styles.container)}>
      <Button fullWidth={true} onClick={handleCollapse} css={styles.title}>
        <div className={css(titleCss)}>{title}</div>
        {open ? (
          <ExpandLess className={classes.titleIcon} />
        ) : (
          <ExpandMore className={classes.titleIcon} />
        )}
      </Button>
      <Collapse in={open}>{children}</Collapse>
    </div>
  );
});
