jQuery.heatmap_report = {
  show_heatmap: function(container, contents) {

  var pos_list_x = [[0,0]];
  for (var i = 1; i < contents.params.pos_x.length; i++) {
    var pos_small_list = [];
    var pos_more = contents.params.pos_x[i] + 0.0001;
    pos_small_list.push(contents.params.pos_x[i]);
    pos_small_list.push(pos_more);
    pos_list_x.push(pos_small_list);
  }
  // console.log(pos_list_x);

  /* 获取当前位置的染色体名称*/
  function getchr(x) {
    for (var i = 0; i < pos_list_x.length; i +=1) {
      if (x < pos_list_x[i][1]) {
        return contents.params.name[i-1];
        break;
      }
    }
  }

  /* 获取当前位置的样品名称*/
  function getsamples(x) {
    return contents.params.samples[x];
  }

  /*获取每个染色体在哪个刻度上*/
  var tick_list = [];
  function getchrtick(x, y) {
    tick_list.push(y);
    // console.log(tick_list);
    for (var i = 0; i < tick_list.length; i++) {
      if (x - 1 < tick_list[i]) {
          return tick_list[i];
          break;
        }
    }
    // if (x - 1 > tick_list[tick_list.length - 1]) {
    //     return tick_list[tick_list.length - 1];
    // }
    // console.log(tick_list);
  }

Highcharts.chart('container', {

    chart: {
        type: 'heatmap',
        marginTop: 40,
        marginBottom: 80,
        plotBorderWidth: 1
    },


    title: {
        text: contents.params.title
    },

    xAxis: {
        gridLineWidth: 1,
        tickInterval: 1,
        tickWidth: 0,
        labels:{
            // x: -(contents.size.width / 65),
            formatter:function(){
                var arr = [];
                for (var i = 0; i < contents.params.pos_x.length; i++) {
                  arr[getchrtick(contents.params.pos_x[i], this.value)] = contents.params.name[i-1];
                };
                // console.log(arr);
                console.log(tick_list);
                console.log(tick_list.length);
                return arr[this.value];
            }
          },
        title: {
          text: contents.params.x_title
        }
    },

    yAxis: {
        title: {
          text: contents.params.y_title
        }
    },

    colorAxis: {
        dataClasses: [{
            from: 1,
            to: 1,
            color: contents.params.colors[0],
            // name: 'Republican'
        }, {
            from: 2,
            to: 2,
            color: contents.params.colors[1],
            // name: 'Democrat'
        }, {
            from: 3,
            to: 3,
            // name: '#FFFF00',
            color: contents.params.colors[2]
        }, {
            from: 4,
            to: 4,
            // name: '#808080',
            color: contents.params.colors[3]
        }, {
            from: 5,
            to: 5,
            // name: '#808080',
            color: contents.params.colors[4]
        }, {
            from: 6,
            to: 6,
            // name: '#808080',
            color: contents.params.colors[5]
        }, {
            from: 7,
            to: 7,
            // name: '#808080',
            color: contents.params.colors[6]
        }, {
            from: 8,
            to: 8,
            // name: '#808080',
            color: contents.params.colors[7]
        }, {
            from: 9,
            to: 9,
            // name: '#808080',
            color: contents.params.colors[8]
        }]
    },

    // colorAxis: {
    //    stops: [
    //        [0, '#FF0000'],
    //        [0.1, '#0000FF'],
    //        [0.2, '#FFFF00'],
    //        [0.3, '#808080'],
    //        [1, '#c4463a']
    //    ],
    //    min: 1,
    //    max: 9,
    //    startOnTick: false,
    //    endOnTick: false,
    //    // labels: {
    //    //     format: '{value}℃'
    //    //   }
    //    },

    legend: {
        enabled: false,
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280
    },

    tooltip: {
        formatter: function () {
			var aaa = '<br>' + getchr(this.point.x) + ':' + this.point.x + '<br>'+ getsamples(this.point.y) + '<br>';
            if (this.point.value == 1) {
              return aaa + 'A';
            }
            else if (this.point.value == 2) {
              return aaa + 'B';
            }
            else if (this.point.value == 3) {
              return aaa + 'H';
            }
            else if (this.point.value == 4) {
              return aaa + '-';
            }
            else if (this.point.value == 5) {
              return aaa + '1';
            }
            else if (this.point.value == 6) {
              return aaa + '2';
            }
            else if (this.point.value == 7) {
              return aaa + '0';
            }
            else if (this.point.value == 8) {
              return aaa + '-';
            }
            else if (this.point.value == 9) {
              return aaa + '5';
            }
        }
    },

    series: [{
        name: 'Sales per employee',
        yAxis: 0,
        borderWidth: 1,
        data: contents.data,
        // dataLabels: {
        //     enabled: true,
        //     color: '#000000'
        // },
    }]

});
  }
}
