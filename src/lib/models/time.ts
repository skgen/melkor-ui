import isNil from 'lodash/isNil';
import isString from 'lodash/isString';

enum MillisecondsMultiplier {
  hours = 1000 * 60 * 60,
  minutes = 1000 * 60,
  seconds = 1000,
}

function hoursToMilliseconds(n: number) {
  return n * MillisecondsMultiplier.hours;
}

function millisecondsToHours(n: number) {
  return n / MillisecondsMultiplier.hours;
}

function minutesToMilliseconds(n: number) {
  return n * MillisecondsMultiplier.minutes;
}

function millisecondsToMinutes(n: number) {
  return n / MillisecondsMultiplier.minutes;
}

function secondsToMilliseconds(n: number) {
  return n * MillisecondsMultiplier.seconds;
}

function millisecondsToSeconds(n: number) {
  return n / MillisecondsMultiplier.seconds;
}

export class Time {
  private h = 0;

  private m = 0;

  private s = 0;

  private ms = 0;

  private time = 0;

  constructor(v?: string) {
    let from = v;
    if (isNil(from)) {
      const now = new Date(Date.now());
      from = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;
    }
    const s = Time.parse(from);
    if (!s) {
      throw new Error('Time value provided is invalid');
    }
    this.setMilliseconds(hoursToMilliseconds(Time.parseChunk(s[0]))
    + minutesToMilliseconds(Time.parseChunk(s[1]))
    + secondsToMilliseconds(Time.parseChunk(s[2]))
    + Time.parseChunk(s[3]));
  }

  private static parseChunk(v?: string | number): number {
    if (isNil(v)) {
      return 0;
    }
    return isString(v) ? parseInt(v, 10) : v;
  }

  private static toXDigits(n: number, length: number): string {
    let res = n.toString();
    while (res.length < length) {
      res = `0${res}`;
    }
    return res;
  }

  private static explodeTime(tInMs: number) {
    let ms = 0;
    let rest = tInMs;
    if (rest / MillisecondsMultiplier.seconds > 1) {
      ms = rest % MillisecondsMultiplier.seconds;
    }
    rest -= ms;
    let sAsMs = 0;
    if (rest / MillisecondsMultiplier.minutes > 1) {
      sAsMs = rest % MillisecondsMultiplier.minutes;
    }
    rest -= sAsMs;
    let mAsMs = 0;
    if (rest / MillisecondsMultiplier.hours > 1) {
      mAsMs = rest % MillisecondsMultiplier.hours;
    }
    rest -= mAsMs;
    return {
      ms, s: sAsMs, m: mAsMs, h: rest,
    };
  }

  private computeTime(total: number) {
    const time = Time.explodeTime(total);
    this.ms = time.ms;
    this.s = time.s;
    this.m = time.m;
    this.h = time.h;
    this.time = Math.floor(this.h + this.m + this.s + this.ms);
  }

  private static parse(v: string): number[] {
    const parsed = v.match(/\d{1,3}/sg);
    if (!parsed) {
      return [];
    }
    return parsed.map((n) => parseInt(n, 10));
  }

  getMilliseconds(): number {
    return Math.floor(this.time - this.h - this.m - this.s);
  }

  setMilliseconds(ms: number) {
    if (ms < 1) {
      throw new Error('Millisecond must be >= 1');
    }
    const total = this.h + this.m + this.s + ms;
    this.computeTime(total);
  }

  getSeconds(): number {
    return Math.floor(millisecondsToSeconds(this.time - this.h - this.m));
  }

  setSeconds(s: number) {
    if (s < 1) {
      throw new Error('Second must be >= 1');
    }
    const total = this.h + this.m + secondsToMilliseconds(s) + this.ms;
    this.computeTime(total);
  }

  getMinutes(): number {
    return Math.floor(millisecondsToMinutes(this.time - this.h));
  }

  setMinutes(m: number) {
    if (m < 1) {
      throw new Error('Minute must be >= 1');
    }
    const total = this.h + minutesToMilliseconds(m) + this.s + this.ms;
    this.computeTime(total);
  }

  getHours(): number {
    return Math.floor(millisecondsToHours(this.time));
  }

  setHours(h: number) {
    if (h < 1) {
      throw new Error('Hour must be >= 1');
    }
    const total = hoursToMilliseconds(h) + this.m + this.s + this.ms;
    this.computeTime(total);
  }

  toISOString() {
    const h = Time.toXDigits(millisecondsToHours(this.h), 2);
    const m = Time.toXDigits(millisecondsToMinutes(this.m), 2);
    const s = Time.toXDigits(millisecondsToSeconds(this.s), 2);
    const ms = Time.toXDigits(this.ms, 3);
    return `${h}:${m}:${s}.${ms}`;
  }

  toDate() {
    const d = new Date();
    d.setMilliseconds(this.getMilliseconds());
    d.setSeconds(this.getSeconds());
    d.setMinutes(this.getMinutes());
    d.setHours(this.getHours());
    return d;
  }
}
