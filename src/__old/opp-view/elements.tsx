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

export const ColumnsWrapper = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  flexShrink: 0,
  overflowX: 'auto',
});

export const ColumnWrapper = styled('div')({
  width: 500,
  borderRight: '2px solid #263238',
  display: 'flex',
  flexDirection: 'column',
  background: '#EEEEEE',
  alignItems: 'stretch',
  flexShrink: 0,
  overflowY: 'auto',
});

export const MinorTreeWrapper = styled('div')({
  flexShrink: 0,
});

type NodeWrapperProps = { selected: boolean; selectedExact: boolean; parentSelected: boolean };

export const NodeWrapper = styled('div')<NodeWrapperProps>(
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    cursor: 'pointer',
  },
  (props: NodeWrapperProps) => ({
    background: props.selectedExact
      ? '#2196F3'
      : props.parentSelected
      ? '#BBDEFB'
      : props.selected
      ? '#1565C0'
      : 'white',
    color: props.selected || props.selectedExact ? 'white' : '#263238',
  })
);

export const NodeContent = styled('div')({
  padding: 10,
});

export const MinorWrapper = styled('div')({});
