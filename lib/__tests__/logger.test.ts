import logger, { LogLevel } from '../logger'

const consoleSpy = {
  log: jest.spyOn(console, 'log').mockImplementation(),
  warn: jest.spyOn(console, 'warn').mockImplementation(),
  error: jest.spyOn(console, 'error').mockImplementation(),
}

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    logger.clearLocalErrors()
  })

  afterAll(() => {
    consoleSpy.log.mockRestore()
    consoleSpy.warn.mockRestore()
    consoleSpy.error.mockRestore()
  })

  describe('log levels', () => {
    it('should log debug messages', () => {
      logger.debug('Test debug message', { key: 'value' })
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        'Test debug message',
        expect.any(Object)
      )
    })

    it('should log info messages', () => {
      logger.info('Test info message')
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        'Test info message',
        expect.anything()
      )
    })

    it('should log warning messages', () => {
      logger.warn('Test warning message')
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        'Test warning message',
        expect.anything()
      )
    })

    it('should log error messages', () => {
      const testError = new Error('Test error')
      logger.error('Test error message', testError)
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'Test error message',
        testError,
        expect.anything()
      )
    })
  })

  describe('log level filtering', () => {
    it('should respect minimum log level', () => {
      logger.configure({ minLevel: LogLevel.WARN })

      logger.debug('This should not be logged')
      logger.info('This should not be logged')
      logger.warn('This should be logged')
      logger.error('This should be logged')

      expect(consoleSpy.log).not.toHaveBeenCalled()
      expect(consoleSpy.warn).toHaveBeenCalledTimes(1)
      expect(consoleSpy.error).toHaveBeenCalledTimes(1)
    })
  })

  describe('error storage', () => {
    it('should store errors locally', () => {
      const testError = new Error('Test error')
      logger.error('Test message', testError)

      const errors = logger.getLocalErrors()
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toBe('Test message')
      expect(errors[0].level).toBe(LogLevel.ERROR)
    })

    it('should clear local errors', () => {
      logger.error('Test error 1', new Error('Error 1'))
      logger.error('Test error 2', new Error('Error 2'))

      expect(logger.getLocalErrors()).toHaveLength(2)

      logger.clearLocalErrors()

      expect(logger.getLocalErrors()).toHaveLength(0)
    })

    it('should only keep last 50 errors', () => {
      for (let i = 0; i < 55; i++) {
        logger.error(`Error ${i}`, new Error(`Error ${i}`))
      }

      const errors = logger.getLocalErrors()
      expect(errors).toHaveLength(50)
      expect(errors[0].message).toBe('Error 5')
      expect(errors[49].message).toBe('Error 54')
    })
  })

  describe('configuration', () => {
    it('should allow configuration updates', () => {
      logger.configure({
        minLevel: LogLevel.ERROR,
        enableConsole: false,
      })

      logger.info('Should not log')
      expect(consoleSpy.log).not.toHaveBeenCalled()
    })
  })
})
