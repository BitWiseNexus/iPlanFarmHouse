// ============================================
// Date utility helpers
// ============================================

/**
 * Format a Date object as YYYY-MM-DD
 */
export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Format a Date object as YYYY-MM
 */
export function formatMonth(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * Get all days in a month, padded to start on Monday
 * Returns array of Date objects (includes padding days from prev/next month)
 */
export function getCalendarDays(year, month) {
  // month is 0-indexed
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // getDay(): 0=Sun, 1=Mon, ...
  // We want Monday=0, so shift: (day + 6) % 7
  const startPad = (firstDay.getDay() + 6) % 7;

  const days = [];

  // Add padding days from previous month
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, isCurrentMonth: false });
  }

  // Add all days of the current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true });
  }

  // Pad to fill the last week (always show 6 rows = 42 cells, or at least fill current week)
  while (days.length % 7 !== 0) {
    const nextDate = new Date(
      year,
      month + 1,
      days.length - startPad - lastDay.getDate() + 1,
    );
    days.push({ date: nextDate, isCurrentMonth: false });
  }

  return days;
}

/**
 * Get human-readable month name
 */
export function getMonthName(month) {
  const names = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return names[month];
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Format date for display: "12 March 2025"
 */
export function formatDateDisplay(date) {
  const d = new Date(date);
  return `${d.getDate()} ${getMonthName(d.getMonth())} ${d.getFullYear()}`;
}
