jQuery.BSA_linechart = {
  show_BSA_linechart:function(container,contents)
  {

    var margin = { top: 100, right: 80, bottom: 80, left: 65 },
        width = 1360 - margin.left - margin.right,
        height = 680 - margin.top - margin.bottom;

    var svg = d3.select("body").append("svg").attr("width",width + margin.left + margin.right).attr("height",height + margin.top + margin.bottom);

    var data = contents.datas;
    console.log(data.values);

    var buckets = 9;
    var colors = contents.datas.colors;

    var maxvalue = 0;  //计算最大value值。
    var maxlistlength =0; //计算最大数据长度。
    for (i = 0; i < data.values.length; i++) {
      var value_list = data.values[i];
      var value_length = value_list.length;
      console.log(value_length);
      if(value_length > maxlistlength) {
        maxlistlength = value_length;
      }
      for (m = 0; m < value_length; m++) {
        if(value_list[m] > maxvalue) {
          maxvalue = value_list[m];
        }
      }
    }

    var chr_amount = data.values.length;

    var gridSizeX = ((width - margin.right) / maxlistlength); //格子大小的参数
    var gridSizeY = Math.floor((height - data.values.length * 10) / chr_amount / 1 ); //格子大小的参数

    var chrs_length = data.chrs.length;

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

    for (i = 0; i < data.values.length; i++) {
    var cards = g.selectAll(".xamounts")
        .data(data.values[i]);
        console.log(data.values[i]);

    var colorScale = d3.scaleQuantile()  //颜色
        .domain([0, maxvalue])
        .range(colors);

   cards.enter()   //每个格子。
        .append("rect")  //每个rect大小
        .attr("x", function(d,i) { return i * (gridSizeX); })
        .attr("y", i * (gridSizeY + 10))
        .attr("class", "every rect")
        .attr("width", gridSizeX)
        .attr("height", gridSizeY)
        .style("fill", function(d) { return colorScale(d);})
        .on("mouseover", function(d) {
        var circle_obj = d3.select(this);
        var page_x     = d3.event.pageX - 12;
        var page_y     = d3.event.pageY+20;//标签位置。
        // console.log(d);
        // console.log("-----");
        timeout = setTimeout(function() {
          tooltip.html(d)
          .style("left",page_x+"px")
          .style("top",page_y+"px")
          .style("opacity",1.5)
          .style("border-color", colorScale(d))
          .style("visibility","visible")  //将tool的div设置为显示。
          .style('padding', '5px');},50);})
        .on('mouseout', function() {
          clearTimeout(timeout);
          d3.select('.tooltip').style('opacity', 0);});

      }

      var dayLabels = g.selectAll(".dayLabel")   //y轴标签
            .data(data.chrs)
            .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * (gridSizeY + 10 ); })  //与rect中的y对应
            .style("text-anchor", "end")
            .attr("transform", "translate(-5,"+ (5 + gridSizeY / 2) +")")
            .attr("class", "text")
            .style("font-size",""+ (30 - chrs_length / 1.5) +"px")
            .style("font-family","serif")
            .style("font-weight",500);

      //创建比例尺，指定定义域和值域。
      var xScale = d3.scaleLinear()
                     .domain([0,maxlistlength])   //定义域：x轴的坐标刻度。
                     .range([0,maxlistlength * gridSizeX]);  //值域：x轴的长度。

      //定义一个坐标轴
      var xAxis = d3.axisTop()   //坐标轴位置。
                    .scale(xScale)  //坐标轴大小。
                    .ticks(10)
                    .tickFormat(function(v) { return v + 'Mb';});

      //在svg中添加g元素并绘制。
       g.append("g")
                    .attr("class","axis")
                    .call(xAxis)
                    .attr("transform","translate(0,-10)")//坐标轴的位置。
                    .style("stroke-width",2)  //设置坐标轴粗细。
                    .style("font-size","14px")   //大小
                    .style("font-family","arial")  //字体
                    .style("font-weight",700);  //加粗

       g.append("g")
                   .append("text")
                   .text(contents.datas.title)
                   .attr("transform","translate("+ (width / 2 - 100) +",-60)")
                   .style("font-size","37px")
                   .style("font-weight",700);

       var list1= [];
       for (i = 0; i < 10; i++) {
         num = Math.round(maxvalue / 9 * i);
         list1.push(num);
       }
       console.log(list1);


       var legendElementWidth = 50;
       var legend = svg.selectAll(".legend")   //添加图例。
           .data([0].concat(colorScale.quantiles()), function(d) { return d; })
           .enter()
           .append("g")
           .attr("class", "legend")
           .attr("transform","translate("+ margin.left +","+ margin.top +")");

       legend.append("rect")
         .attr("x", function(d, i) { return legendElementWidth * i; })
         .attr("y", height)
         .attr("width", legendElementWidth)
         .attr("height", 20)
         .attr("transform","translate("+ (width / 3.8) +",0)")
         .style("fill", function(d, i) { return colors[i]; });

       legend.append("text")
         .attr("class", "mono")
         .text(function(d) { return Math.round(d); })
         .attr("x", function(d, i) { return legendElementWidth * i; })
         .attr("y", height + 15)
         .attr("transform","translate("+ (width / 3.8 - 5) +",20)")
         .style("font-weight",600);

  }
}
