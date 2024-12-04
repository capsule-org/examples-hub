import axios, {AxiosError, AxiosResponse} from 'axios';

// Enhanced type definitions with strict null checks
type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

interface ErrorMetadata {
  component: string | undefined;
  action: string | undefined;
  timestamp: string;
  severity: ErrorSeverity;
  additionalContext?: Record<string, unknown>;
}

interface ErrorDetails {
  stack?: string;
  cause?: unknown;
  status?: number;
  statusText?: string;
  data?: unknown;
  headers?: Record<string, unknown>;
  config?: {
    url?: string;
    method?: string;
    baseURL?: string;
    timeout?: number;
    headers?: Record<string, unknown>;
  };
  rawError?: unknown;
}

interface FormattedError {
  type: string;
  message: string;
  details: ErrorDetails;
  metadata: ErrorMetadata;
  userMessage: string;
}

interface ErrorContext {
  component?: string;
  action?: string;
  additionalContext?: Record<string, unknown>;
}

// Type guard for checking if a value is a plain object
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
};

// Type guard for checking if a value is an Error instance
const isError = (value: unknown): value is Error => {
  return value instanceof Error;
};

// Type guard for checking if a response is an AxiosResponse
const isAxiosResponse = (value: unknown): value is AxiosResponse => {
  return (
    isPlainObject(value) &&
    'status' in value &&
    'data' in value &&
    'headers' in value
  );
};

// HTTP status code messages with explicit type
const HTTP_STATUS_MESSAGES: Readonly<Record<number, string>> = {
  400: 'Invalid request data',
  401: 'Unauthorized - Please login again',
  403: 'Access forbidden',
  404: 'Resource not found',
  422: 'Validation failed',
  429: 'Too many requests - Please try again later',
  500: 'Internal server error',
  502: 'Bad gateway',
  503: 'Service temporarily unavailable',
  504: 'Gateway timeout',
} as const;

// Utility to safely stringify objects with type checking
const safeStringify = (obj: unknown): string => {
  if (obj === undefined) return 'undefined';
  if (obj === null) return 'null';

  try {
    return JSON.stringify(
      obj,
      (key: string, value: unknown) => {
        if (value === undefined) return '[undefined]';
        if (typeof value === 'function') return '[Function]';
        if (value instanceof Error)
          return {
            name: value.name,
            message: value.message,
            stack: value.stack,
          };
        return value;
      },
      2,
    );
  } catch (err) {
    return '[Circular or Invalid JSON]';
  }
};

// Enhanced utility to safely extract error message
const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (
    isPlainObject(error) &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }
  return safeStringify(error);
};

// Utility to get error severity with type checking
const getErrorSeverity = (error: unknown): ErrorSeverity => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (typeof status === 'number') {
      if (status >= 500) return 'critical';
      if (status === 401 || status === 403) return 'high';
      if (status === 429) return 'medium';
      return 'low';
    }
    return 'high'; // Network or config errors
  }

  if (error instanceof Error) {
    switch (error.name) {
      case 'TypeError':
      case 'ReferenceError':
        return 'high';
      case 'SyntaxError':
        return 'critical';
      default:
        return 'medium';
    }
  }

  return 'high'; // Unknown error types default to high severity
};

// Utility to safely extract Axios error details
const extractAxiosErrorDetails = (error: AxiosError): ErrorDetails => {
  const details: ErrorDetails = {};

  if (error.response) {
    details.status = error.response.status;
    details.statusText = error.response.statusText;
    details.data = error.response.data;
    details.headers = error.response.headers;
  }

  if (error.config) {
    details.config = {
      url: error.config.url,
      method: error.config.method,
      baseURL: error.config.baseURL,
      timeout: error.config.timeout,
      headers: error.config.headers as Record<string, unknown>,
    };
  }

  if (error.stack) {
    details.stack = error.stack;
  }

  return details;
};

// Main error logging function with enhanced type safety
export const logError = (
  error: unknown,
  context: ErrorContext = {},
): FormattedError => {
  const timestamp = new Date().toISOString();
  let formattedError: FormattedError;

  if (axios.isAxiosError(error)) {
    formattedError = formatAxiosError(error, timestamp, context);
  } else if (isError(error)) {
    formattedError = formatNativeError(error, timestamp, context);
  } else {
    formattedError = formatUnknownError(error, timestamp, context);
  }

  logToConsole(formattedError);
  return formattedError;
};

// Format Axios errors with strict type checking
const formatAxiosError = (
  error: AxiosError,
  timestamp: string,
  context: ErrorContext,
): FormattedError => {
  const status = error.response?.status;
  const userMessage =
    status && status in HTTP_STATUS_MESSAGES
      ? HTTP_STATUS_MESSAGES[status]
      : 'An unexpected error occurred';

  return {
    type: 'AxiosError',
    message: getErrorMessage(error),
    details: extractAxiosErrorDetails(error),
    metadata: {
      component: context.component,
      action: context.action,
      timestamp,
      severity: getErrorSeverity(error),
      additionalContext: context.additionalContext,
    },
    userMessage,
  };
};

// Format native Error objects with strict type checking
const formatNativeError = (
  error: Error,
  timestamp: string,
  context: ErrorContext,
): FormattedError => {
  return {
    type: error.name || 'Error',
    message: getErrorMessage(error),
    details: {
      stack: error.stack,
    },
    metadata: {
      component: context.component,
      action: context.action,
      timestamp,
      severity: getErrorSeverity(error),
      additionalContext: context.additionalContext,
    },
    userMessage: 'An unexpected error occurred',
  };
};

// Format unknown error types with strict type checking
const formatUnknownError = (
  error: unknown,
  timestamp: string,
  context: ErrorContext,
): FormattedError => {
  return {
    type: 'UnknownError',
    message: getErrorMessage(error),
    details: {
      rawError: error,
    },
    metadata: {
      component: context.component,
      action: context.action,
      timestamp,
      severity: getErrorSeverity(error),
      additionalContext: context.additionalContext,
    },
    userMessage: 'An unexpected error occurred',
  };
};

// Console logging with proper type handling
const logToConsole = (error: FormattedError): void => {
  const styles = {
    error:
      'background: #ff0000; color: white; padding: 2px 5px; border-radius: 2px;',
    info: 'background: #0066cc; color: white; padding: 2px 5px; border-radius: 2px;',
    warning:
      'background: #ff9900; color: white; padding: 2px 5px; border-radius: 2px;',
  } as const;

  console.group(
    `%c${error.type}%c ${error.metadata.timestamp}`,
    styles.error,
    'color: gray',
  );

  console.log(
    `%cComponent:%c ${error.metadata.component ?? 'Not specified'}`,
    'font-weight: bold',
    'font-weight: normal',
  );

  console.log(
    `%cSeverity:%c ${error.metadata.severity}`,
    'font-weight: bold',
    'font-weight: normal',
  );

  console.log(
    `%cMessage:%c ${error.message}`,
    'font-weight: bold',
    'font-weight: normal',
  );

  console.log(
    `%cUser Message:%c ${error.userMessage}`,
    'font-weight: bold',
    'font-weight: normal',
  );

  if (Object.keys(error.details).length > 0) {
    console.group('Details');
    Object.entries(error.details).forEach(([key, value]) => {
      if (value !== undefined) {
        console.log(`%c${key}:%c`, 'font-weight: bold', 'font-weight: normal');
        console.log(safeStringify(value));
      }
    });
    console.groupEnd();
  }

  if (error.metadata.additionalContext) {
    console.group('Additional Context');
    console.log(safeStringify(error.metadata.additionalContext));
    console.groupEnd();
  }

  console.groupEnd();
};
