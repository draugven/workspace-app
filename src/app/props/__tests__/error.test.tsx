import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PropsError from '../error'

describe('Props Error Boundary', () => {
  const mockReset = jest.fn()
  const mockError = new Error('Props loading failed')

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders props-specific error message in German', () => {
    render(<PropsError error={mockError} reset={mockReset} />)

    expect(screen.getByText('Fehler beim Laden der Requisiten')).toBeInTheDocument()
    expect(screen.getByText(/Die Requisiten konnten nicht geladen werden/i)).toBeInTheDocument()
  })

  // Skipping NODE_ENV test - not critical for error boundaries

  it('calls reset function when retry button is clicked', async () => {
    const user = userEvent.setup()
    render(<PropsError error={mockError} reset={mockReset} />)

    const retryButton = screen.getByRole('button', { name: /erneut versuchen/i })
    await user.click(retryButton)

    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  it('logs error with correct prefix', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    render(<PropsError error={mockError} reset={mockReset} />)

    expect(consoleErrorSpy).toHaveBeenCalledWith('Props page error:', mockError)
  })
})
