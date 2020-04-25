export let CALC = {
  G: null,
  va: null,
  vb: null,
  r1: 1,
  r2: 1.524,
  startDate: new Date().toISOString().slice(0, 10),
}

export const PLANETS = [
  { name: 'Mercury', axisA: 0.387, arcL: 252.25084 },
  { name: 'Venus', axisA: 0.723, arcL: 181.97973 },
  { name: 'Earth', axisA: 1, arcL: 100.46435 },
  { name: 'Mars', axisA: 1.524, arcL: 355.45332 },
  { name: 'Jupiter', axisA: 5.2044, arcL: 34.40438 },
  { name: 'Saturn', axisA: 8.5826, arcL: 49.94432 },
  { name: 'Uranus', axisA: 19.21840, arcL: 313.23218 },
  { name: 'Neptune', axisA: 30.11, arcL: 304.8803 }
]

const findRfromDiameter = diameter => ((diameter/2)*1e6)

export const x = [
  {
    name: 'Earth', mass: 5.972*1e24, axisA: 1, R: findRfromDiameter(12.756)
  }
]