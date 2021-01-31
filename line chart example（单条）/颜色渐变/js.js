jQuery.BSA_linechart = {
  show_BSA_linechart:function(container,contents)
  {
    var test_change_color = 100000;
  var svg = d3.select("div#container").append("svg").attr("width",1060).attr("height",700),
  margin = {top: 120,bottom: 100,left: 50,right: 150},
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

  var datas = contents.data;

  //创建比例尺，指定定义域和值域。
  var xScale = d3.scale.linear()
                 .domain([0,10])   //定义域：x轴的坐标刻度。
                 .range([0,width]);  //值域：x轴的长度。

  var yScale = d3.scale.linear()
                 .domain([0,10])
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
                // .tickFormat(function(y) {return y + '(添加文本)'})

  //在svg中添加g元素并绘制。
   g.append("g")
                .attr("class","axis")
                .call(xAxis)
                .attr("transform","translate(0,"+ (height) +")")//坐标轴的位置。
                .style("stroke-width",2)  //设置坐标轴粗细。
                .style("font-size","12px");  //设置文字大小

   g.append("g")
                .attr("class","axis")
                .call(yAxis)
                .style("stroke-width",2)   //设置坐标轴粗细。
                .style("font-size","12px");  //设置文字大小

d3.selectAll('.axis').selectAll('.tick line').attr('stroke', '#000').attr('fill', 'none');
d3.selectAll('.axis').select('path').attr('stroke', '#000').attr('fill', 'none');
// var c = "#FF0000";	//红色
// var b = "#00FF00";
// var a = "#8A2BE2";

dic = contents.linearGradient;

var defs = svg.append("defs");

var linearGradient = defs.append("linearGradient")
						.attr("id","linearColor")
						.attr("x1","0%")
						.attr("y1","100%")
						.attr("x2","0%")
						.attr("y2","0%");   //从左到右渐变 从上到下渐变。

for(var key in dic){
  linearGradient.append("stop")
        				.attr("offset",key)
        				.style("stop-color",dic[key].toString());
}
console.log(linearGradient);
var colorRect = svg.append("rect")
				.attr("x", width + margin.left + 0.5 * margin.right)
				.attr("y", height + margin.top - 200)
				.attr("width", 30)
				.attr("height", 200)
				.style("fill","url(#" + linearGradient.attr("id") + ")");

var nonius_scale = 6;

nonius_path = "M0 0 " +
              "L" + nonius_scale    + " " + -nonius_scale     + " " +
              "L" + nonius_scale    + " " + -2 * nonius_scale + " " +
              "L" + (-nonius_scale) + " " + -2 * nonius_scale + " " +
              "L" + (-nonius_scale) + " " + -nonius_scale     + " Z";

legend_nonius = g.append("path")
    .attr("d", nonius_path)
    .attr("transform", "translate(30,0)")
    .attr("class", "legend-nonius")
    .attr("fill", "#33a3dc")
    .attr("fill-opacity", 0);

// 设置散点的坐标, 半径
    g.selectAll('circle')
      .data(datas)
      .enter()
      .append('circle')
        .attr('cx', function(d) {
          return xScale(d[0]);
        })
        .attr('cy', function(d) {
          return yScale(d[1]);
        })
        .attr('r', 4);

var legendScale = d3.scale.linear()
               .domain([0,1])   //定义域：x轴的坐标刻度。
               .range([200,0]);  //值域：x轴的长度。

var legendAxis = d3.svg.axis()
               .orient("right")
               .scale(legendScale)
               .ticks(10);

g.append("g")
            .attr("class","legendAxis")
            .call(legendAxis)
            .attr("transform", "translate("+ (width + margin.left + 0.5 * margin.right - 20) +","+ (height + margin.top - 320) +")")
            .style("stroke-width",2)   //设置坐标轴粗细。
            .style("font-size","12px");  //设置文字大小

d3.selectAll('.legendAxis').selectAll('.tick line').attr('stroke', '#000').attr('fill', 'none');
d3.selectAll('.legendAxis').select('path').attr('stroke', 'none').attr('fill', 'none');

var a = "#7503EB";
var b = "#35F3F8";
String.prototype.colorRgb = function(sColor){
    //十六进制颜色值的正则表达式
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i=1; i<4; i+=1) {
                sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var i=1; i<7; i+=2) {
            sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));
        }
        return "[" + sColorChange.join(",") + ",0.6]";
    }
    return sColor;
};
console.log(String.prototype.colorRgb(b));
// rgb通过两个颜色之间的差来转换。
function rgb_color(start_num, end_num) {
    new_num = end_num + Math.round((start_num - end_num)*20/35);
    return new_num;
}
console.log(rgb_color(255,128));
console.log(rgb_color(85,251));
console.log(rgb_color(106,57));

}
}
