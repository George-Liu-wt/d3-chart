jQuery.Gwas_map = {
  show_Gwas_map: function(container, contents) {
  var test_data = [];
  var n = 0;
  for (var i = 0; i < contents.datas.length; i++) {
    n += 1;
    $.getJSON(contents.datas[i].data, function (csv) {
      test_data.push(csv)
      if (n == contents.datas.length) {
        function series() {
          var seri = new Array();
          if (contents.params.show_p == 1) {
            seri.push(
              {
            		type: 'line',
            		data: [[0, 0], [contents.params.x_max, contents.params.y_max]],
                color: contents.params.colors[0],
            		marker: {
            			enabled: false
            		},
            		states: {
            			hover: {
            				lineWidth: 0
            			}
            		},
            		enableMouseTracking: false
            	}
            )
          }      
          for (var i = 0; i < contents.datas.length; i++) {
            seri.push(
              {
            		type: 'scatter',
                data: test_data[i],
                color: contents.params.colors[i+1],
            		// data: contents.datas,
            		marker: {
            			radius: 1
            		}
            	}
              );
            }
            return seri
        }
        Highcharts.chart('container', {
          chart: {
              height: contents.size.height,
              width: contents.size.width,
              marginBottom: 80
          },
        	xAxis: {
        		min: 0,
        		max: contents.params.x_max,
            gridLineWidth: contents.params.is_gridline,
            title: {
                text: contents.params.x_title,
                y: 25,
                style : {
                  fontSize : '18px'
                }
            }
        	},
        	yAxis: {
        		min: 0,
            max: contents.params.y_max,
            gridLineWidth: contents.params.is_gridline,
            title: {
                text: contents.params.y_title,
                style : {
                  fontSize : '18px'
                }
            }
        	},
        	title: {
        		text: contents.params.title
        	},
          legend: {
            enabled: false
          },
        	series: series()
        });
      }
    })
  }
  // console.log(test_data[0]);


  }
}
