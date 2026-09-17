const KEY = 'pvi-ai-notice-acknowledged';

export function hasAcknowledgedAINotice(): boolean {
  try {
    return localStorage.getItem(KEY) === 'true';
  } catch {
    return false;
  }
}

export function acknowledgeAINotice(): void {
  try {
    localStorage.setItem(KEY, 'true');
  } catch {
    // Ignore — worst case the notice is shown again next time.
  }
}
