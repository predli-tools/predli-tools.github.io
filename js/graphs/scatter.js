var scttr_margin = { top: 10, right: 30, bottom: 40, left: 50 },
  scttr_width =
    document.getElementById("scattergraph").offsetWidth -
    80 -
    scttr_margin.left -
    scttr_margin.right,
  scttr_height =
    document.getElementById("scattergraph").offsetWidth -
    80 -
    scttr_margin.top -
    scttr_margin.bottom;

// append the svg object to the body of the page
var scttr_svg = d3
  .select("#scttr-graph")
  .append("svg")
  .attr("width", scttr_width + scttr_margin.left + scttr_margin.right)
  .attr("height", scttr_height + scttr_margin.top + scttr_margin.bottom)
  .append("g")
  .attr(
    "transform",
    "translate(" + scttr_margin.left + "," + scttr_margin.top + ")"
  );

// Add the grey background that makes ggplot2 famous
scttr_svg
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("height", scttr_height)
  .attr("width", scttr_height)
  .style("fill", "EBEBEB");

//Read the data
d3.csv(
  "https://raw.githubusercontent.com/iam-abbas/rawfiles/master/pli/data.csv",
  function (data) {
    // Add X axis
    var x = d3.scaleLinear().domain([0, 100]).range([0, scttr_width]);
    scttr_svg
      .append("g")
      .attr("transform", "translate(0," + scttr_height + ")")
      .call(
        d3
          .axisBottom(x)
          .tickSize(-scttr_height * 1.3)
          .ticks(10)
      )
      .select(".domain")
      .remove();

    // Add Y axis
    var y = d3.scaleLinear().domain([0, 100]).range([scttr_height, 0]).nice();
    scttr_svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .tickSize(-scttr_width * 1.3)
          .ticks(9)
      )
      .select(".domain")
      .remove();

    var Tooltip = d3
      .select("#scttr-graph")
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
      d3.select(this).attr("r", 7);
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
      d3.select(this).attr("r", 5);
    };

    // Customization
    scttr_svg.selectAll(".tick line").attr("stroke", "white");

    // Add X axis label:
    scttr_svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", scttr_width / 2 + scttr_margin.left)
      .attr("y", scttr_height + scttr_margin.top + 20)
      .text("Cultural Fit");

    // Y axis label:
    scttr_svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -scttr_margin.left + 20)
      .attr("x", -scttr_margin.top - scttr_height / 2 + 20)
      .text("Exectution Capability");

    // Color scale: give me a specie name, I return a color
    var color = d3
      .scaleOrdinal()
      .domain(["IT", "HR", "Sales", "Marketing", "Other"])
      .range(["#F8766D", "#1fff0a", "#619CFF", "#00BC18", "#ff0ae7"]);

    // Add dots
    scttr_svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", function (d) {
        return "dot " + d.Department;
      })
      .attr("cx", function (d) {
        return x(d.Organisation);
      })
      .attr("cy", function (d) {
        return y(d.Alignment);
      })
      .attr("r", 5)
      .style("fill", function (d) {
        return color(d.Department);
      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    function update() {
      var departments = [];
      d3.selectAll(".dptcheckbox").each(function (d) {
        d3.selectAll(".dot").style("opacity", "0");
        cb = d3.select(this);
        grp = String(cb.property("value"));
        if (cb.property("checked")) {
          if (cb.property("dataset").target == "Department") {
            departments.push(grp);
          }
        }
      });
      console.log(departments);
      for (var dp of departments) {
        svg.selectAll("." + dp).attr("r", function (d) {
          console.log(d);
          d3.selectAll("." + d.Department).style("opacity", "1");
        });
      }
    }

    d3.selectAll(".dptcheckbox").on("change", update);
    update();
  }
);
