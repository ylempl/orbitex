export let SIM = {
  ctxBackground: null,
  canvasBackground: null,
  ctxText: null,
  canvasText: null,
  ctxForeground: null,
  canvasForeground: null,
  width: null,
  height: null,
  margin: { top: 80, right: 60, bottom: 80, left: 60 },
  //Define framerate variables
  fps:30, //Set desired framerate
  now:null,
  then:Date.now(),
  interval:null,
  delta:null,
  //TPS
  nowTPS:null,
  thenTPS:Date.now(),
  avgTPSCount:0,
  TPSCount:0,
  deltaTPS:0,
  //FPS
  nowFPS:null,
  thenFPS:Date.now(),
  avgFPSCount:0,
  FPSCount:0,
  deltaFPS:0,
  zoomLevel: 1,
  
  julianCenturyInJulianDays:36525,
  julianEpochJ2000:2451545.0,
  julianDate:null,
  DAY: null,
  MONTH: null,
  YEAR: null,

  //ELEMENTS @ J2000: a, e, i, mean longitude (L), longitude of perihelion, longitude of ascending node
planetElements: [
//MERCURY (0)
[0.38709927,0.20563593,7.00497902,252.25032350,77.45779628,48.33076593],
//VENUS (1)
[0.72333566,0.00677672,3.39467605,181.97909950,131.60246718,76.67984255],
//EARTH (2)
[1.00000261,0.01671123,-0.00001531,100.46457166,102.93768193,0.0],
//MARS (3)
[1.52371034,0.09339410,1.84969142,-4.55343205,-23.94362959,49.55953891],
//JUPITER (4)
[5.20288700,0.04838624,1.30439695,34.39644051,14.72847983,100.47390909],
//SATURN (5)
[9.53667594,0.05386179,2.48599187,49.95424423,92.59887831,113.66242448],
//URANUS (6)
[19.18916464,0.04725744,0.77263783,313.23810451,170.95427630,74.01692503],
//NEPTUNE (7)
[30.06992276,0.00859048,1.77004347,-55.12002969,44.96476227,131.78422574]
],

planetRadius: {},

//RATES: a, e, i, mean longitude (L), longitude of perihelion, longitude of ascending node
planetRates: [
//MERCURY (0)
[0.00000037,0.00001906,-0.00594749,149472.67411175,0.16047689,-0.1253408],
//VENUS (1)
[0.00000390,-0.00004107,-0.00078890,58517.81538729,0.00268329,-0.27769418],
//EARTH (2)
[0.00000562,-0.00004392,-0.01294668,35999.37244981,0.32327364,0.0],
//MARS (3)
[0.00001847,0.00007882,-0.00813131,19140.30268499,0.44441088,-0.29257343],
//JUPITER (4)
[-0.00011607,-0.00013253,-0.00183714,3034.74612775,0.21252668,0.20469106],
//SATURN (5)
[-0.00125060,-0.00050991,0.00193609,1222.49362201,-0.41897216,-0.28867794],
//URANUS (6)
[-0.00196176,-0.00004397,-0.00242939,428.48202785,0.40805281,0.04240589],
//NEPTUNE (7)
[0.00026291,0.00005105,0.00035372,218.45945325,-0.32241464,-0.00508664]
],

planetColors: [[
"#696969",
"#8FBC8F",
"#6495ED",
"#DC143C",
"#E9967A",
"#FF8C00",
"#00CED1",
"#4169E1"
]],

orbitalElements:null,

xMercury:null,
yMercury:null,
xVenus:null,
yVenus:null,
xEarth:null,
yEarth:null,
xMars:null,
yMars:null,
xJupiter:null,
yJupiter:null,
xSaturn:null,
ySaturn:null,
xUranus:null,
yUranus:null,		
xNeptune:null,
yNeptune:null,

scale:50,

//Divide AU multiplier by this number to fit it into  "orrery" style solar system (compressed scale)
jupiterScaleDivider:2.5, 
saturnScaleDivider:3.5,
uranusScaleDivider:6.2,
neptuneScaleDivider:8.7,

increase:1 

}