jQuery.noref_heatmap = {
  show_noref_heatmap:function(container,contents)
  {
    var margin = { top: 80, right: 60, bottom: 100, left: 180 },
        width = contents.size.width - margin.left - margin.right,
        height = contents.size.height - margin.top - margin.bottom;

    var svg = d3.select('#'+container).append("svg").attr("width",width + margin.left + margin.right).attr("height",height + margin.top + margin.bottom);

    var tooltip = d3.select("body").append("div")
                    .attr("class","tooltip") /*用于css设置类样式*/
                    .attr("opacity",1)
                    .style("visibility","hidden"); /*默认div不显示。*/

    svg.append("rect")
       .attr("class", "background")
       .attr("x", 0)
       .attr("y", 0)
       .attr("width",width + margin.left + margin.right)
       .attr("height",height + margin.top + margin.bottom)
       .style("fill", "#ffffff");

    var data = contents.datas.data,
    color = contents.params.color
    rect_data = [];

    g = svg.append("g").attr("transform","translate("+ margin.left +","+ margin.top +")");

    for (var i = 0; i < data.length; i++) {
      var rect_color;

      if (data[i] == "A") {
        rect_color = color[0]
      }
      else if (data[i] == "T") {
        rect_color = color[1]
      }
      else if (data[i] == "G") {
        rect_color = color[2]
      }
      else if (data[i] == "C") {
        rect_color = color[3]
      }
      else if (data[i] == "N") {
        rect_color = color[4]
      }
      rect_data.push(rect_color)
    }

    var squs = g.append("g")
                .attr("class","rect")
                .selectAll(".xamounts")
                .data(rect_data);

    var gridSizeX = data.length >50 ? width / data.length : width / 50,
    squs_height = 24,
    y_height = 10;

    for (var i = 0; i < data.length; i++) {
     squs.enter()
         .append("rect")
         .attr("x", function(d,i) { return i * (gridSizeX); })
         .attr("y", y_height)
         .attr("class", "every rect")
         .attr("width", gridSizeX - 2)
         .attr("height", squs_height)
         .style("fill", function(d,i) { return d;})
    }

    var line_height = squs_height + y_height + 10,
    line_width = gridSizeX * data.length - 1;
    var line = g.append("line")
                .attr("x1", 0)
                .attr("y1", line_height)
                .attr("x2", line_width)
                .attr("y2", line_height)
                .attr("stroke", "black")
                .attr("stroke-width", 2);

    var arrow_path_left = "M"+(10+margin.left-10)+","+(0+margin.top+line_height-5)+" L"+(2+margin.left-10)+","+(5+margin.top+line_height-5)+ " L"+(10+margin.left-10)+","+(10+margin.top+line_height-5),    /* "M10,2 L2,6 L10,10" */
    arrow_path_right = "M"+(2+margin.left-5+line_width+3)+","+(0+margin.top+line_height-5)+" L"+(10+margin.left-5+line_width+3)+","+(5+margin.top+line_height-5)+ " L"+(2+margin.left-5+line_width+3)+","+(10+margin.top+line_height-5);   /* "M2,2 L10,6 L2,10 L6,6 L2,2" */
    svg.append("path")
			 .attr("d", arrow_path_left)
			 .attr("fill", "black");

    svg.append("path")
			 .attr("d", arrow_path_right)
			 .attr("fill", "black");

    svg.append("text")
       .attr("class", "text-location")
       .text("Location")
       .attr("x", 0)
       .attr("y", 0)
       .attr("transform", "translate("+ (margin.left - 58) +", "+ (margin.top + squs_height + y_height + 12) +")")
       .style("font-size", "12px");

    svg.append("text")
       .attr("class", "text-bp")
       .text(data.length + " bp")
       .attr("x", 0)
       .attr("y", 0)
       .attr("transform", "translate("+ (line_width + margin.left + 13) +", "+ (margin.top + squs_height + y_height + 12) +")")
       .style("font-size", "12px");

    svg.append("text")
       .attr("class", "text-Tag")
       .text("Tag ID:" + (contents.params.tag_id).toString())
       .attr("x", 0)
       .attr("y", 0)
       .attr("transform", "translate("+ (0) +", "+ (margin.top + squs_height + y_height) +")")
       // .attr("transform", "translate("+ (margin.left - 70) +", "+ (margin.top + squs_height + y_height + 12 + 50) +")")
       .style("font-size", "19px");

   var lab_color = [];
   for (var i = 0; i < color.length - 1; i++) {
     lab_color.push(color[i])
   }
   var labs = g.append("g")
               .attr("class","lab")
               .selectAll(".xamounts")
               .data(lab_color);

   var lab_X = (width - margin.right - margin.left) / color.length / 1.5,
   gridSize_lab = width / 70,
   squs_height_lab = 20;


   for (var i = 0; i < color.length; i++) {
    labs.enter()
        .append("rect")
        .attr("x", function(d,i) { return i * (lab_X); })
        .attr("y", y_height + 12 + 50 + 7 + 1)
        .attr("class", "lab")
        .attr("width", gridSize_lab - 2)
        .attr("height", squs_height_lab)
        .style("fill", function(d,i) { return d;})
   }

   var symbolGenerator = d3.svg.symbol()
                             .type(d3.svg.symbolTypes[5])
                             .size(80);
   /* var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'];*/
   var datapath = symbolGenerator();
   labs.enter()
       .append('path')
       .attr('transform','translate(' + (lab_X * 5) + ', '+ (y_height + 12 + 50 + 7 + 11) +')rotate(180)')
       .attr('d', datapath)
       .style("fill", color[5])

   var snp_data = contents.datas.SNP;
   var snp = g.append("g")
              .attr("class","snp")
              .selectAll(".xamounts")
              .data(snp_data);

   for (var i = 0; i < color.length; i++) {
     if (contents.params.is_tooltip == 0) {
       snp.enter()
          .append('path')
          .attr('transform', function(d){return 'translate(' + (d[0] * gridSizeX + (gridSizeX - 2) * 0.5) + ', '+ (0) +')rotate(180)';})
          .attr('d', datapath)
          .style("fill", color[5])
     }
     else if (contents.params.is_tooltip == 1) {
       snp.enter()
          .append('path')
          .attr('transform', function(d){return 'translate(' + (d[0] * gridSizeX + (gridSizeX - 2) * 0.5) + ', '+ (0) +')rotate(180)';})
          .attr('d', datapath)
          .style("fill", color[5])
          .on("mouseover", function(d,i) {
                            var page_x = d3.event.pageX - 20;
                            var page_y = d3.event.pageY - 45;/*标签位置。*/
                            timeout = setTimeout(function() {
                              tooltip.html(d[1])
                              .style("left",page_x+"px")
                              .style("top",page_y+"px")
                              .style("opacity",1.5)
                              .style("border-color", color[5])
                              .style("visibility","visible")  /*将tool的div设置为显示。*/
                              .style('padding', '5px')
                              .style("font-size","15px");},50);})
                            .on('mouseout', function() {
                              clearTimeout(timeout);
                              d3.select('.tooltip').style('opacity', 0);});
     }

     }

   var tag_text = ["A", "T", "G", "C", "N", "SNP"];
   var tags = g.append("g")
               .attr("class","tags")
               .selectAll(".xamounts")
               .data(tag_text);

   for (var i = 0; i < tag_text.length; i++) {
     tags.enter()
         .append("text")
         .attr("class", "text-Tag")
         .text(function(d,i) { return d;})
         .attr("x", function(d,i) { return i * (lab_X) + 0.02 * contents.size.width; })
         .attr("y", y_height + 12 + 50 + squs_height)
         .attr("transform", "translate(0,0)")
         .style("font-size", "17px");
   }

   svg.append("text")
      .attr("class", "text-title")
      .text(contents.params.title)
      .attr("x", 0)
      .attr("y", 0)
      .attr('text-anchor', 'middle')
      .attr("transform", "translate("+ (contents.size.width * 0.5) +", "+ (margin.top * 1/2) +")")
      .style("font-size", "22px");

  d3.select("body").append("p")
  // d3.select('p').style('color', 'blue')
  }
}
