export function getRandomInt(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

export function getRandomFloat(min: number, max: number, decimals = 2) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}

export function norm(value: number, min: number, max: number) {
  return (value - min) / (max - min);
}

export function lerp(normalized: number, min: number, max: number) {
  return (max - min) * normalized + min;
}
