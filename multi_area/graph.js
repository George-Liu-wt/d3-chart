/* globals jQuery: true, d3: true */
var graph = {
	multi_area:function(container, content) {
		if (typeof(content.data) == 'undefined') {
			alert('data不能为空');
			return false;
		}

		//用于填充x轴标签
		var data_element_length = content.data[0].length;
		content.categories = new Array();

		for (var i =0 ; i < data_element_length; i ++) {
			content.categories.push(i);
		}
    console.log(content.categories);
		// var colors = ["#388E3C", "#F44336", "#0288D1", "#FF9800", "#727272", "#E91E63", "#673AB7", "#8BC34A", "#2196F3", "#D32F2F", "#FFC107", "#BDBDBD", "#F8BBD0", "#3F51B5", "#CDDC39", "#009688", "#C2185B", "#FFEB3B", "#212121", "#FFCCBC", "#BBDEFB", "#0099CC", "#FFcc99"];
		var colors = ['#1b9e77','#1f78b4','#33a02c','#e31a1c','#ff7f00','#6a3d9a','#b15928','#1776b6','#ff7f00','#24a121','#d8241f','#9564bf','#e574c3','#bcbf00','#7f7f7f','#00bed0','#666666','#fdc086','#beaed4','#7fc97f','#1b9e77','#a6cee3','#b2df8a','#fb9a99','#fdbf6f','#cab2d6','#ffff99'];
		var count = content.data.length;

		var width=content.size.width, height;

		var padding = {top:50, right:100, bottom:50, left:70}

		var grid_width  = width - padding.left-padding.right;
		var grid_height = content.size.height;

		var height = (grid_height+padding.top) *(count-1)+70-(count+2)*(count-1) < 100 ? 100 : (grid_height+padding.top) *(count-1)+70-(count+2)*(count-1);

		var tooltip = d3.select("body").append("div")
                        .attr("class","tooltip") //用于css设置类样式
                        .attr("opacity",0.0);

		var svg = d3.select('#'+container).append('svg')
			.attr('width', width)
			.attr('height', height+10);

		var title = content.params.title;
		var word_per_margin = 2.8;
		svg.append('text')
			.text(title)
			.attr('text-anchor', 'middle')
			.attr('x', (width+title.length*word_per_margin)/2)
			.attr('y', 20)
			.attr('style', 'color:#333333;font-size:18px;fill:#333333;');
		var maxs = new Array();

		for (var i in content.data) {
			maxs.push(d3.max(content.data[i]));
		}

		// 这个地方的domain非常重要,如果范围错了，可能绘图区域会超出
		var x_scale = d3.scale.linear()
			.domain([0, d3.max(content.categories)])
			.range([0, grid_width]);

		var y_scale = d3.scale.linear()
			.domain([0, d3.max(maxs)])
			.range([grid_height, 0]);

		var xaxis = d3.svg.axis()
			.scale(x_scale)
			.orient('bottom')

		var yaxis = d3.svg.axis()
			.scale(y_scale)
			.orient('left')
			.tickValues([0, d3.max(maxs)]);

		var per_margin = 30;
		for (var i = 0; i < count; i ++){
			var main_top = padding.top + (per_margin+grid_height)*i;

			var main = svg.append('g')
				.attr('transform', "translate("+padding.left+", "+main_top+")");
			main.append('g')
				.attr('class', 'axis')
				.call(xaxis)
				.attr('style', 'font-size:11px')
				.attr('transform', "translate(0, "+grid_height+")")
				.attr('text-anchor', 'start')


			main.append('g')
				.attr('class', 'axis')
				.attr('style', 'font-size:11px')
				.call(yaxis);

			var line = d3.svg.line()
				.x(function(d,i) {
					return x_scale(content.categories[i])
					//return x_scale(i)
				})
				.y(function(d) {
					return y_scale(d)
				})
				.interpolate('cardinal');  // 设置线的类型  cardinal平滑， linear:折线

			var area = d3.svg.area()
				.x(function(d, i) {
					return x_scale(content.categories[i])
					return x_scale(i)
				})
				.y0(grid_height)
				.y1(function(d) {
					return y_scale(d)
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
					.attr('fill-opacity', 0.9)
					.attr('stroke', colors[i%colors.length])
					.attr('stroke-opacity',1)
					.attr('stroke-width',5)
					//

					;

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
					console.log(i)
					timeout = setTimeout(function() {
						circle_obj.attr("r", function() {return circle_radius*1.2}).attr('opacity', 1).attr('fill-opacity', 0.8).attr('stroke-opacity', 0.9);
						tooltip.html('position:'+content.categories[i]+"</br> coverage:"+d)
							.style("left",page_x+"px")
							.style("top",page_y+"px")
							.style("opacity",0.9)
							.style('padding', '5px');
						}, 500);

				})
				.on('mouseout', function() {
					clearTimeout(timeout);
					d3.select(this).transition().duration(30).attr("r", circle_radius).attr('opacity',0);
					d3.select('.tooltip').style('opacity', 0);

				});

				main.append('text').text(content.legend[i]).attr('style', 'font-size:11px;').attr('transform', "translate("+grid_width+",5)")
			//}
		}

		var y_label = content.params.y_label;
		var y_label_y = ((height+y_label.length*word_per_margin)/2) < 122 ? 122 :((height+y_label.length*word_per_margin)/2);

		var x_label = content.params.x_label;
		var x_label_x = ((width+y_label.length*word_per_margin)/2);

		svg.append('text').text(y_label).attr('transform', "translate(20, "+y_label_y+")rotate(-90)").attr('text-anchor', 'middle')
		svg.append('text').text(x_label).attr('transform', "translate("+x_label_x+","+(height)+")");
	}
};
