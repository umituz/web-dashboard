import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { GoalProgressCard } from './GoalProgressCard';

describe('GoalProgressCard', () => {
  it('renders title, current vs target metrics and percentage', () => {
    render(
      <GoalProgressCard
        title="Daily Vocabulary"
        current={15}
        target={20}
        unit="words"
      />
    );

    expect(screen.getByText('Daily Vocabulary')).toBeDefined();
    expect(screen.getByText(/15/)).toBeDefined();
    expect(screen.getByText(/\/ 20 words/)).toBeDefined();
    expect(screen.getByText('75%')).toBeDefined();
    expect(screen.getByText('5 words remaining')).toBeDefined();
  });

  it('renders completed state when current meets or exceeds target', () => {
    render(
      <GoalProgressCard
        title="Weekly Study Goal"
        current={120}
        target={100}
        unit="mins"
        completedLabel="Goal completed! Great job."
      />
    );

    expect(screen.getByText('100%')).toBeDefined();
    expect(screen.getByText('Goal completed! Great job.')).toBeDefined();
  });

  it('renders action button and handles clicks', () => {
    const onClick = vi.fn();
    render(
      <GoalProgressCard
        title="Speaking Practice"
        current={2}
        target={5}
        action={{ label: 'Start Session', onClick }}
      />
    );

    const btn = screen.getByRole('button', { name: 'Start Session' });
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders action link when href is supplied', () => {
    render(
      <MemoryRouter>
        <GoalProgressCard
          title="Listening Drills"
          current={1}
          target={4}
          action={{ label: 'Go to Lessons', href: '/app/lessons' }}
        />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Go to Lessons' });
    expect(link.getAttribute('href')).toBe('/app/lessons');
  });
});
