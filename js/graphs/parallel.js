// set the dimensions and margins of the graph
var margin = { top: 30, right: 50, bottom: 10, left: 50 },
  width =
    document.getElementById("prallelgraph").offsetWidth -
    40 -
    margin.left -
    margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#pll-graph")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv(
  "https://raw.githubusercontent.com/iam-abbas/rawfiles/master/pli/data.csv",
  function (data) {
    // Color scale: give me a specie name, I return a color
    var color = d3
      .scaleOrdinal()
      .domain(["Week_1", "Week_2", "Week_3", "Week_4"])
      .range(["#F8766D", "#1fff0a", "#619CFF", "#00BC18", "#000000"]);

    // Here I set the list of dimension manually to control the order of axis:
    dimensions = [
      "Alignment",
      "Organisation",
      "Baseline and Plan",
      "Suppliers",
      "Interdependencies",
    ];

    var y = {};
    for (i in dimensions) {
      name = dimensions[i];
      y[name] = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    }

    x = d3.scalePoint().range([0, width]).domain(dimensions);

    function path(d) {
      return d3.line()(
        dimensions.map(function (p) {
          return [x(p), y[p](d[p])];
        })
      );
    }

    var Tooltip = d3
      .select("#prallelgraph")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");

    var mouseover = function (d) {
      Tooltip.style("opacity", 1);
      d3.select(this).style("stroke-width", "3px");
    };
    var mousemove = function (d) {
      Tooltip.html(
        `Alignment: ${d.Alignment} <br> Organisation: ${d.Organisation} <br> Baseline and Plan: ${d["Baseline and Plan"]} <br> Suppliers: ${d.Suppliers} <br> Interdependencies: ${d.Interdependencies}`
      )
        .style("left", d3.mouse(this)[0] + 70 + "px")
        .style("top", d3.mouse(this)[1] + "px");
    };
    var mouseleave = function (d) {
      Tooltip.style("opacity", 0);
      d3.select(this).style("stroke-width", "1px");
    };

    // Draw the lines
    svg
      .selectAll("myPath")
      .data(data)
      .enter()
      .append("path")
      .attr("class", function (d) {
        return "line " + d.Week + " " + d.Department;
      }) // 3 class for each line: 'line' and the group name
      .attr("d", path)
      .style("opacity", "0.7")
      .style("fill", "none")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    // Draw the axis:
    svg
      .selectAll("myAxis")
      .data(dimensions)
      .enter()
      .append("g")
      .attr("class", "axis")
      .attr("transform", function (d) {
        return "translate(" + x(d) + ")";
      })
      .each(function (d) {
        d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d]));
      })
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function (d) {
        return d;
      })
      .style("fill", "black");

    function update() {
      var weeks = [];
      var departments = [];
      d3.selectAll(".checkbox").each(function (d) {
        d3.selectAll(".line")
          .style("stroke", "#d3d3d345")
          .style("opacity", "1");
        cb = d3.select(this);
        grp = String(cb.property("value"));
        if (cb.property("checked")) {
          if (cb.property("dataset").target == "Week") {
            weeks.push(grp);
          }
          if (cb.property("dataset").target == "Department") {
            departments.push(grp);
          }
        }
      });
      for (var w of weeks) {
        for (var dp of departments) {
          svg.selectAll("." + w + "." + dp).attr("r", function (d) {
            d3.selectAll("." + d.Week + "." + d.Department)
              .style("opacity", "0.65")
              .style("stroke", color(w));
          });
        }
      }
    }

    d3.selectAll(".checkbox").on("change", update);
    update();
  }
);
