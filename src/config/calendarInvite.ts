/** Флаг: пользователь нажал «Добавить в календарь» — тогда не показываем предупреждение beforeunload. */
export const CALENDAR_ADDED_STORAGE_KEY = 'wedding-calendar-invite-added';

export function hasCalendarInviteAdded(): boolean {
  try {
    return localStorage.getItem(CALENDAR_ADDED_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function markCalendarInviteAdded(): void {
  try {
    localStorage.setItem(CALENDAR_ADDED_STORAGE_KEY, '1');
  } catch {
    /* quota / private mode */
  }
}
