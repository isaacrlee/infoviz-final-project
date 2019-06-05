const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');
var test;

// class LoanPaymentsGraph extends D3Component {

//     initialize(node, props) {
//         var data = props.data;

//         var effectiveInterestRate = data.interestRate / (12 * 100);
//         var numPayments = data.loanTerm * 12;

//         var minPayment = data.expectedDebt * (effectiveInterestRate / (1 - Math.pow(1 + effectiveInterestRate, (- numPayments))));

//         var total = minPayment * numPayments;

//         console.log(total);

//         var totalInterest = total - data.expectedDebt;

//         var temp = total;
//         var month = 0;
//         var paymentData = [];
//         while (temp > 0) {
//             paymentData.push({ "month": month, "variableA": temp });
//             month += 1;
//             temp -= minPayment;
//         }

//         //var paymentData = [{ "month": 0, "variableA": total }, { "month": numPayments, "variableA": 0 }]

//         const svg = this.svg = d3.select(node).append('div').attr("class", "chart-wrapper").attr("id", "chart-line2");
//         var chart = makeLineChart(paymentData, 'month', {
//             'A': { column: 'variableA' },
//             // 'B': { column: 'variableB' },
//         }, { xAxis: 'Months', yAxis: 'Remaining Payment' });
//         chart.bind("#chart-line2");
//         chart.render();

//         function makeLineChart(dataset, xName, yObjs, axisLables) {
//             var chartObj = {};
//             console.log(dataset);
//             var color = d3.scaleOrdinal(d3.schemeCategory10);
//             chartObj.xAxisLable = axisLables.xAxis;
//             chartObj.yAxisLable = axisLables.yAxis;
//             /*
//              yObjsects format:
//              {y1:{column:'',name:'name',color:'color'},y2}
//              */

//             chartObj.data = dataset;
//             chartObj.margin = { top: 15, right: 60, bottom: 30, left: 50 };
//             chartObj.width = 650 - chartObj.margin.left - chartObj.margin.right;
//             chartObj.height = 480 - chartObj.margin.top - chartObj.margin.bottom;

//             // So we can pass the x and y as strings when creating the function
//             chartObj.xFunct = function (d) { return d[xName] };

//             // For each yObjs argument, create a yFunction
//             function getYFn(column) {
//                 return function (d) {
//                     return d[column];
//                 };
//             }

//             // Object instead of array
//             chartObj.yFuncts = [];
//             for (var y in yObjs) {
//                 yObjs[y].name = y;
//                 yObjs[y].yFunct = getYFn(yObjs[y].column); //Need this  list for the ymax function
//                 chartObj.yFuncts.push(yObjs[y].yFunct);
//             }

//             //Formatter functions for the axes
//             chartObj.formatAsNumber = d3.format(".0f");
//             chartObj.formatAsDecimal = d3.format(".2f");
//             chartObj.formatAsCurrency = d3.format("$.2f");
//             chartObj.formatAsFloat = function (d) {
//                 if (d % 1 !== 0) {
//                     return d3.format(".2f")(d);
//                 } else {
//                     return d3.format(".0f")(d);
//                 }

//             };

//             chartObj.xFormatter = chartObj.formatAsNumber;
//             chartObj.yFormatter = chartObj.formatAsFloat;

//             chartObj.bisectYear = d3.bisector(chartObj.xFunct).left; //< Can be overridden in definition

//             //Create scale functions
//             chartObj.xScale = d3.scaleLinear().range([0, chartObj.width]).domain([0, numPayments]); //< Can be overridden in definition

//             // Get the max of every yFunct
//             chartObj.max = function (fn) {
//                 return d3.max(chartObj.data, fn);
//             };
//             chartObj.yScale = d3.scaleLinear().range([chartObj.height, 0]).domain([0, total]);

//             chartObj.formatAsYear = d3.format("");

//             //Create axis
//             chartObj.xAxis = d3.axisBottom().scale(chartObj.xScale).tickFormat(chartObj.xFormatter); //< Can be overridden in definition

//             chartObj.yAxis = d3.axisLeft().scale(chartObj.yScale).tickFormat(chartObj.yFormatter); //< Can be overridden in definition


//             // Build line building functions
//             function getYScaleFn(yObj) {
//                 return function (d) {
//                     return chartObj.yScale(yObjs[yObj].yFunct(d));
//                 };
//             }
//             for (var yObj in yObjs) {
//                 yObjs[yObj].line = d3.line().x(function (d) {
//                     return chartObj.xScale(chartObj.xFunct(d));
//                 }).y(getYScaleFn(yObj)).curve(d3.curveBasis);
//             }


