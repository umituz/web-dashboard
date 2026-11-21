import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Stepper } from './Stepper';
import { Wizard } from './Wizard';

describe('Stepper', () => {
  it('renders steps with numbers and labels', () => {
    render(
      <Stepper
        steps={['General', 'Settings', 'Review']}
        currentStep={1}
      />,
    );
    expect(screen.getByText('General')).toBeTruthy();
    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByText('Review')).toBeTruthy();
  });

  it('triggers onStepClick when clickable is true and previous step is clicked', () => {
    const handleClick = vi.fn();
    render(
      <Stepper
        steps={['Step 1', 'Step 2', 'Step 3']}
        currentStep={2}
        clickable={true}
        onStepClick={handleClick}
      />,
    );
    fireEvent.click(screen.getByText('Step 1'));
    expect(handleClick).toHaveBeenCalledWith(0);
  });
});

describe('Wizard', () => {
  it('navigates next and back', () => {
    const handleStepChange = vi.fn();
    render(
      <Wizard
        steps={['Info', 'Billing', 'Confirmation']}
        currentStep={1}
        onStepChange={handleStepChange}
      >
        <div>Billing Form</div>
      </Wizard>,
    );
    expect(screen.getByText('Billing Form')).toBeTruthy();

    fireEvent.click(screen.getByText('Back'));
    expect(handleStepChange).toHaveBeenCalledWith(0);

    fireEvent.click(screen.getByText('Next'));
    expect(handleStepChange).toHaveBeenCalledWith(2);
  });

  it('triggers onFinish on the last step', () => {
    const handleFinish = vi.fn();
    const handleStepChange = vi.fn();
    render(
      <Wizard
        steps={['Info', 'Review']}
        currentStep={1}
        onStepChange={handleStepChange}
        onFinish={handleFinish}
      >
        <div>Review Step</div>
      </Wizard>,
    );
    fireEvent.click(screen.getByText('Finish'));
    expect(handleFinish).toHaveBeenCalled();
  });
});
