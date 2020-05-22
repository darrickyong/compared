// Function to calculate total number of payments.

const nper = (rate, per, pmt, pv, fv) => {
  fv = parseFloat(fv);
  pmt = parseFloat(pmt);
  pv = parseFloat(pv);
  per = parseFloat(per);

  let nper_value;

  rate = eval((rate) / (per * 100));
  if (rate == 0) {
    nper_value = -(fv + pv) / pmt;
  } else {
    nper_value = Math.log((-fv * rate + pmt) / (pmt + rate * pv)) / Math.log(1 + rate);
  }
  nper_value = conv_number(nper_value, 2);
  return nper_value;
}

const conv_number = (expr, decplaces) => {
  var str = "" + Math.round(eval(expr) * Math.pow(10, decplaces));
  while (str.length <= decplaces) {
    str = "0" + str;
  }
  var decpoint = str.length - decplaces;
  return (str.substring(0, decpoint) + "." + str.substring(decpoint, str.length));
}

module.exports.nper = nper;