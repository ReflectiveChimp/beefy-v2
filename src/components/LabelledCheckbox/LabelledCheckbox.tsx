import type { MouseEventHandler, ReactNode } from 'react';
import { memo, useCallback } from 'react';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';
import { ReactComponent as CheckBoxOutlineBlank } from '@repo/images/icons/mui/CheckBoxOutlineBlank.svg';
import { ReactComponent as CheckBoxOutlined } from '@repo/images/icons/mui/CheckBoxOutlined.svg';

export type LabelledCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  checkboxCss?: CssStyles;
  iconCss?: CssStyles;
  labelCss?: CssStyles;
  checkedCss?: CssStyles;
  checkedIconCss?: CssStyles;
};

export const LabelledCheckbox = memo(function ButtonLink({
  checked,
  onChange,
  label,
  checkboxCss,
  iconCss,
  labelCss,
  checkedCss,
  checkedIconCss,
}: LabelledCheckboxProps) {
  const handleChange = useCallback<MouseEventHandler<HTMLLabelElement>>(
    e => {
      e.stopPropagation();
      onChange(!checked);
    },
    [onChange, checked]
  );
  const Icon = checked ? CheckBoxOutlined : CheckBoxOutlineBlank;

  return (
    <label
      onClick={handleChange}
      className={css(styles.checkbox, checkboxCss, checked && css.raw(styles.checked, checkedCss))}
      data-checked={checked}
    >
      <Icon
        className={css(
          styles.icon,
          iconCss,
          checked && css.raw(styles.checkedIcon, checkedIconCss)
        )}
      />
      <span className={css(styles.label, labelCss)}>{label}</span>
    </label>
  );
});
