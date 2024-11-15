import type { ReactNode } from 'react';
import { memo } from 'react';
import { makeStyles } from '@material-ui/styles';
import { styles } from './styles';
import { ReactComponent as ReportProblemOutlined } from '@repo/images/icons/mui/ReportProblemOutlined.svg';
import clsx from 'clsx';

const useStyles = makeStyles(styles);

export type ErrorIndicatorProps = {
  title: string | ReactNode;
  content?: string | ReactNode;
  className?: string;
};

export const ErrorIndicator = memo<ErrorIndicatorProps>(function ErrorIndicator({
  title,
  content,
  className,
}) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.container, className)}>
      <div className={classes.circle}>
        <ReportProblemOutlined className={classes.icon} />
      </div>
      <div className={classes.title}>{title}</div>
      {content ? <div className={classes.content}>{content}</div> : null}
    </div>
  );
});
