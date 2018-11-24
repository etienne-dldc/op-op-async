import styled from 'react-emotion';

export const AppWrapper = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  display: 'flex',
  alignItems: 'stretch',
  overflow: 'hidden',
});

export const TreeWrapper = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  flexShrink: 0,
  overflowX: 'auto',
});

export const ColumnWrapper = styled('div')({
  width: 300,
  borderRight: '2px solid blue',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  flexShrink: 0,
  overflowY: 'auto',
});

export const StepWrapper = styled('div')({
  flexShrink: 0,
});

export const StepNameWrapper = styled('div')({
  padding: 10,
});

export const MinorWrapper = styled('div')({
  marginLeft: 20,
});
