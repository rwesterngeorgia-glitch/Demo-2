import { categories, type Demo } from './data';
export const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
export const text = (v: unknown, max = 10000): v is string => typeof v === 'string' && v.length <= max;
export const number = (v: unknown, min = 0): v is number => typeof v === 'number' && Number.isFinite(v) && v >= min;
export function date(v: unknown): v is string {
  if (!text(v) || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const [y,m,d] = v.split('-').map(Number), parsed = new Date(0);
  parsed.setUTCFullYear(y,m-1,d); parsed.setUTCHours(0,0,0,0);
  return y >= 1900 && parsed.getUTCFullYear() === y && parsed.getUTCMonth() === m-1 && parsed.getUTCDate() === d;
}
const time = (v: unknown) => text(v) && /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
const records = (v: unknown, fields: string[], max = 500) => Array.isArray(v) && v.length <= max && v.every(x => object(x) && fields.every(k => text(x[k],k === "image" ? 2200000 : 10000))) && new Set(v.map(x => x.id)).size === v.length;
export function validDemo(v: unknown): v is Demo {
  if (!object(v) || (v._schemaVersion !== undefined && v._schemaVersion !== 1)) return false;
  if (!records(v.dishes,['id','name','description','category','allergens','image'],100) || !records(v.staff,['id','name','role','availability'],100) || !records(v.reservations,['id','name','email','date','time','status','notes']) || !records(v.shifts,['id','staffId','date','start','end']) || !records(v.tasks,['id','name','group','owner']) || !records(v.messages,['id','name','email','message'],100) || !text(v.notes,5000) || !Array.isArray(v.activity) || v.activity.length > 30 || !v.activity.every(x => text(x)) || !Array.isArray(v.slots) || v.slots.length > 48) return false;
  const d = v as unknown as Demo;
  if (!d.dishes.every(x => number(x.price) && categories.includes(x.category) && typeof x.available === 'boolean' && Array.isArray(x.dietary) && x.dietary.every(y => text(y,100)) && (x.image.startsWith('/images/') || /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(x.image)))) return false;
  if (!d.reservations.every(x => date(x.date) && time(x.time) && Number.isInteger(x.party) && number(x.party,1) && x.party <= 50 && ['Requested','Confirmed','Seated','Completed','Cancelled'].includes(x.status))) return false;
  if (!d.slots.every(x => object(x) && time(x.time) && Number.isInteger(x.capacity) && number(x.capacity,1) && x.capacity <= 100 && typeof x.enabled === 'boolean')) return false;
  if (!d.tasks.every(x => typeof x.done === 'boolean' && (!x.owner || d.staff.some(s => s.id === x.owner)))) return false;
  if (!d.shifts.every(x => date(x.date) && time(x.start) && time(x.end) && x.start < x.end && d.staff.some(s => s.id === x.staffId))) return false;
  if (d.shifts.some((x,i) => d.shifts.slice(i+1).some(y => x.staffId === y.staffId && x.date === y.date && x.start < y.end && y.start < x.end))) return false;
  if (new Set(d.slots.map(x => x.time)).size !== d.slots.length) return false;
  const occupied = new Map<string,number>();
  for (const r of d.reservations.filter(x => !['Cancelled','Completed'].includes(x.status))) {
    const key = r.date+' '+r.time, count = (occupied.get(key) ?? 0)+r.party;
    if (count > (d.slots.find(s => s.time === r.time)?.capacity ?? 0)) return false;
    occupied.set(key,count);
  }
  return true;
}
export function validateBookingChange(before: Demo, after: Demo) {
  for (const r of after.reservations) {
    const old = before.reservations.find(x => x.id === r.id);
    if ((!old || old.date !== r.date || old.time !== r.time || old.party !== r.party) && (!after.slots.some(s => s.time === r.time && s.enabled) || new Date(r.date+'T12:00:00').getDay() === 1)) throw Error('This booking slot is no longer available. Please choose another date or time.');
  }
}
