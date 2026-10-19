import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SwipeCard } from './SwipeCard';
import { OnboardingIntlProvider } from './OnboardingIntl';

function renderCard(props: Partial<React.ComponentProps<typeof SwipeCard>> = {}) {
  return render(
    <OnboardingIntlProvider>
      <SwipeCard
        text="I want to feel better"
        category="Mood"
        onSwipeLeft={vi.fn()}
        onSwipeRight={vi.fn()}
        {...props}
      />
    </OnboardingIntlProvider>,
  );
}

describe('SwipeCard', () => {
  it('triggers onSwipeRight on ArrowRight and onSwipeLeft on ArrowLeft', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();
    renderCard({ onSwipeLeft, onSwipeRight });
    const card = screen.getByRole('group');
    card.focus();
    fireEvent.keyDown(card, { key: 'ArrowRight' });
    expect(onSwipeRight).toHaveBeenCalledTimes(1);
    expect(onSwipeLeft).not.toHaveBeenCalled();
    fireEvent.keyDown(card, { key: 'ArrowLeft' });
    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
  });

  it('renders the AGREE / DISAGREE badges and the swipe hint', () => {
    renderCard();
    expect(screen.getByText('Agree')).toBeTruthy();
    expect(screen.getByText('Disagree')).toBeTruthy();
    expect(screen.getByText(/arrow keys/)).toBeTruthy();
  });

  it('ignores unrelated keys', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();
    renderCard({ onSwipeLeft, onSwipeRight });
    fireEvent.keyDown(screen.getByRole('group'), { key: 'Enter' });
    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });
});
