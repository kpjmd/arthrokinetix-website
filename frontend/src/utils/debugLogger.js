// Debug logging utility for production troubleshooting
class DebugLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 100; // Keep last 100 logs
  }

  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent.slice(0, 100) // Truncate for brevity
    };

    // Always log to console
    console[level](message, data);

    // Store for debugging
    this.logs.push(logEntry);
    
    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log critical errors to local storage for persistence
    if (level === 'error') {
      try {
        const errorLogs = JSON.parse(localStorage.getItem('arthrokinetix_errors') || '[]');
        errorLogs.push(logEntry);
        // Keep only last 20 errors
        const recentErrors = errorLogs.slice(-20);
        localStorage.setItem('arthrokinetix_errors', JSON.stringify(recentErrors));
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }

  info(message, data) {
    this.log('info', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  error(message, data) {
    this.log('error', message, data);
  }

  debug(message, data) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, data);
    }
  }

  // Get recent logs for debugging
  getRecentLogs(count = 20) {
    return this.logs.slice(-count);
  }

  // Get error logs from localStorage
  getStoredErrors() {
    try {
      return JSON.parse(localStorage.getItem('arthrokinetix_errors') || '[]');
    } catch (e) {
      return [];
    }
  }

  // Clear stored error logs
  clearStoredErrors() {
    try {
      localStorage.removeItem('arthrokinetix_errors');
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  // Log API request details
  logApiRequest(url, options = {}) {
    this.debug('API Request', {
      url,
      method: options.method || 'GET',
      headers: options.headers,
      hasBody: !!options.body
    });
  }

  // Log API response details
  logApiResponse(url, response, data = null) {
    this.debug('API Response', {
      url,
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      hasData: !!data
    });
  }

  // Log page navigation
  logPageNavigation(path, params = {}) {
    this.info('Page Navigation', {
      path,
      params,
      referrer: document.referrer || 'direct'
    });
  }

  // Export logs for support
  exportLogs() {
    const exportData = {
      timestamp: new Date().toISOString(),
      recentLogs: this.getRecentLogs(50),
      storedErrors: this.getStoredErrors(),
      environment: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        connection: navigator.connection ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink
        } : null
      }
    };

    return JSON.stringify(exportData, null, 2);
  }
}

// Create singleton instance
const debugLogger = new DebugLogger();

// Add global debug helper
if (typeof window !== 'undefined') {
  window.arthrokinetixDebug = {
    exportLogs: () => debugLogger.exportLogs(),
    getRecentLogs: (count) => debugLogger.getRecentLogs(count),
    getStoredErrors: () => debugLogger.getStoredErrors(),
    clearErrors: () => debugLogger.clearStoredErrors()
  };
}

export default debugLogger;