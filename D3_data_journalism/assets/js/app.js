// set svg parameters
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100,
};

var width = svgWidth - margin.left -margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter").append("svg").attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function (riskData) {
    // Step 1: Parse Data/Cast as numbers
    riskData.forEach(function (data) {
        data.age = +data.age;
        data.smokes = +data.smokes;
    });

    // console.log(riskData);

    // Step 2: Create scale functions

    var xLinearScale = d3.scaleLinear()
        .domain([28, d3.max(riskData, (d) => d.age * 1.05)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([8, d3.max(riskData, (d) => d.smokes * 1.05)])
        .range([height, 0]);

    // Step 3: Create axis functions

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g").call(leftAxis);

    // Step 5: Create Circles
    // creating parent group with the element 'g'
    var circlesGroup = chartGroup.selectAll("circle")
        .data(riskData)
        .enter()
        .append("g");

    // then appending the circles to the 'g' data
    circlesGroup.append("circle")
        .attr("cx", (d) => xLinearScale(d.age))
        .attr("cy", (d) => yLinearScale(d.smokes))
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("opacity", ".5");

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
            var state = "<p>" + d.state + "</p>";
            var age = "<p>" + d.age + " years old </p>";
            var smokes = "<p>" + d.smokes + " % </p>";

            return state + age + smokes;
        });

    // Step 7: Create tooltip in the chart
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })
    // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    chartGroup.append("test")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height -100))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Percentage of People Who Smoke");

    chartGroup
        .append("text")
        .attr("transform", `translate(${width / 3}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Person's Median Age");

    // Step 9: add text to circles
    circlesGroup.append("text")
        .text(function (d) {
            console.log(d);
            return d.abbr;
        })
        .style("text-anchor", "middle")
        .attr("dx", (d) => xLinearScale(d.age))
        .attr("dy", (d) => yLinearScale(d.smokes))
        .attr('y', 6)
}).catch(function (error) {
    console.log(error);
});
