jQuery.Genetic_map = {
  show_Genetic_map:function(container,contents)
  {
    var margin = { top: 100, right: 80, bottom: 100, left: 120 },
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

    position_value_length = contents.datas.position_value.length;
    max_position_value = 0;
    for (i = 0; i < position_value_length; i++) {
      var parrent_point = parseInt(contents.datas.position_value[i]);
      if (parrent_point > max_position_value) {
        max_position_value = parrent_point;
      }
    }
    // console.log(max_position_value);
    // max_position_value = 43400000;

    position_cm_length = contents.datas.cm_value.length;
    max_cm_value = 0;
    for (i = 0; i < position_cm_length; i++) {
      var parrent_point_cm = parseFloat(contents.datas.cm_value[i]);
      if (parrent_point_cm > max_cm_value) {
        max_cm_value = parrent_point_cm;
      }
    }
    console.log(max_cm_value);
    // max_cm_value = 161.145505150544;

    var left_num = 0;
    var divide_num = max_position_value;
    while (divide_num > 1) {
      divide_num = divide_num/ 10;
      left_num++;
    }
    // console.log(divide_num);
    // console.log(left_num);

    /*统计CMn<CMn+1的数量，如果大于一半，要翻转。*/
    var sumchange = 0;
    var last_value = 0;
    for (var i = 0; i < contents.datas.cm_value.length; i++) {
      if (last_value < contents.datas.cm_value[i]) {
        sumchange = sumchange + 1;
      }
      last_value = contents.datas.cm_value[i];
    }

    /*左边图形颜色*/
    var left_color = contents.params.colors[0];

    /*右边图形颜色*/
    var right_color = contents.params.colors[1];

    /*右边图形颜色*/
    var line_color = "grey";

//左边坐标轴
    var xScale_left = d3.scale.linear()
                   .domain([0,max_position_value])   //定义域：x轴的坐标刻度。
                   .range([0,height]);  //值域：x轴的长度。

    //定义一个坐标轴
    var xAxis_left = d3.svg.axis()   //坐标轴位置。
                  .scale(xScale_left)  //坐标轴大小。
                  .ticks(10)
                  .orient('left');
                  // .tickFormat(function(v) { return v + 'bp';});

    //在svg中添加g元素并绘制。
     g.append("g")
                  .attr("class","axis")
                  .call(xAxis_left)
                  .attr("transform","translate(0,0)")//坐标轴的位置。
                  .style("stroke-width",2)  //设置坐标轴粗细。
                  .style("font-size","14px")   //大小
                  .style("font-family","arial")  //字体
                  .style("font-weight",700);  //加粗

    g.append("g")
                 .append("text") //添加坐标轴说明。
                 .text(contents.params.left_axis_text)
                 .attr("transform","translate(-20,-20)");//指定坐标轴说明的坐标。

//右边坐标轴
    if (sumchange < 0.5 * contents.datas.cm_value.length) {
      var xScale_right = d3.scale.linear()
                     .domain([max_cm_value,0])   //定义域：x轴的坐标刻度。
                     .range([0,height]);  //值域：x轴的长度。
    }
    else {
      var xScale_right = d3.scale.linear()
                     .domain([0,max_cm_value])   //定义域：x轴的坐标刻度。
                     .range([0,height]);  //值域：x轴的长度。
    }

    //定义一个坐标轴
    var xAxis_right = d3.svg.axis()   //坐标轴位置。
                  .scale(xScale_right)  //坐标轴大小。
                  .ticks(10)
                  .orient('right');
                  // .tickFormat(function(v) { return v + 'bp';});

    g.append("g")
                 .append("text") //添加坐标轴说明。
                 .text(contents.params.right_axis_text)
                 .attr("transform","translate("+ ( width - 105 ) +",-20)");//指定坐标轴说明的坐标。

    //在svg中添加g元素并绘制。
     g.append("g")
                  .attr("class","axis")
                  .call(xAxis_right)
                  .attr("transform","translate("+ (width - 100) +",0)")//坐标轴的位置。
                  .style("stroke-width",2)  //设置坐标轴粗细。
                  .style("font-size","14px")   //大小
                  .style("font-family","arial")  //字体
                  .style("font-weight",700);  //加粗

//左边的染色体。
    //添加椭圆。
    var rect_width = 30;
    var chr_position_left = 70;
     g.append("rect")
                  .attr("x",chr_position_left)
                  .attr("y", -20)
                  .attr("rx",100)
                  .attr("ry",100)
                  .attr("width",rect_width)
                  .attr("height",40)
                  .attr("stroke",left_color)
                  .attr("stroke-width",2)
                  .style("fill","white")
                  .style("opacity",1)

    g.append("rect")
                 .attr("x",chr_position_left)
                 .attr("y", height - 20)
                 .attr("rx",100)
                 .attr("ry",100)
                 .attr("width",rect_width)
                 .attr("height",40)
                 .attr("stroke",left_color)
                 .attr("stroke-width",2)
                 .style("fill","white")
                 .style("opacity",1)

    //白色底，挡住上面两个半圆
    g.append("rect")
                 .attr("x",chr_position_left)
                 .attr("y", 0)
                 .attr("width",rect_width)
                 .attr("height",height)
                 .attr("stroke","white")
                 .style("fill","white")

     g.append("rect")
                  .attr("x", chr_position_left)
                  .attr("y", 0)
                  .attr("width",rect_width)
                  .attr("height",height)
                  .attr("stroke",left_color)
                  .attr("stroke-width",2)
                  .style("fill","white")
                  .style("opacity",1)

//右边的染色体。
  //添加椭圆。
  var chr_position_right = width - 170 - rect_width;
   g.append("rect")
                .attr("x",chr_position_right)
                .attr("y", -20)
                .attr("rx",100)
                .attr("ry",100)
                .attr("width",rect_width)
                .attr("height",40)
                .attr("stroke",right_color)
                .attr("stroke-width",2)
                .style("fill","white")
                .style("opacity",1)

  g.append("rect")
               .attr("x",chr_position_right)
               .attr("y", height - 20)
               .attr("rx",100)
               .attr("ry",100)
               .attr("width",rect_width)
               .attr("height",40)
               .attr("stroke",right_color)
               .attr("stroke-width",2)
               .style("fill","white")
               .style("opacity",1)

  //白色底，挡住上面两个半圆
  g.append("rect")
               .attr("x",chr_position_right)
               .attr("y", 0)
               .attr("width",rect_width)
               .attr("height",height)
               .attr("stroke","white")
               .style("fill","white")

   g.append("rect")
                .attr("x", chr_position_right)
                .attr("y", 0)
                .attr("width",rect_width)
                .attr("height",height)
                .attr("stroke",right_color)
                .attr("stroke-width",2)
                .style("fill","white")
                .style("opacity",1)

//添加左边染色体的数据长方形
  for (i = 0; i < position_value_length; i++) {
    parrent_position_left = contents.datas.position_value[i];
    g.append("rect")
                 .attr("x", chr_position_left)
                 .attr("y", height * parrent_position_left /max_position_value)
                 .attr("width",rect_width)
                 .attr("height",2)  //每个方块height=2.
                 .attr("stroke",left_color)
                 .style("fill",left_color)
                 .style("opacity",0.4)

  }

//添加右边染色体的数据长方形
  if (sumchange < 0.5 * contents.datas.cm_value.length) {
    for (i = 0; i < position_cm_length; i++) {
      parrent_position_right = max_cm_value - contents.datas.cm_value[i];
      g.append("rect")
                   .attr("x", chr_position_right)
                   .attr("y", height * parrent_position_right /max_cm_value)
                   .attr("width",rect_width)
                   .attr("height",2)
                   .attr("stroke",right_color)
                   .style("fill",right_color)
                   .style("opacity",0.4)

    }
  }
  else {
    for (i = 0; i < position_cm_length; i++) {
      parrent_position_right = contents.datas.cm_value[i];
      g.append("rect")
                   .attr("x", chr_position_right)
                   .attr("y", height * parrent_position_right /max_cm_value)
                   .attr("width",rect_width)
                   .attr("height",2)
                   .attr("stroke",right_color)
                   .style("fill",right_color)
                   .style("opacity",0.4)

    }
  }



//画直线
  var x_point = contents.size.width / 10;
  var xScale = d3.scale.linear()
                 .domain([0,x_point])   //定义域：x轴的坐标刻度。
                 .range([0,width]);  //值域：x轴的长度。

  var yScale = d3.scale.linear()
                 .domain([0,1])
                 .range([0,height]); //y轴值域要反向。



  for (i = 0; i < position_value_length; i++) {
                var list = [
                  {"sale": "13.16","year": contents.datas.position_percent[i],"categories":contents.categories,"position_value":contents.datas.position_value[i],"cm_value":contents.datas.cm_value[i]},
                  {"sale": "59.88","year": 1 - contents.datas.cm_percent[i],"categories":contents.categories,"position_value":contents.datas.position_value[i],"cm_value":contents.datas.cm_value[i]}
                ];

                var grid = svg.selectAll(".grid")
                              .data(xScale.ticks(10))
                              .enter().append("g")
                              .attr("class", "grid");

                var line = d3.svg.line()
                             // .curve(d3.curveBasis)
                             .x(function(d,i) { return xScale(d.sale);})
                             .y(function(d,i) { return yScale(d.year);})

                g.append("path")
                             .data([list])
                             .attr("class", "chart")
                             .attr("d", line)
                             .attr("fill", line_color)
                             .attr("stroke", line_color)
                             .attr("transform","translate(0,1)")  //每根线往下平移方块长度的一半
                             .style("opacity",0.7)
                             .style("stroke-width",2) //设置折线粗细。
                             .on("mouseover", function(d,i) {
                                               var line_obj = d3.select(this);
                                               var page_x = d3.event.pageX - 134;
                                               var page_y = d3.event.pageY - 80;//标签位置。
                                               timeout = setTimeout(function() {
                                                 line_obj.attr("fill",line_color).attr("stroke", line_color).style("opacity",1).style("stroke-width",4);
                                                 tooltip.html(d[0].categories+"<br/>"+"position:"+d[0].position_value+"<br/>"+"linkage position:"+d[0].cm_value)
                                                 .style("left",page_x+"px")
                                                 .style("top",page_y+"px")
                                                 .style("opacity",1.5)
                                                 .style("border-color", line_color)
                                                 .style("visibility","visible")  //将tool的div设置为显示。
                                                 .style('padding', '5px')
                                                 .style("font-size","13px");},0);})
                                               .on('mouseout', function() {
                                                 clearTimeout(timeout);
                                                 d3.select(this).style("stroke-width",2);
                                                 d3.select(this).style('opacity', 0.7);
                                                 d3.select('.tooltip').style('opacity', 0);
                                                 // console.log(this);
                                               });
  }

  g.append("text")
                .text(contents.params.title)
                .attr("x",1 / 2 * width)
                .attr("y",- 0.6 * margin.top)
                .attr("transform","translate(0,0)")
                .attr('text-anchor', 'middle')
                // .style("font-weight",600)
                .style("font-size","40px");

  g.append('text')
                .text(contents.params.y_title)
                .attr('transform', "translate("+(- left_num * 9 - 20)+", "+(1/2 * height)+")rotate(-90)")
                .attr('text-anchor', 'middle')
                // .style("font-weight",600)
                .style("font-size","30px");

  g.append('text')
                .text(contents.params.x_title)
                .attr("x",1 / 2 * width)
                .attr("y",height + margin.top * 0.6)
                .attr('transform', "translate(0,0)")
                .attr('text-anchor', 'middle')
                // .style("font-weight",600)
                .style("font-size","30px");

  d3.selectAll('.axis').selectAll('.tick line').attr('stroke', '#000').attr('fill', 'none');
  d3.selectAll('.axis').select('path').attr('stroke', '#000').attr('fill', 'none');

  }
}
