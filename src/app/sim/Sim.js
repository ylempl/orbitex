import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'

import './sim.css'

import { EccAnom_SIM, getJulianDate_SIM, toRadians_SIM } from '../../common/helpers/formulas'
import { SIM } from './data'

const Sim = () => {
  const [pause, setPause] = useState(0)
  // console.log(SIM.fps)
  // const [fpsSpeed, setFpsSpeed] = useState(30)
  useEffect(() => {
    SIM.canvasBackground = d3.select('#background')
    SIM.canvasForeground = d3.select('#foreground')
    SIM.canvasText = d3.select('#text')
  
    const c = document.getElementById("foreground")

    SIM.canvasText.call(d3.zoom()
      .scaleExtent([1, 1e4])
      .on('zoom', () => zoomed(d3.event.transform))
      )
      .on('mouseover', () => rotation_mousemove(d3.event)
    )

    SIM.ctxBackground = SIM.canvasBackground.node().getContext('2d') //Need the context to be able to draw on the canvas
    SIM.ctxText = SIM.canvasText.node().getContext('2d') //Need the context to be able to draw on the canvas
    SIM.ctxForeground = SIM.canvasForeground.node().getContext('2d'); //Need the context to be able to draw on the canvas

    c.addEventListener("mousemove", rotation_mousemove, false);

    SIM.width = window.innerWidth - SIM.margin.left - SIM.margin.right;
    SIM.height = window.innerHeight - SIM.margin.top - SIM.margin.bottom;

    SIM.interval = 1000/SIM.fps;
    // //1. Get Gregorian Date
    SIM.current = new Date(); //Set as today
    SIM.current = new Date(Date.UTC(2000, 0, 2,0,0,0)); //Set at Epoch (J2000)
      
    SIM.DAY = SIM.current.getDate();
    SIM.MONTH = SIM.current.getMonth()+1; //January is 0!
    SIM.YEAR = SIM.current.getFullYear();
    //2. Get Julian Date
    SIM.julianDate = getJulianDate_SIM(SIM.YEAR,SIM.MONTH,SIM.DAY);
    //3. Get Julian Centuries since Epoch (J2000)
    SIM.T = (SIM.julianDate-SIM.julianEpochJ2000)/SIM.julianCenturyInJulianDays; 
    
    init()
  })

  function getCursorPosition(e, c) { // get Mouse x,y relative to canvas c from mouseEvent e
    var xy = [];
    if (e.pageX || e.pageY) {
		xy = [e.pageX, e.pageY];
    } else {
		xy[0] = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		xy[1] = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
	xy[0] -= c.offsetLeft;
	xy[1] -= c.offsetTop;
	return xy;
}

  function m_x_v3( m, v) {
    // vout = m*v;			matrix(3x3) times vector(3)
    var vout = [0,0,0];
    vout[0] = m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2];
    vout[1] = m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2];
    vout[2] = m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2];
    return vout;
  }

  function rotation_mousemove(e) {
    console.log(e)
    let rotation = {};
    rotation.mousedown = 0;
    rotation.xy_mousedown = [0,0];
    rotation.x_axis = [0,1,0];
    rotation.y_axis = [1,0,0];
    rotation.g = [ [1,0,0], [0,1,0], [0,0,1] ];
    rotation.g_base = [ [1,0,0], [0,1,0], [0,0,1] ];

    rotation.mousedown = 1;
    rotation.xy_mousedown = getCursorPosition( e, document.getElementById("foreground") );
    rotation.x_axis = m_x_v3( rotation.g, [0,0,1] );
    rotation.y_axis = m_x_v3( rotation.g, [1,0,0] );
    rotation.g_base = rotation.g;     

    console.log(rotation)
  }

  function zoomed(newZoomLevel = SIM.zoomLevel) {
    SIM.zoomLevel = newZoomLevel;
  }

  function init() {
    SIM.canvasForeground.on('click', () => doMouseDown(d3.mouse))
    // SIM.canvasForeground.addEventListener("mousedown", doMouseDown, true)
    //Render background once (render the Sun at center)	
    //Start the main loop
    run_SIM();
  }

  

  function parseObjects(objects) {
    for (const [name] of Object.entries(objects)) {
      SIM.ctxBackground.beginPath();
      // console.log(SIM.planetRadius.Mercury)
      switch(name) {
        case '0':
          SIM.ctxBackground.ellipse(SIM.width/2, SIM.height/2, SIM.planetRadius.Mercury.r * SIM.scale, SIM.planetRadius.Mercury.r * SIM.scale, 0 , 0, 2 * Math.PI);
        break;
        case '1':
          SIM.ctxBackground.ellipse(SIM.width/2, SIM.height/2, SIM.planetRadius.Venus.r * SIM.scale, SIM.planetRadius.Venus.r * SIM.scale, 0, 0, 2 * Math.PI);
        break;
        case '2':
          SIM.ctxBackground.ellipse(SIM.width/2, SIM.height/2, SIM.planetRadius.Earth.r * SIM.scale, SIM.planetRadius.Earth.r * SIM.scale, 0, 0, 2 * Math.PI);
        break;
        case '3':
          SIM.ctxBackground.ellipse(SIM.width/2, SIM.height/2, SIM.planetRadius.Mars.r * SIM.scale, SIM.planetRadius.Mars.r * SIM.scale, 0, 0, 2 * Math.PI);
        break;
        case '4':
          SIM.ctxBackground.ellipse(SIM.width/2, SIM.height/2, SIM.planetRadius.Jupiter.r * SIM.scale/SIM.jupiterScaleDivider, SIM.planetRadius.Jupiter.r * SIM.scale/SIM.jupiterScaleDivider, 0, 0, 2 * Math.PI);
        break;
        case '5':
          SIM.ctxBackground.ellipse(SIM.width/2, SIM.height/2, SIM.planetRadius.Saturn.r * SIM.scale/SIM.saturnScaleDivider, SIM.planetRadius.Saturn.r * SIM.scale/SIM.saturnScaleDivider, 0, 0, 2 * Math.PI);
        break;
        case '6':
          SIM.ctxBackground.ellipse(SIM.width/2, SIM.height/2, SIM.planetRadius.Uranus.r * SIM.scale/SIM.uranusScaleDivider, SIM.planetRadius.Uranus.r * SIM.scale/SIM.uranusScaleDivider, 0, 0, 2 * Math.PI);
        break;
        case '7':
          SIM.ctxBackground.ellipse(SIM.width/2, SIM.height/2, SIM.planetRadius.Neptune.r * SIM.scale/SIM.neptuneScaleDivider, SIM.planetRadius.Neptune.r * SIM.scale/SIM.neptuneScaleDivider, 0, 0, 2 * Math.PI);
        break;
        default: 
          SIM.ctxBackground.ellipse(SIM.width/2, SIM.height/2, SIM.planetRadius.Uranus.r * SIM.scale, SIM.planetRadius.Uranus.r * SIM.scale, 0, 0, 2 * Math.PI);
          break;
      }
      
      // console.log(SIM.planetRadius)
      SIM.ctxBackground.strokeStyle = SIM.planetColors.map(d => d[name])
      SIM.ctxBackground.stroke();
      SIM.ctxBackground.closePath();
    }
  }

  function renderBackground_SIM(){
    SIM.canvasBackground
      .attr('width', SIM.width)
      .attr('height', SIM.height)

    if (SIM.zoomLevel.k) {
      SIM.ctxBackground.translate( SIM.zoomLevel.x ,  SIM.zoomLevel.y);
      SIM.ctxBackground.scale( SIM.zoomLevel.k,  SIM.zoomLevel.k);
    }

    //Set background color of canvas
     SIM.ctxBackground.fillStyle='#090909';
    SIM.ctxBackground.fillRect(0,0, SIM.width, SIM.height); //"ClearRect" by painting background color

    //render Sun at center
    SIM.ctxBackground.beginPath();
    SIM.ctxBackground.arc(SIM.width/2, SIM.height/2, 10, 0, 2*Math.PI, true); 
    SIM.ctxBackground.fillStyle = 'yellow';
    SIM.ctxBackground.fill();
    SIM.ctxBackground.closePath();

    console.log()
    if (Object.entries(SIM.planetRadius).length > 0) {
      parseObjects(SIM.planetElements)
    }
  }

  function updateDate_SIM(increment){
    SIM.newDate = new Date(SIM.current.getFullYear(), SIM.current.getMonth(), SIM.current.getDate()+increment); //Set to today +1 day
    SIM.current = SIM.newDate;
  
    let newdd = SIM.newDate.getDate(),
        newmm = SIM.newDate.getMonth()+1,//January is 0!
        newyyyy = SIM.newDate.getFullYear()
  
    SIM.YEAR = newyyyy;
    SIM.MONTH = newmm;
    SIM.DAY = newdd;
    
    SIM.julianDate = getJulianDate_SIM(SIM.YEAR,SIM.MONTH,SIM.DAY);
    SIM.T = (SIM.julianDate-SIM.julianEpochJ2000)/SIM.julianCenturyInJulianDays; 
  }

  function renderText_SIM() {
    SIM.canvasText
      .attr('width', SIM.width)
      .attr('height', SIM.height)

      //Render Frames Per Second (using desired framerate)
      SIM.ctxText.font = "20px Arial";
      SIM.ctxText.textAlign = "left";
      SIM.ctxText.fillStyle = "dimgrey";
      SIM.ctxText.fillText("FPS = "+SIM.avgFPSCount,10,20);				

      //Render Ticks Per Second (how many loops are executed per second)
      SIM.ctxText.font = "20px Arial";
      SIM.ctxText.textAlign = "right";
      SIM.ctxText.fillStyle = "dimgrey";
      SIM.ctxText.fillText("TPS = "+SIM.avgTPSCount,SIM.width-10,20);

      //Render Gregorian Date for Today
      SIM.ctxText.font = "20px Arial";
      SIM.ctxText.textAlign = "left";
      SIM.ctxText.fillStyle = "dimgrey";
      SIM.ctxText.fillText("GREGORIAN DATE = "+SIM.YEAR+"."+SIM.MONTH+"."+SIM.DAY,10, 80);

      SIM.ctxText.font = "20px Arial";
      SIM.ctxText.textAlign = "left";
      SIM.ctxText.fillStyle = "dimgrey";
      SIM.ctxText.fillText("ZOOM = " + (SIM.zoomLevel.k ? SIM.zoomLevel.k : 1) , 10, 50);

      if(Object.entries(SIM.planetRadius).length > 0) {
        SIM.ctxText.font = "20px Arial";
        SIM.ctxText.textAlign = "left";
        SIM.ctxText.fillStyle = "dimgrey";
        SIM.ctxText.fillText("MeanLEarth = " + (SIM.planetRadius.Earth.L).toFixed(0) +"°" , 10, 110);
      }
  }
  function renderForeground_SIM(){
    SIM.canvasForeground
      .attr('width', SIM.width)
      .attr('height', SIM.height)
      

      if (SIM.zoomLevel.k) {
        SIM.ctxForeground.translate( SIM.zoomLevel.x ,  SIM.zoomLevel.y);
        SIM.ctxForeground.scale( SIM.zoomLevel.k,  SIM.zoomLevel.k);
      }

      let x2 = (SIM.width / 2) + SIM.xMars * SIM.scale 
      let y2 = (SIM.height / 2) - SIM.yMars * SIM.scale

      let x3 = (SIM.width / 2) + SIM.xEarth * SIM.scale
      let y3 = (SIM.height / 2) - SIM.yEarth * SIM.scale

      // console.log(x2, y2)
      //Clear the canvas (otherwise there will be "ghosting" on foreground layer)
      SIM.ctxForeground.clearRect(0, 0, SIM.width, SIM.height);

      SIM.ctxForeground.beginPath();
      SIM.ctxForeground.moveTo(SIM.width / 2, SIM.height / 2)
      SIM.ctxForeground.lineTo(x3, y3);
      SIM.ctxForeground.strokeStyle = '#ff0000';
      SIM.ctxForeground.stroke();
      SIM.ctxForeground.closePath();

      SIM.ctxForeground.beginPath();
      SIM.ctxForeground.moveTo(x2, y2)
      SIM.ctxForeground.lineTo(SIM.width / 2, SIM.height / 2);
      SIM.ctxForeground.strokeStyle = '#ff0000';
      SIM.ctxForeground.stroke();
      SIM.ctxForeground.closePath();


      SIM.ctxForeground.beginPath();
      SIM.ctxForeground.moveTo(SIM.width / 2, SIM.height / 2 - 200);
      SIM.ctxForeground.lineTo(SIM.width / 2, SIM.height / 2 + 200);
      SIM.ctxForeground.strokeStyle = 'rgba(255,255,255, 0.1)';
      SIM.ctxForeground.stroke();
      SIM.ctxForeground.moveTo(SIM.width / 2 - 200, SIM.height / 2);
      SIM.ctxForeground.lineTo(SIM.width / 2 + 200, SIM.height / 2);
      SIM.ctxForeground.strokeStyle = 'rgba(255,255,255,0.2)';
      SIM.ctxForeground.stroke();
      SIM.ctxForeground.closePath();

      SIM.ctxForeground.font = "12px Arial";
      SIM.ctxForeground.fillStyle = "dimgrey";
      SIM.ctxForeground.fillText("- x", SIM.width / 2 - 200, SIM.height / 2);
      SIM.ctxForeground.fillText("- y", SIM.width / 2 , SIM.height / 2 + 200);
    
    //INNER PLANETS
    //Render planet Mercury

      SIM.ctxForeground.beginPath();
      SIM.ctxForeground.arc((SIM.width/2)+(SIM.xMercury*SIM.scale), (SIM.height/2)-(SIM.yMercury*SIM.scale), (3+(0.5*(4879/10000))), 0, 2*Math.PI, true); 
      SIM.ctxForeground.fillStyle = SIM.planetColors.map(d => d[0]);
      SIM.ctxForeground.fill();
      SIM.ctxForeground.closePath();				
     
      //Render planet Venus
      SIM.ctxForeground.beginPath();
      SIM.ctxForeground.arc((SIM.width/2)+(SIM.xVenus*SIM.scale), (SIM.height/2)-(SIM.yVenus*SIM.scale),(3+(0.5*(12104/10000))), 0, 2*Math.PI, true); 
      SIM.ctxForeground.fillStyle = SIM.planetColors.map(d => d[1]);
      SIM.ctxForeground.fill();
      SIM.ctxForeground.closePath();				
      //Render planet Earth
      SIM.ctxForeground.beginPath();
      SIM.ctxForeground.arc((SIM.width/2)+(SIM.xEarth*SIM.scale), (SIM.height/2)-(SIM.yEarth*SIM.scale),  (3+(0.5*(12756/10000))), 0, 2*Math.PI, true); 
      SIM.ctxForeground.fillStyle = SIM.planetColors.map(d => d[2]);
      SIM.ctxForeground.fill();
      SIM.ctxForeground.closePath();				
      //Render planet Mars
      SIM.ctxForeground.beginPath();
      SIM.ctxForeground.arc((SIM.width/2)+(SIM.xMars*SIM.scale), (SIM.height/2)-(SIM.yMars*SIM.scale), (3+(0.5*(6792/10000))), 0, 2*Math.PI, true); 
      SIM.ctxForeground.fillStyle = SIM.planetColors.map(d => d[3]);
      SIM.ctxForeground.fill();
      SIM.ctxForeground.closePath();	
      
      //OUTER PLANETS
      //Render planet Jupiter
      SIM.ctxForeground.beginPath();
      SIM.ctxForeground.arc((SIM.width/2)+(SIM.xJupiter*SIM.scale/SIM.jupiterScaleDivider), (SIM.height/2)-(SIM.yJupiter*SIM.scale/SIM.jupiterScaleDivider), (4+(0.5*(142984/13000))), 0, 2*Math.PI, true); 
      SIM.ctxForeground.fillStyle = SIM.planetColors.map(d => d[4]);
      SIM.ctxForeground.fill();
      SIM.ctxForeground.closePath();					
      //Render planet Saturn
      SIM.ctxForeground.beginPath();
      SIM.ctxForeground.arc((SIM.width/2)+(SIM.xSaturn*SIM.scale/SIM.saturnScaleDivider), (SIM.height/2)-(SIM.ySaturn*SIM.scale/SIM.saturnScaleDivider), (4+(0.5*(120536/13000))), 0, 2*Math.PI, true); 
      SIM.ctxForeground.fillStyle = SIM.planetColors.map(d => d[5]);
      SIM.ctxForeground.fill();
      SIM.ctxForeground.closePath();						
      //Render planet Uranus
      SIM.ctxForeground.beginPath();
      SIM.ctxForeground.arc((SIM.width/2)+(SIM.xUranus*SIM.scale/SIM.uranusScaleDivider), (SIM.height/2)-(SIM.yUranus*SIM.scale/SIM.uranusScaleDivider), (4+(0.5*(51118/13000))), 0, 2*Math.PI, true); 
      SIM.ctxForeground.fillStyle = SIM.planetColors.map(d => d[6]);
      SIM.ctxForeground.fill();
      SIM.ctxForeground.closePath();	
      //Render planet Neptune
      SIM.ctxForeground.beginPath();
      SIM.ctxForeground.arc((SIM.width/2)+(SIM.xNeptune*SIM.scale/SIM.neptuneScaleDivider), (SIM.height/2)-(SIM.yNeptune*SIM.scale/SIM.neptuneScaleDivider), (4+(0.5*(49528/13000))), 0, 2*Math.PI, true); 
      SIM.ctxForeground.fillStyle = SIM.planetColors.map(d => d[7]);
      SIM.ctxForeground.fill();
      SIM.ctxForeground.closePath();	

      

  }
  
  function plotPlanet_SIM(TGen,planetNumber){
    //--------------------------------------------------------------------------------------------
    //1.
    //ORBIT SIZE
    //AU (CONSTANT = DOESN'T CHANGE)
    let aGen = SIM.planetElements[planetNumber][0] + (SIM.planetRates[planetNumber][0] * TGen);
    
    //2.
    //ORBIT SHAPE
    //ECCENTRICITY (CONSTANT = DOESN'T CHANGE)
    let eGen = SIM.planetElements[planetNumber][1] + (SIM.planetRates[planetNumber][1] * TGen);
    
    //--------------------------------------------------------------------------------------------
    //3.
    //ORBIT ORIENTATION
    //ORBITAL INCLINATION (CONSTANT = DOESN'T CHANGE)
    let iGen = SIM.planetElements[planetNumber][2] + (SIM.planetRates[planetNumber][2] * TGen);
    iGen = iGen%360;
    //4.
    //ORBIT ORIENTATION
    //LONG OF ASCENDING NODE (CONSTANT = DOESN'T CHANGE)
    let WGen = SIM.planetElements[planetNumber][5] + (SIM.planetRates[planetNumber][5] * TGen);
        WGen = WGen%360;
    //5.
    //ORBIT ORIENTATION
    //LONGITUDE OF THE PERIHELION
    let wGen = SIM.planetElements[planetNumber][4] + (SIM.planetRates[planetNumber][4] * TGen);
    wGen = wGen%360;
    if(wGen<0){wGen = 360+wGen;}	
    
    //--------------------------------------------------------------------------------------------
    //6.
    //ORBIT POSITION
    //MEAN LONGITUDE (DYNAMIC = CHANGES OVER TIME)
    let LGen = SIM.planetElements[planetNumber][3] + (SIM.planetRates[planetNumber][3] * TGen);
    LGen = LGen%360;
    if(LGen<0){LGen = 360+LGen;}	
    
    
    //MEAN ANOMALY --> Use this to determine Perihelion (0 degrees = Perihelion of planet)
    let MGen = LGen - (wGen);
    if(MGen<0){MGen=360+MGen;}
  
    //ECCENTRIC ANOMALY
    let EGen = EccAnom_SIM(eGen,MGen,6);
    
    //ARGUMENT OF TRUE ANOMALY
    let trueAnomalyArgGen = (Math.sqrt((1+eGen) / (1-eGen)))*(Math.tan(toRadians_SIM(EGen)/2));
  
    //TRUE ANOMALY (DYNAMIC = CHANGES OVER TIME)
    let K = Math.PI/180.0; //Radian converter variable
    let nGen;
    if(trueAnomalyArgGen<0){ 
      nGen = 2 * (Math.atan(trueAnomalyArgGen)/K+180); //ATAN = ARCTAN = INVERSE TAN
    }
    else{
      nGen = 2 * (Math.atan(trueAnomalyArgGen)/K)
    }
    //--------------------------------------------------------------------------------------------
    
    //CALCULATE RADIUS VECTOR
    let rGen = aGen * (1 - (eGen * (Math.cos(toRadians_SIM(EGen)))));

    
    //TAKEN FROM: http://www.stargazing.net/kepler/ellipse.html
    //CREDIT: Keith Burnett
    //Used to determine Heliocentric Ecliptic Coordinates
    let xGen = rGen *(Math.cos(toRadians_SIM(WGen)) * Math.cos(toRadians_SIM(nGen+wGen-WGen)) - Math.sin(toRadians_SIM(WGen)) * Math.sin(toRadians_SIM(nGen+wGen-WGen)) * Math.cos(toRadians_SIM(iGen)));
    let yGen = rGen *(Math.sin(toRadians_SIM(WGen)) * Math.cos(toRadians_SIM(nGen+wGen-WGen)) + Math.cos(toRadians_SIM(WGen)) * Math.sin(toRadians_SIM(nGen+wGen-WGen)) * Math.cos(toRadians_SIM(iGen)));
    // let zGen = rGen *(Math.sin(toRadians_SIM(nGen+wGen-WGen))*Math.sin(toRadians_SIM(iGen)));
    
    return [xGen, yGen, rGen, aGen, LGen, eGen];
  }
  
  function run_SIM(){
    SIM.now = Date.now();
    SIM.delta = SIM.now - SIM.then;
    
    //Run this code based on desired rendering rate
    if (SIM.delta > SIM.interval){ 
      SIM.then = SIM.now - (SIM.delta % SIM.interval);
      
      //Keep track of FPS
      SIM.FPSCount++;
      SIM.nowFPS = Date.now();
      SIM.deltaFPS = SIM.nowFPS - SIM.thenFPS;
      if(SIM.deltaFPS > 1000){ //Update frame rate every second
          SIM.avgFPSCount = SIM.FPSCount;
          SIM.FPSCount = 0;
          SIM.thenFPS = SIM.nowFPS - (SIM.deltaFPS % 1000);
      }
      
      //Increase date by 1 day each frame
        updateDate_SIM(1);
      // Get Mercury Heliocentric Ecliptic Coordinates
      // console.log(SIM.planetRadius)
      SIM.orbitalElements = plotPlanet_SIM(SIM.T,0);SIM.xMercury = SIM.orbitalElements[0];SIM.yMercury = SIM.orbitalElements[1];
      SIM.planetRadius.Mercury = { x: Math.abs(SIM.orbitalElements[0]), y: Math.abs(SIM.orbitalElements[1]), r: SIM.orbitalElements[2], a: SIM.orbitalElements[3], L: SIM.orbitalElements[4],  e: SIM.orbitalElements[5] }
      //Get Venus Heliocentric Ecliptic Coordinates
      SIM.orbitalElements = plotPlanet_SIM(SIM.T,1);SIM.xVenus = SIM.orbitalElements[0];SIM.yVenus = SIM.orbitalElements[1];
      SIM.planetRadius.Venus = { x: Math.abs(SIM.orbitalElements[0]), y: Math.abs(SIM.orbitalElements[1]), r: SIM.orbitalElements[2], a: SIM.orbitalElements[3]  }
      //Get Earth Heliocentric Ecliptic Coordinates
      SIM.orbitalElements = plotPlanet_SIM(SIM.T,2);SIM.xEarth = SIM.orbitalElements[0];SIM.yEarth = SIM.orbitalElements[1];
      SIM.planetRadius.Earth  = { x: Math.abs(SIM.orbitalElements[0]), y: Math.abs(SIM.orbitalElements[1]), r: SIM.orbitalElements[2], a: SIM.orbitalElements[3], L: SIM.orbitalElements[4]  }
      //Get Mars Heliocentric Ecliptic Coordinates
      SIM.orbitalElements = plotPlanet_SIM(SIM.T,3);SIM.xMars = SIM.orbitalElements[0];SIM.yMars = SIM.orbitalElements[1];
      SIM.planetRadius.Mars = { x: Math.abs(SIM.orbitalElements[0]), y: Math.abs(SIM.orbitalElements[1]), r: SIM.orbitalElements[2], a: SIM.orbitalElements[3]  }
      //Get Jupiter Heliocentric Ecliptic Coordinates
      SIM.orbitalElements = plotPlanet_SIM(SIM.T,4);SIM.xJupiter = SIM.orbitalElements[0];SIM.yJupiter = SIM.orbitalElements[1];
      SIM.planetRadius.Jupiter = { x: Math.abs(SIM.orbitalElements[0]), y: Math.abs(SIM.orbitalElements[1]), r: SIM.orbitalElements[2], a: SIM.orbitalElements[3]  }
      //Get Saturn Heliocentric Ecliptic Coordinates
      SIM.orbitalElements = plotPlanet_SIM(SIM.T,5);SIM.xSaturn = SIM.orbitalElements[0];SIM.ySaturn = SIM.orbitalElements[1];
      SIM.planetRadius.Saturn = { x: Math.abs(SIM.orbitalElements[0]), y: Math.abs(SIM.orbitalElements[1]), r: SIM.orbitalElements[2], a: SIM.orbitalElements[3]  }
      //Get Uranus Heliocentric Ecliptic Coordinates
      SIM.orbitalElements = plotPlanet_SIM(SIM.T,6);SIM.xUranus = SIM.orbitalElements[0];SIM.yUranus = SIM.orbitalElements[1];		
      SIM.planetRadius.Uranus = { x: Math.abs(SIM.orbitalElements[0]), y: Math.abs(SIM.orbitalElements[1]), r: SIM.orbitalElements[2], a: SIM.orbitalElements[3]  }
      //Get Neptune Heliocentric Ecliptic Coordinates
      SIM.orbitalElements = plotPlanet_SIM(SIM.T,7);SIM.xNeptune = SIM.orbitalElements[0];SIM.yNeptune = SIM.orbitalElements[1];
      SIM.planetRadius.Neptune = { x: Math.abs(SIM.orbitalElements[0]), y: Math.abs(SIM.orbitalElements[1]), r: SIM.orbitalElements[2], a: SIM.orbitalElements[3]  }
    }
  
    //Keep track of TPS
    SIM.TPSCount++;
    SIM.nowTPS = Date.now();
    SIM.deltaTPS = SIM.nowTPS - SIM.thenTPS;
    if(SIM.deltaTPS > 1000){ //Update frame rate every second
        SIM.avgTPSCount = SIM.TPSCount;
        SIM.TPSCount = 0;
        SIM.thenTPS = SIM.nowTPS - (SIM.deltaTPS % 1000);
    }
    
    //schedules a callback invocation before the next repaint. The number of callbacks performed is usually 60 times per second
    requestAnimationFrame(renderForeground_SIM); //Call requestAnimationFrame to draw to the screen (native way for browsers to handle animation) --> This does not affect the FPS, but dramatically improves TPS
    requestAnimationFrame(renderText_SIM)
    requestAnimationFrame(renderBackground_SIM)
    //Loop as fast as we can
    setTimeout(run_SIM, pause);
    
  }

  function doMouseDown(e) {
    console.log(e)
		if(SIM.increase>0){
			SIM.increase=0; //Pause simulation
		}
		else{
			SIM.increase = 1; //Continue simulation
		}
}

const speedChange = (e) => {
  // console.log('e', fpsSpeed)
  
  if (pause) {
    SIM.fps = 0
    setPause(0)
  }

  SIM.fps = e
}

  return (
    <div className="sim-container">
       <canvas id="background"
        width={SIM.width}
        height={SIM.height}
        className="sim">
        </canvas>
        <canvas id="foreground" 
          width={SIM.width}
          height={SIM.height}
        className="sim">
        </canvas>
        <canvas id="text" 
          width={SIM.width}
          height={SIM.height}
          className="sim">
        </canvas>
        <div id="controls">
          <div>
            Speed: {SIM.fps} [days/s]
          </div>
          <input id="speed-control" type="range" value={SIM.fps} min="0" max="60" step="10" onMouseUp={() => setPause(0)} onMouseDown={() => setPause(1)} onChange={evt => speedChange(evt.target.value)} />
        </div>
    </div>
  )
}

export default Sim