//             chartObj.svg;

//             // Change chart size according to window size
//             chartObj.update_svg_size = function () {
//                 chartObj.width = parseInt(chartObj.chartDiv.style("width"), 10) - (chartObj.margin.left + chartObj.margin.right);

//                 chartObj.height = parseInt(chartObj.chartDiv.style("height"), 10) - (chartObj.margin.top + chartObj.margin.bottom);

//                 /* Update the range of the scale with new width/height */
//                 chartObj.xScale.range([0, chartObj.width]);
//                 chartObj.yScale.range([chartObj.height, 0]);

//                 if (!chartObj.svg) { return false; }

//                 /* Else Update the axis with the new scale */
//                 chartObj.svg.select('.x.axis').attr("transform", "translate(0," + chartObj.height + ")").call(chartObj.xAxis);
//                 chartObj.svg.select('.x.axis .label').attr("x", chartObj.width / 2);

//                 chartObj.svg.select('.y.axis').call(chartObj.yAxis);
//                 chartObj.svg.select('.y.axis .label').attr("x", -chartObj.height / 2);

//                 /* Force D3 to recalculate and update the line */
//                 for (var y in yObjs) {
//                     yObjs[y].path.attr("d", yObjs[y].line);
//                 }


//                 d3.selectAll(".focus.line").attr("y2", chartObj.height);

//                 chartObj.chartDiv.select('svg').attr("width", chartObj.width + (chartObj.margin.left + chartObj.margin.right)).attr("height", chartObj.height + (chartObj.margin.top + chartObj.margin.bottom));

//                 chartObj.svg.select(".overlay").attr("width", chartObj.width).attr("height", chartObj.height);
//                 return chartObj;
//             };

//             chartObj.bind = function (selector) {
//                 chartObj.mainDiv = d3.select(selector);
//                 // Add all the divs to make it centered and responsive
//                 chartObj.mainDiv.append("div").attr("class", "inner-wrapper").append("div").attr("class", "outer-box").append("div").attr("class", "inner-box");
//                 var chartSelector = selector + " .inner-box";
//                 chartObj.chartDiv = d3.select(chartSelector);
//                 d3.select(window).on('resize.' + chartSelector, chartObj.update_svg_size);
//                 chartObj.update_svg_size();
//                 return chartObj;
//             };

//             // Render the chart
//             chartObj.render = function () {
//                 //Create SVG element
//                 chartObj.svg = chartObj.chartDiv.append("svg").attr("class", "chart-area").attr("width", chartObj.width + (chartObj.margin.left + chartObj.margin.right)).attr("height", chartObj.height + (chartObj.margin.top + chartObj.margin.bottom)).append("g").attr("transform", "translate(" + chartObj.margin.left + "," + chartObj.margin.top + ")");

//                 // Draw Lines
//                 for (var y in yObjs) {
//                     console.log(yObjs[y]);
//                     yObjs[y].path = chartObj.svg.append("path").datum(chartObj.data).attr("class", "line").attr("d", yObjs[y].line).style("stroke", color(y)).attr("data-series", y).on("mouseover", function () {
//                         focus.style("display", null);
//                     }).on("mouseout", function () {
//                         focus.transition().delay(700).style("display", "none");
//                     }).on("mousemove", mousemove);
//                 }


//                 // Draw Axis
//                 chartObj.svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + chartObj.height + ")").call(chartObj.xAxis).append("text").attr("class", "label").attr("x", chartObj.width / 2).attr("y", 30).style("text-anchor", "middle").text(chartObj.xAxisLable).attr("fill", "black");

//                 chartObj.svg.append("g").attr("class", "y axis").call(chartObj.yAxis).append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", -50).attr("x", -chartObj.height / 2).attr("dy", ".71em").style("text-anchor", "middle").text(chartObj.yAxisLable).attr("fill", "black");

//                 //Draw tooltips
//                 var focus = chartObj.svg.append("g").attr("class", "focus").style("display", "none");

//                 for (var y in yObjs) {
//                     yObjs[y].tooltip = focus.append("g");
//                     yObjs[y].tooltip.append("circle").attr("r", 5);
//                     yObjs[y].tooltip.append("rect").attr("x", 8).attr("y", "-5").attr("width", 22).attr("height", '0.75em');
//                     yObjs[y].tooltip.append("text").attr("x", 9).attr("dy", ".35em");
//                 }

