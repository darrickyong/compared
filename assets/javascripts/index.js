const errors = document.getElementsByClassName("errors")[0];
const savings = document.getElementsByClassName("user-savings")[0];
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
// Select drop-down
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

document.getElementsByClassName("user-savings")[0]
  .addEventListener("change", e => setYears(e));
document.getElementsByClassName("user-contributions")[0]
  .addEventListener("change", e => setYears(e));
document.getElementsByClassName("user-growth")[0]
  .addEventListener("change", e => setYears(e));

document
  .getElementsByClassName("user-selection")[0]
  .addEventListener("change", (e) => {
    setYears(e);
    // document.getElementsByClassName("compare-img")[0].src = netWorth[e.target.selectedIndex].img;
    compareImg.attr("xlink:href", netWorth[e.target.selectedIndex].img);
    compareVal.text(`${conv_number(netWorth[e.target.selectedIndex].val)}`);
  }); 

// Comparisons
const you = d3
  .select(".this-is-you")
  .append("svg")
  .attr("width", cellSize)
  .attr("height", cellSize)
  .append("rect")
  .attr("width", cellSize)
  .attr("height", cellSize)
  .style("fill", "green");

const compareImg = d3
  .select(".this-is-else")
  .append("svg")
  .attr("width", "225px")
  .attr("height", "150px")
  .attr("class", "compare-img")
  .append("image")
  .attr("width", "225px")
  .attr("height", "150px")
  .attr(
    "xlink:href",
    netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex].img
  );

// Vizualize
document
  .getElementsByClassName("user-form")[0]
    .addEventListener("submit", e => visualize(e));

const visualize = e => {
  errors.innerText = "";
  savings.style.border = "none";
  setYears(e);
  document.getElementsByClassName("blocks")[0].scrollLeft = 0;
  document.getElementsByClassName("blocks")[0].scrollTop = 0;
  let baseline = document.getElementsByClassName("user-savings")[0].value;
  let compare = netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex].val;
  if (!baseline) {
    errors.innerText = "In order to visualize disparity, please enter your savings.";
    savings.style.border="1px solid red";
  } else if ((compare / baseline) > 40000) {
    if (window.confirm("It seems like there is a vast disparity, which will cause an usually long load time. Confirm you still wish to continue.")) {
      update(compare / baseline);
    } else return;
  } else {
    update(compare / baseline);
  }
}

// TVM visualization
document.getElementsByClassName("tvm-button")[0]
  .addEventListener("click", e => drawChart(e));

// Block visualization



// Formulas
const nper = (rate, cmpd, pmt, pv, fv) => {
  fv = parseFloat(fv);
  pmt = pmt === "" ? 0 : parseFloat(pmt);
  pv = pv === "" ? 0 : parseFloat(pv);
  cmpd = parseFloat(cmpd);

  if (!pv && !pmt) {
    return "FOREVER";
  }

  let yrs;
  rate = eval(rate / (cmpd * 100));
  if (rate == 0) {
    yrs = -(fv + pv) / pmt;
  } else {
    yrs = Math.log((-fv * rate + pmt) / (pmt + rate * pv)) / Math.log(1 + rate);
  }
  yrs = conv_number(yrs);
  return yrs < 0 ? 0 : yrs;
};

const conv_number = (expr) => {
  if (expr === Infinity) return "FOREVER";
  return parseFloat(expr.toFixed(2).toString()).toLocaleString("en");
};

const compareVal = d3
  .select("#compare-val")
  .text(
    conv_number(netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex].val)
  );

const setYears = (e) => {
  e.preventDefault();
  let baseSavings = document.getElementsByClassName("user-savings")[0].value;
  let baseContributions = document.getElementsByClassName("user-contributions")[0].value;
  let growth = document.getElementsByClassName("user-growth")[0].value;
  let comparison = netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex].val;
  let years = nper(growth, 1, baseContributions, baseSavings, -comparison);
  document.getElementsByClassName("years")[0].textContent = years === "FOREVER" ? "FOREVER" : `${years} years`;
  return years;
};

const removeCharts = () => {
  d3.select(".blockChart").remove();
  d3.select(".lineChart").remove();
}

