const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');
var test;

var margin = { top: 10, right: 30, bottom: 30, left: 50 },
            width = 460 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;
class LoanPaymentsGraph extends D3Component {

    initialize(node, props) {
        var data = props.data;
        // var effectiveInterestRate = data.interestRate / (12 * 100);
        // var numPayments = data.loanTerm * 12;

        // var minPayment = data.expectedDebt * (effectiveInterestRate / (1 - Math.pow(1 + effectiveInterestRate, (- numPayments))));

        // var total = minPayment * numPayments;

        // console.log(total);

        // var totalInterest = total - data.expectedDebt;

        // Min Payments
        var remainingDebt = data.expectedDebt;
        var month = 0;
        var minPaymentData = [];
        var monthlyPayment = data.minPayment;
        var minTotalInterest = 0
        var interest;

        while (remainingDebt > 0) {
            minPaymentData.push({ "month": month, "remainingDebt": remainingDebt });
            month += 1;
            remainingDebt -= monthlyPayment;
            interest = remainingDebt * (data.interestRate / (12 * 100)) 
            remainingDebt += 1 + interest;
            minTotalInterest += interest;
        }
        minPaymentData.push({"month":month,"remainingDebt":0});

        // Not Min Payments
        var remainingDebt = data.expectedDebt;
        var month = 0;
        var paymentData = [];
        var monthlyPayment = data.minPayment + data.addlPayment;
        var totalInterest = 0;
        while (remainingDebt > 0) {
            paymentData.push({ "month": month, "remainingDebt": remainingDebt });
            month += 1;
            remainingDebt -= monthlyPayment;
            interest = remainingDebt * (data.interestRate / (12 * 100)) 
            remainingDebt += 1 + interest;
            totalInterest += interest;
        }
        
        paymentData.push({"month":month,"remainingDebt":0});



        var bothData=[minPaymentData,paymentData]

        // set the dimensions and margins of the graph
        

        // append the svg object to the body of the page
        var svg = this.svg = d3.select(node)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")").attr("class","lines");

