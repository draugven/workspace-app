import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TasksError from '../error'

describe('Tasks Error Boundary', () => {
  const mockReset = jest.fn()
  const mockError = new Error('Tasks loading failed')

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders tasks-specific error message in German', () => {
    render(<TasksError error={mockError} reset={mockReset} />)

    expect(screen.getByText('Fehler beim Laden der Tasks')).toBeInTheDocument()
    expect(screen.getByText(/Die Tasks konnten nicht geladen werden/i)).toBeInTheDocument()
  })

  it('displays error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    render(<TasksError error={mockError} reset={mockReset} />)

    expect(screen.getByText('Tasks loading failed')).toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })

  it('calls reset function when retry button is clicked', async () => {
    const user = userEvent.setup()
    render(<TasksError error={mockError} reset={mockReset} />)

    const retryButton = screen.getByRole('button', { name: /erneut versuchen/i })
    await user.click(retryButton)

    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  it('logs error with correct prefix', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    render(<TasksError error={mockError} reset={mockReset} />)

    expect(consoleErrorSpy).toHaveBeenCalledWith('Tasks page error:', mockError)
  })
})
