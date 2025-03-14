import React from 'react'
import {render, screen} from '@testing-library/react'

import {HomeContent} from '../../src/components/home-content'

describe('Home Content', () => {
  it('shows a login button when user is not logged in', () => {
    render(<HomeContent />)

    const button = screen.getByRole('button')
    expect(button.textContent).toEqual('Login')
  })
})
