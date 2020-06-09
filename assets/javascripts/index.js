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
  return yrs < 0 ? 0 : yrs;
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
  .addEventListener("submit", e => {
    setYears(e);
    let baseline = document.getElementsByClassName("user-worth")[0].value;
    let compare =
      netWorth[
        document.getElementsByClassName("user-selection")[0].selectedIndex
      ].val;
    if ((compare / baseline) > 40000) {
      if (window.confirm("It seems like there is a vast disparity, which will cause an usually long load time. Are you sure you want to continue?")) {
        update(compare / baseline);
      } else return;
    } else {
      update(compare / baseline);
    }
  })
const width = 2000;
const height = 550;
const offset = 20;
const groupSpacing = 0;
const cellSpacing = 1;
const cellSize = 8;
const updateDuration = 125;
const updateDelay = updateDuration / 500;

const netWorth = [
  { "name": "Test", "val": 500000, "img":"./assets/images/test.jpeg" },
  { "name": "Median Bay Area house", "val": 928000, "img":"./assets/images/home.jpg" },
  { "name": "Boeing 777-300ER", "val": 375500000, "img": "./assets/images/boeing.jpg"},
  { "name": "Jeff Bezos", "val": 145000000000, "img": "./assets/images/jeff.jpg" },
]

const selection = d3
  .select(".user-selection")

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
  
const you = d3.select(".this-is-you")
  .append("svg")
  .attr("width", cellSize)
  .attr("height", cellSize)
  .append("rect")
  .attr("width", cellSize)
  .attr("height", cellSize)
  .style("fill", "green")

const compareImg = d3.select(".this-is-else")
  .append("svg")
  .attr("width", "225px")
  .attr("height", "150px")
  .attr("class", "compare-img")
  .append("image")
  .attr("width", "225px")
  .attr("height", "150px")
  .attr("xlink:href",
    netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex].img)

// const compareName = d3
//   .selectAll(".compare-name")
//   .text(netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex].name);

const compareVal = d3
  .select("#compare-val")
  .text(conv_number(netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex].val));

document
  .getElementsByClassName("user-selection")[0]
  .addEventListener("change", (e) => {
    setYears(e);
    compareImg.attr("xlink:href", netWorth[e.target.selectedIndex].img);
    compareVal.text(`${ conv_number(netWorth[e.target.selectedIndex].val) }`);
    // compareName.text(`${ netWorth[e.target.selectedIndex].name }`);
    // let baseline = document.getElementsByClassName("user-worth")[0].value;
    // let compare = netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex].val;
    // // update(compare/baseline);
  });

const svg = d3.select(".blocks")
  .append("svg")

let block = svg
  .append("g")
  .attr("class", "cells")
  .attr("transform", "translate(" + offset + "," + (offset) + ")")
  // .attr("transform", "translate(0,0)")
  .selectAll("rect");

const update = size => {
  svg.selectAll("rect").remove();
  block = block.data(d3.range(size));

  block
    .enter()
    .append("rect")
    .attr("width", 0)
    .attr("height", cellSize)
    .attr("x", i => {
      const x0 = Math.floor(i / 1000);
      // const x0 = Math.floor(i / 500);
      const x1 = Math.floor((i % 100) / 10);
      // const x1 = Math.floor((i % 50) / 10);
      const xblock = groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 10);
      // const xblock = groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 5);
      return xblock;
    })
    .attr("y", i => {
      const y0 = Math.floor(i / 100) % 10;
      // const y0 = Math.floor(i / 50) % 10;
      const y1 = Math.floor(i % 10);
      // const y1 = Math.floor(i % 5);
      const yblock = groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10);
      // const yblock = groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10);
      return yblock;
    })
    .transition()
    .delay(function (d, i) {
      return (i) * updateDelay;
    })
    .duration(updateDuration)
    .attr("width", cellSize);
}