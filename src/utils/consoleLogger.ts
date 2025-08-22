export class ConsoleLogger {
  private static instance: ConsoleLogger;
  private logs: string[] = [];
  private listeners: ((logs: string[]) => void)[] = [];

  private constructor() {}

  public static getInstance(): ConsoleLogger {
    if (!ConsoleLogger.instance) {
      ConsoleLogger.instance = new ConsoleLogger();
    }
    return ConsoleLogger.instance;
  }

  public log(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    this.logs.push(logEntry);
    
    // Keep only last 100 logs to prevent memory issues
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }
    
    // Notify all listeners
    this.listeners.forEach(listener => listener([...this.logs]));
    
    // Also log to browser console for debugging
    console.log(logEntry);
  }

  public addListener(listener: (logs: string[]) => void): void {
    this.listeners.push(listener);
    // Immediately send current logs to new listener
    listener([...this.logs]);
  }

  public removeListener(listener: (logs: string[]) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  public clear(): void {
    this.logs = [];
    this.listeners.forEach(listener => listener([]));
  }

  public getLogs(): string[] {
    return [...this.logs];
  }
}

// Global logging function for easy use
export const log = (message: string): void => {
  ConsoleLogger.getInstance().log(message);
};