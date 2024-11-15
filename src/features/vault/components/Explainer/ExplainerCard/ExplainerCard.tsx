import { memo, type ReactElement, type ReactNode } from 'react';
import { makeStyles } from '@material-ui/core';
import { Card, CardContent, CardHeader } from '../../Card';
import { styles } from './styles';
import { ContractsDropdown } from '../ContractsDropdown';
import { styled } from '@repo/styles/jsx';

const useStyles = makeStyles(styles);

type ExplainerCardProps = {
  title: ReactElement;
  links?: { label: string; link: string }[];
  description: ReactElement;
  details?: ReactNode;
};

export const ExplainerCard = memo<ExplainerCardProps>(function ExplainerCard({
  title,
  links,
  description,
  details,
}) {
  const classes = useStyles();

  return (
    <Card>
      <CardHeader>
        <div className={classes.title}>{title}</div>
        {links ? <ContractsDropdown links={links} /> : null}
      </CardHeader>
      <StyledCardContent>
        <div className={classes.description}>{description}</div>
        {details ? <div className={classes.details}>{details}</div> : null}
      </StyledCardContent>
    </Card>
  );
});

const StyledCardContent = styled(CardContent, {
  base: {
    gap: '32px',
  },
});
