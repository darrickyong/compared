const errors = document.getElementsByClassName("errors")[0];
const savings = document.getElementsByClassName("user-savings")[0];
const contributions = document.getElementsByClassName("user-contributions")[0];
const growth = document.getElementsByClassName("user-growth")[0];
const selection = document.getElementsByClassName("user-selection")[0];
const width = 2000;
const height = 550;
const offset = 20;
const groupSpacing = 0;
const cellSpacing = 0;
const cellSize = 1;
const updateDuration = 125;
const updateDelay = updateDuration / 250;
const numericKeys = "0123456789.";


const netWorth = [
  { "name": "Select from one of the below", "val": 0, "img": null, "disabled": true },
  { "name": "iPhone Pro", "val": 1000, "img":"./assets/images/iphone.jpg" },
  { "name": "Toyota Camry", "val": 24425, "img":"./assets/images/camry.jpeg" },
  { "name": "Ferrari 458", "val": 250000, "img":"./assets/images/458.jpg" },
  { "name": "Median Bay Area Home", "val": 928000, "img":"./assets/images/home.jpg" },
  { "name": "Median Beverly Hills Mansion", "val": 3540000, "img":"./assets/images/mansion.jpg" },
  { "name": "Boeing 777-300ER", "val": 375500000, "img": "./assets/images/boeing.jpg"},
  { "name": "Mark Cuban", "val": 4300000000, "img": "./assets/images/cuban.jpeg"},
  { "name": "Jeff Bezos", "val": 145000000000, "img": "./assets/images/jeff.jpg" },
]
// Select drop-down
const d3Selection = d3
  .select(".user-selection")

const options = d3Selection.selectAll("option")
  .data(netWorth)
  .enter()
  .append("option")

options.text( d => {
  return d.name;
})
  .attr("disabled", d => {
    return d.disabled;
  })

savings.addEventListener("keypress", e => {
  if (e.charCode === 0) {
    return;
  }

  if (-1 == numericKeys.indexOf(e.key)) {
    e.preventDefault();
    return;
  }
});

savings.addEventListener("blur", e => {
  if (e.target.value === "") return; 
  let minNum = Math.max(1000, Number(e.target.value));
  let newNum = minNum.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  e.target.value = newNum;
});

savings.addEventListener("focus", e => {
  if (e.target.value === "") return;
  e.target.value = e.target.value.replace(/[,.]/g, "") / 100;
});

contributions.addEventListener("keypress", e => {
  if (e.charCode === 0) {
    return;
  }

  if (-1 == numericKeys.indexOf(e.key)) {
    e.preventDefault();
    return;
  }
});

contributions.addEventListener("blur", e => {
  if (e.target.value === "") return;
  e.target.value = Number(e.target.value).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
});

contributions.addEventListener("focus", e => {
  if (e.target.value === "") return;
  e.target.value = e.target.value.replace(/[,.]/g, "") / 100;
});

growth.addEventListener("keypress", e => {
  if (e.charCode === 0) {
    return;
  }

  if (-1 == numericKeys.indexOf(e.key)) {
    e.preventDefault();
    return;
  }
});

growth.addEventListener("blur", e => {
  if (e.target.value === "") return;
  // let minGrowth = Math.max(1,)
  e.target.value = Number(e.target.value).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
});

growth.addEventListener("focus", e => {
  if (e.target.value === "") return;
  e.target.value = e.target.value.replace(/[,.]/g, "") / 100;
});

document
  .getElementsByClassName("user-selection")[0]
  .addEventListener("change", (e) => {
    document.getElementsByClassName("value")[0].innerText = `is valued at $${conv_number(netWorth[e.target.selectedIndex].val)}.`
    document.getElementsByClassName("compare-img")[0].src = `${netWorth[e.target.selectedIndex].img}`
  }); 

// Vizualize
document
  .getElementsByClassName("visualize-button")[0]
    .addEventListener("click", e => visualize(e));

