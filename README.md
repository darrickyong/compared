View the [live site](https://https://darrickyong.github.io/compared/ "Compared").

# Compared
![](https://github.com/darrickyong/compared/blob/master/assets/images/meta.png)

Compared is a front-end app providing a data visualization of wealth disparity. It was built using JavaScript, D3.js, HTML5, and CSS3.

## Block Representation

![](https://github.com/darrickyong/compared/blob/master/assets/images/block.png)

Fill in your current savings, select a benchmark, and click "Visualize" to see a block comparison. Your current savings are represented by a single block.

Blocks are generated individually and transitioned in using the below method:

```
  block
    .enter()
    .append("rect")
    .attr("width", 0)
    .attr("height", cellSize)
    .attr("x", (i) => {
      const x0 = Math.floor(i / 1000);
      const x1 = Math.floor((i % 100) / 10);
      const xblock = groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 10);
      return xblock;
    })
    .attr("y", (i) => {
      const y0 = Math.floor(i / 100) % 10;
      const y1 = Math.floor(i % 10);
      const yblock = groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10);
      return yblock;
    })
    .transition()
    .delay(function (d, i) { return i * updateDelay })
    .duration(updateDuration)
    .attr("width", cellSize);
  ```


## Growth of Savings Over Time

![](https://github.com/darrickyong/compared/blob/master/assets/images/line.png)

Fill in one of the following combinations and click "Grow My Savings".

1. Current Savings + Amount to Save Annually
2. Current Savings/Amount to Save Annually + Annual Interest Rate
3. Current Savings + Amount to Save Annually + Annual Interest Rate

Once the line graph is drawn, an event listener is added to the graph to help pinpoint the closest point on the drawn line in order to highlight the year and value of your savings using the below method:

```
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
  ```