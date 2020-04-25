import React, {useState, useMemo} from 'react'

import Container from '../../common/components/Container/Container'

import './calc.css'

// import { CALC } from './data'

import { calcHohmann } from './helpers/calcHohmann'
import { CALC, PLANETS, x } from './data'



const Calc = () => {
  const [values, setValues] = useState({
    G: 6.67e-11,
    au: 149597871,
    M: 0,
    GM: 0,
    A: 0,
    P: 0,
    a: 0,
    c: 0,
    ecc: 0.0934,
    Re: 6.378e6, // [m]
    r1: 1,
    r2: 1.52,
    T: null,
    TSyn: null,
    startDate: new Date().toISOString().slice(0, 10)
  })

  useMemo(() => {
    setValues((prevState) => ({...prevState,
      ...calcHohmann(CALC.r1, CALC.r2, CALC.startDate)
    }))
  }, [])

  // const calcEcc = (a, c) => {
  //   return (a - c) / (a + c)
  // }

  // const toFixedNumber = (num, digits, base) => {
  //   let pow = Math.pow(base||10, digits);
  //   return Math.round(num*pow) / pow;
  // }


  const handleChange = (e) => {
    switch(e.name) {
      case 'r1':
        setValues((prevState) => ({...prevState, r1: parseFloat(e.value),
          ...calcHohmann(e.value, values.r2, values.startDate)
        }))
      break;
      case 'r2':
        setValues((prevState) => ({...prevState, r2: parseFloat(e.value),
          ...calcHohmann(values.r1, e.value, values.startDate)
        }))
      break;
      case 'calendarInit':
        setValues((prevState) => ({...prevState, startDate: e.value,
          ...calcHohmann(values.r1, values.r2, e.value)
        }))
      break;
      default:
        break;
    }
  }
  const toFixedNumber = (num, digits, base) => {
    var pow = Math.pow(base||10, 2);
    return Math.round(num*pow) / pow;
  }

  const aToKm = a => a * values.au
  const gFind = (mass, r) => {
    const g = (values.G * (mass / Math.pow(r, 2)))
    return toFixedNumber(g)
  }
  const periodYears = a => Math.sqrt(Math.pow(a, 3))
  const distanceInYear = a => toFixedNumber(2 * Math.PI * a)
  const orbitalVelocity = distanceInYear => toFixedNumber(distanceInYear/365.25/24/3600)
  const v1Escape = (R, g) => toFixedNumber(Math.sqrt(R*g)/1000)
  const v2Escape = (v1) => toFixedNumber(Math.sqrt(2)*v1)
  const v3Escape = orbitalVelocity => toFixedNumber(Math.sqrt(2)*orbitalVelocity)

  const PLANETS_DATA = x.map(planet => ({
    name: planet.name,
    a: aToKm(planet.axisA),
    R: planet.R,
    aAu: planet.axisA,
    periodYears: Math.sqrt(Math.pow(planet.axisA, 3)),
    periodDays: periodYears(planet.axisA) * 365.25,
    g: gFind(planet.mass, planet.R),
    distanceInYear: distanceInYear(aToKm(planet.axisA)),
    orbitalVelocity: orbitalVelocity(distanceInYear(aToKm(planet.axisA))),
    v1Escape: v1Escape(planet.R, gFind(planet.mass, planet.R)),
    v2Escape: v2Escape(v1Escape(planet.R, gFind(planet.mass, planet.R))),
    v3Escape: v3Escape(orbitalVelocity(distanceInYear(aToKm(planet.axisA))))

  }))

  console.warn(PLANETS_DATA)
  // const convertScientific = (num) => {
  //     return Number(num.replace(/,/g, '.'))
  // }

  // const convertToScientific = (num) => {
  //   return num.toExponential()
  // }

  // const convertUnits = (num) => {
  //   return (num / 1000)
  // }

  return (
    <Container className="container">
      <Container className="calc-container">
      {/* <div className="form-row align-items-center">
        <div className="col-auto">
          <label htmlFor="">Mass 1</label>
          <input name="M" type="text" className="form-control mb-2" aria-describedby="M" onChange={(e) => handleChange(e.target)} />
        </div>
      </div>
      <ul className="list-group text-dark">
        <li className="list-group-item">GM: {convertToScientific(values.GM)}</li>
      </ul> */}
      <div className="form-row align-items-center mb-3">
        <div className="col-auto">
          <label htmlFor="r1">Init Distance from Sun(au)</label>
          <select name="r1"  defaultValue={CALC.r1} className="form-control" onChange={(e) => handleChange(e.target)}>
            {PLANETS.map(p => {
              return <option key={p.name} value={p.axisA}>{p.name}</option>
            })}
          </select>
          {/* <input name="r1" type="text" className="form-control mb-2" aria-describedby="r1" onChange={(e) => handleChange(e.target)} /> */}
        </div>
        <div className="col-auto">
          <label htmlFor="r2">Target Distance from Sun(au)</label>
          <select name="r2" defaultValue={CALC.r2} className="form-control" onChange={(e) => handleChange(e.target)}>
            {PLANETS.map(p => {
              return <option key={p.name} value={p.axisA}>{p.name}</option>
            })}
          </select>
          {/* <input name="r2" type="text" className="form-control mb-2" aria-describedby="r2" onChange={(e) => handleChange(e.target)} /> */}
        </div>
      </div>
      <ul className="list-group text-dark list-group-flush">
      <li className="list-group-item list-group-item-success">Hohmann Transfer</li>
        <li className="list-group-item list-group-item-primary">Speed:</li>
        <li className="list-group-item">v1: {CALC.va} [m/s]</li>
        <li className="list-group-item">v2: {CALC.vb} [m/s]</li>
        <li className="list-group-item">vDelta: {values.vd} [m/s]</li>
        <li className="list-group-item list-group-item-primary">Time:</li>
        <li className="list-group-item">
          <input name="calendarInit" className="form-control" type="date" value={values.startDate} onChange={(e) => handleChange(e.target)}/>
        </li>
        <li className="list-group-item">Arc Start: {values.arcStart}, </li>
        <li className="list-group-item">Period: {values.T} [years], </li>
        <li className="list-group-item">Time Syn: {values.TSyn} [years], </li>
        <li className="list-group-item">Time Trip: <br/>{values.TTransfer / 2} [years], <br/> {values.TTransferDays} [days] </li>
        <li className="list-group-item">Date: <br/>Leave: {CALC.dateLeave} <br/> Arrival: {CALC.dateArrive} <br/> LeaveP2: {CALC.dateLeaveP2} <br/> ArrivalP2: {CALC.dateArriveP2}</li>
      </ul>
      </Container>
      <Container className="calc-data-container ml-5">
      <table className="table table-dark">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Axis A (au)</th>
          </tr>
        </thead>
        <tbody>
          {PLANETS.map((p, i) => {
            return (
              <tr key={p.name}>
                <th scope="row">{i + 1}</th>
                <td>{p.name}</td>
                <td>{p.axisA}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </Container>
    </Container>
  )
}

export default Calc