const visualize = e => {
  removeCharts();
  document.getElementsByClassName("blocks")[0].scrollLeft = 0;
  document.getElementsByClassName("blocks")[0].scrollTop = 0;
  let baseline = parseFloat(document.getElementsByClassName("user-savings")[0].value);
  let compare = netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex].val;
  if (!baseline) {
    errors.innerText = "Please enter your current savings.";
    savings.style.border = "1px solid red";
  } else if (!compare) {
    errors.innerText = "Please select a benchmark.";
    selection.style.border = "1px solid red";
  } else {
    setYears(e);
    update(baseline);
  }
}

// TVM visualization
document.getElementsByClassName("grow-button")[0]
  .addEventListener("click", e => drawChart(e));

// Formulas
const nper = (rate, cmpd, pmt, pv, fv) => {
  fv = parseFloat(fv);
  // if (!fv) return 0;
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
  // if (expr === -Infinity) return -1;
  return (parseFloat(expr)).toLocaleString("en", {minimumFractionDigits: 2, maximumFractionDigits: 2});
};

const setYears = (e) => {
  e.preventDefault();
  let baseSavings = document.getElementsByClassName("user-savings")[0].value.replace(/[,.]/g, "") / 100 ;
  let baseContributions = document.getElementsByClassName("user-contributions")[0].value.replace(/[,.]/g, "") / 100;
  let growth = document.getElementsByClassName("user-growth")[0].value.replace(/[,.]/g, "") / 100;
  let comparison = netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex].val;
  let years = nper(growth, 1, baseContributions, baseSavings, -comparison);
  const forever = "It seems like it will take a long time to reach your goal. Double check that you are either saving something every year or that your money is growing."
  const already = "Congratuations are in order! It seems like you've reached your goal. ";
  const normal = years > 0 ? `You will reach your goal in ${years} year(s), in Year ${new Date().getFullYear() + Math.ceil(years.replace(/[,.]/g, "")/100)}.`: null;
  document.getElementsByClassName("tvm-notes")[0].textContent = years === "FOREVER" ? forever : years > 0 ? normal : already; 
  return years.replace(/[,.]/g, "")/100;
};

const removeCharts = () => {
  errors.innerText = "";
  savings.style.border = "1px solid #cccccc";
  contributions.style.border = "1px solid #cccccc";
  growth.style.border = "1px solid #cccccc";
  selection.style.border = "1px solid #cccccc";

  document.getElementsByClassName("blocks")[0].innerHTML = "";
  d3.select(".blockChart").remove();
  d3.select(".lineChart").remove();
}

const generateDiv = (size, str) => {
  // 1000
  const resultDiv = document.createElement("div");
  size = Math.max(1, Math.ceil(size / 1000));

  if (Math.sqrt(size) < 250) {
    let div = document.createElement("div");
    let square = Math.floor(Math.sqrt(size));
    div.style.height = `${square}px`;
    div.style.width = `${square}px`;
    div.className = str === "self" ? "selfDiv" : "compareDiv";
    resultDiv.appendChild(div);

    size = size - square ** 2;
    while (size > 0) {
      let newDiv = document.createElement("div");
      newDiv.style.height = `${Math.min(square, size)}px`;
      newDiv.style.width = "1px";
      newDiv.className = str === "self" ? "selfDiv" : "compareDiv";
      resultDiv.appendChild(newDiv);
      size = size - square;
    }

  } else {
    while ( size >= 1 ) {
      let div = document.createElement("div");
      if ( size >= 250 ) {
        div.style.height = "250px";
        div.style.width = `${Math.floor(size / 250)}px`;
        size = size % 250;
      } else {
        div.style.height = `${size}px`;
        div.style.width = "1px";
        size = size / 250;
      }
      div.className = str === "self" ? "selfDiv" : "compareDiv";
      resultDiv.appendChild(div);
    }
  }
  return resultDiv;
}

