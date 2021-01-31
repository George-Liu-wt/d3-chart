jQuery.tree_line_report = {

  show_area_multy: function(container, contents) {
    /**
     * In order to synchronize tooltips and crosshairs, override the
     * built-in events with handlers defined on the parent element.
     */
    var colors = ['#1b9e77','#1f78b4','#33a02c','#e31a1c','#ff7f00','#6a3d9a','#b15928','#1776b6','#ff7f00','#24a121','#d8241f','#9564bf','#e574c3','#bcbf00','#7f7f7f','#00bed0','#666666','#fdc086','#beaed4','#7fc97f','#1b9e77','#a6cee3','#b2df8a','#fb9a99','#fdbf6f','#cab2d6','#ffff99'];

    function setTitle(i){
      if (i==0){
        return contents.params.title?contents.params.title+" of "+contents.params.sample:"Depth distribution of genome coverage"
      }else{
        return ''
      }
    }

    function setXlab(i){
      if (i==contents.datasets.length-1){
        return contents.params.x_label ? contents.params.x_label : 'Sequencing postion(bp)'
      }else{
        return ''
      }
    }


    for (var i = 0; i < contents.datasets.length; i += 1) {

      $('<div class="chart">')
        .appendTo('#' + container)
        .highcharts({
          chart: {
            marginTop: 12,
            // spacingTop: 20,
            // spacingBottom: 1,
            // height:70
          },
          title: {
            text: setTitle(i)
          },
          subtitle: {
            text: contents.datasets[i].name,
            align: 'right'
          },
          credits: {
            enabled: false   //版权信息
          },
          legend: {
            enabled: false  //图例
          },
          xAxis: {
            title: {
                text: setXlab(i)
            },
            crosshair: false,
            labels: {
              formatter: function() {

                return this.value;
              }
            }
          },
          yAxis: {
            tickWidth: 1,
            tickAmount: 5,
            // tickInterval: 5,
            lineWidth: 1,
            gridLineWidth: 0,
            crosshair: false,
            title: {
                text: contents.params.y_label ? contents.params.y_label : 'Average depth'
            },
          },
          tooltip: {
            formatter: function() {
              return  "position:"+this.x+'<br/>coverage:' + this.y;
            },
          },
          series: [{
            data: contents.datasets[i].data,
            name: contents.datasets[i].name,
            type: contents.datasets[i].type,
            color: contents.params.colors[i],
            // fillOpacity: 0.1,
            // allowPointSelect: true,
            // tooltip: {
            //   valueSuffix: ' ' + contents.datasets[i].unit
            // }
          }],
          // plotOptions: {
          //   series: {
          //     zoneAxis: 'x',
          //     zones: setZone()
          //   }
          // }
        });
    }

    // });
  }
}
