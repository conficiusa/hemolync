/**
 * SSE Debug Logger
 * Centralized debug logging for SSE connections
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  timestamp: string
  level: LogLevel
  category: string
  message: string
  data?: any
}

class SSEDebugLogger {
  private logs: Array<LogEntry> = []
  private maxLogs = 1000
  private isEnabled: boolean

  constructor() {
    this.isEnabled =
      typeof window !== 'undefined' &&
      localStorage.getItem('DEBUG_SSE') === 'true'
  }

  private formatTimestamp(): string {
    const now = new Date()
    return (
      now.toTimeString().split(' ')[0] +
      '.' +
      now.getMilliseconds().toString().padStart(3, '0')
    )
  }

  private getColor(level: LogLevel): string {
    const colors = {
      info: '#00bcd4',
      warn: '#ff9800',
      error: '#f44336',
      debug: '#9c27b0',
    }
    return colors[level]
  }

  private log(
    level: LogLevel,
    category: string,
    message: string,
    data?: any,
  ): void {
    if (!this.isEnabled) return

    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      category,
      message,
      data,
    }

    this.logs.push(entry)

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console output with colors
    const color = this.getColor(level)
    const prefix = `%c[SSE Debug] [${entry.timestamp}] [${category.toUpperCase()}]`
    const style = `color: ${color}; font-weight: bold;`

    if (data) {
      console.log(prefix, style, message, data)
    } else {
      console.log(prefix, style, message)
    }
  }

  info(category: string, message: string, data?: any): void {
    this.log('info', category, message, data)
  }

  warn(category: string, message: string, data?: any): void {
    this.log('warn', category, message, data)
  }

  error(category: string, message: string, data?: any): void {
    this.log('error', category, message, data)
  }

  debug(category: string, message: string, data?: any): void {
    this.log('debug', category, message, data)
  }

  // Connection state tracking
  logConnectionState(
    url: string,
    fromState: string,
    toState: string,
    data?: any,
  ): void {
    this.info('STATE', `${url}: ${fromState} -> ${toState}`, data)
  }

  // Event counting
  logEvent(url: string, eventType: string, count: number, data?: any): void {
    this.debug('EVENT', `${url} ${eventType} (${count})`, data)
  }

  // Get all logs for debugging
  getLogs(): Array<LogEntry> {
    return [...this.logs]
  }

  // Clear logs
  clearLogs(): void {
    this.logs = []
  }

  // Enable/disable debug mode
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('DEBUG_SSE', enabled.toString())
    }
  }

  isDebugEnabled(): boolean {
    return this.isEnabled
  }
}

// Export singleton instance
export const debug = new SSEDebugLogger()

// Helper function to check if debug is enabled
export const isSSEDebugEnabled = (): boolean => debug.isDebugEnabled()
