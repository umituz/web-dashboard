import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { StreakBanner } from './StreakBanner';

describe('StreakBanner', () => {
  it('renders title, streak count, and milestone dots', () => {
    const { container } = render(
      <MemoryRouter>
        <StreakBanner
          streak={4}
          title="Daily Masterpiece"
          subtitle="Van Gogh - Starry Night"
          milestones={7}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('Daily Masterpiece')).toBeTruthy();
    expect(screen.getByText('4-Day Streak')).toBeTruthy();
    expect(screen.getByText('Van Gogh - Starry Night')).toBeTruthy();

    const dots = container.querySelectorAll('.udb-streak-milestone-dot');
    expect(dots.length).toBe(7);
    const filled = container.querySelectorAll('.udb-streak-milestone-dot.is-filled');
    expect(filled.length).toBe(4);
  });

  it('renders custom badge and custom streak label', () => {
    render(
      <MemoryRouter>
        <StreakBanner
          streak={10}
          streakLabel="10 Consecutive Visits"
          title="Milestone Unlocked"
          badge={{ label: 'IMPRESSIONISM', tone: 'accent' }}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('10 Consecutive Visits')).toBeTruthy();
    expect(screen.getByText('IMPRESSIONISM')).toBeTruthy();
  });

  it('renders router link action and handles click action', () => {
    const handleClick = vi.fn();
    const { rerender } = render(
      <MemoryRouter>
        <StreakBanner
          streak={2}
          title="Quiz of the Day"
          action={{ label: 'Take Quiz', href: '/daily-art' }}
        />
      </MemoryRouter>,
    );
    const link = screen.getByText('Take Quiz');
    expect(link).toBeTruthy();

    rerender(
      <MemoryRouter>
        <StreakBanner
          streak={2}
          title="Quiz of the Day"
          action={{ label: 'Start Now', onClick: handleClick }}
        />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText('Start Now'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
