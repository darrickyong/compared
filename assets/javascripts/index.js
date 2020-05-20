// const width = document.getElementsByClassName("user-worth")[0];

document
  .getElementById("user-form")
  .addEventListener("submit", e => {
    e.preventDefault();
    let baseWorth = document.getElementsByClassName("user-worth")[0].value;
    let baseSavings = document.getElementsByClassName("user-savings")[0].value;
    let comparison = netWorth[
      document.getElementsByClassName("user-selection")[0].selectedIndex
    ];
    debugger
  })

document
  .getElementsByClassName("slide-button")[0]
  .addEventListener("click", (e) => {
    document.getElementById("test").style.color = "red";
  });

document
  .getElementsByClassName("zoom-button")[0]
  .addEventListener("click", (e) => {
    document.getElementById("test").style.color = "blue";
  });


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
  .select(".main-right")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .style("background", "#F2F2F2");
  
svg.append("text")
  .attr("class", "this-is-you")
  .attr("x", 50)
  .attr("y", 90)
  .text("This is you.")

const compare = svg
  .append("text")
  .attr("class", "this-is-else")
  .attr("x", 500)
  .attr("y", 90)
  .text(
    `This is ${
      netWorth[
        document.getElementsByClassName("user-selection")[0].selectedIndex
      ].name
    }.`
  );

svg.append("rect")
  .attr("x", 100)
  .attr("y", 100)
  .attr("width", "10px")
  .attr("height", "10px")
  .style("fill", "pink")

const compareImg = svg
  .append("image")
  .attr("width", 200)
  .attr("height", 200)
  .attr("x", 500)
  .attr("y", 100)
  .attr("xlink:href",
    netWorth[document.getElementsByClassName("user-selection")[0].selectedIndex]
      .img
  );


  

document
  .getElementsByClassName("user-selection")[0]
  .addEventListener("change", (e) => {
    compareImg.attr("xlink:href", netWorth[e.target.selectedIndex].img);
    compare.text(`This is ${ netWorth[e.target.selectedIndex].name }.`);
  });