//                 // Year label
//                 focus.append("text").attr("class", "focus year").attr("x", 9).attr("y", 7);
//                 // Focus line
//                 focus.append("line").attr("class", "focus line").attr("y1", 0).attr("y2", chartObj.height);

//                 //Draw legend
//                 var series;
//                 var legend = chartObj.mainDiv.append('div').attr("class", "legend");
//                 for (var y in yObjs) {
//                     series = legend.append('div');
//                     series.append('div').attr("class", "series-marker").style("background-color", color(y));
//                     series.append('p').text(y);
//                     yObjs[y].legend = series;
//                 }

//                 // Overlay to capture hover
//                 chartObj.svg.append("rect").attr("class", "overlay").attr("width", chartObj.width).attr("height", chartObj.height).on("mouseover", function () {
//                     focus.style("display", null);
//                 }).on("mouseout", function () {
//                     focus.style("display", "none");
//                 }).on("mousemove", mousemove);

//                 return chartObj;
//                 function mousemove() {
//                     var x0 = chartObj.xScale.invert(d3.mouse(this)[0]), i = chartObj.bisectYear(dataset, x0, 1), d0 = chartObj.data[i - 1], d1 = chartObj.data[i];
//                     try {
//                         var d = x0 - chartObj.xFunct(d0) > chartObj.xFunct(d1) - x0 ? d1 : d0;
//                     } catch (e) { return; }
//                     var minY = chartObj.height;
//                     for (var y in yObjs) {
//                         yObjs[y].tooltip.attr("transform", "translate(" + chartObj.xScale(chartObj.xFunct(d)) + "," + chartObj.yScale(yObjs[y].yFunct(d)) + ")");
//                         yObjs[y].tooltip.select("text").text(chartObj.yFormatter(yObjs[y].yFunct(d)));
//                         minY = Math.min(minY, chartObj.yScale(yObjs[y].yFunct(d)));
//                     }

//                     focus.select(".focus.line").attr("transform", "translate(" + chartObj.xScale(chartObj.xFunct(d)) + ")").attr("y1", minY);
//                     focus.select(".focus.year").text("Month: " + chartObj.xFormatter(chartObj.xFunct(d)));
//                 }

//             };
//             test = chartObj;
//             return chartObj;
//         }
//     }





//     update(props, oldProps) {
//         var data = props.data;
//         var monthlyPayment = data.income * data.monthlyPaymentPercent / 100;
//         console.log(monthlyPayment);

//         var effectiveInterestRate = data.interestRate / (12 * 100);
//         var numPayments = data.loanTerm * 12;

//         var minPayment = data.expectedDebt * (effectiveInterestRate / (1 - Math.pow(1 + effectiveInterestRate, (- numPayments))));

//         var total = minPayment * numPayments;

//         console.log(total);

//         var totalInterest = total - data.expectedDebt;

//         var temp = total;
//         var month = 0;
//         var paymentData = [];
//         while (temp > 0) {
//             paymentData.push({ "month": month, "variableA": temp });
//             month += 1;
//             temp -= monthlyPayment;
//         }
//         console.log(paymentData);
//         // var chart = makeLineChart(paymentData, 'month', {
//         //     'A': { column: 'variableA' },
//         //     // 'B': { column: 'variableB' },
//         // }, { xAxis: 'Months', yAxis: 'Remaining Payment' });
//         // chart.bind("#chart-line2");
//         // chart.render();
//         test.data = paymentData;
//         // console.log(test);
//         d3.select("div#chart-line2").remove();
//         // d3.select(".chart-wrapper").remove();
//         // this.svg.append('div').attr("class", "chart-wrapper").attr("id", "chart-line2");
//         const svg = this.svg.append('div').attr("class", "chart-wrapper").attr("id", "chart-line2");
//         var chart = makeLineChart(paymentData, 'month', {
//             'A': { column: 'variableA' },
//             // 'B': { column: 'variableB' },
//         }, { xAxis: 'Months', yAxis: 'Remaining Payment' });
//         chart.bind("#chart-line2");
//         chart.render();

