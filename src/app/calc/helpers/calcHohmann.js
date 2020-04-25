import { CALC } from '../data'

const au = 149597871 / (365.24 * 24 * 3600)

function addDays(date, days) {
  const copy = new Date(Number(date))
  copy.setDate(date.getDate() + days)
  return copy
}

export const calcHohmann = (r1, r2, startDate) => {
  let orbitInit,
  orbitTarget,
  orbitInitYear,
  orbitTargetYear,
  orbitTransfer,
  orbitTransferEcc,
  orbitTransferYears,
  orbitTransferSemiMinor,
  momentum,
  va,
  vb,
  vInit,
  vTarget,
  deltaVInit,
  deltaVTarget,
  T,
  TSyn,
  TTransfer,
  arcTransfer,
  arcRelative,
  TFlight,
  TTravel,
  arcStart

  r1 = parseFloat(r1)
  r2 = parseFloat(r2)

  orbitInit = Math.pow(r1, 3/2)
  orbitInitYear = 2 * Math.PI * r1 / orbitInit
  orbitTarget = Math.pow(r2, 3/2)
  orbitTargetYear = 2 * Math.PI * r2 / orbitTarget

  orbitTransfer = (parseFloat(r1) + r2) / 2
  orbitTransferYears = Math.pow(orbitTransfer, 3/2)
  orbitTransferEcc = (orbitTransfer - r1) / orbitTransfer
  orbitTransferSemiMinor = orbitTransfer * Math.sqrt(1-Math.pow(orbitTransferEcc, 2))
  momentum = orbitTransferSemiMinor * orbitTransfer * 2 * Math.PI / orbitTransferYears

  vInit = momentum / r1
  vTarget = momentum / r2
  deltaVInit = Math.abs(vInit - orbitInitYear)
  deltaVTarget = Math.abs(orbitTargetYear - vTarget)

  va = deltaVInit * au
  vb = deltaVTarget * au
  T = Math.sqrt(Math.pow(r2, 3))
  TSyn = Math.abs(1 / (1 - (1 / T)))
  TTransfer = Math.sqrt(Math.pow(orbitTransfer, 3))
  TTravel = TTransfer / 2

  arcStart = 360 * ((TTransfer / 2) / T)

  arcTransfer = Math.abs(180 - TTransfer / 2 * 360)
  arcRelative = 360 - 2 * arcTransfer
  TFlight = (arcRelative / 360) * TSyn

  // const dateBetween = {}
  // TJ2000 = PLANETS.map(p => {
  //   if(r1 === p.axisA) {
  //     dateBetween.d1 = parseFloat(p.arcL)
  //   }

  //   if (r2 === p.axisA) {
  //     dateBetween.d2 = parseFloat(p.arcL)
  //   }
  //   if(dateBetween.d1 && dateBetween.d2) {
  //     dateBetween.d3 = dateBetween.d2 - dateBetween.d1
  //   }

  //   return dateBetween
  // })


  // let atx,
  // ViA,
  // VfB,
  // VtxA,
  // VtxB,
  // dVA,
  // dVB,
  // dVT
  // // semi-major axis of transfer ellipse
  // atx = (r1 + r2) / 2

  // // initial velocity at point A
  // ViA = Math.sqrt(G*M/r1)

  // // final velocity at point B
  // VfB = Math.sqrt(G*M/2)

  // // velocity on transfer orbit at initial orbit A
  // VtxA = Math.sqrt(G*M*(2/r1 - 1/atx))

  // // velocity on transfer orbit at final orbit B
  // VtxB = Math.sqrt(G*M*(2/r2 - 1/atx))

  // // initial velocity change
  // dVA = VtxA - ViA

  // // final veloctiy change
  // dVB = VfB - VtxB

  // // total veloctiy change
  // dVT=dVA + dVB


  CALC.dateLeave = startDate
  CALC.dateArrive = addDays(new Date(startDate) , TTravel * 365.25).toISOString().slice(0, 10)
  CALC.dateLeaveP2 = addDays(new Date(CALC.dateArrive) , TSyn * 365.25).toISOString().slice(0, 10)
  CALC.dateArriveP2 = addDays(new Date(CALC.dateLeaveP2) , TTravel * 365.25).toISOString().slice(0, 10)


  CALC.va = va.toFixed(3)
  CALC.vb = vb.toFixed(3)

  const data = {
    v1: va.toFixed(3),
    v2: vb.toFixed(3),
    vd: (va + vb).toFixed(3),
    T: T.toFixed(3),
    TSyn: TSyn.toFixed(3),
    TTransfer: TTransfer.toFixed(3),
    TTransferDays: (TTransfer / 2 * 365.25).toFixed(3),
    TFlight: TFlight.toFixed(3),
    arcStart: arcStart.toFixed(2)
    // atx,
    // ViA,
    // VfB,
    // VtxA,
    // VtxB,
    // dVA,
    // dVB,
    // dVT
  }

  return data
}