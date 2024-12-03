// Utility function to validate if a string is an ISO 8601 timestamp
export function isISO8601(timestamp: string): boolean {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3,6}Z$/;
  return iso8601Regex.test(timestamp);
}

// Function to format the time
export function formatTime(timestamp: string): string {
  // Check if the input is a valid ISO 8601 timestamp
  if (isISO8601(timestamp)) {
    // Parse the timestamp as a Date object
    const utcDate = new Date(timestamp);

    // Define the NYC timezone offset (UTC-5)
    // const nycOffsetMinutes = -5 * 60; // Offset in minutes
    const nycOffsetMinutes = 0; // Offset in minutes

    // Convert UTC time to NYC time
    const nycDate = new Date(utcDate.getTime() + nycOffsetMinutes * 60 * 1000);

    // Format the date and time in a human-readable format
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZoneName: "short",
    };
    return nycDate.toLocaleString("en-US", options);
  } else {
    // If not a valid timestamp, return the original input
    console.warn("Not valid timestamp");
    return timestamp;
  }
}
