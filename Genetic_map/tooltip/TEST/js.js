jQuery.BSA_linechart = {
   show_BSA_linechart:function(container,contents)
  {
    var margin = { top: 130, right: 80, bottom: 100, left: 120 },
        width = contents.size.width - margin.left - margin.right,
        height = contents.size.height - margin.top - margin.bottom;

    var svg = d3.select('#'+container).append("svg").attr("width",width + margin.left + margin.right).attr("height",height + margin.top + margin.bottom);

    g = svg.append("g").attr("class","frame").attr("transform","translate("+ margin.left +","+ margin.top +")");

    var tooltip = d3.select("body").append("div")
                    .attr("class","tooltip")   /* 用于css设置类样式 */
                    .attr("opacity",1)
                    .style("visibility","hidden"); /* 默认div不显示。*/

    var yScaleMaxValue = 0;
    for (i = 0; i < contents.categories.length; i++) {
        var chri_length = contents.datas[i].values.length;
        var chri = contents.datas[i];
        for (m = 0; m < chri_length; m++) {
            var chri_value = chri.values[m];
            if (chri_value > yScaleMaxValue) {
                yScaleMaxValue = chri_value;
              }
            }
          }

    var space = width / (contents.categories.length * (1.5 + 1) - 1);  /* 每个柱子间的间距，柱子之间间隔1.5个柱子大小。*/

//    var inner_color = contents.params.inner_color;  /* 每个柱子颜色。*/

    /*彩虹色*/
    var chrlength = contents.categories.length;
    var color_r = 0;
    var color_g = 0;
    var color_b = 0;
    var color_r_list = [];
    var color_g_list = [];
    var color_b_list = [];

    var count_a = chrlength - Math.round(chrlength / 6 * 5);
    var count_b = chrlength - Math.round(chrlength / 6 * 4);
    var count_c = chrlength - Math.round(chrlength / 6 * 3);
    var count_d = chrlength - Math.round(chrlength / 6 * 2);
    var count_e = chrlength - Math.round(chrlength / 6 * 1);
    var count_f = chrlength;

    for (var i = 0; i < count_a; i++) {
        color_r = 255;
        color_g = 0 + 165 * (i / count_a);
        color_b = 0;
        color_r_list.push(color_r);
        color_g_list.push(color_g);
        color_b_list.push(color_b);
      }

    for (var i = count_a; i < count_b; i++) {
        color_r = 255;
        color_g = 165 + 90 * (i - count_a) / (count_b - count_a);
        color_b = 0;
        color_r_list.push(color_r);
        color_g_list.push(color_g);
        color_b_list.push(color_b);
      }

    for (var i = count_b; i < count_c; i++) {
        color_r = 255 - 255 * (i - count_b) / (count_c - count_b);
        color_g = 255;
        color_b = 0;
        color_r_list.push(color_r);
        color_g_list.push(color_g);
        color_b_list.push(color_b);
      }

    for (var i = count_c; i < count_d; i++) {
        color_r = 0;
        color_g = 255;
        color_b = 0 + 255 * (i - count_c) / (count_d - count_c);
        color_r_list.push(color_r);
        color_g_list.push(color_g);
        color_b_list.push(color_b);
      }

    for (var i = count_d; i < count_e; i++) {
        color_r = 0;
        color_g = 255 - 255 * (i - count_d) / (count_e - count_d);
        color_b = 255;
        color_r_list.push(color_r);
        color_g_list.push(color_g);
        color_b_list.push(color_b);
      }

    for (var i = count_e; i < count_f; i++) {
        color_r = 0 + 255 * (i - count_e) / (count_f - count_e);
        color_g = 0;
        color_b = 255;
        color_r_list.push(color_r);
        color_g_list.push(color_g);
        color_b_list.push(color_b);
      }

    var yScale = d3.scale.linear()
                         .domain([contents.params.axis_start,contents.params.axis_end])   /*定义域：x轴的坐标刻度。*/
                         .range([0,height]);  /*值域：x轴的长度。*/

    /*定义一个坐标轴*/
    var yAxis = d3.svg.axis()   /*坐标轴位置。*/
                  .scale(yScale)  /*坐标轴大小。*/
                  .ticks(4)
                  .orient('left');

    g.append("g")
                 .attr("class","axis")
                 .call(yAxis)
                 .attr("transform","translate(-20,0)")
                 .style("stroke-width",2)   /*设置坐标轴粗细。*/
                 .style("font-size","12px");  /*设置文字大小*/

   for (i = 0; i < contents.categories.length; i++) {
       var chri_maxvalue = 0;
       var chri_length = contents.datas[i].values.length;
       var chri = contents.datas[i];
       for (m = 0; m < chri_length; m++) {
           var chri_value = chri.values[m];
           if (chri_value > chri_maxvalue) {
               chri_maxvalue = chri_value;
             }
           }

    /*添加椭圆。*/
     g.append("rect")
                  .attr("x",i * space * 2.5)
                  .attr("y", -20)
                  .attr("rx",100)
                  .attr("ry",100)
                  .attr("width",space)
                  .attr("height",40)
                  .attr("stroke","white")
                  .attr("stroke-width",2)
                  .style("fill","rgb(" + color_r_list[i] + "," + color_g_list[i] + "," + color_b_list[i] + ")")
                  .style("opacity",0.3)

    g.append("rect")
                 .attr("x",i * space * 2.5)
                 .attr("y", height / yScaleMaxValue * chri_maxvalue -20)
                 .attr("rx",100)
                 .attr("ry",100)
                 .attr("width",space)
                 .attr("height",40)
                 .attr("stroke","white")
                 .attr("stroke-width",2)
                 .style("fill","rgb(" + color_r_list[i] + "," + color_g_list[i] + "," + color_b_list[i] + ")")
                 .style("opacity",0.3)

    /*白色底，挡住上面两个半圆*/
    g.append("rect")
                 .attr("x",i * space * 2.5)
                 .attr("y", 0)
                 .attr("width",space)
                 .attr("height",height / yScaleMaxValue * chri_maxvalue)
                 .attr("stroke","white")
                 .style("fill","white")

     g.append("rect")
                  .attr("x",i * space * 2.5)
                  .attr("y", 0)
                  .attr("width",space)
                  .attr("height",height / yScaleMaxValue * chri_maxvalue)
                  .attr("stroke","rgb(" + color_r_list[i] + "," + color_g_list[i] + "," + color_b_list[i] + ")")
                  .style("fill","rgb(" + color_r_list[i] + "," + color_g_list[i] + "," + color_b_list[i] + ")")
                  .style("opacity",0.3)

     g.append("text")
                  .text(contents.categories[i])
                  .attr("x",i * space * 2.5 + space * 0.5)
                  .attr("y",- 0.3 * margin.top)
                  .attr("transform","translate(0,0)")
                  .attr('text-anchor', 'middle')
                  .style("font-weight",600)
                  .style("font-size","15px");
      }

  /*画中间颜色*/
   g = svg.append("g").attr("class","inner_color").attr("transform","translate("+ margin.left +","+ margin.top +")");

   for (i = 0; i < contents.categories.length; i++) {
       var chr_name = contents.datas[i].name;
       var chri_maxvalue = 0;
       var chri_length = contents.datas[i].values.length;
       var chri = contents.datas[i];
       for (m = 0; m < chri_length; m++) {
           var chri_value = chri.values[m];
           if (chri_value > chri_maxvalue) {
               chri_maxvalue = chri_value;
             }
           }
       for (m = 0; m < chri_length; m++) {

       var pointvalue = contents.datas[i].values[m];

       var list_tooltip = [contents.datas[i].values[m],contents.datas[i].name,color_r_list[i],color_g_list[i],color_b_list[i]];

       var symbolpath = g.selectAll(".rectamounts")
                         .data([list_tooltip]);

       if (pointvalue < chri_maxvalue) {
           symbolpath.enter()
                     .append("rect")
                     .attr("x",i * space * 2.5 + 1)
                     .attr("y", height * pointvalue / yScaleMaxValue)
                     .attr("width",space - 2)
                     .attr("height",2)
                     .style("fill","rgb(" + color_r_list[i] + "," + color_g_list[i] + "," + color_b_list[i] + ")")
                     .style("opacity",0.4)
                     .on("mouseover", function(d,i) {
                                       var page_x = d3.event.pageX - 84;
                                       var page_y = d3.event.pageY - 50;/*标签位置。*/
                                       timeout = setTimeout(function() {
                                           tooltip.html(d[1]+":"+d[0])
                                           .style("left",page_x+"px")
                                           .style("top",page_y+"px")
                                           .style("opacity",1.5)
                                           .style("border-color", "rgb(" + d[2] + "," + d[3] + "," + d[4] + ")")
                                           .style("visibility","visible")  /*将tool的div设置为显示。*/
                                           .style('padding', '5px')
                                           .style("font-size","15px");},50);})
                                     .on('mouseout', function() {
                                         clearTimeout(timeout);
                                         d3.select('.tooltip').style('opacity', 0);});
       }
     }
   }


   /*添加SNP及tooltip*/
   var symbolGenerator = d3.svg.symbol()
                           .type(d3.svg.symbolTypes[5])
                           .size(100);
   /* var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'];*/

   var datapath = symbolGenerator();

   for (i = 0; i < contents.datas.length; i++) {
       var g = svg.append("g")
                  .attr("transform","translate("+ margin.left +","+ margin.top +")");
       for (m = 0; m < contents.datas[i].snp_value.length; m++) {
           var test_multi_line_location = contents.datas[i].snp_value[m];
           var select_test_multi_line_value = contents.datas[i].snp_value;
           var list_tooltip2 = [contents.datas[i].snp_value[m],color_r_list[i],color_g_list[i],color_b_list[i]];

           var symbolpath = g.selectAll(".rectamounts")
                             .data([list_tooltip2]);

                 symbolpath.enter().append('path')
                 .attr('transform','translate(' + (i * space * 2.5 + space * 1 + 10) + ', '+ (test_multi_line_location * height / yScaleMaxValue) +')rotate(-90)')
                 .attr('d', datapath)
                 .style("fill","white")
                 .on("mouseover", function(d,i) {
                                   var page_x = d3.event.pageX - 64;
                                   var page_y = d3.event.pageY - 50;  /*标签位置。*/
                                   timeout = setTimeout(function() {
                                       tooltip.html('SNP:'+d[0])
                                       .style("left",page_x+"px")
                                       .style("top",page_y+"px")
                                       .style("opacity",1.5)
                                       .style("border-color", "rgb(" + d[1] + "," + d[2] + "," + d[3] + ")")
                                       .style("visibility","visible")  /*将tool的div设置为显示。*/
                                       .style('padding', '5px')
                                       .style("font-size","15px");},50);})
                                   .on('mouseout', function() {
                                       clearTimeout(timeout);
                                       d3.select('.tooltip').style('opacity', 0);});
               }
             }


    /*文字*/
    g.append("text")
                  .text(contents.params.text_title)
                  .attr("x",1 / 2 * width)
                  .attr("y",- 0.6 * margin.top)
                  .attr("transform","translate(0,0)")
                  .attr('text-anchor', 'middle')
                  .style("font-weight",600)
                  .style("font-size","30px");

    g.append('text')
                  .text(contents.params.y_title)
                  .attr('transform', "translate("+(- 0.5 * margin.left -  10)+", "+(1/2 * height)+")rotate(-90)")
                  .attr('text-anchor', 'middle')
                  .style("font-weight",600)
                  .style("font-size","30px");

    d3.select('.axis').selectAll('.tick line').attr('stroke', '#000').attr('fill', 'none');
    d3.select('.axis').select('path').attr('stroke', '#000').attr('fill', 'none');
  }
}
