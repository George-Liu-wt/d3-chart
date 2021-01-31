/* globals jQuery: true, d3: true */
var graph = {
	multiArea:function(container, content) {

		d3.select('#'+container).select('svg').remove();
		//d3.select('body').select('.area_tooltip').remove();
		if (typeof(content.data) == 'undefined') {
			alert('data不能为空');
			return false;
		}

		var per_margin = 30;

		//用于填充x轴标签
		var data_element_length = content.data[0].length;
		content.categories = new Array();

		var data_lengths = {};

		for (var i in content.data) {
			data_lengths[i] = content.data[i].length;
		}
		var index = 0;
		var max_count = 0;

		for (var i in data_lengths) {
			if (data_lengths[i] > max_count) {
				index = i;
				max_count = data_lengths[i];
				continue;
			}
		}

		for (var i =0 ; i < max_count; i ++) {
			content.categories.push(i);
		}

		//var colors = ["#388E3C", "#F44336", "#0288D1", "#FF9800", "#727272", "#E91E63", "#673AB7", "#8BC34A", "#2196F3", "#D32F2F", "#FFC107", "#BDBDBD", "#F8BBD0", "#3F51B5", "#CDDC39", "#009688", "#C2185B", "#FFEB3B", "#212121", "#FFCCBC", "#BBDEFB", "#0099CC", "#FFcc99"];

		var colors = content.params.colors;
		var count = content.data.length;

		var width=content.size.width, height;

		var padding = {top:50, right:100, bottom:30, left:70};

		var grid_width  = width - padding.left-padding.right;
		var grid_height = content.size.height;

		var height = (grid_height+per_margin) * count + padding.top+padding.bottom;

		var tooltip_html = typeof($('.area_tooltip')).html();
		if (tooltip_html == 'undefined'){
			var tooltip = d3.select("body").append("div")
				.attr("class","area_tooltip") //用于css设置类样式
				.attr("opacity",0.0);
		} else {
			tooltip = d3.select('.area_tooltip');;
		}

		var svg = d3.select('#'+container).append('svg')
			.attr('version', '1.1')
			.attr('style', 'font-family:arial')
			.attr('xmlns', 'http://www.w3.org/2000/svg')
			.attr('width', width)
			.attr('height', height+10);

	   	svg.append('rect')
	   	   .attr("x", 0)
	   	   .attr("y", 0)
	   	   .attr("height", height)
	   	   .attr("width", width)
	   	   .style('fill', '#ffffff');

		var title = content.params.title;
		var word_per_margin = 1;
		svg.append('text')
			.text(title)
			.attr('text-anchor', 'middle')
			.attr('x', (width-title.length*word_per_margin)/2)
			.attr('y', 20)
			.attr('style', 'color:#333333;font-size:18px;fill:#333333;');
		var maxs = new Array();

		var mins = new Array();

		for (var i in content.data) {
			maxs.push(d3.max(content.data[i]));
			mins.push(d3.min(content.data[i]));
		}

		// 这个地方的domain非常重要,如果范围错了，可能绘图区域会超出
		var x_scale = d3.scale.linear()
			.domain([0, d3.max(content.categories)])
			.range([0, grid_width]);

		var y_min = d3.min(mins);
		y_min -= y_min/10;
		var y_scale = d3.scale.linear()
			.domain([y_min, d3.max(maxs)])
			.range([grid_height, 0]);

		var xaxis = d3.svg.axis()
			.scale(x_scale)
			.orient('bottom');

		var yaxis = d3.svg.axis()
			.scale(y_scale)
			.orient('left')
			.tickValues([0, d3.max(maxs)]);


		for (var i = 0; i < count; i ++){
			var main_top = padding.top + (per_margin+grid_height)*i;

			var main = svg.append('g')
				.attr('transform', "translate("+padding.left+", "+main_top+")");
			main.append('g')
				.attr('class', 'axis')
				.call(xaxis)
				.attr('style', 'font-size:11px')
				.attr('transform', "translate(0, "+grid_height+")")
				.attr('text-anchor', 'start');


			main.append('g')
				.attr('class', 'axis')
				.attr('style', 'font-size:11px')
				.call(yaxis);

			var line = d3.svg.line()
				.x(function(d,i) {
					return x_scale(content.categories[i]);
					//return x_scale(i)
				})
				.y(function(d) {
					return y_scale(d);
				})
				.interpolate('cardinal');  // 设置线的类型  cardinal平滑， linear:折线

			var area = d3.svg.area()
				.x(function(d, i) {
					return x_scale(content.categories[i]);
				})
				.y0(grid_height)
				.y1(function(d) {
					return y_scale(d);
				})
				.interpolate('cardinal');

			var data = content.data[i];
			var circle_radius = 3;
			var timeout;
			//for (var j in content.data) {
				var suffer = i;
				// 画线条
				main.append('path')
					.attr('class', 'area'+suffer)
					.attr('d', area(data))
					.attr('style', "fill:"+colors[i]+"")
					.attr('fill-opacity', 0.7)
					.attr('stroke', colors[i%colors.length])
					.attr('stroke-opacity',1)
					.attr('stroke-width',2);

				/*main.append('path')
					.attr('class', 'line'+suffer)
					.attr('d', line(data))
					.attr('style', "fill:none")
					.attr('stroke', colors[i%colors.length]);*/
				// 画点

				main.selectAll('.circles'+suffer)
				.data(data)
				.enter()
				.append('circle')
				.attr('class', 'circles'+suffer)
				.attr('cx', function(d,i) {
					return x_scale(content.categories[i]);
					return x_scale(i);
				})
				.attr('cy', function(d) {
					return y_scale(d);
				})
				.attr('r', circle_radius)

				.attr('stroke', colors[i])
				.attr('opacity',0.0)
				.attr('stroke-width',2)
				.attr('fill', colors[i])
				.on('mouseover', function(d, i) {
					var circle_obj = d3.select(this);
					var page_x     = d3.event.pageX;
					var page_y     = d3.event.pageY+20;
					timeout = setTimeout(function() {
						circle_obj.attr("r", function() {return circle_radius*1.2;}).attr('opacity', 1).attr('fill-opacity', 0.8).attr('stroke-opacity', 0.9);
						tooltip.html('position:'+content.categories[i]+"</br> coverage:"+d)
							.style("left",page_x+"px")
							.style("top",page_y+"px")
							.style("opacity",0.9)
							.style('padding', '5px');
						}, 100);

				})
				.on('mouseout', function() {
					clearTimeout(timeout);
					d3.select('.area_tooltip').style('opacity', 0);
					d3.select(this).transition().duration(100).attr("r", circle_radius).attr('opacity',0);


				});

				main.append('text').text(content.legend[i]).attr('style', 'font-size:11px;').attr('transform', "translate("+grid_width+",5)");
			//}
		}

		d3.selectAll('.axis').selectAll('line').attr('stroke', '#000').attr('fill', 'none');
		d3.selectAll('.axis').selectAll('path').attr('stroke', '#000').attr('fill', 'none');

		var x_label_width = 1;
		var y_label_width = 2;
		var y_label = content.params.y_label;
		var y_label_y = height/2 - y_label_width * y_label.length/2;

		var x_label = content.params.x_label;
		var word_per_margin_x = 5;

		var x_label_x = ((width-y_label.length*x_label_width-x_label.length*word_per_margin_x)/2);
		var x_label_y = height - padding.top/3;

		svg.append('text').text(y_label).attr('transform', "translate(20, "+y_label_y+")rotate(-90)").attr('text-anchor', 'middle').attr('style', 'font-size:12px');
		svg.append('text').text(x_label).attr('transform', "translate("+x_label_x+","+(x_label_y)+")").attr('style', 'font-size:12px');
	},

	/**
	 * 染色体分布图
	 *
	 **/
	distribution:function(container,contents)
	{
		var margin = { top: 100, right: 80, bottom: 80, left: 65 },
        width = contents.size.width - margin.left - margin.right,
        height = contents.datas.length * contents.size.height;

		var svg = d3.select('#'+container).append("svg").attr('version', '1.1')
			.attr('style', 'font-family:arial')
			.attr('xmlns', 'http://www.w3.org/2000/svg').attr("width",width + margin.left + margin.right).attr("height",height + margin.top + margin.bottom);

		var num_list = [1/9, 2/9, 3/9, 4/9, 5/9, 6/9, 7/9, 8/9, 9/9];
		var colors = [];
		var per_color = '';
		for (i = 0; i < num_list.length; i++) {
			if (contents.params.colors == 1) {
				per_color =  d3.interpolateBlues(num_list[i]);
			}
			else if (contents.params.colors == 2) {
				per_color = d3.interpolateCool(num_list[8-i]);
			}
			else if (contents.params.colors == 3) {
				per_color = d3.interpolateGreens(num_list[i]);
			}
			else if (contents.params.colors == 4) {
				per_color = d3.interpolateYlOrBr(num_list[i]);
			}
			else if (contents.params.colors == 5) {
				per_color = d3.interpolateGreys(num_list[i]);
			}
			colors.push(per_color);
		}

		var maxvalue = 0;  /*计算最大value值。*/
		var maxlistlength =0; /*计算最大数据长度。*/
		for (i = 0; i < contents.datas.length; i++) {
		  var value_list = contents.datas[i];
		  var value_length = value_list.length;
		  if(value_length > maxlistlength) {
			maxlistlength = value_length;
		  }
		  for (m = 0; m < value_length; m++) {
			if(value_list[m] > maxvalue) {
			  maxvalue = value_list[m];
			}
		  }
		}

		var chr_amount = contents.datas.length;

		var gridSizeX = ((width - margin.right) / maxlistlength); /*格子大小的参数*/
		var gridSizeY = Math.floor((height - contents.datas.length * 10) / chr_amount / 1 ); /*格子大小的参数*/

		var chrs_length = contents.categories.length;

		svg.append("rect")
		   .attr("class", "background")
		   .attr("x", 0)
		   .attr("y", 0)
		   .attr("width",width + margin.left + margin.right)
		   .attr("height",height + margin.top + margin.bottom)
		   .style("fill", "#ffffff");


		g = svg.append("g").attr("transform","translate("+ margin.left +","+ margin.top +")");

		var tooltip = d3.select("body").append("div")
						.attr("class","distribution_tooltip") /*用于css设置类样式*/
						.attr("opacity",1)
						.style("visibility","hidden"); /*默认div不显示。*/

		list_datas = [];
		for (i = 0; i < contents.datas.length; i++) {
		  list_datas = list_datas.concat(contents.datas[i]);
		}

		for (i = 0; i < contents.datas.length; i++) {
		var cards = g.selectAll(".xamounts")
			.data(contents.datas[i]);

		var colorScale = d3.scale.quantile()  //颜色
			.domain(list_datas)
			.range(colors);

	   cards.enter()   /*每个格子。*/
			.append("rect")  /*每个rect大小*/
			.attr("x", function(d,i) { return i * (gridSizeX); })
			.attr("y", i * (gridSizeY + 10))
			.attr("class", "every rect")
			.attr("width", gridSizeX)
			.attr("height", gridSizeY)
			.style("fill", function(d) { return colorScale(d);})
			.on("mouseover", function(d) {
			var circle_obj = d3.select(this);
			var page_x     = d3.event.pageX - 12;
			var page_y     = d3.event.pageY+20;/*标签位置。*/
			timeout = setTimeout(function() {
			  tooltip.html(d)
			  .style("left",page_x+"px")
			  .style("top",page_y+"px")
			  .style("opacity",1.5)
			  .style("border-color", colorScale(d))
			  .style("visibility","visible")  /*将tool的div设置为显示。*/
			  .style('padding', '5px');},50);})
			.on('mouseout', function() {
			  clearTimeout(timeout);
			  d3.selectAll('.distribution_tooltip').style('opacity', 0);});

		  }

		  var dayLabels = g.selectAll(".dayLabel")   //y轴标签
				.data(contents.categories)
				.enter().append("text")
				.text(function (d) { return d; })
				.attr("x", 0)
				.attr("y", function (d, i) { return i * (gridSizeY + 10 ); })  /*与rect中的y对应*/
				.style("text-anchor", "end")
				.attr("transform", "translate(-5,"+ (5 + gridSizeY / 2) +")")
				.attr("class", "text")
				.style("font-size","20px")
				.style("font-family","SimHei")
				.style("font-weight",500);


		  if (contents.params.axis_end / 1000000 > 1) {
			axis_start = contents.params.axis_start / 1000000;
			axis_end = contents.params.axis_end / 1000000;
		  }
		  else if (contents.params.axis_end / 1000 > 1) {
			axis_start = contents.params.axis_start / 1000;
			axis_end = contents.params.axis_end / 1000;
		  }
		  else {
			axis_start = contents.params.axis_start;
			axis_end = contents.params.axis_end;
		  }

		  /*创建比例尺，指定定义域和值域。*/
		  var xScale = d3.scale.linear()
						 .domain([axis_start,axis_end])   /*定义域：x轴的坐标刻度。*/
						 .range([0,maxlistlength * gridSizeX]);  /*值域：x轴的长度。*/

		  /*定义一个坐标轴*/
		  var xAxis = d3.svg.axis()   /*坐标轴位置。*/
						.scale(xScale)
						.orient('top')  /*坐标轴大小。*/
						.ticks(10)
						.tickFormat(function(v) {
						  if (contents.params.axis_end / 1000000 > 1) {
							return v + 'Mb';
						  }
						  else if (contents.params.axis_end / 1000 > 1) {
							return v + 'Kb';
						  }
						  else {
							return v + 'b';
						  }
						  });

		  /*在svg中添加g元素并绘制。*/
		   g.append("g")
						.attr("class","axis")
						.call(xAxis)
						.attr("transform","translate(0,-10)")/*坐标轴的位置。*/
						.style("stroke-width",1)  /*设置坐标轴粗细。*/
						.style("font-size","14px")   /*大小*/
						.style("font-family","arial")  /*字体*/
						.style("font-weight",700);  /*加粗*/

		   g.append("g")
					   .append("text")
					   .text(contents.params.title)
					   .attr("transform","translate("+ ((width -margin.right)/ 2 - 13 * contents.params.title.length / 2) +",-60)")
					   .style("font-size","20px")
					   .style("font-weight",700);

		d3.selectAll('.axis').selectAll('line').attr('stroke', '#000').attr('fill', 'none');
		d3.selectAll('.axis').selectAll('path').attr('stroke', '#000').attr('fill', 'none');


	  var average_num = [0].concat(colorScale.quantiles());

      var list_position = 0;
      var change_position = 0;

      for(var i=0;i<average_num.length;i++){
        if (average_num[i]==average_num[i+1]){
          if (average_num[i] == 0) {
            list_position = i + 1;
          }
        }
      }
      if (list_position != 0 ) {
        change_position = list_position - 1;
      }

       var legendElementWidth = 50;
       var legend = svg.selectAll(".legend")   /*添加图例。*/
           .data(average_num, function(d) { return d; })
           .enter()
           .append("g")
           .attr("class", "legend")
           .attr("transform","translate("+ margin.left +","+ margin.top +")");

	  var num_draw = 0;
      for (var i=0;i<average_num.length;i++) {
		  if (average_num[i]==average_num[i+1])
		  {
			  continue;
		  }
          legend.append("rect")
            .attr("x", legendElementWidth * (num_draw) )
            .attr("y", height + 30)
            .attr("width", legendElementWidth)
            .attr("height", 20)
            .attr("transform","translate("+ (maxlistlength * gridSizeX / 2 - colors.length / 2 * legendElementWidth ) +",0)")
            .style("fill", colors[i]);

          legend.append("text")
            .attr("class", "mono")
            .text(average_num[i].toFixed(0))
            .attr("x",legendElementWidth * (num_draw))
            .attr("y", height + 45)
            .attr("transform","translate("+ (maxlistlength * gridSizeX / 2 - colors.length / 2 * legendElementWidth - 5) +",20)")
            .style("font-weight",600);

		  num_draw = num_draw + 1;
          }

	},

	/**
	 * 基因结构图
	 *
	 **/
	showStructure:function(container,contents)
	{
		var margin = { top: 100, right: 80, bottom: 100, left: 120 },
        width = contents.size.width - margin.left - margin.right,
        height = contents.size.height* contents.categories.length *2;

    var svg = d3.select("body").select('#'+container).append("svg")
			.attr('version', '1.1')
			.attr('style', 'font-family:arial')
			.attr('xmlns', 'http://www.w3.org/2000/svg')
			.attr("width",width + margin.left + margin.right).attr("height",height + margin.top + margin.bottom);

    svg.append("rect")
       .attr("class", "background")
       .attr("x", 0)
       .attr("y", 0)
       .attr("width",width + margin.left + margin.right)
       .attr("height",height + margin.top + margin.bottom)
       .style("fill", "#ffffff");

    var data = contents.datas;

    g = svg.append("g").attr("transform","translate("+ margin.left +","+ margin.top +")");

    var x_start = contents.params.x_start;
    var x_end = contents.params.x_end;
    var xScaleMaxValue = 0;
    for (i = 0; i < data.length; i++) {
      var chr_data = data[i];
      var chr_data_length = data[i].values.length;
      for (x = 0; x < chr_data_length; x++) {
        var point_value = chr_data.values[x][1];
        if (point_value > xScaleMaxValue) {
          xScaleMaxValue = point_value;
        }
      }
    }

    var chramount = contents.categories.length;
    var gridSizeX = width / (x_end - x_start);
    var gridSizeY = contents.size.height;
    var gridSizeSpace = gridSizeY;

    var Legend_colors = contents.params.Legend_colors;
    if (contents.params.Legend_colors.length == 0) {
      Legend_colors = ["#00BFFF","#FFD700","#FF69B4","#808080","#FFF000","#FFFF00"];
    }

    var colors = {};
      for (i = 0; i < contents.params.legend.length; i++) {
        colors[contents.params.legend[i]] = Legend_colors[i];
      }

    var xScale = d3.scale.linear()
                   .domain([x_start,x_end])   /*定义域：x轴的坐标刻度。*/
                   .range([0,width]);  /*值域：x轴的长度。*/

    //定义一个坐标轴
    var xAxis = d3.svg.axis()   /*坐标轴位置。*/
                  .scale(xScale)  /*坐标轴大小。*/
                  .ticks(8)
                  .orient('bottom')
                  .tickFormat(function(v) { return (v / 1000).toFixed(2) ;});

    /*在svg中添加g元素并绘制。*/
     g.append("g")
                  .attr("class","axis")
                  .call(xAxis)
                  .attr("transform","translate(0," + (height) + ")")/*坐标轴的位置。*/
                  .style("stroke-width",2)  /*设置坐标轴粗细。*/
                  .style("font-size","12px")   /*大小*/
                  .style("font-family","arial")  /*字体*/
                  .style("font-weight",700);  /*加粗*/

      //画横线
      for (i = 0; i < data.length; i++) {
        var dataMaxpoint_i = 0;
        var datalength_i = data[i].values.length;
        for (x = 0; x < datalength_i; x++) {
          var data_point = data[i].values[x][1];
          if (data_point > dataMaxpoint_i) {
            dataMaxpoint_i = data_point;
          }
        }
        // console.log(dataMaxpoint_i);

        var line = g.append("line")
               .attr("x1",0)   /*x从哪里开始。*/
               .attr("y1",gridSizeSpace * 2 * i + 1 / 2 * gridSizeSpace)
               .attr("x2",(dataMaxpoint_i - x_start) / (x_end - x_start) * width)   /*x从哪里结束;要按比例来。*/
               .attr("y2",gridSizeSpace * 2 * i + 1 / 2 * gridSizeSpace)
               .attr("stroke","black")
               .attr("stroke-width",2);
      }


    for (m = 0; m < data.length; m++) {
      var chr_data = data[m];
    for (i = 0; i < chr_data.values.length; i++) {
      var cards = g.selectAll(".rectamounts")
                   .data(chr_data.values[i]);
      var d_value = chr_data.values[i][1] - chr_data.values[i][0];
      var x_value = chr_data.values[i][0];
      var type_select = chr_data.type[i];
      var color_select = colors[type_select];

      var linearGradient = cards.enter().append("linearGradient")
      						.attr("id","linearColor" + m + i)   /*用循环中的变量m，i来表达不同的url。*/
      						.attr("x1","0%")
      						.attr("y1","50%")
      						.attr("x2","0%")
      						.attr("y2","0%");   /*从左到右渐变 从上到下渐变。*/

      var stop1 = linearGradient.append("stop")
      				.attr("offset","0%")
      				.style("stop-color",color_select);

      var stop2 = linearGradient.append("stop")
      				.attr("offset","100%")
      				.style("stop-color","#FFFFFF");

     cards.enter()   /*每个格子。*/
          .append("rect")  /*每个rect大小*/
          .attr("x", (x_value - x_start) * gridSizeX)
          .attr("y", (gridSizeSpace * 2 * m + 1 / 2 * (gridSizeSpace - gridSizeY)))
          .attr("rx",20)
          .attr("ry",20)
          .attr("class", "every rect")
          .attr("width", d_value * gridSizeX)
          .attr("height", gridSizeY) /*格子大小*/
          .style("fill","url(#" + linearGradient.attr("id") + ")"); /*注：URL不能一样，同一个url只能是一个颜色。*/
    }
  }

    //y轴标题
    var chrtext = g.selectAll(".textchr")
                 .data(contents.categories);
    // for (m = 0; m < contents.params.allchrs.length; m++) {
      chrtext.enter()
      .append("text")
             .attr("class", "mono")
             .text(function(d,i) { return d; })
             .attr("x",-20)
             .attr("y", function(d,i) { return gridSizeSpace * i * 2 + 1 / 2 * gridSizeSpace + 2; })
             .attr("transform","translate(0,0)")
             .style("font-weight",600)
             .style("font-size","15px")
             .attr("text-anchor","end");

      chrtext.enter()
      .append("text")
             .attr("class", "mono")
             .text(contents.params.text_title)
             .attr("x",1 / 2 * width - 20 * contents.params.text_title.length * 0.5)
             .attr("y",- 0.5 * margin.top)
             .attr("transform","translate(0,0)")
             .style("font-weight",600)
             .style("font-size","27px");


    var tooltip = d3.select("body").append("div")
                    .attr("class","structure_tooltip") /*用于css设置类样式*/
                    .attr("opacity",1)
                    .style("visibility","hidden"); /*默认div不显示。*/

    //添加SNP及tooltip
      var symbolGenerator = d3.svg.symbol()
                              .type(d3.svg.symbolTypes[5])
                              .size(100);
    // var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'];

    var datapath = symbolGenerator();

    if (contents.params.marker_colors.length == 0) {
      var marker1_color = "#6495ED";
      var marker2_color = "#90EE90";
    }
    else {
      var marker1_color = contents.params.marker_colors[0];
      var marker2_color = contents.params.marker_colors[1];
    }

    for (i = 0; i < data.length; i++) {
         var g = svg.append("g")
                    .attr("transform","translate("+ margin.left +","+ margin.top +")");
       for (m = 0; m < data[i].marker2.length; m++) {
         var marker2_location = data[i].marker2[m][0] - x_start;
         var select_marker2_value = data[i].marker2;

         var symbolpath = g.selectAll(".rectamounts")
                           .data([select_marker2_value[m]]);

                  symbolpath.enter().append('path')
                  .attr('transform','translate(' + (marker2_location / (x_end - x_start) * width) + ', '+ (gridSizeSpace * 2 * i + 1 / 2 * gridSizeSpace - 0.5 * gridSizeY - 7.7) +')rotate(-180)')
                  .attr('d', datapath)
                  .style("fill",marker2_color)
                  .on("mouseover", function(d,i) {
                                    // var circle_obj = d3.select(this);
                                    var page_x = d3.event.pageX - 80;
                                    var page_y = d3.event.pageY - 80;/*标签位置。*/
                                    timeout = setTimeout(function() {
                                      tooltip.html('SNP:'+d[0]+"<br/>"+'ref:'+d[1]+"<br/>"+'alt:'+d[2])
                                      .style("left",page_x+"px")
                                      .style("top",page_y+"px")
                                      .style("opacity",1.5)
                                      .style("border-color", marker2_color)
                                      .style("visibility","visible")  /*将tool的div设置为显示。*/
                                      .style('padding', '5px')
                                      .style("font-size","15px");},50);})
                                    .on('mouseout', function() {
                                      clearTimeout(timeout);
                                      d3.select('.structure_tooltip').style('opacity', 0);});
                }
              }



    //添加Indel及tooltip
      var symbolGenerator = d3.svg.symbol()
                              .type(d3.svg.symbolTypes[2])
                              .size(100);
    // var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'];

    var datapath = symbolGenerator();

    for (i = 0; i < data.length; i++) {
         var g = svg.append("g")
                    .attr("transform","translate("+ margin.left +","+ margin.top +")");
       for (m = 0; m < data[i].marker1.length; m++) {
         var indel_location = data[i].marker1[m][0] - x_start;

         var select_marker1 = data[i].marker1;

         var symbolpath = g.selectAll(".rectamounts")
                           .data([select_marker1[m]]);

                  symbolpath.enter().append('path')
                  .attr('transform','translate(' + (indel_location / (x_end - x_start) * width) + ', '+ (gridSizeSpace * 2 * i + 1 / 2 * gridSizeSpace - 0.5 * gridSizeY - 9.3) +')')
                  .attr('d', datapath)
                  .style("fill",marker1_color)
                  .on("mouseover", function(d,i) {
                                    // var circle_obj = d3.select(this);
                                    var page_x = d3.event.pageX - 80;
                                    var page_y = d3.event.pageY - 80;/*标签位置。*/
                                    timeout = setTimeout(function() {
                                      tooltip.html('Indel:'+d[0]+"<br/>"+'ref:'+d[1]+"<br/>"+'alt:'+d[2])
                                      .style("left",page_x+"px")
                                      .style("top",page_y+"px")
                                      .style("opacity",1.5)
                                      .style("border-color", marker1_color)
                                      .style("visibility","visible")  /*将tool的div设置为显示。*/
                                      .style('padding', '5px')
                                      .style("font-size","15px");},50);})
                                    .on('mouseout', function() {
                                      clearTimeout(timeout);
                                      d3.select('.structure_tooltip').style('opacity', 0);});
                }
              }

     //图例
     var g = svg.append("g")
                // .data(contents.params.colors)
                .attr("transform","translate("+ margin.left +","+ (height + margin.top) +")");

     var Legend_rect = g.selectAll(".Legendrect")
                        .data([Legend_colors]);

     var Legend_width = 40;
     var Legend_height = 15;
     var text_width = 80;
     var text_height = 23;
     var line_width = 40;
     var arrow_width = 10;

     for (i = 0; i < contents.params.legend.length; i++) {
       Legend_rect.enter().append("rect")  /*每个rect大小*/
                  .attr("x", (Legend_width + text_width) * i)
                  .attr("y", 0.5 * margin.bottom)
                  .attr("rx",50)
                  .attr("ry",50)
                  .attr("class", "Legendrect")
                  .attr("width", Legend_width)
                  .attr("height", Legend_height)
                  .style("fill",Legend_colors[i]);

       Legend_rect.enter().append("text")
                  .attr("class", "Legendtexts")
                  .text(contents.params.legend[i])
                  .attr("x",(Legend_width + text_width) * i + Legend_width + 7)
                  .attr("y",Legend_height * 0.5 + 0.5 * margin.bottom + 5)
                  // .style("font-weight",600)
                  .style("font-size","17px");
     }

     Legend_rect.enter()
                .append("line")
                .attr("x1",(Legend_width + text_width) * contents.params.legend.length)
                .attr("y1",Legend_height * 0.5 + 0.5 * margin.bottom)
                .attr("x2",(Legend_width + text_width) * contents.params.legend.length + line_width)
                .attr("y2",Legend_height * 0.5 + 0.5 * margin.bottom)
                .attr("stroke","black")
                .attr("stroke-width",2);

     Legend_rect.enter().append("text")  /*横线text*/
                .attr("class", "Legendtexts")
                .text("Intron")
                .attr("x",(Legend_width + text_width) * contents.params.legend.length + Legend_width + 7)
                .attr("y",Legend_height * 0.5 + 0.5 * margin.bottom + 5)
                // .style("font-weight",600)
                .style("font-size","17px");

    var symbolGenerator = d3.svg.symbol()
                              .type(d3.svg.symbolTypes[2])
                              .size(100);
    // var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'];
    var datapath = symbolGenerator();
    Legend_rect.enter()
               .append('path')
               .attr('transform','translate(' + ((Legend_width + text_width) * (contents.params.legend.length + 1) + arrow_width + text_width) + ', '+ (Legend_height * 0.5 + 0.5 * margin.bottom) +')')
               .attr('d', datapath)
               .style("fill",marker1_color);

     Legend_rect.enter()
                .append("text")  /*横线text*/
                .attr("class", "Legendtexts")
                .text("SNP")
                .attr("x",(Legend_width + text_width) * contents.params.legend.length + arrow_width + text_width + Legend_width + 7)
                .attr("y",Legend_height * 0.5 + 0.5 * margin.bottom + 5)
                // .style("font-weight",600)
                .style("font-size","17px");

     //SNP图标
     var symbolGenerator = d3.svg.symbol()
                             .type(d3.svg.symbolTypes[5])
                             .size(100);
     // var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'];
     var datapath = symbolGenerator();
     Legend_rect.enter()
                .append('path')
                .attr('transform','translate(' + ((Legend_width + text_width) * (contents.params.legend.length + 1)) + ', '+ (Legend_height * 0.5 + 0.5 * margin.bottom) +')rotate(-180)')
                .attr('d', datapath)
                .style("fill",marker2_color);

     Legend_rect.enter()
                .append("text")  /*横线text*/
                .attr("class", "Legendtexts")
                .text("Indel")
                .attr("x",(Legend_width + text_width) * contents.params.legend.length + (arrow_width + text_width) * 2 + Legend_width + 7)
                .attr("y",Legend_height * 0.5 + 0.5 * margin.bottom + 5)
                // .style("font-weight",600)
                .style("font-size","17px");

                d3.select('.axis').selectAll('.tick line').attr('stroke', '#000').attr('fill', 'none');
                d3.select('.axis').select('path').attr('stroke', '#000').attr('fill', 'none');
	}
};
