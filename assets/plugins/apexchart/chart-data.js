"use strict";
$(document).ready(function () {
  function generateData(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;
      series.push([x, y, z]);
      baseval += 86400000;
      i++;
    }
    return series;
  }
  var columnCtx = document.getElementById("initial-final"),
    columnConfig = {
      colors: ["#FF5200", "#00A8B5", "#FA9905"],
      series: [
        {
          name: "Initial",
          type: "column",
          data: [201, 80, 150, 88],
        },
        {
          name: "Filtered",
          type: "column",
          data: [187, 42, 90, 40],
        },
        {
          name: "Shortlisted",
          type: "column",
          data: [22, 35, 42, 30],
        },
      ],
      chart: {
        type: "bar",
        fontFamily: "Poppins, sans-serif",
        height: 350,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: { horizontal: false, columnWidth: "60%", endingShape: "rounded" },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr"],
      },
      yaxis: { title: { text: "CVs" } },
      fill: { opacity: 1 },
      tooltip: {
        y: {
          formatter: function (val) {
            return "" + val + " CVs";
          },
        },
      },
    };
  var columnChart = new ApexCharts(columnCtx, columnConfig);
  columnChart.render();
  var pieCtx = document.getElementById("invoice_chart"),
    pieConfig = {
      colors: ["#7638ff", "#ff737b", "#fda600", "#1ec1b0"],
      series: [55, 40, 20, 10],
      chart: { fontFamily: "Poppins, sans-serif", height: 350, type: "donut" },
      labels: [
        "Bad CVS",
        "Qualification Not Met",
        "Fudging",
        "Other applicants better",
      ],
      legend: { show: false },
      responsive: [
        {
          breakpoint: 480,
          options: { chart: { width: 200 }, legend: { position: "bottom" } },
        },
      ],
    };
  var pieChart = new ApexCharts(pieCtx, pieConfig);
  pieChart.render();
});
