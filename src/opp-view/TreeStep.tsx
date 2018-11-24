import { TreeNode, TreePath, CreatePathStep } from './types';
import * as React from 'react';
import { StepWrapper, MinorWrapper, StepNameWrapper } from './elements';

type Props = {
  step: TreeNode;
  parentPath: TreePath;
  setSelectedPath: (path: TreePath) => void;
};

export const TreeStep: React.FunctionComponent<Props> = ({ step, parentPath, setSelectedPath }) => {
  return (
    <StepWrapper>
      <StepNameWrapper
        onClick={() => {
          setSelectedPath([...parentPath, CreatePathStep.Major(step.id)]);
        }}
      >
        {step.name}
      </StepNameWrapper>
      {step.minor && (
        <MinorWrapper>
          {step.minor.map(minorStep => (
            <TreeStep
              key={minorStep.id}
              step={minorStep}
              parentPath={[...parentPath, CreatePathStep.Minor(step.id)]}
              setSelectedPath={setSelectedPath}
            />
          ))}
        </MinorWrapper>
      )}
    </StepWrapper>
  );
};
