jQuery.point_report = {
  show_point: function(container, contents) {

    if (!Highcharts.Series.prototype.renderCanvas) {
    		throw 'Module not loaded';
    }

    var datas = contents.datas;
    var colors = contents.params.colors;

    var pos_list_x = [[0,0]];
    for (var i = 1; i < contents.params.pos_x.length; i++) {
      var pos_small_list = [];
      var pos_more = contents.params.pos_x[i] + 0.0001;
      pos_small_list.push(contents.params.pos_x[i]);
      pos_small_list.push(pos_more);
      pos_list_x.push(pos_small_list);
    }

    var pos_list_y = [];
    var pos_small_list = [];
    var pos_more = contents.params.pos_y[0] + 0.0001;
    pos_small_list.push(contents.params.pos_y[0]);
    pos_small_list.push(pos_more);
    pos_list_y.push(pos_small_list);
    for (var i = 1; i < contents.params.pos_y.length; i++) {
      var pos_small_list = [];
      var pos_more = contents.params.pos_y[i] - 0.0001;
      pos_small_list.push(contents.params.pos_y[i]);
      pos_small_list.push(pos_more);
      pos_list_y.push(pos_small_list);
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

    /* 获取当前位置的染色体名称*/
    function getchr(x) {
      for (var i = 0; i < pos_list_x.length; i +=1) {
        if (x < pos_list_x[i][1]) {
          return contents.params.name[i-1];
          break;
        }
      }
    }

    /*获取真实x pos*/
    function getrealposx(x) {
      for (var i = 0; i < pos_list_x.length; i +=1) {
        if (x < pos_list_x[i][1]) {
          var lastposlen = pos_list_x[i - 1][0];
          var realpos = x - lastposlen;
          if (x%1 == 0) {
            if (pos_list_x[i - 1][0]%1 == 0){
              return realpos;
              break;
            }
            else {
              return realpos.toFixed(pos_list_x[i - 1][0].toString().split(".")[1].length);
              break;
            }
          }
          else {
            return realpos.toFixed(x.toString().split(".")[1].length);
            break;
          }
        }
      }
    }

    /*获取真实y pos*/
    function getrealposy(y) {
      for (var i = 0; i < pos_list_y.length - 1; i++) {
        if (y < pos_list_y[i][1]) {
          if (pos_list_y[i + 1][1] < y) {
            var lastposlen = pos_list_y[i + 1][0];
            var realpos = y - lastposlen;
            if (y%1 == 0) {
              if (pos_list_y[i + 1][0]%1 == 0){
                return realpos;
                break;
              }
              else {
                return realpos.toFixed(pos_list_y[i + 1][0].toString().split(".")[1].length);
                break;
              }
            }
            else {
              return realpos.toFixed(y.toString().split(".")[1].length);
              break;
            }
          }
        }
      }
    }

    function get_series(){
      var seri = new Array();
      for (var i = 0; i < datas.length; i++) {
        seri.push(
          {
              name: ' ',
      				type: 'scatter',
      				color: colors[i],
      				data: datas[i].data,
      				marker: {
      						radius: 1
      				}
      		}
          );
        }
        return seri
    }

	var pos_x_len = contents.params.pos_x.length;
    function labels(){
      var label_list = new Array();
      for (var i = 0; i < contents.params.name.length; i++) {
        var html = "<p style='font-size:10px;'>" + contents.params.name[i] + "</p>";
        label_list.push(
          {
            html: html,
            style:{
                    left:(width - 150) / contents.params.pos_x[contents.params.pos_x.length - 1] * (contents.params.pos_x[i + 1] + contents.params.pos_x[i]) * 0.5 ,
                    top:height - 150,
            }
          }
        )
      }
		for (var i = 0; i < contents.params.name.length; i++) {
        var html = "<p style='font-size:10px;rotation:90deg;'>" + contents.params.name[i] + "</p>";
        label_list.push(
          {
            html: html,
            style:{
                    left:-34,
                    top:(height - 150) / contents.params.pos_y[0] * (contents.params.pos_y[0] - (contents.params.pos_y[i+1] + contents.params.pos_y[i])*0.5),
            }
          }
        )
      }
      console.log(label_list);
      return label_list
    }

    var height = contents.size.height;
    var width = contents.size.width;

    Highcharts.chart(container, {
        chart: {
            zoomType: 'xy',
            height: height,
            width: width,
            margin: [50,50,100,100]
        },
        boost: {
            useGPUTranslations: true,
            usePreAllocated: true
        },
		labels:{
                      items: labels(),
                      style:{    //设置标签颜色
                          color:'rgb(0,0,0)',
                          fontSize : 10
                      }
                  },
        xAxis: {
            gridLineWidth: 1,
            tickInterval: 1,
            tickWidth: 0,
            labels: {
                enabled: false
            },
            title: {
                text: contents.params.x_title,
				y:40
            },
        },
        yAxis: {
			endOnTick: false,
			maxPadding: 0,
			max: contents.params.pos_y[0],
			labels: {
                enabled: false
            },
            title: {
                text: contents.params.y_title,
				x:-50
            }
        },
        tooltip: {
          formatter : function() {
            return '<br>' + '标记ID:' + getchr(this.x) + '<br>' + 'linkage postion:' + getrealposx(this.x) + '<br>' + 'physical position:' + getrealposy(this.y);},
        },
        title: {
            text: contents.params.title
        },
        legend: {
            enabled: false
        },
        series: get_series()
    });

  }
}
