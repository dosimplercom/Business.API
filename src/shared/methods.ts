export function getFullName(first_name: string, last_name: string) {
  return `${first_name} ${last_name}`;
}

export function roundMinTo5(minutes: number): number {
  return minutes % 5 > 0 ? Math.round(minutes / 5) * 5 : minutes;
}
