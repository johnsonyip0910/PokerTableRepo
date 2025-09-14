/**
 * Date/Time Validation Utilities
 * 
 * Provides robust date/time validation and formatting to prevent "Invalid time value" errors.
 * All dates should be in ISO 8601 format: YYYY-MM-DDTHH:mm:ssZ
 */

/**
 * Validates if a date input is valid and returns a proper Date object
 * @param input - Date input (Date object, string, or number)
 * @returns Valid Date object or null if invalid
 */
export function validateDate(input: any): Date | null {
  if (!input) {
    return null;
  }

  try {
    const parsed = new Date(input);
    
    // Check if the parsed date is valid
    if (isNaN(parsed.getTime())) {
      console.warn('⚠️ Invalid date input:', input);
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.warn('⚠️ Error parsing date:', input, error);
    return null;
  }
}

/**
 * Safely converts a Date object to ISO string
 * @param date - Date object to convert
 * @returns ISO string or null if invalid
 */
export function safeToISOString(date: any): string | null {
  const validDate = validateDate(date);
  
  if (!validDate) {
    console.warn('⚠️ Cannot convert invalid date to ISO string:', date);
    return null;
  }
  
  try {
    return validDate.toISOString();
  } catch (error) {
    console.warn('⚠️ Error converting date to ISO string:', validDate, error);
    return null;
  }
}

/**
 * Combines date and time strings into a valid ISO datetime string
 * @param dateInput - Date string (YYYY-MM-DD) or Date object
 * @param timeInput - Time string (HH:mm in 24-hour format)
 * @returns ISO datetime string or null if invalid
 */
export function combineDateAndTime(dateInput: any, timeInput: string): string | null {
  if (!dateInput || !timeInput) {
    console.warn('⚠️ Missing date or time for combination:', { dateInput, timeInput });
    return null;
  }

  try {
    // Extract date part
    let dateStr: string;
    if (dateInput instanceof Date) {
      const validDate = validateDate(dateInput);
      if (!validDate) return null;
      dateStr = validDate.toISOString().split('T')[0];
    } else if (typeof dateInput === 'string') {
      // Assume it's already in YYYY-MM-DD format or can be parsed
      const validDate = validateDate(dateInput);
      if (!validDate) return null;
      dateStr = validDate.toISOString().split('T')[0];
    } else {
      console.warn('⚠️ Invalid date input type:', typeof dateInput, dateInput);
      return null;
    }

    // Validate time format (should be HH:mm)
    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(timeInput)) {
      console.warn('⚠️ Invalid time format (expected HH:mm):', timeInput);
      return null;
    }

    // Combine into ISO format
    const combined = `${dateStr}T${timeInput}:00.000Z`;
    
    // Validate the combined result
    const finalDate = validateDate(combined);
    if (!finalDate) {
      console.warn('⚠️ Invalid combined datetime:', combined);
      return null;
    }

    return finalDate.toISOString();
  } catch (error) {
    console.warn('⚠️ Error combining date and time:', { dateInput, timeInput, error });
    return null;
  }
}

/**
 * Formats a date for display purposes
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string or 'Invalid Date'
 */
export function formatDateSafe(date: any, options?: Intl.DateTimeFormatOptions): string {
  const validDate = validateDate(date);
  
  if (!validDate) {
    return 'Invalid Date';
  }
  
  try {
    return validDate.toLocaleDateString('en-US', options);
  } catch (error) {
    console.warn('⚠️ Error formatting date:', validDate, error);
    return 'Invalid Date';
  }
}

/**
 * Formats a time for display purposes
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted time string or 'Invalid Time'
 */
export function formatTimeSafe(date: any, options?: Intl.DateTimeFormatOptions): string {
  const validDate = validateDate(date);
  
  if (!validDate) {
    return 'Invalid Time';
  }
  
  try {
    return validDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      ...options
    });
  } catch (error) {
    console.warn('⚠️ Error formatting time:', validDate, error);
    return 'Invalid Time';
  }
}

/**
 * Checks if a date/time combination is in the future
 * @param dateInput - Date input
 * @param timeInput - Time input
 * @returns boolean indicating if datetime is in future
 */
export function isDateTimeInFuture(dateInput: any, timeInput: string): boolean {
  const combined = combineDateAndTime(dateInput, timeInput);
  if (!combined) return false;
  
  const targetDate = validateDate(combined);
  if (!targetDate) return false;
  
  return targetDate.getTime() > Date.now();
}

/**
 * Gets current timestamp in ISO format
 * @returns Current timestamp as ISO string
 */
export function getCurrentISOTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Validates that a datetime string is in proper ISO 8601 format
 * @param isoString - ISO datetime string to validate
 * @returns boolean indicating if format is valid
 */
export function isValidISOString(isoString: string): boolean {
  if (typeof isoString !== 'string') return false;
  
  // Check basic ISO format pattern
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  if (!isoRegex.test(isoString)) {
    return false;
  }
  
  // Check if it can be parsed as valid date
  const date = validateDate(isoString);
  return date !== null;
}