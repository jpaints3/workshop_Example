// Load the iris dataset
d3.csv("iris.csv").then((data) => {
  // SECTION 1: MINIMUM AND MAXIMUM
  // S1 Part 1: Finding minimum & maximum
  let petalWidths = data.map((d) => d["PetalWidthCm"]);
  let minPetalWidth = d3.min(petalWidths);
  let maxPetalWidth = d3.max(petalWidths);
  console.log("Minimum petal width: " + minPetalWidth);
  console.log("Maximum petal width: " + maxPetalWidth);

  // S1 Part 2: Graph the points
  var width = 600;
  var height = 400;

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "15px")
    .style("font-weight", "bold")
    .text("Iris Petal Length vs. Width");

  var xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.PetalWidthCm)])
    .range([0, width]);
  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.PetalLengthCm)])
    .range([height, 0]);

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.PetalWidthCm))
    .attr("cy", (d) => yScale(d.PetalLengthCm))
    .attr("r", 5)
    .style("fill", "steelblue");

  // SECTION 2: Regression
  // S2 Part 1: Generate the regression
  // https://observablehq.com/@harrystevens/introducing-d3-regression
  var regression = d3
    .regressionPoly()
    .x((d) => d.PetalWidthCm)
    .y((d) => d.PetalLengthCm);
  let regressionLine = regression(data);

  // S2 Part 2: Add the regression line to the chart
  var line = d3
    .line()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]));
  svg
    .append("path")
    .datum(regressionLine)
    .attr("class", "regression-line")
    .attr("d", line)
    .style("stroke", "red")
    .style("stroke-width", 2)
    .style("fill", "none");

  // Linear Regression Slope & Y-int
  // console.log(`Point 1: (${regressionLine[0]})`);
  // console.log(`Point 2: (${regressionLine[1]})`);
  // let slope = (regressionLine[1][1] - regressionLine[1][0]) / (regressionLine[0][1] - regressionLine[0][0]);
  // console.log(`Slope: ${slope}`);
  // console.log(`Y-int: ${regressionLine[0][1] - slope * regressionLine[0][0]}`);

  // Polynomial Regression Coefficients
  console.log(`All Coefficients: ${regressionLine.coefficients}`);
  console.log(
    `Intercept of the regression line: ${regressionLine.coefficients[0]}`
  );
  console.log(`Co-efficient of x: ${regressionLine.coefficients[1]}`);
  console.log(`Co-efficient of x^2: ${regressionLine.coefficients[2]}`);
  console.log(`Co-efficient of x^3: ${regressionLine.coefficients[3]}`);

  // SECTION 3: Derivative
  // S3 Part 1: Find the derivative of the regression line
  regressionFunction = `${regressionLine.coefficients[0]} + ${regressionLine.coefficients[1]}x + ${regressionLine.coefficients[2]}x^2 + ${regressionLine.coefficients[3]}x^3`;
  let regressionFirstDerivative = math.derivative(regressionFunction, "x");
  console.log(
    `Regression First Derivative: ${regressionFirstDerivative.toString()}`
  );
  let regressionSecondDerivative = math.derivative(
    regressionFirstDerivative,
    "x"
  );
  console.log(
    `Regression Second Derivative: ${regressionSecondDerivative.toString()}`
  );
  let criticalPoint = math.polynomialRoot(
    3.5541187717453697,
    -3.5690818411437486
  );

  console.log(`Regression Second Derivative Critical Point: ${criticalPoint}`);

  regressionDerivativeLocalMaximumY = math.evaluate(
    regressionFirstDerivative.toString(),
    {
      x: 0.9958075857981492,
    }
  );
  console.log(
    `Regression Derivative Local-Maximum: (${criticalPoint}, ${regressionDerivativeLocalMaximumY})`
  );

  // S3 Part 2: Highlight the local minimum and maximum
  svg
    .append("circle")
    .attr("cx", xScale(criticalPoint))
    .attr("cy", yScale(regressionDerivativeLocalMaximumY))
    .attr("r", 5)
    .style("fill", "green");

  // S3 Part 3: Draw the derivative
  var derivativeLine = d3
    .line()
    .x((d) => xScale(d))
    .y((d) => yScale(regressionFirstDerivative.evaluate({ x: d })));

  var randomXValues = [];

  for (var i = -10; i <= 20; i += 0.1) {
    randomXValues.push(i);
  }

  svg
    .append("path")
    .datum(randomXValues)
    .attr("class", "derivative-line")
    .attr("d", derivativeLine)
    .style("stroke", "green")
    .style("stroke-width", 2)
    .style("fill", "none");

  // SECTION 4: Integral
  // S4 Part 1: Find the integral of the regression line
  console.log(math.integral);
  let regressionFunctionIntegral = math.integral(regressionFunction, "x");
  console.log(`Regression Integral: ${regressionFunctionIntegral}`);
});