const update = (size) => {
  removeCharts();
  // Div Element
  const blockChart = document.createElement("div");
  blockChart.className = "blockChart";
  const header = document.createElement("div");
  header.className = "blockHeader";
  const header1 = document.createElement("div");
  header1.innerText = "Below, you will see two sections:"
  const header2 = document.createElement("div");
  header2.innerText = 
    `In blue, is a pixel representation of your current savings. If your savings is small, you may need to look closer, or try increasing your savings. 
    In orange, is a pixel representation of your selected benchmark.`;
  header.appendChild(header1);
  header.appendChild(header2);
  blockChart.appendChild(header);

  // const selfHeader = document.createElement("div");
  // selfHeader.className = "selfHeader";
  let baseSavings = document.getElementsByClassName("user-savings")[0].value.replace(/[,.]/g, "") / 100;
  const selfDiv = generateDiv(baseSavings, "self");
  selfDiv.className = "selfDivs";

  // const compareHeader = document.createElement("div");
  // compareHeader.className = "compareHeader";
  // compareHeader.innerText = "Compare Header";
  let compare = netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex].val;
  const compareDiv = generateDiv(compare, "compare");
  compareDiv.className = "compareDivs";

  document.getElementsByClassName("blocks")[0].appendChild(blockChart);
  // blockChart.appendChild(selfHeader);
  blockChart.appendChild(selfDiv);
  // blockChart.appendChild(compareHeader);
  blockChart.appendChild(compareDiv);

  // Block Chart
  // const svg = d3.select(".blocks").append("svg").attr("class", "blockChart");

  // let block = svg
  //   .append("g")
  //   .attr("class", "cells")
  //   .attr("transform", "translate(" + offset + "," + offset + ")")
  //   .selectAll("rect");

  // block = block.data(d3.range(size));

  // block
  //   .enter()
  //   .append("rect")
  //   .attr("width", 0)
  //   .attr("height", cellSize)
  //   .attr("x", (i) => {
  //     const x0 = Math.floor(i / 1000);
  //     const x1 = Math.floor((i % 100) / 10);
  //     const xblock = groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 10);
  //     return xblock;
  //   })
  //   .attr("y", (i) => {
  //     const y0 = Math.floor(i / 100) % 10;
  //     const y1 = Math.floor(i % 10);
  //     const yblock = groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10);
  //     return yblock;
  //   })
  //   .transition()
  //   .delay(function (d, i) {
  //     return i * updateDelay;
  //   })
  //   .duration(updateDuration)
  //   .attr("width", cellSize);
};

const drawChart = (e) => {
  errors.innerText = "";
  removeCharts();
  const baseSavings = document.getElementsByClassName("user-savings")[0].value.replace(/[,.]/g, "") / 100 ;
  const baseContributions = document.getElementsByClassName("user-contributions")[0].value.replace(/[,.]/g, "") / 100;
  const growth = document.getElementsByClassName("user-growth")[0].value.replace(/[,.]/g, "") / 100;
  const compare = netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex].val;
  
  
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
  } else if (!compare) {
    errors.innerText = "Please select a benchmark.";
    selection.style.border = "1px solid red";
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

  // focus
  //   .append("line")
  //   .attr("class", "benchXLine")
  //   .style("stroke", "#92DCE5")
  //   .style("stroke-width", "1.5")
  //   .style("stroke-dasharray", "5")
  //   .style("opacity", 0.5)
  //   .attr("y1", 0)
  //   .attr("y2", lineHeight);

  // focus
  //   .append("line")
  //   .attr("class", "benchYLine")
  //   .style("stroke", "#92DCE5")
  //   .style("stroke-width", "1.5")
  //   .style("stroke-dasharray", "5")
  //   .style("opacity", 0.5)
  //   .attr("x1", lineWidth)
  //   .attr("x2", lineWidth);

  // focus
  //   .select(".benchXLine")
  //   .attr("transform", "translate(100,200)")
  //   .attr("y2", lineHeight + margin.top - 200)

  // focus
  //   .select(".benchYLine")
  //   .attr("transform", "translate(" + widthAdjust + ", " + yAdjust + ")")
  //   .attr("x2", lineWidth + x(d.year));

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
  for (let i = 0; i < yrs + 5; i++) {
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