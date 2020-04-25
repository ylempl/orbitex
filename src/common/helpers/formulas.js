export const EccAnom_SIM = (ec,m,dp) => {
    // arguments:
    // ec=eccentricity, m=mean anomaly,
    // dp=number of decimal places

  var pi=Math.PI, K=pi/180.0;
  var maxIter=30, i=0;
  var delta=Math.pow(10,-dp);
  var E, F;

  m=m/360.0;
  m=2.0*pi*(m-Math.floor(m));

  if (ec<0.8) E=m; else E=pi;

  F = E - ec*Math.sin(m) - m;

  while ((Math.abs(F)>delta) && (i<maxIter)) {
    E = E - F/(1.0-ec*Math.cos(E));
    F = E - ec*Math.sin(E) - m;
    i = i + 1;
  }

  E=E/K;

  return Math.round(E*Math.pow(10,dp))/Math.pow(10,dp);
}

export const getJulianDate_SIM = (Year,Month,Day) => {
  var inputDate = new Date(Year,Month,Day);
  var switchDate = new Date("1582","10","15");

  var isGregorianDate = inputDate >= switchDate;

  //Adjust if B.C.
  if (Day < 1) {
    Day++
  }
  if(Year<0){
    Year++;
  }

  //Adjust if JAN or FEB
  if(Month===1||Month===2){
    Year = Year - 1;
    Month = Month + 12;
  }

  //Calculate A & B; ONLY if date is equal or after 1582-Oct-15
  var A = Math.floor(Year/100); //A
  var B = 2-A+Math.floor(A/4); //B

  //Ignore B if date is before 1582-Oct-15
  if(!isGregorianDate){B=0;}
  return ((Math.floor(365.25*Year)) + (Math.floor(30.6001*(Month+1))) + Day + 1720994.5 + B);
}

export const toRadians_SIM = (deg) =>{
  return deg * (Math.PI / 180);
}