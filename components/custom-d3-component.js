const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;
var height = 400;
var width = 600;
var margin = { top: 20, right: 20, bottom: 30, left: 40 },
  width = 600 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;
var schools = { "OSU": "Ohio State University", "MSU": "Michigan State University", "IU": "Indiana University", "UMich": "University of Michigan", "UIUC": "University of Illinois Urbana Champaign", "UI": "University of Iowa", "NU": "Northwestern University", "PSU": "Pennsylvania State University", "RU": "Rutgers University", "UMinn": "University of Minnesota", "PU": "Purdue University", "UW": "University of Wisconsin", "UN": "University of Nebraska" }
var bt = 0;
class CustomD3Component extends D3Component {

  initialize(node, props) {
    const svg = this.svg = d3.select(node).append('svg');
    svg.attr('viewBox', `0 0 ${size} ${size}`)
      // .style('width', '100%')
      // .style('height', 'auto')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    var x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);
    var y = d3.scaleLinear()
      .range([height, 0]);

    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
    var ans = d3.select("body").append("div")
      .attr("class", "ans")
      .style("opacity", 0);
    var button = d3.select(node)
      .append("div")
      .attr("class", "btn btn-default")
      .text(function (d) { return 'Why does NU have lower student loan debt?'; })
      .on("click", function (d) {
        console.log("button pressed");

        if (bt == 0) {
          ans.transition()
            .duration(100)
            .style("opacity", .9);
          ans.html("Northwestern is the only private school in the Big 10 (so we have higher tuition), but the institution can afford to give out more merit aid.")
            .style("left", (450) + "px")
            .style("top", (d3.event.pageY - 120) + "px");
          bt = 1;
        }
        else {
          ans.transition()
            .duration(100)
            .style("opacity", 0);
          bt = 0;
        }
      });

    var data = props.data;
    x.domain(data.map(function (d) { return d.x; }));
    y.domain([0, 37307]);
    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")//.attr("fill", "steelblue")
      .attr("fill", d => (schools[d.x] === "Northwestern University" ? d3.rgb("#4E2A84") : "steelblue"))
      .attr("x", function (d) { return x(d.x); })
      .attr("width", x.bandwidth())
      .attr("y", function (d) { return y(d.y); })
      .attr("height", function (d) { return height - y(d.y); })
      .on("mouseover", function (d) {

        div.transition()
          .duration(100)
          .style("opacity", .9);
        div.html("School: " + schools[d.x] + "<br> Avg Debt: $" + d.y)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // add the y Axis

    svg.append("g")
      .call(d3.axisLeft(y));
  }

  update(props, oldProps) {
    // this.svg.selectAll('circle')
    //   .transition()
    //   .duration(750)
    //   .attr('cx', Math.random() * size)
    //   .attr('cy', Math.random() * size);
  }
}

module.exports = CustomD3Component;