jQuery.tree_line_report = {

  show_tree_line: function(container, contents) {
    /**
     * In order to synchronize tooltips and crosshairs, override the
     * built-in events with handlers defined on the parent element.
     */
    var colors = ['#1b9e77','#1f78b4','#33a02c','#e31a1c','#ff7f00','#6a3d9a','#b15928','#1776b6','#ff7f00','#24a121','#d8241f','#9564bf','#e574c3','#bcbf00','#7f7f7f','#00bed0','#666666','#fdc086','#beaed4','#7fc97f','#1b9e77','#a6cee3','#b2df8a','#fb9a99','#fdbf6f','#cab2d6','#ffff99'];
    // $('#' + container).bind('mousemove touchmove touchstart', function(e) {
    //   var chart,
    //     point,
    //     i,
    //     event;
    //   // alert(Highcharts.charts.length)
    //   for (i = 0; i < Highcharts.charts.length; i = i + 1) {
    //     chart = Highcharts.charts[i];
    //     event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
    //     point = chart.series[0].searchPoint(event, true); // Get the hovered point

    //     if (point) {
    //       point.highlight(e);
    //     }
    //   }
    // });

    /**
     * Highlight a point by showing tooltip, setting hover state and draw crosshair
     */
    // Highcharts.Point.prototype.highlight = function(event) {
    //   this.onMouseOver(); // Show the hover marker
    //   this.series.chart.tooltip.refresh(this); // Show the tooltip
    //   this.series.chart.yAxis[0].drawCrosshair(event, this); // Show the crosshair
    // };

    /**
     * Synchronize zooming through the setExtremes event handler.
     */
    function syncExtremes(e) {
      var thisChart = this.chart;
      if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
        Highcharts.each(Highcharts.charts, function(chart) {
          if (chart !== thisChart) {
            if (chart.yAxis[0].setExtremes) { // It is null while updating  setExtremes获取坐标最值。
              chart.yAxis[0].setExtremes(e.min, e.max, undefined, false, {
                trigger: 'syncExtremes'
              });
            }
          }
        });
      }
    }

    // 设置曲线区段颜色
    function setZone() {
      var zarr = new Array();
      for (var j = 0; j < contents.xCategory.name.length; j += 1) {
       zarr.push({'value': contents.xCategory.pos[j], 'color':contents.params.colors?contents.params.colors[j]:colors[j]});
     };
      // console.log(zarr);
      return zarr
    }

    // 获取当前位置的染色体名称
    function getZone(x){
      // console.log(contents.xCategory.pos.length);
      for (var i = 0; i < contents.xCategory.pos.length; i +=1){
        // console.log(contents.xCategory.x_categories[i]);
        // console.log(x);
        if (x < contents.xCategory.pos[i]){
          return contents.xCategory.name[i];
          break;
        }
      }
    }

    function get_series(i){
      var seri = new Array();
      var s = 0;
      var e = 0;
      for (var n = 0; n < contents.xCategory.pos.length; n +=1) {
        e = contents.xCategory.pos[n] - 1;
        seri.push(
          {
            'data':contents.datasets[i].data.slice(s,e),
            'pointStart': s,
            'type': 'line',
            'color': contents.params.colors?contents.params.colors[n]:colors[n]
          }
          );
        s = contents.xCategory.pos[n];
      }
      return seri
    }

    function getx_categories(x){
      return contents.xCategory.x_categories[x];
    }
    console.log(contents.datasets.length);
    for (var i = 0; i < contents.datasets.length; i += 1) {
      //用于画标示线
      if (i == 2) {
        plotLines = [{
          color: '#0000CD', //线的颜色
          dashStyle: 'solid', //默认值，这里定义为实线
          value: contents.markIndex, //定义在那个值上显示标示线
          width: 2, //标示线的宽度，2px
          label: {
            text: '分位值：' + contents.markQvalue + '  index值: ' +
              contents.markIndex, //标签的内容
            align: 'right', //标签的水平位置
            x: 10 //标签相对于被定位的位置水平偏移的像素
          },
          // events:{
          //    click:function(){
          //         //当标示线被单击时，触发的事件
          // },
        }]
      } else {
        plotLines = []
      };

      $('<div class="chart">')
        .appendTo('#' + container)
        .highcharts({
          chart: {
            marginLeft: 50, // Keep all charts left aligned
            spacingTop: 20,
            spacingBottom: 20,
            height: 200
          },
          title: {
            text: '',
            align: 'left',
            margin: 0,
            x: 10
          },
          credits: {
            enabled: false
          },
          legend: {
            enabled: false
          },
          xAxis: {
            title: {
                text: contents.params.x_label ? contents.params.x_label : 'Chromosome postion'
            },
            crosshair: false,
            // events: {
            //   setExtremes: syncExtremes
            // },
            labels: {
              // format: '{value}'
              formatter: function() {

                return this.value;
              }
            }
          },
          yAxis: {
            tickWidth: 1,
            // tickInterval: 1,
            lineWidth: 1,
            gridLineWidth: 0,
            crosshair: true,
            title: {
                text: contents.datasets[i].name
            },
            events: {
              // setExtremes: syncExtremes
            },
            plotLines: plotLines
          },
          series: get_series(i),
          tooltip: {
            positioner: function() {
              return {
                x: this.chart.chartWidth - this.label.width, // right aligned
                y: 10 // align to title
              };
            },
            formatter: function() {
              return  getZone(this.x)+":"+ getx_categories(this.x) +' index:' + this.y;
            },
            borderWidth: 0,
            backgroundColor: 'none',
            // pointFormat: '{point.y}',
            headerFormat: '',
            shadow: false,
            style: {
              fontSize: '14px'
            },
            // valueDecimals: contents.datasets[i].valueDecimals,
            shared: true,
          },
          // plotOptions: {
          //   series: {
          //     zoneAxis: 'x',
          //     zones: setZone()
          //   }
          // }
        });
      // });
    }

    // });
  }
}
