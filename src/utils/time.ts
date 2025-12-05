// Shared time formatter
export function formatTime(val: any): string {
  if (val === null || val === undefined) return 'N/A';
  if (typeof val === 'string') {
    const isoLike = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?Z?)?$/.test(val);
    if (isoLike) {
      const d = new Date(val);
      if (isNaN(d.getTime())) return val;
      // Use UTC getters so we don't get shifted by local timezone when the string has a Z suffix
      const hh = String(d.getUTCHours()).padStart(2, '0');
      const mm = String(d.getUTCMinutes()).padStart(2, '0');
      const ss = String(d.getUTCSeconds()).padStart(2, '0');
      return `${hh}:${mm}:${ss}`;
    }
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(val)) {
      const parts = val.split(':');
      const hh = String(parts[0]).padStart(2, '0');
      const mm = String(parts[1]).padStart(2, '0');
      const ss = parts[2] ? String(parts[2]).padStart(2, '0') : '00';
      return `${hh}:${mm}:${ss}`;
    }
    return val;
  }
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return 'N/A';
    const hh = String(val.getHours()).padStart(2, '0');
    const mm = String(val.getMinutes()).padStart(2, '0');
    const ss = String(val.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
  return String(val);
}
