import { render } from '@testing-library/react';

import {LeasingUi} from './ui';

describe('LeasingUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LeasingUi />);
    expect(baseElement).toBeTruthy();
  });
});
