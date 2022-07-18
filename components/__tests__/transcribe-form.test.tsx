import { render, fireEvent, waitFor, screen, configure } from '@testing-library/react';
import React from 'react';
import { SelectField } from '../transcribe-form';

configure({ testIdAttribute: 'data-qa' });

describe('transcribe form and flow tests', () => {
  test('SelectField doing what it should', () => {
    const data = [
      { label: 'English', value: 'en', default: true },
      { label: 'French', value: 'fr' },
      { label: 'German', value: 'de' }
    ];

    const callback = (value: string) => {
      expect(value).toBe('fr');
    };

    const comp = render(
      <SelectField
        label='title'
        tooltip='tooltip'
        data={data}
        onSelect={callback}
        data-qa='test-select'
        disabled={false}
      />
    );

    fireEvent.change(comp.getByTestId('test-select'), {
      target: {
        selectedIndex: 1
      }
    });
  });
});
