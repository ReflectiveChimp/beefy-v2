import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core';
import { useAppSelector } from '../../../../../../store';
import type { BeefyState } from '../../../../../../redux-types';

const useStyles = makeStyles({
  container: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '620px',
    height: '100%',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    backgroundColor: '#111',
  },
});

function selectDebugData(state: BeefyState) {
  const transact = state.ui.transact;
  return transact;
}

export const TransactDebugger = memo(function TransactDebugger() {
  const classes = useStyles();
  const data = useAppSelector(selectDebugData);

  return <div className={classes.container}>{JSON.stringify(data, null, 2)}</div>;
});
