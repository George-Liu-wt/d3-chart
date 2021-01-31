jQuery.BSA_linechart = {
  show_BSA_linechart:function(container,contents)
  {

    var margin = { top: 100, right: 80, bottom: 80, left: 65 },
        width = contents.size.width - margin.left - margin.right,
        // height = contents.size.height - margin.top - margin.bottom;
        height = contents.datas.length * contents.size.height;

    var svg = d3.select("body").append("svg").attr('version', '1.1').attr('style', 'font-family:arial').attr('xmlns', 'http://www.w3.org/2000/svg').attr("width",width + margin.left + margin.right).attr("height",height + margin.top + margin.bottom);

    num_list = [1/9, 2/9, 3/9, 4/9, 5/9, 6/9, 7/9, 8/9, 9/9];
    var colors = [];
    var per_color;
    for (i = 0; i < num_list.length; i++) {
        if (contents.params.colors == 1) {
            per_color =  d3.interpolateBlues(num_list[i]);
        }
        else if (contents.params.colors == 2) {
            per_color = d3.interpolateCool(num_list[8-i]);
        }
        else if (contents.params.colors == 3) {
            per_color = d3.interpolateGreens(num_list[i]);
        }
        else if (contents.params.colors == 4) {
            per_color = d3.interpolateYlOrBr(num_list[i]);
        }
        else if (contents.params.colors == 5) {
            per_color = d3.interpolateGreys(num_list[i]);
        }
        colors.push(per_color);
        console.log(d3.interpolateBlues(num_list[i]));
    }
    // if (contents.params.colors.length > 9) {
    //   var colors = []
    //   for (n = 0; n < 9; n++) {
    //     colors.push(contents.params.colors[n])
    //   }
    // }
    // else {
    //   var colors = contents.params.colors;
    // }

    var maxvalue = 0;  //计算最大value值。
    var maxlistlength =0; //计算最大数据长度。
    for (i = 0; i < contents.datas.length; i++) {
      var value_list = contents.datas[i];
      var value_length = value_list.length;
      // console.log(value_length);
      if(value_length > maxlistlength) {
        maxlistlength = value_length;
      }
      for (m = 0; m < value_length; m++) {
        if(value_list[m] > maxvalue) {
          maxvalue = value_list[m];
        }
      }
    }
    // console.log(maxlistlength);

    var chr_amount = contents.datas.length;

    var gridSizeX = ((width - margin.right) / maxlistlength); //格子大小的参数
    var gridSizeY = Math.floor((height - contents.datas.length * 10) / chr_amount / 1 ); //格子大小的参数
    // console.log(gridSizeX);

    var chrs_length = contents.categories.length;

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


    /* 把所有数据放到一起 */
    list_datas = [];
    for (i = 0; i < contents.datas.length; i++) {
      list_datas = list_datas.concat(contents.datas[i])
    }

    var colorScale = d3.scale.quantile()  //颜色
        .domain(list_datas)
        .range(colors);
    console.log(colorScale);
    console.log("+++++");
    var aaaa = [0].concat(colorScale.quantiles());
    console.log(aaaa);
    console.log(colorScale(0));
    console.log(d3.interpolateBlues(6/9));

    for (i = 0; i < contents.datas.length; i++) {
    var cards = g.selectAll(".xamounts")
        .data(contents.datas[i]);
        // console.log(contents.datas[i]);
        console.log("------");
        console.log(colorScale(0));
        console.log("------");

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
            .data(contents.categories)
            .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * (gridSizeY + 10 ); })  //与rect中的y对应
            .style("text-anchor", "end")
            .attr("transform", "translate(-5,"+ (5 + gridSizeY / 2) +")")
            .attr("class", "text")
            .style("font-size","20px")
            .style("font-family","SimHei")
            .style("font-weight",500);


      if (contents.params.axis_end / 1000000 > 1) {
        axis_start = contents.params.axis_start / 1000000;
        axis_end = contents.params.axis_end / 1000000;
      }
      else if (contents.params.axis_end / 1000 > 1) {
        axis_start = contents.params.axis_start / 1000;
        axis_end = contents.params.axis_end / 1000;
      }
      else {
        axis_start = contents.params.axis_start;
        axis_end = contents.params.axis_end;
      }

      //创建比例尺，指定定义域和值域。
      var xScale = d3.scale.linear()
                     .domain([axis_start,axis_end])   //定义域：x轴的坐标刻度。
                     .range([0,maxlistlength * gridSizeX]);  //值域：x轴的长度。

      //定义一个坐标轴
      var xAxis = d3.svg.axis()   //坐标轴位置。
                    .scale(xScale)
                    .orient('top')  //坐标轴大小。
                    .ticks(10)
                    .tickFormat(function(v) {
                      if (contents.params.axis_end / 1000000 > 1) {
                        return v + 'Mb';
                      }
                      else if (contents.params.axis_end / 1000 > 1) {
                        return v + 'Kb';
                      }
                      else {
                        return v + 'b';
                      }
                      });

      //在svg中添加g元素并绘制。
       g.append("g")
                    .attr("class","axis")
                    .call(xAxis)
                    .attr("transform","translate(0,-10)")//坐标轴的位置。
                    .style("stroke-width",1)  //设置坐标轴粗细。
                    .style("font-size","14px")   //大小
                    .style("font-family","arial")  //字体
                    .style("font-weight",700);  //加粗

       g.append("g")
                   .append("text")
                   .text(contents.params.title)
                   .attr("transform","translate("+ (width / 2 - 100) +",-60)")
                   .style("font-size","37px")
                   .style("font-weight",700);

      d3.select('.axis').selectAll('.tick line').attr('stroke', '#000').attr('fill', 'none');
      d3.select('.axis').select('path').attr('stroke', '#000').attr('fill', 'none');
       var list1= [];
       for (i = 0; i < 10; i++) {
         num = Math.round(maxvalue / 9 * i);
         list1.push(num);
       }
       // console.log(list1);

       var nary = [0].concat(colorScale.quantiles());
       // var nary = [1,2,3,5,6,7,8,9,10,11];
       var list_position = 0;
       var change_position = 0;
       // var nary = [0,0,1,1,2,2];
       // var nary = [0,1,2,2,2,2,3,4];
       // var listtest = [];
       for(var i=0;i<nary.length;i++){
         if (nary[i]==nary[i+1]){
           list_position = i + 1;
         }
       }
       console.log(list_position);
       if (list_position != 0 ) {
         change_position = list_position - 1;
       }

       // for(var i=0;i<listtest.length;i++){
       //   var num_cut = listtest[i] - i;
       //   nary.splice(num_cut,1);
       // }
       //
       // console.log("--==--==--");
       // console.log(listtest);
       // console.log(nary);
       // console.log("--==--==--");




       var legendElementWidth = 50;
       var legend = svg.selectAll(".legend")   //添加图例。
           .data(nary, function(d) { return d; })
           // .data(listtest, function(d) { return d; })
           .enter()
           .append("g")
           .attr("class", "legend")
           .attr("transform","translate("+ margin.left +","+ margin.top +")");

var num_draw = 0;
for (var i=0;i<nary.length;i++) {
  if (nary[i]==nary[i+1]) {
    continue;
  }
  else {
       legend.append("rect")
         .attr("x", legendElementWidth * (num_draw) )
         .attr("y", height + 30)
         .attr("width", legendElementWidth)
         .attr("height", 20)
         .attr("transform","translate("+ (maxlistlength * gridSizeX / 2 - colors.length / 2 * legendElementWidth ) +",0)")
         .style("fill", colors[i]);

       legend.append("text")
         .attr("class", "mono")
         .text(nary[i])
         .attr("x",legendElementWidth * (num_draw))
         .attr("y", height + 45)
         .attr("transform","translate("+ (maxlistlength * gridSizeX / 2 - colors.length / 2 * legendElementWidth - 5) +",20)")
         .style("font-weight",600);

         num_draw = num_draw + 1;
       }
  }

  // legend.append("rect")
  //   .attr("x", -change_position * legendElementWidth )
  //   .attr("y", height + 30)
  //   .attr("width", legendElementWidth * list_position)
  //   .attr("height", 20)
  //   .attr("transform","translate("+ (maxlistlength * gridSizeX / 2 - colors.length / 2 * legendElementWidth ) +",0)")
  //   .style("fill", "white");
  //
  // legend.append("rect")
  //   .attr("x", (-0.5 - change_position) * legendElementWidth)
  //   .attr("y", height + 50)
  //   .attr("width", legendElementWidth * list_position)
  //   .attr("height", 20)
  //   .attr("transform","translate("+ (maxlistlength * gridSizeX / 2 - colors.length / 2 * legendElementWidth ) +",0)")
  //   .style("fill", "white");

  }
}
