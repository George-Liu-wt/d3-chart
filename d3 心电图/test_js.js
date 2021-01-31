jQuery.BSA_linechart = {
  show_BSA_linechart:function(container,contents)
  {
    var svg = d3.select("div#container").append("svg").attr("width",1060).attr("height",700),
    margin = {top: 120,bottom: 50,left: 50,right: 50},
    width = 960 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

    //添加背景
    svg.append("g")
    .append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",width + margin.left + margin.right + 40)
    .attr("height",height + margin.top + margin.bottom)
    .style("fill","#FFF") //#F5F5F5
    .style("stroke-width",3)
    .style("stroke","#E7E7E7");


    g = svg.append("g").attr("transform","translate("+ margin.left +","+ margin.top +")");

    var tooltip = d3.select("body").append("div")
                    .attr("class","tooltip") //用于css设置类样式
                    .attr("opacity",1)
                    .style("visibility","hidden"); //默认div不显示。

    // var datas = contents.data;
    var datas = [];
    for (var i = 0; i < 50; i++) {
      list = [i, i%20]
      datas.push(list)
    }

    var n = 50;
    var maxDataPointY = 0;


    for (i = 0;i < datas.length;i++) {
      if (datas[i][1] > maxDataPointY) {
        maxDataPointY = datas[i][1];
      }
    }
    var maxDataPointY = 20;
    console.log(maxDataPointY);
    contents.categories = new Array();

    for (var i =0 ; i <= maxDataPointY; i ++) {
      contents.categories.push(i);
    }

    //创建比例尺，指定定义域和值域。
    var xScale = d3.scale.linear()
                   .domain([0,1000])   //定义域：x轴的坐标刻度。
                   .range([0,width]);  //值域：x轴的长度。

    var yScale = d3.scale.linear()
                   .domain([-10,maxDataPointY+10])
                   .range([height,0]); //y轴值域要反向。

    //定义一个坐标轴
    var xAxis = d3.svg.axis()
                  .orient("bottom")   //坐标轴位置。
                  .scale(xScale)  //坐标轴大小。
                  .ticks(5);       //设置x轴间距，数字越大间距越小。
                  // .tickFormat(function(x) {return x + '(添加文本)'}); //坐标后添加文字。

    //定义y轴
    var yAxis = d3.svg.axis()
                  .orient("left")
                  .scale(yScale)
                  .ticks(5);
                  // .tickFormat(function(y) {return y + '(添加文本)'});

    //在svg中添加g元素并绘制。
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


     g.append("g")
                  .append("text") //添加坐标轴说明。
                  .text("x坐标")
                  .attr("transform","translate("+ (width + 15) +","+ (height + 5) +")");//指定坐标轴说明的坐标。

     g.append("g")
                  .append("text") //添加坐标轴说明。
                  .text("y坐标")
                  .attr("transform","translate(-20,-20)");//指定坐标轴说明的坐标。

                  //添加横线、竖线分组。
                  var grid = svg.selectAll(".grid")
                                .data(xScale.ticks(10))
                                .enter().append("g")
                                .attr("class", "grid");
                  //画竖线，调整位置。
                  grid.append("line")
                                .attr("x1", xScale)
                                .attr("x2", xScale)
                                .attr("y1", margin.top)
                                .attr("y2", height + margin.top)
                                .attr("transform","translate("+ margin.left +",0)");

                  //画横线，调整位置。
                  grid.append("line")
                                .attr("x1", margin.left)
                                .attr("x2", width + margin.bottom)
                                .attr("y1", yScale)
                                .attr("y2", yScale)
                                .attr("transform","translate(0,"+ margin.top +")");

        function draw_line() {
          new_data()
          var line = d3.svg.line()
                       // .curve(d3.curveBasis)
                       .x(function(d,i) { return xScale(d[0]);})
                       .y(function(d,i) { return yScale(d[1]);})

                       g.append("path")
                                    .data([datas])
                                    .attr("class", "chart")
                                    .attr("d", line)
                                    .attr("fill", "none")
                                    .attr("stroke", "steelblue")
                                    .style("stroke-width",4); //设置折线粗细。
        }

        function new_data(){
          datas.splice(0,1)
          data.push([n, n%20])
          n += 1
          if (n == 1000) {
            n = 0
          }
        }

        setInterval(function() {draw_line();},1000）


  }
}
