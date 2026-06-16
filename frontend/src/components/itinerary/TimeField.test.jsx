import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { TimeField } from './TimeField.jsx';

describe('TimeField', () => {
  it('atualiza hora e minuto', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <TimeField id="start" label="Início" value="" onChange={onChange} />
    );

    await user.selectOptions(screen.getByLabelText('Início — hora'), '09');
    expect(onChange).toHaveBeenCalledWith('09:00');
  });
});
