const nper = (rate, cmpd, pmt, pv, fv) => {
  fv = parseFloat(fv);
  pmt = pmt === "" ? 0 : parseFloat(pmt);
  pv = pv === "" ? 0 : parseFloat(pv);
  cmpd = parseFloat(cmpd);

  if (!pv && !pmt) return 0;
  
  let yrs;
  rate = eval(rate / (cmpd * 100));
  if (rate == 0) {
    yrs = -(fv + pv) / pmt;
  } else {
    yrs =
      Math.log((-fv * rate + pmt) / (pmt + rate * pv)) / Math.log(1 + rate);
  }
  yrs = conv_number(yrs);
  return yrs;
};

const conv_number = (expr) => {
  if (expr === Infinity) return "FOREVER";
  return parseFloat(expr.toFixed(2).toString()).toLocaleString("en");
};

const setYears = e => {
  e.preventDefault();
  let baseWorth = document.getElementsByClassName("user-worth")[0].value;
  let baseSavings = document.getElementsByClassName("user-savings")[0].value;
  let interest = document.getElementsByClassName("user-interest")[0].value;
  let comparison =
    netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex]
      .val;
  let years = nper(interest, 1, baseSavings, baseWorth, -comparison);
  document.getElementById("years").textContent = years;
}

document
  .getElementById("user-form")
  .addEventListener("submit", e => setYears(e))

const netWorth = [
  { "name": "Jeff Bezos", "val": 145000000000, "img": "./assets/images/jeff.jpg" },
  { "name": "Test", "val": 500000, "img":"./assets/images/test.png" },
]

const selection = d3
  .select(".user-compare")
  .append("select")
  .attr("class", "user-selection")

const options = selection.selectAll("option")
  .data(netWorth)
  .enter()
  .append("option")

options.text( d => {
  return d.name;
})
  .attr("value", d => {
    return d.name;
  })

const svg = d3
  .select(".svg")
  .append("svg")
  .attr("width", "100%")
  .style("background", "#F2F2F2");
  
const you = d3.select(".this-is-you")
  .append("svg")
  .attr("width", 10)
  .attr("height", 10)
  .append("rect")
  .attr("width", 10)
  .attr("height", 10)
  .style("fill", "pink")

const compareImg = d3.select(".this-is-else")
  .append("svg")
  .attr("width", 200)
  .attr("height", 200)
  .append("image")
  .attr("width", 200)
  .attr("height", 200)
  .attr("xlink:href",
    netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex]
      .img
  );

const compareName = d3
  .select("#compare-name")
  .text(netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex].name);

const compareVal = d3
  .select("#compare-val")
  .text(conv_number(netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex].val));

document
  .getElementsByClassName("user-selection")[0]
  .addEventListener("change", (e) => {
    setYears(e);
    compareImg.attr("xlink:href", netWorth[e.target.selectedIndex].img);
    compareName.text(`${ netWorth[e.target.selectedIndex].name }`);
    compareVal.text(`${ conv_number(netWorth[e.target.selectedIndex].val) }`);
  });


