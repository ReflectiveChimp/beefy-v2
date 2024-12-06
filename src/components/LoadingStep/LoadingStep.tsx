import { memo } from 'react';
import type { StepType } from '../Step';
import { Step } from '../Step';
import { LoadingIndicator } from '../LoadingIndicator';

interface LoadingStepProps {
  stepType: StepType;
}

export const LoadingStep = memo(function LoadingStep({ stepType }: LoadingStepProps) {
  return (
    <Step stepType={stepType} title={undefined}>
      <LoadingIndicator />
    </Step>
  );
});
