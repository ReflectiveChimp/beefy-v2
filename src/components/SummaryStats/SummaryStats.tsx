import { legacyMakeStyles } from '@repo/helpers/mui';
import { type FC, memo } from 'react';
import { styles } from './styles';

const useStyles = legacyMakeStyles(styles);

interface SummaryStatProps {
  title: string;
  Icon: FC;
  value: string;
}

const SummaryStat = memo(function SummaryStat({ title, Icon, value }: SummaryStatProps) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.iconContainer}>
        <Icon />
      </div>
      <div className={classes.contentContainer}>
        <div className={classes.title}>{title}</div>
        <div className={classes.value}>{value}</div>
      </div>
    </div>
  );
});

interface SummaryStatsProps {
  items: SummaryStatProps[];
}

export const SummaryStats = memo(function SummaryStats({ items }: SummaryStatsProps) {
  const classes = useStyles();

  return (
    <div className={classes.summaryContainer}>
      {items.map(item => (
        <SummaryStat key={item.title} title={item.title} value={item.value} Icon={item.Icon} />
      ))}
    </div>
  );
});
