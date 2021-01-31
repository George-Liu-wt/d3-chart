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
                   .domain([0,10])   //定义域：x轴的坐标刻度。
                   .range([0,width]);  //值域：x轴的长度。

    var yScale = d3.scaleLinear()
                   .domain([0,10])
                   .range([height,0]); //y轴值域要反向。

    //定义一个坐标轴
    var xAxis = d3.axisBottom().scale(xScale)  //坐标轴大小。

    //定义y轴
    var yAxis = d3.axisLeft().scale(yScale)

    g.append("g")
                 .attr("class","axis")
                 .call(xAxis)
                 .attr("transform","translate(0,"+ (height) +")")//坐标轴的位置。
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
                 .style("stroke-width",2)   //设置坐标轴粗细。
                 .style("font-size","12px");  //设置文字大小
    // datas = contents.data;
    datas = [];
    for (var i = 0; i < 100; i++) {
      datas.push([i/10, Math.random() * 10])
    }
    n = 0;
    var line = d3.line()
                 // .curve(d3.curveBasis)
                 .x(function(d,i) { return xScale(d[0]);})
                 .y(function(d,i) { return yScale(d[1]);})
    d3.interval(function() {
      datas2 = [];
      datas2.push(datas[n])
      datas2.push(datas[n+1])
      n += 1
      if (n == datas.length) {
        n = 0;
      }
      g.append("path")
                   .data([datas2])
                   .attr("class", "chart")
                   .attr("d", line)
                   .attr("fill", "none")
                   .attr("stroke", "green")
                   .style("stroke-width",4)
                   .transition()
                     .duration(2000)
                     .ease(Math.sqrt)
                     .attr("stroke", "white")
                     .remove();
    }, 100)
  }
}
