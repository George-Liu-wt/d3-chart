jQuery.Genetic_evolution = {
  show_line_chart:function(container,contents)
  {
    var margin = { top: 100, right: 150, bottom: 100, left: 120 },
        width = contents.size.width - margin.left - margin.right,
        height = contents.size.height - margin.top - margin.bottom;

    var svg = d3.select("body").append("svg").attr("width",width + margin.left + margin.right).attr("height",height + margin.top + margin.bottom);

    svg.append("rect")
       .attr("class", "background")
       .attr("x", 0)
       .attr("y", 0)
       .attr("width",width + margin.left + margin.right)
       .attr("height",height + margin.top + margin.bottom)
       .style("fill", "#ffffff");

    g = svg.append("g").attr("transform","translate("+ margin.left +","+ margin.top +")");

    var tooltip = d3.select("body").append("div")
                    .attr("class","tooltip") //用于css设置类样式
                    .attr("opacity",1)
                    .style("visibility","hidden"); //默认div不显示。

    g.append("rect")
       .attr("class", "flame")
       .attr("x", 0)
       .attr("y", -20)
       .attr("width",width+20)
       .attr("height",height+20)
       .attr("stroke","#000")
       .style("stroke-width",2.5)
       .style("fill", "#ffffff");

    var max_position_value = 0;
    for (var i = 0; i < contents.datas.length; i++) {
      eh_data = contents.datas[i].data;
      for (var m = 0; m < eh_data.length; m++) {
        if (eh_data[m][1] > max_position_value) {
          max_position_value = eh_data[m][1];
        }
      }
    }

    max_position_value = max_position_value * 1.5;
    //左边坐标轴
    var yScale = d3.scale.linear()
                   .domain([0,max_position_value])   //定义域：x轴的坐标刻度。
                   .range([height,0]);  //值域：x轴的长度。

    //定义一个坐标轴
    var yAxis = d3.svg.axis()   //坐标轴位置。
                  .scale(yScale)  //坐标轴大小。
                  .ticks(4)
                  .orient('left');
                  // .tickFormat(function(v) { return v + 'bp';});

    //在svg中添加g元素并绘制。
     g.append("g")
                  .attr("class","axis")
                  .call(yAxis)
                  .attr("transform","translate(0,0)")//坐标轴的位置。
                  .style("stroke-width",2)  //设置坐标轴粗细。
                  .style("font-size","14px")   //大小
                  .style("font-family","arial")  //字体
                  .style("font-weight",700);  //加粗

    var max_amount = 0;
    for (var i = 0; i < contents.datas.length; i++) {
      if (Math.log(contents.datas[i].data[(contents.datas[i].data.length - 1)][0]) > max_amount) {
        max_amount = Math.log(contents.datas[i].data[(contents.datas[i].data.length - 1)][0]);
      }
    }
    max_amount = max_amount / Math.log(10) * 1.2;

    var min_amount = 100000;
    for (var i = 0; i < contents.datas.length; i++) {
      if (Math.log(contents.datas[i].data[0][0]) < min_amount) {
        min_amount = Math.log(contents.datas[i].data[0][0]);
      }
    }
    min_amount = min_amount/Math.log(10) * 0.9;

    var xScale = d3.scale.linear()
                   .domain([min_amount,max_amount])   //定义域：x轴的坐标刻度。
                   .range([0,width]);  //值域：x轴的长度。

    //定义一个坐标轴
    var xAxis = d3.svg.axis()   //坐标轴位置。
                  .scale(xScale)  //坐标轴大小。
                  .ticks(4)
                  .orient('bottom')
                  .tickFormat(function(v) {
                      return '1e+0' + v;
                    });
                  // .tickFormat(function(v) { return v + 'bp';});

    //在svg中添加g元素并绘制。
     g.append("g")
                  .attr("class","axis")
                  .call(xAxis)
                  .attr("transform","translate(0,"+height+")")//坐标轴的位置。
                  .style("stroke-width",2)  //设置坐标轴粗细。
                  .style("font-size","14px")   //大小
                  .style("font-family","arial")  //字体
                  .style("font-weight",700);  //加粗

    var line = d3.svg.line()
                 // .curve(d3.curveBasis)
                 .x(function(d,i) { return xScale(Math.log(d[0])/ Math.log(10));})
                 .y(function(d,i) { return yScale(d[1]);})

    var circle_data = [];
    for (var i = 0; i < contents.datas.length; i++) {
      var datas = contents.datas[i].data;
      var color = contents.params.color[i];

      g.append("path")
                   .data([datas])
                   .attr("class", "chart")
                   .attr("d", line)
                   .attr("fill", "none")
                   .attr("stroke", color)
                   .style("stroke-width",4); //设置折线粗细。

      var circle_radius = 3;
      var circles = g.selectAll('circle' + i)
                   .data(datas)

        circles.enter()
               .append('circle')
               .attr('cx', function(d,i) {
                 return xScale(Math.log(d[0])/Math.log(10));
               })
               .attr('cy', function(d,i) {
                 return yScale(d[1]);
               })
               .attr('r', 2)
               .attr('fill',color)
               .on('mouseover', function(d, i) {
               	var circle_obj = d3.select(this);
               	var page_x     = d3.event.pageX - 70;
               	var page_y     = d3.event.pageY - 60;//标签位置。
               	timeout = setTimeout(function() {
               		circle_obj.attr("r", function() {return circle_radius*1.8}).attr('fill-opacity', 0.8).attr('stroke-opacity', 0.9); //circle_radius可以改变点击后圆圈大小。
               		tooltip.html('X:'+d[0]+"</br> Y:"+d[1])
               			.style("left",page_x+"px")
               			.style("top",page_y+"px")
               			.style("opacity",1.5)
                    .style("visibility","visible")  //将tool的div设置为显示。
               			.style('padding', '5px')
                    .style('border-color','brown');
               		}, 50);

               })
               .on('mouseout', function() {
               	clearTimeout(timeout);
               	d3.select(this).transition().duration(30).attr("r", 2).attr('opacity', 1);
               	d3.select('.tooltip').style('opacity', 0);

               });
    }

    g.append("g")
                 .append("text")
                 .text(contents.params.x_title)
                 .attr("transform","translate("+ (0.5 * width - 3 * contents.params.x_title.length) +","+ (height + 55) +")");

    g.append("g")
                 .append("text")
                 .text(contents.params.y_title)
                 .attr("transform","translate("+ (- 50) +","+ (0.5 * height + 3 * contents.params.x_title.length) +")rotate(-90)");

    g.append("g")
                 .append("text")
                 .text(contents.params.title)
                 .attr("transform","translate("+ (0.5 * width - 3 * contents.params.x_title.length) +","+ (- 0.5 * margin.top) +")");

    for (var i = 0; i < contents.datas.length; i++) {
      g.append("g")
                   .append("text")
                   .text(contents.datas[i].name)
                   .attr("transform","translate("+ (0.4 * margin.right + width) +","+ (20 * i) +")");

      g.append("g")
                   .append("circle")
                   .attr('r', 4)
                   .attr('fill',contents.params.color[i])
                   .attr("transform","translate("+ (0.3 * margin.right + width) +","+ (20 * i - 3) +")");
    }

    d3.selectAll('.axis').selectAll('.tick line').attr('stroke', '#000').attr('fill', 'none');
    d3.selectAll('.axis').select('path').attr('stroke', '#000').attr('fill', 'none');
  }
}