//         function makeLineChart(dataset, xName, yObjs, axisLables) {
//             var chartObj = {};
//             console.log(dataset);
//             var color = d3.scaleOrdinal(d3.schemeCategory10);
//             chartObj.xAxisLable = axisLables.xAxis;
//             chartObj.yAxisLable = axisLables.yAxis;
//             /*
//              yObjsects format:
//              {y1:{column:'',name:'name',color:'color'},y2}
//              */

//             chartObj.data = dataset;
//             chartObj.margin = { top: 15, right: 60, bottom: 30, left: 50 };
//             chartObj.width = 650 - chartObj.margin.left - chartObj.margin.right;
//             chartObj.height = 480 - chartObj.margin.top - chartObj.margin.bottom;

//             // So we can pass the x and y as strings when creating the function
//             chartObj.xFunct = function (d) { return d[xName] };

//             // For each yObjs argument, create a yFunction
//             function getYFn(column) {
//                 return function (d) {
//                     return d[column];
//                 };
//             }

//             // Object instead of array
//             chartObj.yFuncts = [];
//             for (var y in yObjs) {
//                 yObjs[y].name = y;
//                 yObjs[y].yFunct = getYFn(yObjs[y].column); //Need this  list for the ymax function
//                 chartObj.yFuncts.push(yObjs[y].yFunct);
//             }

//             //Formatter functions for the axes
//             chartObj.formatAsNumber = d3.format(".0f");
//             chartObj.formatAsDecimal = d3.format(".2f");
//             chartObj.formatAsCurrency = d3.format("$.2f");
//             chartObj.formatAsFloat = function (d) {
//                 if (d % 1 !== 0) {
//                     return d3.format(".2f")(d);
//                 } else {
//                     return d3.format(".0f")(d);
//                 }

//             };

//             chartObj.xFormatter = chartObj.formatAsNumber;
//             chartObj.yFormatter = chartObj.formatAsFloat;

//             chartObj.bisectYear = d3.bisector(chartObj.xFunct).left; //< Can be overridden in definition

//             //Create scale functions
//             chartObj.xScale = d3.scaleLinear().range([0, chartObj.width]).domain([0, numPayments]); //< Can be overridden in definition

//             // Get the max of every yFunct
//             chartObj.max = function (fn) {
//                 return d3.max(chartObj.data, fn);
//             };
//             chartObj.yScale = d3.scaleLinear().range([chartObj.height, 0]).domain([0, total]);

//             chartObj.formatAsYear = d3.format("");

//             //Create axis
//             chartObj.xAxis = d3.axisBottom().scale(chartObj.xScale).tickFormat(chartObj.xFormatter); //< Can be overridden in definition

//             chartObj.yAxis = d3.axisLeft().scale(chartObj.yScale).tickFormat(chartObj.yFormatter); //< Can be overridden in definition


//             // Build line building functions
//             function getYScaleFn(yObj) {
//                 return function (d) {
//                     return chartObj.yScale(yObjs[yObj].yFunct(d));
//                 };
//             }
//             for (var yObj in yObjs) {
//                 yObjs[yObj].line = d3.line().x(function (d) {
//                     return chartObj.xScale(chartObj.xFunct(d));
//                 }).y(getYScaleFn(yObj)).curve(d3.curveBasis);
//             }


//             chartObj.svg;

//             // Change chart size according to window size
//             chartObj.update_svg_size = function () {
//                 chartObj.width = parseInt(chartObj.chartDiv.style("width"), 10) - (chartObj.margin.left + chartObj.margin.right);

//                 chartObj.height = parseInt(chartObj.chartDiv.style("height"), 10) - (chartObj.margin.top + chartObj.margin.bottom);

//                 /* Update the range of the scale with new width/height */
//                 chartObj.xScale.range([0, chartObj.width]);
//                 chartObj.yScale.range([chartObj.height, 0]);

//                 if (!chartObj.svg) { return false; }

//                 /* Else Update the axis with the new scale */
//                 chartObj.svg.select('.x.axis').attr("transform", "translate(0," + chartObj.height + ")").call(chartObj.xAxis);
//                 chartObj.svg.select('.x.axis .label').attr("x", chartObj.width / 2);

//                 chartObj.svg.select('.y.axis').call(chartObj.yAxis);
//                 chartObj.svg.select('.y.axis .label').attr("x", -chartObj.height / 2);

//                 /* Force D3 to recalculate and update the line */
//                 for (var y in yObjs) {
//                     yObjs[y].path.attr("d", yObjs[y].line);
//                 }


//                 d3.selectAll(".focus.line").attr("y2", chartObj.height);

