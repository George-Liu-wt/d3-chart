jQuery.BSA_linechart = {
  show_BSA_linechart:function(container,contents)
  {

  var svg = d3.select("body").append("svg").attr("width",1060).attr("height",700),
  margin = {top: 120,bottom: 50,left: 50,right: 50},
  width = 960 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;

  //添加背景
  p = svg.append("g");
  p.append("rect")
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


  var datas = contents.alldatas;


  //创建比例尺，指定定义域和值域。
  var xScale = d3.scaleLinear()
                 .domain([0,20])   //定义域：x轴的坐标刻度。
                 .range([0,width]);  //值域：x轴的长度。

  var yScale = d3.scaleLinear()
                 .domain([0,10])
                 .range([height,0]); //y轴值域要反向。
  //
  //定义一个坐标轴
  var xAxis = d3.axisBottom()   //坐标轴位置。
                .scale(xScale)  //坐标轴大小。
                .ticks(5);       //设置x轴间距，数字越大间距越小。
                // .tickFormat(function(x) {return x + '(添加文本)'}); //坐标后添加文字。

  //定义y轴
  var yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5);

  //在svg中添加g元素并绘制。
   g.append("g")
                .attr("class","axis")
                .call(xAxis)
                .attr("transform","translate(0,"+ height +")")//坐标轴的位置。
                .style("stroke-width",2)  //设置坐标轴粗细。
                .style("font-size","12px");  //设置文字大小


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
   var gridx = svg.selectAll(".gridx")
                 .data(xScale.ticks(10))
                 .enter().append("g")
                 .attr("class", "grid");
   //画竖线，调整位置。
   gridx.append("line")
                 .attr("x1", xScale)
                 .attr("x2", xScale)
                 .attr("y1", margin.top)
                 .attr("y2", height + margin.top)
                 .attr("transform","translate("+ margin.left +",0)");

   var gridy = svg.selectAll(".gridy")
                 .data(yScale.ticks(10))
                 .enter().append("g")
                 .attr("class", "grid");

  //画横线，调整位置。
   gridy.append("line")
                 .attr("x1", margin.left)
                 .attr("x2", width + margin.bottom)
                 .attr("y1", yScale)
                 .attr("y2", yScale)
                 .attr("transform","translate(0,"+ margin.top +")");


  var colors = ['#1b9e77','#FFF000','#dcdcdc'];

    var data_element_length = 21;
    contents.categories = new Array();

    for (var i =0 ; i < data_element_length; i ++) {
      contents.categories.push(i);
    }
    console.log(contents.categories);

    var showlines = g.selectAll("asdasdasdasd")
                .data(datas)
                .enter().append("g")
                .attr("class", "showlines");


    var line = d3.line()
                 // .curve(d3.curveBasis)
                 .x(function(d) { return xScale(contents.categories[i]);})
                 .y(function(d) { return yScale(d);})

    for (var m = 0; m < 3; m++){

    var circledatas = datas[m].yz;
    console.log(circledatas);




       showlines.append("path")
                .attr("class", "chart")
                .attr("d", line(circledatas) )
                .attr("fill", "none")
                .attr("stroke", colors[m])
                .style("stroke-width",4); //设置折线粗细。











      var showcircles = g.selectAll(".showcircles")
                  .data(datas)
                  .enter().append("g")
                  .attr("class", "showcircles");

       var circle_radius = 5;
      // g = svg.append("g");


      showcircles.selectAll('circle')
                   .data(circledatas)
                   .enter()
                   .append('circle')
                   .attr('cx', function(d,i) {
                     return xScale(contents.categories[i]);
                   })
                   .attr('cy', function(d,i) {
                     return yScale(d);
                   })
                   .attr('r', 5)
                   .attr('fill',colors[m]);
                  //  .on('mouseover', function(d, i) {
           				// 	var circle_obj = d3.select(this);
           				// 	var page_x     = d3.event.pageX;
           				// 	var page_y     = d3.event.pageY+20;//标签位置。
                  //   console.log(d);
           				// 	timeout = setTimeout(function() {
           				// 		circle_obj.attr("r", function() {return circle_radius*1.8}).attr('fill-opacity', 0.8).attr('stroke-opacity', 0.9).attr("fill","grey"); //circle_radius可以改变点击后圆圈大小。
           				// 		tooltip.html('X值:'+contents.categories[i]+"</br> Y值:"+d)
           				// 			.style("left",page_x+"px")
           				// 			.style("top",page_y+"px")
           				// 			.style("opacity",1.5)
                  //       .style("visibility","visible")  //将tool的div设置为显示。
           				// 			.style('padding', '15px');
           				// 		}, 50);
                  //
           				// })
           				// .on('mouseout', function() {
           				// 	clearTimeout(timeout);
           				// 	d3.select(this).transition().duration(30).attr("r", circle_radius).attr('opacity', 1).attr("fill","red");
           				// 	d3.select('.tooltip').style('opacity', 0);
                  //
           				// });

}
}
}
