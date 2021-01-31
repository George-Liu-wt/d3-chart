jQuery.BSA_linechart = {
  show_BSA_linechart:function(container,contents)
  {
    var svg = d3.select("div#container").append("svg").attr("width",contents.size.width).attr("height",contents.size.height),
    margin = {top: 80,bottom: 50,left: 50,right: 50},
    width = contents.size.width - margin.left - margin.right,
    height = contents.size.height - margin.top - margin.bottom;

    g = svg.append("g").attr("transform","translate("+ margin.left +","+ margin.top +")");

    //创建比例尺，指定定义域和值域。
    var xScale = d3.scaleLinear()
                   .domain([-5,5])   //定义域：x轴的坐标刻度。
                   .range([0,width]);  //值域：x轴的长度。

    var yScale = d3.scaleLinear()
                   .domain([-5,5])
                   .range([height,0]); //y轴值域要反向。

    //定义一个坐标轴
    var xAxis = d3.axisBottom().scale(xScale)  //坐标轴大小。

    //定义y轴
    var yAxis = d3.axisLeft().scale(yScale)

    g.append("g")
                 .attr("class","axis")
                 .call(xAxis)
                 .attr("transform","translate(0,"+ (0.5 * height) +")")//坐标轴的位置。
                 .style("stroke-width",2)  //设置坐标轴粗细。
                 .style("font-size","12px");  //设置文字大小
                 // xAxis(gxAxis)
                 // .selectAll("text")
                 //  .attr("transform", "rotate(90,-20,35)")  //将坐标轴的文字旋转。
                 //  .style("font-size","15px")  //设置文字大小。
                 //  .attr("fill","red");  //设置文字颜色。

    g.append("g")
                 .attr("class","axis")
                 .call(yAxis)
                 .attr("transform","translate("+ (0.5 * width) +", 0)")
                 .style("stroke-width",2)   //设置坐标轴粗细。
                 .style("font-size","12px");  //设置文字大小
    // datas = contents.data;
    var a = 0;
    var isStop = false;
    var In;
    In = d3.interval(function() {
      if (a >= 20) {
          In.stop();
          g.append('text')
           .text('你个大沙雕！')
           .attr("transform","translate(250,100)")
           .style('font-size',20)
           .style('fill','red');
      }
      else {
        datas = [];
        for (var i = 0; i < 360; i++) {
          x = i/100 - 1.8;
          // y = Math.pow(Math.abs(x), 2/3) + 0.9 * Math.pow((3.3-Math.pow(Math.abs(x), 2)), 1/2) * Math.sin(a*Math.PI*x);
          datas.push([x])
        }
        var line = d3.line()
                     .x(function(d,i) { return xScale(d[0]);})
                     .y(function(d,i) { return yScale(Math.pow(Math.abs(d[0]), 2/3) + 0.9 * Math.pow((3.3-Math.pow(Math.abs(d[0]), 2)), 1/2) * Math.sin(a*Math.PI*d[0]));})
         g.append("path")
                        .data([datas])
                        .attr("class", "chart")
                        .attr("d", line)
                        .attr("fill", "none")
                        .attr("stroke", "red")
                        .style("stroke-width",4)
                        .transition()
                        .duration(100)
                        .ease(Math.sqrt)
                        .attrTween('d', function(d) {a += 0.1;})
                        // .attr("stroke", "white")
                        .remove();
      }
    }, 100);
  }
}
