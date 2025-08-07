import { render } from '@testing-library/react';

import LeasingAppShell from './app-shell';

describe('LeasingAppShell', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LeasingAppShell />);
    expect(baseElement).toBeTruthy();
  });
});
