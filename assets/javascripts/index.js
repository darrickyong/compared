const errors = document.getElementsByClassName("errors")[0];
const savings = document.getElementsByClassName("user-savings")[0];
const contributions = document.getElementsByClassName("user-contributions")[0];
const growth = document.getElementsByClassName("user-growth")[0];
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

savings.addEventListener("change", e => setYears(e));
contributions.addEventListener("change", e => setYears(e));
growth.addEventListener("change", e => setYears(e));

document
  .getElementsByClassName("user-selection")[0]
  .addEventListener("change", (e) => {
    setYears(e);
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

const compareImg = d3
  .select(".this-is-else")
  .append("svg")
  .attr("class", "compare-img")
  .append("image")
  .attr("width", "270")
  .attr("height", "180px")
  .attr(
    "xlink:href",
    netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex].img
  );

// Vizualize
document
  .getElementsByClassName("visualize-button")[0]
    .addEventListener("click", e => visualize(e));

const visualize = e => {
  removeCharts();
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
document.getElementsByClassName("grow-button")[0]
  .addEventListener("click", e => drawChart(e));

// Formulas
const nper = (rate, cmpd, pmt, pv, fv) => {
  fv = parseFloat(fv);
  pmt = pmt === "" ? 0 : parseFloat(pmt);
  pv = pv === "" ? 0 : parseFloat(pv);
  cmpd = parseFloat(cmpd);

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
  return (parseFloat(expr)).toLocaleString("en", {minimumFractionDigits: 2});
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
  document.getElementsByClassName("years")[0].textContent = years === "FOREVER" ? "FOREVER" : years <= 0 ? `... Congrats! You have already exceeded the benchmark!`:`approximately ${years} years`;
  return years;
};

const removeCharts = () => {
  errors.innerText = "";
  savings.style.border = "1px solid #cccccc";
  contributions.style.border = "1px solid #cccccc";
  growth.style.border = "1px solid #cccccc";
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
  errors.innerText = "";
  removeCharts();
  
  const baseSavings = document.getElementsByClassName("user-savings")[0].value;
  const baseContributions = document.getElementsByClassName("user-contributions")[0].value;
  const growth = document.getElementsByClassName("user-growth")[0].value;

  if (parseFloat(growth) && (!parseFloat(baseSavings) && !parseFloat(baseContributions))) {
    errors.innerText = "Please enter your current savings or an amount to save annually."
    savings.style.border = "1px solid red";
    contributions.style.border = "1px solid red";
    return;
  } else if (!parseFloat(growth) && !parseFloat(baseSavings) && !parseFloat(baseContributions)) {
    errors.innerText = "Please enter both your current savings and an amount to save annually."
    savings.style.border = "1px solid red";
    contributions.style.border = "1px solid red";
    return;
  }
  
  const years = setYears(e);
  const data = createData(baseSavings, baseContributions, growth, years);
  
  const svg = d3.select(".blocks").append("svg").attr("class", "lineChart");
  const margin = {top: 30, right: 20, bottom: 20, left: 100}
  const chartSpace = document.getElementsByClassName("lineChart")[0];
  const lineHeight = chartSpace.clientHeight - 100;
  const lineWidth = chartSpace.clientWidth - 200;

  const minYear = d3.min(data, function(d) { return d.year });
  const maxYear = d3.max(data, function(d) { return d.year });
  const minVal = d3.min(data, function(d) { return d.value });
  const maxVal = d3.max(data, function(d) { return d.value });

  const bisectDate = d3.bisector((d) => {
    return d.year;
  }).left;

  const mousemove = () => {
    const x0 = x.invert(d3.mouse(event.currentTarget)[0]);
    const i = bisectDate(data, x0, 1);
    const d0 = data[i - 1];
    const d1 = data[i] === undefined ? d0 : data[i];
    const d = x0 - d0.year > d1.year - x0 ? d1 : d0;
    const xAdjust = x(d.year) + margin.left;
    const yAdjust = y(d.value) + margin.top;
    const widthAdjust = lineWidth * -1 + margin.left;

    focus
      .select("circle.y")
      .attr("transform", "translate(" + xAdjust + ", " + yAdjust + ")");

    focus
      .select(".xLine")
      .attr("transform", "translate(" + xAdjust + ", " + yAdjust + ")")
      .attr("y2", lineHeight + margin.top - yAdjust);

    focus
      .select(".yLine")
      .attr("transform", "translate(" + widthAdjust + ", " + yAdjust + ")")
      .attr("x2", lineWidth + x(d.year));

    focus
      .select("text.y1")
      .attr("transform", "translate("+xAdjust+", "+yAdjust+")")
      .text("$" + conv_number(d.value))

    focus
      .select("text.y2")
      .attr("transform", "translate(" + xAdjust + ", " + yAdjust + ")")
      .text("$" + conv_number(d.value))

    focus
      .select("text.y3")
      .attr("transform", "translate("+xAdjust+", "+yAdjust+")")
      .text("Year " + d.year)

    focus
      .select("text.y4")
      .attr("transform", "translate(" + xAdjust + ", " + yAdjust + ")")
      .text("Year " + d.year)
  };

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
  const lineSvg = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  const focus = svg
    .append("g")
    .style("display", "none");

  const line = d3
    .line()
    .x(function(d) {return x(d.year) })
    .y(function(d) { return y(d.value) })

  lineSvg
    .append("path")
    .attr("class", "graphline")
    .attr("d",line(data));

  svg
    .append("rect")
    .attr("width", lineWidth)
    .attr("height", lineHeight)
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", () => focus.style("display", null))
    .on("mouseout", () => focus.style("display", "none"))
    .on("mousemove", mousemove)

  focus
    .append("circle")
    .attr("class", "y")
    .style("fill", "none")
    .style("stroke", "#EEE5E9")
    .attr("r", 5);
  
  focus
    .append("line")
    .attr("class", "xLine")
    .style("stroke", "#92DCE5")
    .style("stroke-width", "1.5")
    .style("stroke-dasharray", "5")
    .style("opacity", 0.5)
    .attr("y1", 0)
    .attr("y2", lineHeight);

  focus
    .append("line")
    .attr("class", "yLine")
    .style("stroke", "#92DCE5")
    .style("stroke-width", "1.5")
    .style("stroke-dasharray", "5")
    .style("opacity", 0.5)
    .attr("x1", lineWidth)
    .attr("x2", lineWidth);

  focus
    .append("text")
    .attr("class", "y1")
    .style("stroke", "#39393A")
    .style("stroke-width", "3px")
    .attr("dx", 10)
    .attr("dy", 35)
  focus
    .append("text")
    .attr("class", "y2")
    .attr("dx", 10)
    .attr("dy", 35)

  focus
    .append("text")
    .attr("class", "y3")
    .style("stroke", "#39393A")
    .style("stroke-width", "3px")
    .attr("dx", 10)
    .attr("dy", 20)
  focus
    .append("text")
    .attr("class", "y4")
    .attr("dx", 10)
    .attr("dy", 20)
  

}

const createData = (pv, pmt, rate, yrs) => {
  pv = pv === "" ? 0 : parseFloat(pv);
  pmt = pmt === "" ? 0 : parseFloat(pmt);
  rate = 1 + rate/100;
  yrs = parseFloat(yrs);
  let currYear = new Date().getFullYear();
  let currVal = parseFloat(pv);
  const data = [];
  for (let i = 0; i < yrs + 10; i++) {
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