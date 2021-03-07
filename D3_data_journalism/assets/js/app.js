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
})
