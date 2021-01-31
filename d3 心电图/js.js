jQuery.BSA_linechart = {
  show_BSA_linechart:function(container,contents)
  {
    var test_change_color = 100000;
function draw_pic() {
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

  // var test_list = [];
  // test_list.push("11");
  // test_list.push("22");
  // console.log(test_list);



  var datas = contents.data;
  // console.log(datas);
  var maxDataPointY = 0;


  for (i = 0;i < datas.length;i++) {
    if (datas[i][1] > maxDataPointY) {
      maxDataPointY = datas[i][1];
    }
  }
  // console.log(maxDataPointY);
  contents.categories = new Array();

  for (var i =0 ; i <= maxDataPointY; i ++) {
    contents.categories.push(i);
  }

  //创建比例尺，指定定义域和值域。
  var xScale = d3.scale.linear()
                 .domain([0,datas.length - 1])   //定义域：x轴的坐标刻度。
                 .range([0,width]);  //值域：x轴的长度。

  var yScale = d3.scale.linear()
                 .domain([0,maxDataPointY])
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

  var circle_radius = 5;


  function draw_circle() {
    g.selectAll('circle')
                 .data(datas)
                 .enter()
                 .append('circle')
                 .attr('cx', function(d,i) {
                   return xScale(d[0]);
                 })
                 .attr('cy', function(d,i) {
                   return yScale(d[1]);
                 })
                 .attr('r', 5)
                 .attr('fill',function(d,i) {if(yScale(d[1]) < test_change_color) {return "red"}
               else {
                 return "green"
               }})
                 .on('mouseover', function(d, i) {
         					var circle_obj = d3.select(this);
         					var page_x     = d3.event.pageX;
         					var page_y     = d3.event.pageY+20;//标签位置。
                  // console.log(d);
         					timeout = setTimeout(function() {
         						circle_obj.attr("r", function() {return circle_radius*1.8}).attr('fill-opacity', 0.8).attr('stroke-opacity', 0.9).attr("fill","grey"); //circle_radius可以改变点击后圆圈大小。
         						tooltip.html('X值:'+contents.categories[i]+"</br> Y值:"+d[1])
         							.style("left",page_x+"px")
         							.style("top",page_y+"px")
         							.style("opacity",1.5)
                      .style("visibility","visible")  //将tool的div设置为显示。
         							.style('padding', '15px');
         						}, 50);

         				})
         				.on('mouseout', function() {
         					clearTimeout(timeout);
         					d3.select(this).transition().duration(30).attr("r", circle_radius).attr('opacity', 1).attr("fill","red");
         					d3.select('.tooltip').style('opacity', 0);

         				});

  }
draw_circle()


}
draw_pic()
var drag = d3.behavior.drag()
    //定义了元素拖拽行为的原点，设置为圆的圆心位置可以避免明显的元素跳动,第一个参考连接中的例子可以看到明显的跳动
    .origin(function() {
        var t = d3.select(this);
        return {
            y: t.attr("y1")
        };
    })
    .on("drag", dragmove);
function draw_line(x1,x2,y1,y2) {
  d3.select("div#container").select("svg").append("line")
                .attr("x1", x1)
                .attr("x2", x2)
                .attr("y1", y1)
                .attr("y2", y2)
                // .attr("transform","translate(0,"+ margin.top +")");
                .attr("stroke", "cyan")
                .attr("stroke-width", 5)
                .attr("transform","translate("+ 50 +","+ 120 +")")
                .call(drag);

  d3.select("div#container").select("svg").append("text")
  .text(function() {return "Y轴坐标:" + ((530 - y1) / 53).toFixed(2)})
  .attr("transform","translate("+ (860) +","+ (y1 + 100) +")");
}
draw_line(0,861,500,500)

//定义拖拽行为，此处为重新设置元素圆心位置
function dragmove(d) {
    d3.select(this)
        // .attr("cx", function() {
        //     return d.cx = d3.event.x
        // })
        .attr("y1", function() { if (d3.event.y < 0) {return 0;}
      else if (d3.event.y > 530) {
        return 530;
      }
    else {
      return d3.event.y;
    }})
    .attr("y2", function() { if (d3.event.y < 0) {return 0;}
  else if (d3.event.y > 530) {
    return 530;
  }
else {
  return d3.event.y;
}})
test_change_color = d3.event.y;
$("#container").html('');
// d3.selectAll(".circle").html('')
// draw_circle()
draw_pic()
if (test_change_color < 0) {
  draw_line(0,861,0,0)
}
else if (test_change_color > 530) {
  draw_line(0,861,530,530)
}
else {
  draw_line(0,861,test_change_color,test_change_color)
}
}
}
}
