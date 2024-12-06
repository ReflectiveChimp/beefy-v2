import { Tab, Tabs as MuiTabs } from '@material-ui/core';
import { legacyMakeStyles } from '@repo/helpers/mui';

import { styles } from './styles';

const useStyles = legacyMakeStyles(styles);

export const Tabs = ({ value, onChange, labels }) => {
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  return (
    <MuiTabs value={value} textColor="primary" onChange={handleChange} className={classes.tabs}>
      {labels.map(label => (
        <Tab label={label} key={label} />
      ))}
    </MuiTabs>
  );
};
