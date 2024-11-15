import type { MouseEventHandler, ReactNode } from 'react';
import { memo, useCallback } from 'react';
import { ReactComponent as CheckBoxOutlineBlank } from '@repo/images/icons/mui/CheckBoxOutlineBlank.svg';
import { ReactComponent as CheckBoxOutlined } from '@repo/images/icons/mui/CheckBoxOutlined.svg';
import { styled } from '@repo/styles/jsx';
import type { StyledVariantProps } from '@repo/styles/types';
import { cva } from '@repo/styles/css';

export type LabelledCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
} & Exclude<CheckboxVariants, 'checked'>;

export const LabelledCheckbox = memo<LabelledCheckboxProps>(function ButtonLink({
  checked,
  onChange,
  label,
  ...rest
}) {
  const handleChange = useCallback<MouseEventHandler<HTMLLabelElement>>(
    e => {
      e.stopPropagation();
      onChange(!checked);
    },
    [onChange, checked]
  );
  const Icon = checked ? CheckedIcon : UncheckedIcon;

  return (
    <Checkbox onClick={handleChange} checked={checked} {...rest}>
      <Icon />
      <Label>{label}</Label>
    </Checkbox>
  );
});

type CheckboxVariants = StyledVariantProps<typeof Checkbox>;

const Checkbox = styled('label', {
  base: {
    '--checkbox-icon-color': '{colors.text.dark}',
    '--checkbox-size': '24px',
    textStyle: 'body-lg-med',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--checkbox-icon-color, {colors.text.dark})',
    cursor: 'pointer',
    columnGap: '4px',
    userSelect: 'none',
  },
  variants: {
    variant: {
      middle: {
        '--checkbox-label-color': '{colors.text.middle}',
      },
      dark: {
        '--checkbox-label-color': '{colors.text.dark}',
      },
    },
    size: {
      small: {
        '--checkbox-size': '16px',
        textStyle: 'subline-sm',
        fontWeight: 500,
      },
      default: {
        '--checkbox-size': '24px',
      },
    },
    checked: {
      true: {
        '--checkbox-icon-color': '{colors.text.light}',
      },
    },
  },
  defaultVariants: {
    checked: false,
    size: 'default',
    variant: 'middle',
  },
});

const Label = styled('span', {
  base: {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--checkbox-label-color, {colors.text.middle})',
  },
});

const iconRecipe = cva({
  base: {
    width: 'var(--checkbox-size, 24px)',
    height: 'var(--checkbox-size, 24px)',
  },
});

const CheckedIcon = styled(CheckBoxOutlined, iconRecipe);
const UncheckedIcon = styled(CheckBoxOutlineBlank, iconRecipe);