//                 chartObj.chartDiv.select('svg').attr("width", chartObj.width + (chartObj.margin.left + chartObj.margin.right)).attr("height", chartObj.height + (chartObj.margin.top + chartObj.margin.bottom));

//                 chartObj.svg.select(".overlay").attr("width", chartObj.width).attr("height", chartObj.height);
//                 return chartObj;
//             };

//             chartObj.bind = function (selector) {
//                 chartObj.mainDiv = d3.select(selector);
//                 // Add all the divs to make it centered and responsive
//                 chartObj.mainDiv.append("div").attr("class", "inner-wrapper").append("div").attr("class", "outer-box").append("div").attr("class", "inner-box");
//                 var chartSelector = selector + " .inner-box";
//                 chartObj.chartDiv = d3.select(chartSelector);
//                 d3.select(window).on('resize.' + chartSelector, chartObj.update_svg_size);
//                 chartObj.update_svg_size();
//                 return chartObj;
//             };

//             // Render the chart
//             chartObj.render = function () {
//                 //Create SVG element
//                 chartObj.svg = chartObj.chartDiv.append("svg").attr("class", "chart-area").attr("width", chartObj.width + (chartObj.margin.left + chartObj.margin.right)).attr("height", chartObj.height + (chartObj.margin.top + chartObj.margin.bottom)).append("g").attr("transform", "translate(" + chartObj.margin.left + "," + chartObj.margin.top + ")");

//                 // Draw Lines
//                 for (var y in yObjs) {
//                     console.log(yObjs[y]);
//                     yObjs[y].path = chartObj.svg.append("path").datum(chartObj.data).attr("class", "line").attr("d", yObjs[y].line).style("stroke", color(y)).attr("data-series", y).on("mouseover", function () {
//                         focus.style("display", null);
//                     }).on("mouseout", function () {
//                         focus.transition().delay(700).style("display", "none");
//                     }).on("mousemove", mousemove);
//                 }


//                 // Draw Axis
//                 chartObj.svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + chartObj.height + ")").call(chartObj.xAxis).append("text").attr("class", "label").attr("x", chartObj.width / 2).attr("y", 30).style("text-anchor", "middle").text(chartObj.xAxisLable).attr("fill", "black");

//                 chartObj.svg.append("g").attr("class", "y axis").call(chartObj.yAxis).append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", -50).attr("x", -chartObj.height / 2).attr("dy", ".71em").style("text-anchor", "middle").text(chartObj.yAxisLable).attr("fill", "black");

//                 //Draw tooltips
//                 var focus = chartObj.svg.append("g").attr("class", "focus").style("display", "none");

//                 for (var y in yObjs) {
//                     yObjs[y].tooltip = focus.append("g");
//                     yObjs[y].tooltip.append("circle").attr("r", 5);
//                     yObjs[y].tooltip.append("rect").attr("x", 8).attr("y", "-5").attr("width", 22).attr("height", '0.75em');
//                     yObjs[y].tooltip.append("text").attr("x", 9).attr("dy", ".35em");
//                 }

//                 // Year label
//                 focus.append("text").attr("class", "focus year").attr("x", 9).attr("y", 7);
//                 // Focus line
//                 focus.append("line").attr("class", "focus line").attr("y1", 0).attr("y2", chartObj.height);

//                 //Draw legend
//                 var series;
//                 var legend = chartObj.mainDiv.append('div').attr("class", "legend");
//                 for (var y in yObjs) {
//                     series = legend.append('div');
//                     series.append('div').attr("class", "series-marker").style("background-color", color(y));
//                     series.append('p').text(y);
//                     yObjs[y].legend = series;
//                 }

//                 // Overlay to capture hover
//                 chartObj.svg.append("rect").attr("class", "overlay").attr("width", chartObj.width).attr("height", chartObj.height).on("mouseover", function () {
//                     focus.style("display", null);
//                 }).on("mouseout", function () {
//                     focus.style("display", "none");
//                 }).on("mousemove", mousemove);