const update = (size) => {
  removeCharts();
  const svg = d3.select(".blocks").append("svg").attr("class", "blockChart");

  let block = svg
    .append("g")
    .attr("class", "cells")
    .attr("transform", "translate(" + offset + "," + offset + ")")
    // .attr("transform", "translate(0,0)")
    .selectAll("rect");

  block = block.data(d3.range(size));

  block
    .enter()
    .append("rect")
    .attr("width", 0)
    .attr("height", cellSize)
    .attr("x", (i) => {
      const x0 = Math.floor(i / 1000);
      // const x0 = Math.floor(i / 500);
      const x1 = Math.floor((i % 100) / 10);
      // const x1 = Math.floor((i % 50) / 10);
      const xblock =
        groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 10);
      // const xblock = groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 5);
      return xblock;
    })
    .attr("y", (i) => {
      const y0 = Math.floor(i / 100) % 10;
      // const y0 = Math.floor(i / 50) % 10;
      const y1 = Math.floor(i % 10);
      // const y1 = Math.floor(i % 5);
      const yblock =
        groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10);
      // const yblock = groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10);
      return yblock;
    })
    .transition()
    .delay(function (d, i) {
      return i * updateDelay;
    })
    .duration(updateDuration)
    .attr("width", cellSize);
};

const drawChart = (e) => {
  removeCharts();
  const svg = d3.select(".blocks").append("svg").attr("class", "lineChart");

  const baseSavings = document.getElementsByClassName("user-savings")[0].value;
  const baseContributions = document.getElementsByClassName("user-contributions")[0].value;
  const growth = document.getElementsByClassName("user-growth")[0].value;
  const years = setYears(e);
  const data = createData(baseSavings, baseContributions, growth, years);
  
  const margin = {top: 30, right: 20, bottom: 20, left: 100}
  const chartSpace = document.getElementsByClassName("lineChart")[0];

  const lineHeight = chartSpace.clientHeight - 100;
  const lineWidth = chartSpace.clientWidth - 200;
  const xAdjust = lineHeight + margin.top;

  const minYear = d3.min(data, function(d) { return d.year });
  const maxYear = d3.max(data, function(d) { return d.year });
  const minVal = d3.min(data, function(d) { return d.value });
  const maxVal = d3.max(data, function(d) { return d.value });
  
  // Line Chart
  const chartGroup = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
  
  // X and Y axis
  const y = d3.scaleLinear()
    .domain([0, maxVal])
    .range([lineHeight, 0]);

  const x = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([0, lineWidth]);

  const xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(y)

  chartGroup
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + lineHeight + ")")
    .call(xAxis);

  chartGroup.append("g").attr("class", "y axis").call(yAxis);
  
  // X and Y gridlines
  // const xGridlines = () => {
  //   return d3.axisBottom(x).ticks(Math.floor(years));
  // }

  // const yGridlines = () => {
  //   return d3.axisLeft(y).ticks(20);
  // }

  // svg
  //   .append("g")
  //   .attr("class", "grid")
  //   .attr("transform", "translate("+margin.left+", "+xAdjust+")")
  //   .call(xGridlines().tickSize(-lineHeight).tickFormat(""));
  // svg
  //   .append("g")
  //   .attr("class", "grid")
  //   .attr("transform", "translate("+margin.left+", "+margin.top+")")
  //   .call(yGridlines().tickSize(-lineWidth).tickFormat(""));

  // Path
  const line = d3
    .line()
    .x(function(d) {return x(d.year) })
    .y(function(d) { return y(d.value) })

  chartGroup
    .append("path")
    .attr("class", "graphline")
    .attr("d",line(data));
  
}

const createData = (pv, pmt, rate, yrs) => {
  pv = pv === "" ? 0 : parseFloat(pv);
  pmt = pmt === "" ? 0 : parseFloat(pmt);
  rate = 1 + rate/100;
  yrs = parseFloat(yrs);
  let currYear = new Date().getFullYear();
  let currVal = parseFloat(pv);
  const data = [];
  for (let i = 0; i < yrs + 1; i++) {
    data.push({year: currYear, value: +currVal.toFixed(2)});
    currYear += 1;
    currVal = (currVal + pmt) * rate;
  }
  return data;
  
}

window.addEventListener("resize", (e) => {
  if (document.getElementsByClassName("lineChart")[0]) {
    drawChart(e);
  }
})