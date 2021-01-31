jQuery.BSA_linechart = {
  show_BSA_linechart:function(container,contents)
  {
    var margin = { top: 100, right: 80, bottom: 100, left: 120 },
        width = contents.size.width - margin.left - margin.right,
        // height = contents.size.height - margin.top - margin.bottom;
        height = contents.size.height * contents.categories.length * 2;

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

    var x_start = contents.params.x_start;
    var x_end = contents.params.x_end;
    var xScaleMaxValue = 0;
    for (i = 0; i < data.length; i++) {
      var chr_data = data[i];
      var chr_data_length = data[i].values.length;
      for (x = 0; x < chr_data_length; x++) {
        var point_value = chr_data.values[x][1];
        if (point_value > xScaleMaxValue) {
          xScaleMaxValue = point_value;
        }
      }
    }

    var chramount = contents.categories.length;
    var gridSizeX = width / (x_end - x_start);
    // var gridSizeY = height / chramount / 2;
    var gridSizeY = contents.size.height;
    var gridSizeSpace = gridSizeY;
    // if (gridSizeY > 20) {
    //   gridSizeY = 25
    // }

    var Legend_colors = contents.params.Legend_colors;
    if (contents.params.Legend_colors.length == 0) {
      Legend_colors = ["#00BFFF","#FFD700","#FF69B4","#808080","#FFF000","#FFFF00"];
    }

    var colors = {};
      for (i = 0; i < contents.params.legend.length; i++) {
        colors[contents.params.legend[i]] = Legend_colors[i];
      }

    var xScale = d3.scale.linear()
                   .domain([x_start,x_end])   /*定义域：x轴的坐标刻度。*/
                   .range([0,width]);  /*值域：x轴的长度。*/

    /*定义一个坐标轴*/
    var xAxis = d3.svg.axis()   /*坐标轴位置。*/
                  .scale(xScale)  /*坐标轴大小。*/
                  .ticks(10)
                  .orient('bottom')
                  .tickFormat(function(v) { return (v / 1000).toFixed(2) ;}); /*保留两位小数*/

    /*在svg中添加g元素并绘制。*/
     g.append("g")
                  .attr("class","axis")
                  .call(xAxis)
                  .attr("transform","translate(0," + (height) + ")")/*坐标轴的位置。*/
                  .style("stroke-width",2)  /*设置坐标轴粗细。*/
                  .style("font-size","12px")   /*大小*/
                  .style("font-family","arial")  /*字体*/
                  .style("font-weight",700);  /*加粗*/

      /*画横线*/
      for (i = 0; i < data.length; i++) {
        var dataMaxpoint_i = 0;
        var datalength_i = data[i].values.length;
        for (x = 0; x < datalength_i; x++) {
          var data_point = data[i].values[x][1];
          if (data_point > dataMaxpoint_i) {
            dataMaxpoint_i = data_point;
          }
        }

        var line = g.append("line")
               .attr("x1",0)   /*x从哪里开始。*/
               .attr("y1",gridSizeSpace * 2 * i + 1 / 2 * gridSizeSpace)
               .attr("x2",(dataMaxpoint_i - x_start) / (x_end - x_start) * width)   /*x从哪里结束;要按比例来。*/
               .attr("y2",gridSizeSpace * 2 * i + 1 / 2 * gridSizeSpace)
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
      var color_select = colors[type_select];

      var linearGradient = cards.enter().append("linearGradient")
      						.attr("id","linearColor" + m + i)   /*用循环中的变量m，i来表达不同的url。*/
      						.attr("x1","0%")
      						.attr("y1","50%")
      						.attr("x2","0%")
      						.attr("y2","0%");   /*从左到右渐变 从上到下渐变。*/

      var stop1 = linearGradient.append("stop")
      				.attr("offset","0%")
      				.style("stop-color",color_select);

      var stop2 = linearGradient.append("stop")
      				.attr("offset","100%")
      				.style("stop-color","#FFFFFF");

     cards.enter()   /*每个格子。*/
          .append("rect")  /*每个rect大小*/
          .attr("x", (x_value - x_start) * gridSizeX)
          .attr("y", (gridSizeSpace * 2 * m + 1 / 2 * (gridSizeSpace - gridSizeY)))
          .attr("rx",20)
          .attr("ry",20)
          .attr("class", "every rect")
          .attr("width", d_value * gridSizeX)
          .attr("height", gridSizeY) /*格子大小*/
          .style("fill","url(#" + linearGradient.attr("id") + ")"); /*注：URL不能一样，同一个url只能是一个颜色。*/
    }
  }

    /*y轴标题*/
    var chrtext = g.selectAll(".textchr")
                 .data(contents.categories);

      chrtext.enter()
      .append("text")
             .attr("class", "mono")
             .text(function(d,i) { return d; })
             .attr("x",-20)
             .attr("y", function(d,i) { return gridSizeSpace * i * 2 + 1 / 2 * gridSizeSpace + 2; })
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
                    .attr("class","tooltip") /*用于css设置类样式*/
                    .attr("opacity",1)
                    .style("visibility","hidden"); /*默认div不显示。*/

    /*添加SNP及tooltip*/
      var symbolGenerator = d3.svg.symbol()
                              .type(d3.svg.symbolTypes[5])
                              .size(100);
    /* var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'];*/

    var datapath = symbolGenerator();

    if (contents.params.marker_colors.length == 0) {
      var marker1_color = "#6495ED";
      var marker2_color = "#90EE90";
    }
    else {
      var marker1_color = contents.params.marker_colors[0];
      var marker2_color = contents.params.marker_colors[1];
    }

    for (i = 0; i < data.length; i++) {
         var g = svg.append("g")
                    .attr("transform","translate("+ margin.left +","+ margin.top +")");
       for (m = 0; m < data[i].marker2.length; m++) {
         var marker2_location = data[i].marker2[m][0] - x_start;
         var select_marker2_value = data[i].marker2;

         var symbolpath = g.selectAll(".rectamounts")
                           .data([select_marker2_value[m]]);

                  symbolpath.enter().append('path')
                  .attr('transform','translate(' + (marker2_location / (x_end - x_start) * width) + ', '+ (gridSizeSpace * 2 * i + 1 / 2 * gridSizeSpace - 0.5 * gridSizeY - 7.7) +')rotate(-180)')
                  .attr('d', datapath)
                  .style("fill",marker2_color)
                  .on("mouseover", function(d,i) {
                                    var page_x = d3.event.pageX - 80;
                                    var page_y = d3.event.pageY - 80;/*标签位置。*/
                                    timeout = setTimeout(function() {
                                      tooltip.html('SNP:'+d[0]+"<br/>"+'ref:'+d[1]+"<br/>"+'alt:'+d[2])
                                      .style("left",page_x+"px")
                                      .style("top",page_y+"px")
                                      .style("opacity",1.5)
                                      .style("border-color", marker2_color)
                                      .style("visibility","visible")  /*将tool的div设置为显示。*/
                                      .style('padding', '5px')
                                      .style("font-size","15px");},50);})
                                    .on('mouseout', function() {
                                      clearTimeout(timeout);
                                      d3.select('.tooltip').style('opacity', 0);});
                }
              }



    /*添加Indel及tooltip*/
      var symbolGenerator = d3.svg.symbol()
                              .type(d3.svg.symbolTypes[2])
                              .size(100);
    /* var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'];*/

    var datapath = symbolGenerator();

    for (i = 0; i < data.length; i++) {
         var g = svg.append("g")
                    .attr("transform","translate("+ margin.left +","+ margin.top +")");
       for (m = 0; m < data[i].marker1.length; m++) {
         var indel_location = data[i].marker1[m][0] - x_start;

         var select_marker1 = data[i].marker1;

         var symbolpath = g.selectAll(".rectamounts")
                           .data([select_marker1[m]]);

                  symbolpath.enter().append('path')
                  .attr('transform','translate(' + (indel_location / (x_end - x_start) * width) + ', '+ (gridSizeSpace * 2 * i + 1 / 2 * gridSizeSpace - 0.5 * gridSizeY - 9.3) +')')
                  .attr('d', datapath)
                  .style("fill",marker1_color)
                  .on("mouseover", function(d,i) {
                                    var page_x = d3.event.pageX - 80;
                                    var page_y = d3.event.pageY - 80;/*标签位置。*/
                                    timeout = setTimeout(function() {
                                      tooltip.html('Indel:'+d[0]+"<br/>"+'ref:'+d[1]+"<br/>"+'alt:'+d[2])
                                      .style("left",page_x+"px")
                                      .style("top",page_y+"px")
                                      .style("opacity",1.5)
                                      .style("border-color", marker1_color)
                                      .style("visibility","visible")  /*将tool的div设置为显示。*/
                                      .style('padding', '5px')
                                      .style("font-size","15px");},50);})
                                    .on('mouseout', function() {
                                      clearTimeout(timeout);
                                      d3.select('.tooltip').style('opacity', 0);});
                }
              }

     /*图例*/
     var g = svg.append("g")
                .attr("transform","translate("+ margin.left +","+ (height + margin.top) +")");

     var Legend_rect = g.selectAll(".Legendrect")
                        .data([Legend_colors]);

     var Legend_width = 40;
     var Legend_height = 15;
     var text_width = 80;
     var text_height = 23;
     var line_width = 40;
     var arrow_width = 10;

     for (i = 0; i < contents.params.legend.length; i++) {
       Legend_rect.enter().append("rect")  /*每个rect大小*/
                  .attr("x", (Legend_width + text_width) * i)
                  .attr("y", 0.5 * margin.bottom)
                  .attr("rx",50)
                  .attr("ry",50)
                  .attr("class", "Legendrect")
                  .attr("width", Legend_width)
                  .attr("height", Legend_height)
                  .style("fill",Legend_colors[i]);

       Legend_rect.enter().append("text")
                  .attr("class", "Legendtexts")
                  .text(contents.params.legend[i])
                  .attr("x",(Legend_width + text_width) * i + Legend_width + 7)
                  .attr("y",Legend_height * 0.5 + 0.5 * margin.bottom + 5)
                  .style("font-size","17px");
     }

     Legend_rect.enter()
                .append("line")
                .attr("x1",(Legend_width + text_width) * contents.params.legend.length)
                .attr("y1",Legend_height * 0.5 + 0.5 * margin.bottom)
                .attr("x2",(Legend_width + text_width) * contents.params.legend.length + line_width)
                .attr("y2",Legend_height * 0.5 + 0.5 * margin.bottom)
                .attr("stroke","black")
                .attr("stroke-width",2);

     Legend_rect.enter().append("text")  /*横线text*/
                .attr("class", "Legendtexts")
                .text("Intron")
                .attr("x",(Legend_width + text_width) * contents.params.legend.length + Legend_width + 7)
                .attr("y",Legend_height * 0.5 + 0.5 * margin.bottom + 5)
                .style("font-size","17px");

    if (contents.params.indel_is_show == 1) {
      if (contents.params.snp_is_show == 1) {
        /*Indel图标*/
        var symbolGenerator = d3.svg.symbol()
                                  .type(d3.svg.symbolTypes[2])
                                  .size(100);
        /* var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'];*/
        var datapath = symbolGenerator();
        Legend_rect.enter()
                   .append('path')
                   .attr('transform','translate(' + ((Legend_width + text_width) * (contents.params.legend.length + 1) + arrow_width + text_width) + ', '+ (Legend_height * 0.5 + 0.5 * margin.bottom) +')')
                   .attr('d', datapath)
                   .style("fill",marker1_color)

       Legend_rect.enter()
                  .append("text")  /*横线text*/
                  .attr("class", "Legendtexts")
                  .text("Indel")
                  .attr("x",(Legend_width + text_width) * contents.params.legend.length + (arrow_width + text_width) * 2 + Legend_width + 7)
                  .attr("y",Legend_height * 0.5 + 0.5 * margin.bottom + 5)
                  .style("font-size","17px");
      }
      else {
        /*Indel图标*/
        var symbolGenerator = d3.svg.symbol()
                                  .type(d3.svg.symbolTypes[2])
                                  .size(100);
        /* var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'];*/
        var datapath = symbolGenerator();
        Legend_rect.enter()
                   .append('path')
                   .attr('transform','translate(' + ((Legend_width + text_width) * (contents.params.legend.length + 1)) + ', '+ (Legend_height * 0.5 + 0.5 * margin.bottom) +')')
                   .attr('d', datapath)
                   .style("fill",marker1_color)

       Legend_rect.enter()
                  .append("text")  /*横线text*/
                  .attr("class", "Legendtexts")
                  .text("Indel")
                  .attr("x",(Legend_width + text_width) * contents.params.legend.length + arrow_width + text_width + Legend_width + 7)
                  .attr("y",Legend_height * 0.5 + 0.5 * margin.bottom + 5)
                  .style("font-size","17px");
      }

    }

    if (contents.params.snp_is_show == 1) {
      /*SNP图标*/
      var symbolGenerator = d3.svg.symbol()
                              .type(d3.svg.symbolTypes[5])
                              .size(100);
      /* var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'];*/
      var datapath = symbolGenerator();
      Legend_rect.enter()
                 .append('path')
                 .attr('transform','translate(' + ((Legend_width + text_width) * (contents.params.legend.length + 1)) + ', '+ (Legend_height * 0.5 + 0.5 * margin.bottom) +')rotate(-180)')
                 .attr('d', datapath)
                 .style("fill",marker2_color)

     Legend_rect.enter()
                .append("text")  /*横线text*/
                .attr("class", "Legendtexts")
                .text("SNP")
                .attr("x",(Legend_width + text_width) * contents.params.legend.length + arrow_width + text_width + Legend_width + 7)
                .attr("y",Legend_height * 0.5 + 0.5 * margin.bottom + 5)
                .style("font-size","17px");


    }
    d3.select('.axis').selectAll('.tick line').attr('stroke', '#000').attr('fill', 'none');
    d3.select('.axis').select('path').attr('stroke', '#000').attr('fill', 'none');
  }
}
