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


// const svg = d3
//   .select(".svg")
//   .append("svg")
//   .attr("width", "100%")
//   .style("background", "#F2F2F2");
  
const you = d3.select(".this-is-you")
  .append("svg")
  .attr("width", 4)
  .attr("height", 4)
  .append("rect")
  .attr("width", 4)
  .attr("height", 4)
  .style("fill", "red")

const compareImg = d3.select(".this-is-else")
  .append("svg")
  .attr("width", 200)
  .attr("height", 200)
  .append("image")
  .attr("width", 200)
  .attr("height", 200)
  .attr("xlink:href",
    netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex].img)

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

const svg = d3.select(".blocks")
  .append("svg")

// const svg = d3.select(".testing")

const width = 2000;
const height = 550;
const offset = 20;
const groupSpacing = 1;
const cellSpacing = 1;
const cellSize = 4;
const updateDuration = 125;
const updateDelay = updateDuration / 500;

let block = svg
  .append("g")
  .attr("class", "cells")
  .attr("transform", "translate(" + offset + "," + (offset + 30) + ")")
  .selectAll("rect");

const update = size => {
  svg.selectAll("rect").remove();
  // debugger
  const n0 = block.size();
  block = block.data(d3.range(size));
  // debugger
  // block
  //   .exit()
  //   .transition()
  //   .delay((d, i) => {
  //     return (n0 - i) * updateDelay;
  //   })
  //   .duration(updateDuration)
  //   .attr("width", 0)
  //   .remove();


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
      // debugger
      // const xblock = groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 5);
      // debugger
      return xblock;
    })
    .attr("y", i => {
      const y0 = Math.floor(i / 100) % 10;
      // const y0 = Math.floor(i / 50) % 10;
      const y1 = Math.floor(i % 10);
      // const y1 = Math.floor(i % 5);
      const yblock = groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10);
      // debugger
      // const yblock = groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10);
      // debugger
      return yblock;
    })
    .transition()
    .delay(function (d, i) {
      return (i - n0) * updateDelay;
    })
    .duration(updateDuration)
    .attr("width", cellSize);

  // label
  //   .attr("x", offset + groupSpacing)
  //   .attr("y", offset + groupSpacing)
  //   .attr("dy", ".71em")
  //   .transition()
  //   .duration(Math.abs(size - n0) * updateDelay + updateDuration / 2)
  //   .ease("linear")
  //   .tween("text", function () {
  //     const i = d3.interpolateNumber(n0, size);
  //     return function (t) {
  //       this.textContent = formatNumber(Math.round(i(t)));
  //     };
  //   });
}

document
  .getElementsByClassName("slide-button")[0]
  .addEventListener("click", (e) => {
    update(1)
  });

document
  .getElementsByClassName("zoom-button")[0]
  .addEventListener("click", (e) => {
    update(10)
  });