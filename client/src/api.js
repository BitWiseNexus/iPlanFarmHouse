// ============================================
// API Helper — all backend calls in one place
// ============================================
const API_URL = "http://localhost:5000";

/**
 * Fetch all users (for login screen)
 */
export async function fetchUsers() {
  const res = await fetch(`${API_URL}/auth/users`);
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  const data = await res.json();
  return data.users || [];
}

/**
 * Login as a specific user
 */
export async function loginUser(userId) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  const data = await res.json();
  return data.user;
}

/**
 * Get tasks for a specific date (includes carry-forward)
 * @param {string} date - YYYY-MM-DD format
 * @param {number|null} userId - filter by user (optional)
 */
export async function fetchTasks(date, userId = null) {
  let url = `${API_URL}/tasks?date=${date}`;
  if (userId) url += `&userId=${userId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  const data = await res.json();
  return data.tasks || [];
}

/**
 * Get calendar summary for a month
 * @param {string} month - YYYY-MM format
 * @param {number|null} userId - filter by user (optional)
 */
export async function fetchCalendar(month, userId = null) {
  let url = `${API_URL}/tasks/calendar/${month}`;
  if (userId) url += `?userId=${userId}`;
  const res = await fetch(url);
  return await res.json();
}

/**
 * Create a new task (admin only)
 */
export async function createTask(title, assignedUserId, scheduledDate) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      assigned_user_id: assignedUserId,
      scheduled_date: scheduledDate,
    }),
  });
  return await res.json();
}

/**
 * Mark a task as completed
 */
export async function completeTask(taskId) {
  const res = await fetch(`${API_URL}/tasks/${taskId}/complete`, {
    method: "PATCH",
  });
  return await res.json();
}
