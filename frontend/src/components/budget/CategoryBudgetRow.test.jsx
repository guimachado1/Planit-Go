import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryBudgetRow } from './CategoryBudgetRow.jsx';
import { BUDGET_CATEGORIES } from '../../constants/budgetCategories.js';

describe('CategoryBudgetRow', () => {
  it('renderiza categoria e dispara onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const category = BUDGET_CATEGORIES[0];

    render(
      <CategoryBudgetRow
        category={category}
        amount={100}
        totalBudget={1000}
        onChange={onChange}
      />
    );

    expect(screen.getByText('Transporte')).toBeInTheDocument();
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '250');
    expect(onChange).toHaveBeenCalled();
  });
});