//                 return chartObj;
//                 function mousemove() {
//                     var x0 = chartObj.xScale.invert(d3.mouse(this)[0]), i = chartObj.bisectYear(dataset, x0, 1), d0 = chartObj.data[i - 1], d1 = chartObj.data[i];
//                     try {
//                         var d = x0 - chartObj.xFunct(d0) > chartObj.xFunct(d1) - x0 ? d1 : d0;
//                     } catch (e) { return; }
//                     var minY = chartObj.height;
//                     for (var y in yObjs) {
//                         yObjs[y].tooltip.attr("transform", "translate(" + chartObj.xScale(chartObj.xFunct(d)) + "," + chartObj.yScale(yObjs[y].yFunct(d)) + ")");
//                         yObjs[y].tooltip.select("text").text(chartObj.yFormatter(yObjs[y].yFunct(d)));
//                         minY = Math.min(minY, chartObj.yScale(yObjs[y].yFunct(d)));
//                     }

//                     focus.select(".focus.line").attr("transform", "translate(" + chartObj.xScale(chartObj.xFunct(d)) + ")").attr("y1", minY);
//                     focus.select(".focus.year").text("Month: " + chartObj.xFormatter(chartObj.xFunct(d)));
//                 }

//             };
//             test = chartObj;
//             return chartObj;
//         }



//     }

// }


class LoanPaymentsGraph extends D3Component {

    initialize(node, props) {
        var data = props.data;

        // var effectiveInterestRate = data.interestRate / (12 * 100);
        // var numPayments = data.loanTerm * 12;

        // var minPayment = data.expectedDebt * (effectiveInterestRate / (1 - Math.pow(1 + effectiveInterestRate, (- numPayments))));

        // var total = minPayment * numPayments;

        // console.log(total);

        // var totalInterest = total - data.expectedDebt;

        var temp = 5000;
        var month = 0;
        var paymentData = [];
        var minPayment = 50;

        while (temp > 0) {
            paymentData.push({ "month": month, "variableA": temp });
            month += 1;
            temp -= minPayment;
        }

        var data1 = paymentData;

        var data2 = [
            { month: 1, variableA: 7 },
            { month: 4, variableA: 1 },
            { month: 6, variableA: 8 }
        ];

        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 30, bottom: 30, left: 50 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = this.svg = d3.select(node)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Initialise a X axis:
        var x = d3.scaleLinear().range([0, width]);
        var xAxis = d3.axisBottom().scale(x);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "myXaxis")

        // Initialize an Y axis
        var y = d3.scaleLinear().range([height, 0]);
        var yAxis = d3.axisLeft().scale(y);
        svg.append("g")
            .attr("class", "myYaxis")
        // Create a function that takes a dataset as input and update the plot:
        function update(data) {

            // Create the X axis:
            x.domain([0, d3.max(data, function (d) { return d.month })]);
            svg.selectAll(".myXaxis").transition()
                .duration(3000)
                .call(xAxis);

            // create the Y axis
            y.domain([0, d3.max(data, function (d) { return d.variableA })]);
            svg.selectAll(".myYaxis")
                .transition()
                .duration(3000)
                .call(yAxis);

            // Create a update selection: bind to the new data
            var u = svg.selectAll(".lineTest")
                .data([data], function (d) { return d.month });

            // Updata the line
            u
                .enter()
                .append("path")
                .attr("class", "lineTest")
                .merge(u)
                .transition()
                .duration(3000)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.month); })
                    .y(function (d) { return y(d.variableA); }))
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2.5)
        }

        // At the beginning, I run the update function on the first dataset:
        update(data1)

    }
    update(props, oldProps) {
        var temp = 1000;
        var month = 0;
        var paymentData = [];
        var minPayment = 50;

        while (temp > 0) {
            paymentData.push({ "month": month, "variableA": temp });
            month += 1;
            temp -= minPayment;
        }

        var data1 = paymentData;

        function update(data) {

            // Create the X axis:
            x.domain([0, d3.max(data, function (d) { return d.month })]);
            svg.selectAll(".myXaxis").transition()
                .duration(3000)
                .call(xAxis);

            // create the Y axis
            y.domain([0, d3.max(data, function (d) { return d.variableA })]);
            svg.selectAll(".myYaxis")
                .transition()
                .duration(3000)
                .call(yAxis);

            // Create a update selection: bind to the new data
            var u = this.svg.selectAll(".lineTest")
                .data([data], function (d) { return d.month });

            // Updata the line
            u
                .enter()
                .append("path")
                .attr("class", "lineTest")
                .merge(u)
                .transition()
                .duration(3000)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.month); })
                    .y(function (d) { return y(d.variableA); }))
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2.5)
        }

        // At the beginning, I run the update function on the first dataset:
        update(data1)
    }
}

module.exports = LoanPaymentsGraph;
