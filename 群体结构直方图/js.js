jQuery.bar_chart = {
  show_bar_chart:function(container,contents)
  {
    var svg = d3.select("svg"),
    margin = {top: 80, right: 80, bottom: 90, left: 80},
    width = contents.size.width - margin.left - margin.right,
    height = contents.size.height - margin.bottom;
    svg_height = (height + margin.bottom)* contents.datas.length - margin.top;
    var svg = d3.select('#'+container).append("svg").attr("width",width + margin.left + margin.right).attr("height",svg_height + margin.top + margin.bottom);

    svg.append("rect")
       .attr("class", "background")
       .attr("x", 0)
       .attr("y", 0)
       .attr("width",width + margin.left + margin.right)
       .attr("height",height + margin.top + margin.bottom)
       .style("fill", "#ffffff");

    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                  console.log(d);
                  // return "<strong>XXtt:</strong> <span style='color:red'>" + d.data + "</span>";
                  return "<span style='color:red'>" + d.data + "</span>";
                })

    svg.call(tip);

    var data = contents.datas;
    var sample_length = contents.params.categories.length;
    // var bar_width = width / sample_length / 2;  /* 有间隙*/
    var bar_width = width / sample_length;    /* 无间隙*/
    var color = contents.params.colors;

    var xScale = d3.scale.linear()
                         .domain([0,sample_length])
                         .range([0,width]);

    var yScale = d3.scale.linear()
                         .domain([1,0])
                         .range([0,height]);

    var yAxis = d3.svg.axis()   /*坐标轴位置。*/
                  .scale(yScale)  /*坐标轴大小。*/
                  .ticks(5)
                  .orient('left');

    for (var k = 0; k < data.length; k++) {
      g = svg.append("g").attr("class","frame"+k).attr("transform","translate("+ margin.left +","+ (margin.top + (height + margin.bottom) * k) +")");

      g.append("g")
                   .attr("class","axis")
                   .call(yAxis)
                   .attr("transform","translate(0,0)")
                   .style("stroke-width",2)   /*设置坐标轴粗细。*/
                   .style("font-size","12px");  /*设置文字大小*/

      g.append("text")
                    .text(contents.params.y_title)
                    .attr("x",0)
                    .attr("y",height/2)
                    .attr('text-anchor', 'middle')
                    .attr("transform","translate("+ (- height / 2 - margin.left / 2) +","+(height/2)+")rotate(-90)")
                    .style("font-size","15px");

      for (var i = 0; i < data[k].data.length; i++) {
        if (data[k].data[0]) {
          var yScale_data = 0;
          for (var m = 0; m < data[k].data[0].length; m++) {
            var yScale_data = yScale_data + data[k].data[i][m];
            var tooltip_color = color[m];
            var data_list = [{"data":data[k].data[i][m],"color":color[m]}];
            g.append("rect")
                         .data(data_list)
                         .attr("class","bar")
                         .attr("x", xScale(i+1))
                         .attr("y", yScale(yScale_data))
                         .attr("width",bar_width)
                         .attr("height",data[k].data[i][m] * height)  //每个方块height=2.
                         .attr("transform","translate("+ (- bar_width / 2 ) +",0)")
                         .style("fill",color[m])
                         .on('mouseover', tip.show)
                         .on('mouseout', tip.hide)
          }
        }
        g.append("text")
                      .text(contents.params.categories[i])
                      // .attr("x",xScale(i+1))
                      // .attr("y",height + 30)
                      .attr("transform", "translate("+(xScale(i+1) + 3)+","+(height + 10)+")rotate(-" + (90) + ")")
                      .attr('text-anchor', 'middle')
                      .style("font-size","8px");
      }
    }
    g = svg.append("g").attr("class","title");
    g.append("text")
                  .text(contents.params.title)
                  .attr("x",width / 2 + 17 * contents.params.title.length / 2)
                  .attr("y",margin.top/2)
                  .attr('text-anchor', 'middle')
                  .style("font-size","25px");


    d3.selectAll('.axis').selectAll('.tick line').attr('stroke', '#000').attr('fill', 'none');
    d3.selectAll('.axis').select('path').attr('stroke', '#000').attr('fill', 'none');
  }
}
