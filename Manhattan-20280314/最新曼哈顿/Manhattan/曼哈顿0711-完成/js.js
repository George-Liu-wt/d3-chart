jQuery.manhattan_report = {
  show_manhattan: function(container, contents) {

    var datas = contents.datas;
    var colors = contents.params.colors;

    var pos_list = [[0,0]];
    for (var i = 1; i < contents.params.pos.length; i++) {
      var pos_small_list = [];
      var pos_more = contents.params.pos[i] + 0.00000000001;
      pos_small_list.push(contents.params.pos[i]);
      pos_small_list.push(pos_more);
      pos_list.push(pos_small_list);
      // console.log(pos_small_list);
      // console.log(contents.params.pos[i]);
    }
    // console.log(pos_list);

    function get_series() {
      var seri = new Array();
      for (var i = 0; i < datas.length; i++) {
        seri.push(
          {
            'data': datas[i].data,
            'type': 'line',
            'color': colors[i],
            'name': datas[i].name
          }
          );
      }
    return seri
    }

    function tickInterval() {
      var tickInterval_num = 0;
      for (var i = 0; i < 5; i++) {
        tickInterval_num = 3 * i;
      }
      return tickInterval_num;
    }

    /* 获取当前位置的染色体名称*/
    function getchr(x) {
      for (var i = 0; i < pos_list.length; i +=1) {
        if (x < pos_list[i][1]) {
          return contents.params.name[i-1];
          break;
        }
      }
    }

    /*获取每个染色体在哪个刻度上*/
    var tick_list = [];
    function getchrtick(x, y) {
      tick_list.push(y);
      for (var i = 0; i < tick_list.length; i++) {
        if (x < tick_list[i]) {
            return tick_list[i];
            break;
          }
      }
    }

    /*获取真实pos*/
    function getrealpos(x) {
      for (var i = 0; i < pos_list.length; i +=1) {
        if (x < pos_list[i][1]) {
          var lastposlen = pos_list[i - 1][0];
          var realpos = x - lastposlen;
          // console.log(x);
          // console.log(lastposlen);
          if (x%1 == 0) {
            if (pos_list[i - 1][0]%1 == 0){
              // console.log(realpos);
              // console.log("-------------");
              return realpos;
              break;
            }
            else {
              return realpos.toFixed(pos_list[i - 1][0].toString().split(".")[1].length);
              break;
            }
          }
          else {
            // console.log(realpos.toFixed(x.toString().split(".")[1].length));
            // console.log(realpos);
            // console.log("-------------");
            return realpos.toFixed(x.toString().split(".")[1].length);
            break;
          }
        }
      }
    }

    var plotLines = [];
    for (var i = 0; i < contents.params.plot_value.length; i++) {
      plotLines.push({
        color: contents.params.plot_color[i], //线的颜色
        dashStyle: 'solid', //默认值，这里定义为实线
        value: contents.params.plot_value[i], //定义在那个值上显示标示线
        width: 2, //标示线的宽度，2px
        label: {
          text: contents.params.plot_text + contents.params.plot_value[i], //标签的内容
          align: 'right', //标签的水平位置
          x: 10, //标签相对于被定位的位置水平偏移的像素
        },
      })
    }
    console.log(plotLines);

    var pos_x_len = contents.params.pos.length;
      function labels(){
        var label_list = new Array();
        for (var i = 0; i < contents.params.name.length; i++) {
          var html = "<p style='font-size:10px;'>" + contents.params.name[i].replace("chr","") + "</p>";
          label_list.push(
            {
              html: html,
              style:{
                      left:(width - 150) / contents.params.pos[contents.params.pos.length - 1] * (contents.params.pos[i + 1] + contents.params.pos[i]) * 0.5 + 10,
                      top:height - 130,
              }
            }
          )
        }
        console.log(label_list);
        return label_list
      }

      var height = contents.size.height;
      var width = contents.size.width;


    var chart = Highcharts.chart('container', {
    		chart: {
    				type: 'scatter',
    				margin: [70, 50, 60, 80],
            zoomType:"xy"
    		},
    		title: {
    				text: contents.params.title
    		},
        subtitle: {
          text: 'LOD score',
          align: 'left',
          x : 35
        },
        labels:{
                          items: labels(),
                          style:{    //设置标签颜色
                              color:'rgb(0,0,0)',
                              fontSize : 10
                          }
                      },
    		xAxis: {
    				// gridLineWidth: 1,
            // tickInterval: tickInterval(),
    				// minPadding: 0.2,
    				// maxPadding: 0.2,
    				// maxZoom: 60,
            tickInterval: 1,
            tickWidth: 0,
            title: {
        				text: contents.params.x_title,
                y: 20
        		},
            labels: {
                enabled: false
            },
            // labels:{
            //     x: -(contents.size.width / 65),
            //     formatter:function(){
            //         var arr = [];
            //         for (var i = 0; i < pos_list.length; i++) {
            //           arr[getchrtick(pos_list[i][0], this.value)] = contents.params.name[i-1];
            //         };
            //         return arr[this.value];
            //     }
            //   }

    		},
    		yAxis: {
    				title: {
    						text: contents.params.y_title
    				},
            lineWidth: 1,
            tickWidth: 1,
            gridLineWidth: 0,
            crosshair: true,  /*鼠标放上去后有横线*/
    				// minPadding: 0.2,
    				// maxPadding: 0.2,
    				// maxZoom: 60,
    				plotLines: plotLines
    		},
        tooltip: {
          formatter : function() {
            return '<br>' + getchr(this.x) + '<br>' + 'pos:' + getrealpos(this.x) + '<br>' + 'value:' + this.y;},
        },
        legend: {
    				layout: 'vertical',
    				align: 'right',
    				verticalAlign: 'top'
    		},
    		plotOptions: {
    				series: {
    						lineWidth: 1,
    				}
    		},
    		series: get_series()
    });
  }
}
