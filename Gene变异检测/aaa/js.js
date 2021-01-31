jQuery.BSA_linechart = {
  show_BSA_linechart:function(container,contents)
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

    var data = contents.datas;

    g = svg.append("g").attr("transform","translate("+ margin.left +","+ margin.top +")");

    var xScaleMaxValue = 0;
    for (i = 0; i < data.length; i++) {
      var chr_data = data[i];
      var maxpoint_location = chr_data.values.length - 1;
      var maxpoint = chr_data.values[maxpoint_location][1];
      if (maxpoint > xScaleMaxValue) {
        xScaleMaxValue = maxpoint;
      }
    }

    var chramount = contents.categories.length;
    var gridSizeX = width / xScaleMaxValue;
    var gridSizeY = height / chramount / 2;

    var xScale = d3.scale.linear()
                   .domain([0,xScaleMaxValue])   //定义域：x轴的坐标刻度。
                   .range([0,width]);  //值域：x轴的长度。

    //定义一个坐标轴
    var xAxis = d3.svg.axis()   //坐标轴位置。
                  .scale(xScale)  //坐标轴大小。
                  .ticks(10)
                  .orient('bottom')
                  .tickFormat(function(v) { return v + 'bp';});

    //在svg中添加g元素并绘制。
     g.append("g")
                  .attr("class","axis")
                  .call(xAxis)
                  .attr("transform","translate(0," + (height) + ")")//坐标轴的位置。
                  .style("stroke-width",2)  //设置坐标轴粗细。
                  .style("font-size","14px")   //大小
                  .style("font-family","arial")  //字体
                  .style("font-weight",700);  //加粗

      //画横线
      for (i = 0; i < data.length; i++) {
        var datalength_i = data[i].values.length - 1;
        var data_i = data[i].values;
        var dataMaxpoint_i = data_i[datalength_i][1];

        var line = g.append("line")
               .attr("x1",0)   //x从哪里开始。
               .attr("y1",gridSizeY * 2 * i + 1 / 2 * gridSizeY)
               .attr("x2",dataMaxpoint_i / xScaleMaxValue * width)   //x从哪里结束;要按比例来。
               .attr("y2",gridSizeY * 2 * i + 1 / 2 * gridSizeY)
               .attr("stroke","black")
               .attr("stroke-width",2);
      }


    for (m = 0; m < data.length; m++) {
      var chr_data = data[m];
    for (i = 0; i < chr_data.values.length; i++) {
      var cards = g.selectAll(".rectamounts")
                   .data(chr_data.values[i]);
      var d_value = chr_data.values[i][1] - chr_data.values[i][0];
      var x_value = chr_data.values[i][0];
      var type_select = chr_data.type[i];
      var colors = contents.params.colors;
      var color_select = colors[type_select];

      var linearGradient = cards.enter().append("linearGradient")
      						.attr("id","linearColor" + m + i)   //用循环中的变量m，i来表达不同的url。
      						.attr("x1","0%")
      						.attr("y1","50%")
      						.attr("x2","0%")
      						.attr("y2","0%");   //从左到右渐变 从上到下渐变。

      var stop1 = linearGradient.append("stop")
      				.attr("offset","0%")
      				.style("stop-color",color_select);

      var stop2 = linearGradient.append("stop")
      				.attr("offset","100%")
      				.style("stop-color","#FFFFFF");

     cards.enter()   //每个格子。
          .append("rect")  //每个rect大小
          .attr("x", x_value * gridSizeX)
          .attr("y", (gridSizeY) * 2 * m)
          .attr("rx",20)
          .attr("ry",20)
          .attr("class", "every rect")
          .attr("width", d_value * gridSizeX)
          .attr("height", gridSizeY)
          .style("fill","url(#" + linearGradient.attr("id") + ")"); //注：URL不能一样，同一个url只能是一个颜色。
    }
  }

    //y轴标题
    var chrtext = g.selectAll(".textchr")
                 .data(contents.categories);
    // for (m = 0; m < contents.params.allchrs.length; m++) {
      chrtext.enter()
      .append("text")
             .attr("class", "mono")
             .text(function(d,i) { return d; })
             .attr("x",-20)
             .attr("y", function(d,i) { return gridSizeY * i * 2 + 1 / 2 * gridSizeY + 2; })
             .attr("transform","translate(0,0)")
             .style("font-weight",600)
             .style("font-size","15px")
             .attr("text-anchor","end");

      chrtext.enter()
      .append("text")
             .attr("class", "mono")
             .text(contents.params.text_title)
             .attr("x",1 / 2 * width - 20 * contents.params.text_title.length * 0.5)
             .attr("y",- 0.5 * margin.top)
             .attr("transform","translate(0,0)")
             .style("font-weight",600)
             .style("font-size","27px");


    var tooltip = d3.select("body").append("div")
                    .attr("class","tooltip") //用于css设置类样式
                    .attr("opacity",1)
                    .style("visibility","hidden"); //默认div不显示。

    //添加SNP及tooltip
      var symbolGenerator = d3.svg.symbol()
                              .type(d3.svg.symbolTypes[5])
                              .size(100);
    // var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'];

    var datapath = symbolGenerator();

    for (i = 0; i < data.length; i++) {
         var g = svg.append("g")
                    .attr("transform","translate("+ margin.left +","+ margin.top +")");
       for (m = 0; m < data[i].snp_datas.length; m++) {
         var snp_datas_location = data[i].snp_datas[m][0];
         var select_snp_datas_value = data[i].snp_datas;

         var symbolpath = g.selectAll(".rectamounts")
                           .data([select_snp_datas_value[m]]);

                  symbolpath.enter().append('path')
                  .attr('transform','translate(' + (snp_datas_location / xScaleMaxValue * width) + ', '+ (gridSizeY * 2 * i - gridSizeY * 0.4) +')rotate(-180)')
                  .attr('d', datapath)
                  .style("fill",contents.params.snp_color)
                  .on("mouseover", function(d,i) {
                                    // var circle_obj = d3.select(this);
                                    var page_x = d3.event.pageX - 80;
                                    var page_y = d3.event.pageY - 80;//标签位置。
                                    timeout = setTimeout(function() {
                                      tooltip.html('SNP:'+d[0]+"<br/>"+'ref:'+d[1]+"<br/>"+'alt:'+d[2])
                                      .style("left",page_x+"px")
                                      .style("top",page_y+"px")
                                      .style("opacity",1.5)
                                      .style("border-color", contents.params.snp_color)
                                      .style("visibility","visible")  //将tool的div设置为显示。
                                      .style('padding', '5px')
                                      .style("font-size","15px");},50);})
                                    .on('mouseout', function() {
                                      clearTimeout(timeout);
                                      d3.select('.tooltip').style('opacity', 0);});
                }
              }



    //添加Indel及tooltip
      var symbolGenerator = d3.svg.symbol()
                              .type(d3.svg.symbolTypes[2])
                              .size(100);
    // var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'];

    var datapath = symbolGenerator();

    for (i = 0; i < data.length; i++) {
         var g = svg.append("g")
                    .attr("transform","translate("+ margin.left +","+ margin.top +")");
       for (m = 0; m < data[i].indel_datas.length; m++) {
         var indel_location = data[i].indel_datas[m][0];

         var select_indel_datas = data[i].indel_datas;

         var symbolpath = g.selectAll(".rectamounts")
                           .data([select_indel_datas[m]]);

                  symbolpath.enter().append('path')
                  .attr('transform','translate(' + (indel_location / xScaleMaxValue * width) + ', '+ (gridSizeY * 2 * i - gridSizeY * 0.4) +')')
                  .attr('d', datapath)
                  .style("fill",contents.params.indel_color)
                  .on("mouseover", function(d,i) {
                                    // var circle_obj = d3.select(this);
                                    var page_x = d3.event.pageX - 80;
                                    var page_y = d3.event.pageY - 80;//标签位置。
                                    timeout = setTimeout(function() {
                                      tooltip.html('Indel:'+d[0]+"<br/>"+'ref:'+d[1]+"<br/>"+'alt:'+d[2])
                                      .style("left",page_x+"px")
                                      .style("top",page_y+"px")
                                      .style("opacity",1.5)
                                      .style("border-color", contents.params.indel_color)
                                      .style("visibility","visible")  //将tool的div设置为显示。
                                      .style('padding', '5px')
                                      .style("font-size","15px");},50);})
                                    .on('mouseout', function() {
                                      clearTimeout(timeout);
                                      d3.select('.tooltip').style('opacity', 0);});
                }
              }

     //图例
     var g = svg.append("g")
                // .data(contents.params.colors)
                .attr("transform","translate("+ margin.left +","+ (height + margin.top) +")");

     var Legend_rect = g.selectAll(".Legendrect")
                        .data([contents.params.Legend_colors]);

     var Legend_width = 40;
     var Legend_height = 15;
     var text_width = 80;
     var text_height = 23;
     var line_width = 40;
     var arrow_width = 10;

     for (i = 0; i < contents.params.Legend_colors.length; i++) {
       Legend_rect.enter().append("rect")  //每个rect大小
                  .attr("x", (Legend_width + text_width) * i)
                  .attr("y", 0.5 * margin.bottom)
                  .attr("rx",50)
                  .attr("ry",50)
                  .attr("class", "Legendrect")
                  .attr("width", Legend_width)
                  .attr("height", Legend_height)
                  .style("fill",contents.params.Legend_colors[i]);

       Legend_rect.enter().append("text")
                  .attr("class", "Legendtexts")
                  .text(contents.params.gene_type[i])
                  .attr("x",(Legend_width + text_width) * i + Legend_width + 7)
                  .attr("y",Legend_height * 0.5 + 0.5 * margin.bottom + 5)
                  // .style("font-weight",600)
                  .style("font-size","17px");
     }

     Legend_rect.enter()
                .append("line")
                .attr("x1",(Legend_width + text_width) * contents.params.gene_type.length)
                .attr("y1",Legend_height * 0.5 + 0.5 * margin.bottom)
                .attr("x2",(Legend_width + text_width) * contents.params.gene_type.length + line_width)
                .attr("y2",Legend_height * 0.5 + 0.5 * margin.bottom)
                .attr("stroke","black")
                .attr("stroke-width",2);

     Legend_rect.enter().append("text")  //横线text
                .attr("class", "Legendtexts")
                .text("Intron")
                .attr("x",(Legend_width + text_width) * contents.params.gene_type.length + Legend_width + 7)
                .attr("y",Legend_height * 0.5 + 0.5 * margin.bottom + 5)
                // .style("font-weight",600)
                .style("font-size","17px");

    //Indel图标
    var symbolGenerator = d3.svg.symbol()
                              .type(d3.svg.symbolTypes[2])
                              .size(100);
    // var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'];
    var datapath = symbolGenerator();
    Legend_rect.enter()
               .append('path')
               .attr('transform','translate(' + ((Legend_width + text_width) * (contents.params.gene_type.length + 1) + arrow_width + text_width) + ', '+ (Legend_height * 0.5 + 0.5 * margin.bottom) +')')
               .attr('d', datapath)
               .style("fill",contents.params.indel_color)

     Legend_rect.enter()
                .append("text")  //横线text
                .attr("class", "Legendtexts")
                .text("SNP")
                .attr("x",(Legend_width + text_width) * contents.params.gene_type.length + arrow_width + text_width + Legend_width + 7)
                .attr("y",Legend_height * 0.5 + 0.5 * margin.bottom + 5)
                // .style("font-weight",600)
                .style("font-size","17px");

     //SNP图标
     var symbolGenerator = d3.svg.symbol()
                             .type(d3.svg.symbolTypes[5])
                             .size(100);
     // var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'];
     var datapath = symbolGenerator();
     Legend_rect.enter()
                .append('path')
                .attr('transform','translate(' + ((Legend_width + text_width) * (contents.params.gene_type.length + 1)) + ', '+ (Legend_height * 0.5 + 0.5 * margin.bottom) +')rotate(-180)')
                .attr('d', datapath)
                .style("fill",contents.params.snp_color)

     Legend_rect.enter()
                .append("text")  //横线text
                .attr("class", "Legendtexts")
                .text("Indel")
                .attr("x",(Legend_width + text_width) * contents.params.gene_type.length + (arrow_width + text_width) * 2 + Legend_width + 7)
                .attr("y",Legend_height * 0.5 + 0.5 * margin.bottom + 5)
                // .style("font-weight",600)
                .style("font-size","17px");

                d3.select('.axis').selectAll('.tick line').attr('stroke', '#000').attr('fill', 'none');
                d3.select('.axis').select('path').attr('stroke', '#000').attr('fill', 'none');
  }
}
