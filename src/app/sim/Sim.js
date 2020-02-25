import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import d3ForceMagnetic from 'd3-force-magnetic'

import './sim.css'

//todo
// utworzenie statku i zwiazanie go siłami
// inputy dla masy i predkosci statku
// zmiana predkosci
// klikniecie na obiekt
// dopasowanie jednostki astronomicznej do miarki
// stop/start

const margin = { top: 80, right: 60, bottom: 80, left: 60 }
const width = window.innerWidth - margin.left - margin.right
const height = window.innerHeight - margin.top - margin.bottom
let au = d3.scaleLinear().range([0, Math.min(width, height)]);
let zoomLevel = 1,
    speedLevel = 1,
    lockOn

const objects = [
  { name: "Sun", radius: 696000, color: "white" },
  { name: "Mercury", radius: 2439.7, color: "hsl(39, 5%, 29%)", distance: 0.38709927, speed: 47.362 },
  { name: "Venus", radius: 6051.8, color: "hsl(50, 9%, 85%)", distance: 0.72333566, speed: 35.021 },
  { name: "Earth", radius: 6378.1, color: "hsl(212, 57%, 15%)", distance: 1.00000261, speed: 29.79 },
  { name: "Mars", radius: 3396.2, color: "hsl(28, 54%, 33%)", distance: 1.52371034, speed: 24.13 },
  { name: "Jupiter", radius: 71492.0, color: "hsl(24, 10%, 53%)", distance: 5.20288700, speed: 13.0697 },
  { name: "Saturn", radius: 60268.0, color: "hsl(39, 50%, 72%)", distance: 9.53667594, speed: 9.68 },
  { name: "Uranus", radius: 25559.0, color: "hsl(206, 62%, 85%)", distance: 19.18916464, speed: 6.8 },
  { name: "Neptune", radius: 24764.0, color: "hsl(216, 97%, 81%)", distance: 30.06992276, speed: 5.43 }
]

const Sim = () => {
  const [getSpeedLevel, setSpeedLevel] = useState('1')
  const d3svg = useRef(null)

  useEffect(() => {
    const canvas = d3.select('#canvas'),
        ctx = canvas.node().getContext('2d')

    setInterval( () => simulation(canvas, ctx), 0 );

    lockOn = ctx
    console.log(lockOn)
    canvas.call(d3.zoom()
        .scaleExtent([1, 1e4])
        .on('zoom', () => zoomed(d3.event.transform, ctx))
      )
  })

  function zoomed(newZoomLevel=zoomLevel) {
    zoomLevel = newZoomLevel;

    d3.select('#au-100px-scale').text(Math.round(au.invert(100) / zoomLevel.k * 1000) / 10)
  }

  function simulation(canvas, ctx) {
    canvas.attr('width', width)
      .attr('height', height)
      .node().getContext('2d');

    if (zoomLevel) {
        ctx.scale(zoomLevel.k, zoomLevel.k);
        ctx.translate(zoomLevel.x , zoomLevel.y);
    }

    if (lockOn) {
      ctx.translate(-lockOn.x, -lockOn.y);
    }

    if (d3svg.current) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      for (const [name, object] of Object.entries(objects)) {
        const distance = ("distance" in object) ? Math.sqrt(object.distance * 2000) : 0;
        const speed = ("speed" in object) ? object.speed / 20 : 0;
        const radius = Math.pow(object.radius / 20, 0.26);
        const x = distance * Math.sin(speed * (Date.now() / (10000 / speedLevel)));
        const y = distance * Math.cos(speed * (Date.now() / (10000 / speedLevel)));

        if (distance > 0) {
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, distance, 0, 2 * Math.PI);
          ctx.strokeStyle = "hsl(0, 0%, 15%)";
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(x + (width / 2), y + (height / 2), radius, 0, 2 * Math.PI);
        ctx.fillStyle = object.color;
        ctx.fill();
      }
    }
  }

  const speedChange = (e) => {
    speedLevel = e;
    setSpeedLevel(e)
    d3.select('#speed-control-val').text(e);
  }

  return (
    <div className="sim-container">
      <canvas
        id="canvas"
        className="sim"
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom}
        role="img"
        ref={d3svg}/>
      <div id="controls">
        <div>
          Speed:
        </div>
        <input id="speed-control" type="range" value={getSpeedLevel} min="1" max="10" step="1" onChange={evt => speedChange(evt.target.value)} />
        <span id="speed-control-val">1</span>x
      </div>
      <div id="info">
        
        <span id="au-100px-scale">12.7</span>&nbsp;AU&nbsp;
        <svg width="100px" height="6px">
          <path d="M0,0V6H100V0" stroke="darkgrey" strokeWidth="1.5" fill="transparent"></path>
        </svg>
        &nbsp;(scroll to zoom)
      </div>
    </div>
  )
}

export default Sim
