const scrs = document.getElementById("scores");

$(function () {
  "use strict";
  var chart2 = new Chartist.Bar(
    ".amp-pxl",
    {
      labels: [
        "Alignment",
        "Organisation",
        "Baseline and Plan",
        "Suppliers",
        "Interdependencies",
      ],
      series: [
        [74, 86, 90, 66, 73],
        [84, 66, 40, 80, 50],
        [28, 62, 74, 100, 20],
        [88, 86, 90, 93, 70],
        [94, 36, 71, 82, 69],
      ],
    },
    {
      axisX: {
        position: "end",
        showGrid: false,
      },
      axisY: {
        position: "start",
      },
      high: "100",
      low: "0",
      plugins: [Chartist.plugins.tooltip()],
    }
  );

  var chart = [chart2];

  for (var i = 0; i < chart.length; i++) {
    chart[i].on("draw", function (data) {
      if (data.type === "line" || data.type === "area") {
        data.element.animate({
          d: {
            begin: 500 * data.index,
            dur: 500,
            from: data.path
              .clone()
              .scale(1, 0)
              .translate(0, data.chartRect.height())
              .stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeInOutElastic,
          },
        });
      }
      if (data.type === "bar") {
        data.element.animate({
          y2: {
            dur: 500,
            from: data.y1,
            to: data.y2,
            easing: Chartist.Svg.Easing.easeInOutElastic,
          },
          opacity: {
            dur: 500,
            from: 0,
            to: 1,
            easing: Chartist.Svg.Easing.easeInOutElastic,
          },
        });
      }
    });
  }
});
