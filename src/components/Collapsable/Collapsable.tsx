import { ReactComponent as ExpandLess } from '@repo/images/icons/mui/ExpandLess.svg';
import { ReactComponent as ExpandMore } from '@repo/images/icons/mui/ExpandMore.svg';
import type { MouseEventHandler, ReactNode } from 'react';
import { memo, useCallback, useState } from 'react';
import { css, cva, type RecipeVariantProps } from '@repo/styles/css';

type CollapsableProps = {
  openByDefault?: boolean;
  children: ReactNode;
  title: ReactNode;
} & CollapseRecipeProps;

export const Collapsable = memo<CollapsableProps>(function Collapsable({
  openByDefault = false,
  children,
  title,
  variant,
}) {
  const [open, setOpen] = useState<boolean>(openByDefault);
  const collapsableStyles = collapseRecipe({ variant });
  const handleCollapse = useCallback(() => {
    setOpen(prevStatus => !prevStatus);
  }, [setOpen]);

  return (
    <div className={collapsableStyles}>
      <Header onClick={handleCollapse} variant={variant} open={open}>
        {title}
        {open ? <CloseIcon /> : <OpenIcon />}
      </Header>
      {open && <Content variant={variant} children={children} />}
    </div>
  );
});

const collapseRecipe = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    borderRadius: '12px',
  },
  variants: {
    variant: {
      transparent: {},
      light: {
        background: 'background.contentLight',
      },
      primary: {
        background: 'background.contentPrimary',
      },
      card: {
        background: 'background.contentPrimary',
        gap: '0',
        padding: '0',
      },
    },
  },
  defaultVariants: {
    variant: 'transparent',
  },
});

type CollapseRecipeProps = NonNullable<RecipeVariantProps<typeof collapseRecipe>>;

const contentRecipe = cva({
  base: {},
  variants: {
    variant: {
      transparent: {},
      light: {},
      primary: {},
      card: {
        padding: '24px',
      },
    },
  },
  defaultVariants: {
    variant: 'transparent',
  },
});

type ContentRecipeProps = NonNullable<RecipeVariantProps<typeof contentRecipe>>;

const Content = memo(function Header({
  variant,
  ...props
}: {
  children: ReactNode;
} & ContentRecipeProps) {
  return <div className={contentRecipe({ variant })} {...props} />;
});

const headerRecipe = cva({
  base: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderRadius: '12px',
  },
  variants: {
    variant: {
      transparent: {},
      light: {},
      primary: {},
      card: {
        backgroundColor: 'background.contentDark',
        padding: '24px',
      },
    },
    open: {
      true: {
        borderRadius: '12px 12px 0 0',
      },
    },
  },
  defaultVariants: {
    variant: 'transparent',
  },
});

type HeaderRecipeProps = NonNullable<RecipeVariantProps<typeof headerRecipe>>;

const Header = memo(function Header({
  variant,
  open,
  ...props
}: {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
} & HeaderRecipeProps) {
  return <button className={headerRecipe({ variant, open })} {...props} />;
});

const iconStyles = css({
  fill: 'text.primary',
});

const CloseIcon = memo(function CloseIcon() {
  return <ExpandLess className={iconStyles} />;
});

const OpenIcon = memo(function OpenIcon() {
  return <ExpandMore className={iconStyles} />;
});
