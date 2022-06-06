import { formatDate, formatTimeDateFromString } from '../../utils/date-utils';
import { capitalizeFirstLetter, pad } from '../../utils/string-utils';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

describe('unit tests on utils functions', () => {
  test('pad to make 2 to 02', () => {
    expect(pad(2)).toBe('02');
    expect(pad(20)).toBe('20');
  });

  test('capitalize first letter', () => {
    expect(capitalizeFirstLetter('word')).toBe('Word');
    expect(capitalizeFirstLetter(' word')).toBe('Word');
  });

  test('date in format designed for the portal', () => {
    const date = new Date('2022-05-25T14:15:29.460Z');

    const comp = render(formatDate(date)).asFragment();

    expect(comp.textContent).toBe('25 May 2022');
  });

  test('time and date in format designed for the portal', () => {
    expect(formatTimeDateFromString('2022-06-25T14:15:29.460Z')).toBe('25 Jun 2022 14:15');
  });
});