        // Initialise a X axis:
        var x = d3.scaleLinear().range([0, width]);
        var xAxis = d3.axisBottom().scale(x);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "myXaxis")
            
        svg.append("text")
            .attr("class", "xlabel")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("# Payments");

        // Initialize an Y axis
        var y = d3.scaleLinear().range([height, 0]);
        var yAxis = d3.axisLeft().scale(y);
        svg.append("g")
            .attr("class", "myYaxis")

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Remaining Debt");

        
        // Create a function that takes a dataset as input and update the plot:
        function render(data) {
 
            console.log(data);
            var data1=data[0];
            var data2=data[1];
            console.log(data1)
            console.log(data2);
            var max1=Math.max.apply(Math, data1.map(function(o) { return o.month; }))
            console.log(max1)
            var max2=Math.max.apply(Math, data2.map(function(o) { return o.month; }))
            console.log(max2)
            if (max1>max2) {
                x.domain([0, d3.max(data1, function (d) { return d.month })]);
                svg.selectAll(".myXaxis").transition()
                    .duration(3000)
                    .call(xAxis);
            }
            else {
                x.domain([0, d3.max(data2, function (d) { return d.month })]);
                svg.selectAll(".myXaxis").transition()
                    .duration(3000)
                    .call(xAxis);

            }

            max1=Math.max.apply(Math, data1.map(function(o) { return o.remainingDebt; }))
            console.log(max1)
            max2=Math.max.apply(Math, data2.map(function(o) { return o.remainingDebt; }))
            console.log(max2)

            if (max1>max2) {
                y.domain([0, d3.max(data1, function (d) { return d.remainingDebt })]);
                svg.selectAll(".myYaxis")
                    .transition()
                    .duration(3000)
                    .call(yAxis);
            }
            else {
                y.domain([0, d3.max(data2, function (d) { return d.remainingDebt })]);
                svg.selectAll(".myYaxis")
                    .transition()
                    .duration(3000)
                    .call(yAxis);
            }


            // Create a update selection: bind to the new data
            var u = svg.selectAll(".lineTestA")
                .data([data1], function (d) { return d.month });

            // Updata the line
            u
                .enter()
                .append("path")
                .attr("class", "lineTestA")
                .merge(u).attr("opacity",0)
                .transition()
                .duration(1000).attr("opacity",1)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.month); })
                    .y(function (d) { return y(d.remainingDebt); }))
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2.5);
            
                
            var v = svg.selectAll(".lineTestB")
                .data([data2], function (d) { return d.month });
            v
                .enter()
                .append("path")
                .attr("class", "lineTestB")
                .merge(v)
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.month); })
                    .y(function (d) { return y(d.remainingDebt); }))
                .attr("fill", "none")
                .attr("stroke", "green")
                .attr("stroke-width", 2.5);
        }

        render(bothData);

        // var interest1=500;
        // var interest2=100;
        var maxInterest=Math.max(minTotalInterest,totalInterest);
        var x = d3.scaleLinear().range([0,300]).domain([0,maxInterest+10])
        var s=d3.select("body").append("svg")
            .attr("width", 800)
            .attr("height", 500).attr("class","rectangles")
            console.log(x(minTotalInterest));
            console.log(x(totalInterest));
    //creating initial circle objects
        var rect1 = s.append("rect")
            .attr("x", 500)
            .attr("y", 0)
            .attr("height", 50)
            .attr("width",x(minTotalInterest))
            .style("fill", "steelblue");
        var rect2=s.append("rect")
            .attr("x", 500)
            .attr("y", 75)
            .attr("height", 50)
            .attr("width",x(totalInterest))
            .style("fill", "green");
        
        s.append("text")
        .attr("x", 500)
        .attr("y", 30)
        .text("Total Interest: "+ Math.round(minTotalInterest))
        .style('fill','black');


        s.append("text")
        .attr("x", 500)
        .attr("y", 105)
        .text("Total Interest: "+ Math.round(totalInterest))
        .style('fill','black');

        // .attr("font-family", "sans-serif")
        // .attr("font-size", "20px").attr('fill','black');

    }


    update(props, oldProps) {
        var data = props.data;

        // render(this.svg, data);
        var svg=this.svg;

        var x = d3.scaleLinear().range([0, width]);
        var xAxis = d3.axisBottom().scale(x);
        // svg.append("g")
        //     .attr("transform", "translate(0," + height + ")")
        //     .attr("class", "myXaxis")

        // Initialize an Y axis
        var y = d3.scaleLinear().range([height, 0]);
        var yAxis = d3.axisLeft().scale(y);
        // svg.append("g")
        //     .attr("class", "myYaxis")

        var remainingDebt = data.expectedDebt;
        var month = 0;
        var minPaymentData = [];
        var monthlyPayment = data.minPayment;
        var interest;
        var minTotalInterest = 0;

        while (remainingDebt > 0) {
            minPaymentData.push({ "month": month, "remainingDebt": remainingDebt });
            month += 1;
            remainingDebt -= monthlyPayment;
            interest = remainingDebt * (data.interestRate / (12 * 100)) 
            remainingDebt += 1 + interest;
            minTotalInterest += interest;

        }
        minPaymentData.push({"month":month,"remainingDebt":0});

        // Not Min Payments
        var remainingDebt = data.expectedDebt;
        var month = 0;
        var paymentData = [];
        var monthlyPayment = data.minPayment + data.addlPayment;
        var totalInterest = 0;
        while (remainingDebt > 0) {
            paymentData.push({ "month": month, "remainingDebt": remainingDebt });
            month += 1;
            remainingDebt -= monthlyPayment;
            interest = remainingDebt * (data.interestRate / (12 * 100)) 
            remainingDebt += 1 + interest;
            totalInterest += interest;

        }
        paymentData.push({"month":month,"remainingDebt":0});
        var bothData=[minPaymentData,paymentData]


        
        function render(data) {

            console.log(data);
            var data1=data[0];
            var data2=data[1];
            console.log(data1)
            console.log(data2);
            var max1=Math.max.apply(Math, data1.map(function(o) { return o.month; }))
            console.log(max1)
            var max2=Math.max.apply(Math, data2.map(function(o) { return o.month; }))
            console.log(max2)
            if (max1>max2) {
                x.domain([0, d3.max(data1, function (d) { return d.month })]);
                svg.selectAll(".myXaxis").transition()
                    .duration(3000)
                    .call(xAxis);
            }
            else {
                x.domain([0, d3.max(data2, function (d) { return d.month })]);
                svg.selectAll(".myXaxis").transition()
                    .duration(3000)
                    .call(xAxis);

            }

            max1=Math.max.apply(Math, data1.map(function(o) { return o.remainingDebt; }))
            console.log(max1)
            max2=Math.max.apply(Math, data2.map(function(o) { return o.remainingDebt; }))
            console.log(max2)

            if (max1>max2) {
                y.domain([0, d3.max(data1, function (d) { return d.remainingDebt })]);
                svg.selectAll(".myYaxis")
                    .transition()
                    .duration(3000)
                    .call(yAxis);
            }
            else {
                y.domain([0, d3.max(data2, function (d) { return d.remainingDebt })]);
                svg.selectAll(".myYaxis")
                    .transition()
                    .duration(3000)
                    .call(yAxis);
            }


            // Create a update selection: bind to the new data
            var u = svg.selectAll(".lineTestA")
                .data([data1], function (d) { return d.month });

            // Updata the line
            u
                .enter()
                .append("path")
                .attr("class", "lineTestA")
                .merge(u)
                .transition()
                .duration(3000)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.month); })
                    .y(function (d) { return y(d.remainingDebt); }))
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2.5);
            var v = svg.selectAll(".lineTestB")
                .data([data2], function (d) { return d.month });
            v
                .enter()
                .append("path")
                .attr("class", "lineTestB")
                .merge(v).attr("opacity",0)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.month); })
                    .y(function (d) { return y(d.remainingDebt); }))
                .attr("fill", "none")
                .attr("stroke", "green")
                .attr("stroke-width", 2.5)
                .transition()
                .duration(1000).attr("opacity",1);
        }

        // At the beginning, I run the update function on the first dataset:
        render(bothData);

        d3.selectAll("rect").remove();

        var maxInterest=Math.max(minTotalInterest,totalInterest);
        var x = d3.scaleLinear().range([0,300]).domain([0,maxInterest+10]);
        
        console.log("minTotalInterest: " + x(minTotalInterest));
        console.log("totalInterest:" + x(totalInterest));
        var s = d3.selectAll(".rectangles");
        var rect1 = s.append("rect")
            .attr("x", 500)
            .attr("y", 0)
            .attr("height", 50)
            .attr("width",x(minTotalInterest))
            .style("fill", "steelblue");
        var rect2=s.append("rect")
            .attr("x", 500)
            .attr("y", 75)
            .attr("height", 50)
            .attr("width",x(totalInterest))
            .style("fill", "green");
        s.selectAll("text").remove();

        s.append("text")
            .attr("x", 500)
            .attr("y", 30)
            .text("Total Interest: "+ Math.round(minTotalInterest))
            .style('fill','black');
            
    
        s.append("text")
            .attr("x", 500)
            .attr("y", 105)
            .text("Total Interest: "+ Math.round(totalInterest))
            .style('fill','black');

    }
}

module.exports = LoanPaymentsGraph;
