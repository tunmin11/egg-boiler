import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timer from './Timer'; // Assuming Timer.tsx is in the same directory

jest.useFakeTimers();

describe('Timer Component', () => {
  it('displays the initial time correctly (30 seconds)', () => {
    render(<Timer />);
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start timer/i })).toBeInTheDocument();
  });

  it('initiates the countdown when the start button is clicked', () => {
    render(<Timer />);
    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    // After clicking start, the button might disappear or change text if it's not supposed to be there while running
    // The current implementation hides the start button when active and timeLeft > 0
    expect(screen.queryByRole('button', { name: /start timer/i })).not.toBeInTheDocument(); 
    
    // Check if time starts decrementing (advance time by 1s)
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('29')).toBeInTheDocument();
  });

  it('decrements the timer value every second after starting', () => {
    render(<Timer />);
    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('29')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('28')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('updates the progress bar correctly with the time', () => {
    render(<Timer />);
    const progressbar = screen.getByRole('progressbar');
    const indicator = progressbar.firstChild as HTMLElement; // Get the indicator div
    expect(indicator).toHaveStyle('transform: translateX(-0%)'); // Initial progress (value 100)

    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    act(() => {
      jest.advanceTimersByTime(1000); // 29s left (1/30 elapsed)
    });
    // For 29s, value is (29/30)*100. transform is 100 - value.
    expect(indicator).toHaveStyle(`transform: translateX(-${100 - (29/30)*100}%)`);


    act(() => {
      jest.advanceTimersByTime(14000); // 15s left (15/30 elapsed)
    });
    // (15 / 30) * 100 = 50. transform is 100 - 50 = 50%
    expect(indicator).toHaveStyle(`transform: translateX(-${100 - (15/30)*100}%)`);
    
    act(() => {
      jest.advanceTimersByTime(15000); // 0s left (30/30 elapsed)
    });
    // (0 / 30) * 100 = 0. transform is 100 - 0 = 100%
    expect(indicator).toHaveStyle(`transform: translateX(-${100 - (0/30)*100}%)`);
  });

  it('displays 0 and the button changes to "Restart Timer" when the timer reaches 0', () => {
    render(<Timer />);
    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    act(() => {
      jest.advanceTimersByTime(30000); // Advance to 0 seconds
    });

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /restart timer/i })).toBeInTheDocument();
  });

  it('restarts the timer when the "Restart Timer" button is clicked', () => {
    render(<Timer />);
    const startButton = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(startButton);

    act(() => {
      jest.advanceTimersByTime(30000); // Timer finishes
    });

    expect(screen.getByText('0')).toBeInTheDocument();
    const restartButton = screen.getByRole('button', { name: /restart timer/i });
    fireEvent.click(restartButton);

    expect(screen.getByText('30')).toBeInTheDocument(); // Timer resets to 30
    // Button should not be "Restart Timer" anymore, it should be hidden or be "Start Timer" if it was immediately paused
    // In the current implementation, clicking restart immediately starts the timer and hides the button.
     expect(screen.queryByRole('button', { name: /restart timer/i })).not.toBeInTheDocument();


    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('29')).toBeInTheDocument();
  });
});
