jQuery.insert_chart = {
  show_insert_chart:function(container,contents)
  {
    var svg = d3.select("svg"),
    margin = {top: 80, right: 50, bottom: 100, left: 50},
    width = contents.size.width - margin.left - margin.right,
    height = contents.size.height - margin.bottom - margin.top;
    var svg = d3.select('#'+container).append("svg").attr("width",width + margin.left + margin.right).attr("height",height + margin.top + margin.bottom);

    svg.append("rect")
       .attr("class", "background")
       .attr("x", 0)
       .attr("y", 0)
       .attr("width",width + margin.left + margin.right)
       .attr("height",height + margin.top + margin.bottom)
       .style("fill", "#ffffff");

   function draw_line() {
     g = svg.append("g").attr("class","line").attr("transform","translate("+ margin.left +","+ margin.top +")");

     g.append("line")
            .attr("class", "bottom")
            .attr("x1", -1/2*margin.left)   /*x从哪里开始。*/
            .attr("y1", contents.size.height-margin.top-margin.bottom)
            .attr("x2", contents.size.width-margin.left-margin.right+1/2*margin.left)   /*x从哪里结束;要按比例来。*/
            .attr("y2", contents.size.height-margin.top-margin.bottom)
            .attr("stroke","black")
            .attr("stroke-width",3);

     g.append("line")
            .attr("class", "bottom2")
            .attr("x1", -1/2*margin.left)   /*x从哪里开始。*/
            .attr("y1", contents.size.height-margin.top-margin.bottom-1/3*contents.size.height)
            .attr("x2", contents.size.width-margin.left-margin.right+1/2*margin.left)   /*x从哪里结束;要按比例来。*/
            .attr("y2", contents.size.height-margin.top-margin.bottom-1/3*contents.size.height)
            .attr("stroke","black")
            .attr("stroke-width",3);

    g.append("line")
           .attr("class", "right")
           .attr("x1", contents.size.width-margin.left-margin.right+1/2*margin.left)   /*x从哪里开始。*/
           .attr("y1", contents.size.height-margin.top-margin.bottom-1.1/3*contents.size.height)
           .attr("x2", contents.size.width-margin.left-margin.right+1/2*margin.left)   /*x从哪里结束;要按比例来。*/
           .attr("y2", contents.size.height-margin.top-margin.bottom)
           .attr("stroke","black")
           .attr("stroke-width",3);

   g.append("line")
          .attr("class", "left")
          .attr("x1", -1/2*margin.left)   /*x从哪里开始。*/
          .attr("y1", contents.size.height-margin.top-margin.bottom-1.1/3*contents.size.height)
          .attr("x2", -1/2*margin.left)   /*x从哪里结束;要按比例来。*/
          .attr("y2", contents.size.height-margin.top-margin.bottom)
          .attr("stroke","black")
          .attr("stroke-width",3);

  g.append("line")
         .attr("class", "left1")
         .attr("x1", (contents.size.width-margin.left-margin.right)*1/8)   /*x从哪里开始。*/
         .attr("y1", contents.size.height-margin.top-margin.bottom-1/6*contents.size.height)
         .attr("x2", (contents.size.width-margin.left-margin.right)*1/8)   /*x从哪里结束;要按比例来。*/
         .attr("y2", contents.size.height-margin.top-margin.bottom)
         .attr("stroke","black")
         .attr("stroke-width",3);

  g.append("line")
        .attr("class", "right1")
        .attr("x1", (contents.size.width-margin.left-margin.right)*7/8)   /*x从哪里开始。*/
        .attr("y1", contents.size.height-margin.top-margin.bottom-1/6*contents.size.height)
        .attr("x2", (contents.size.width-margin.left-margin.right)*7/8)   /*x从哪里结束;要按比例来。*/
        .attr("y2", contents.size.height-margin.top-margin.bottom)
        .attr("stroke","black")
        .attr("stroke-width",3);

    for (var i = 0; i < 6; i++) {
      g.append("line")
             .attr("class", "axis"+i)
             .attr("x1", (contents.size.width-margin.left-margin.right)*(i+2)/8)   /*x从哪里开始。*/
             .attr("y1", contents.size.height-margin.top-margin.bottom-5)
             .attr("x2", (contents.size.width-margin.left-margin.right)*(i+2)/8)   /*x从哪里结束;要按比例来。*/
             .attr("y2", contents.size.height-margin.top-margin.bottom)
             .attr("stroke","black")
             .attr("stroke-width",3);
    }
   }

   function draw_text() {
     t = svg.append("g").attr("class","text").attr("transform","translate("+ margin.left +","+ margin.top +")");

     t.append("text")
           .text(contents.params.upstream_seq_num)
           .attr("x", (contents.size.width-margin.left-margin.right)*1/8)
           .attr("y", contents.size.height-margin.top-margin.bottom+20)
           .attr('text-anchor', 'middle')
           .style("font-size","13px");

     t.append("text")
           .text(contents.params.downstream_seq_num)
           .attr("x", (contents.size.width-margin.left-margin.right)*7/8)
           .attr("y", contents.size.height-margin.top-margin.bottom+20)
           .attr('text-anchor', 'middle')
           .style("font-size","13px");

     if (contents.params.title_is_show == 1) {
       t.append("text")
             .text(contents.params.title)
             .attr("x", (contents.size.width-margin.left-margin.right)*0.5)
             .attr("y", contents.size.height-margin.top-margin.bottom-1/3*contents.size.height-10)
             .attr('text-anchor', 'middle')
             .style("font-size","18px");
     }

     if (contents.params.left_is_show == 1) {
       t.append("text")
             .text(contents.params.left_axis_title)
             .attr("x", margin.left)
             .attr("y", contents.size.height-margin.top-margin.bottom+50)
             .attr('text-anchor', 'middle')
             .style("font-size","18px");
     }

     if (contents.params.right_is_show == 1) {
       t.append("text")
             .text(contents.params.right_axis_title)
             .attr("x", (contents.size.width-margin.left-margin.right)*15/16)
             .attr("y", contents.size.height-margin.top-margin.bottom+50)
             .attr('text-anchor', 'middle')
             .style("font-size","18px");
     }

     t.append("text")
           .text(contents.params.chr_id)
           .attr("x", (contents.size.width-margin.left-margin.right)*1/2)
           .attr("y", contents.size.height-margin.top-margin.bottom+30)
           .attr('text-anchor', 'middle')
           .style("font-size","18px");
   }

   function draw_arrow() {
     var arrow_path_left = "M0,0 L15,-7 L15,7",
     arrow_path_right = "M15,0 L0,-7 L0,7";

     svg.append("path")
        .attr("d", arrow_path_left)
        .attr("fill", "black")
        .attr("transform","translate("+(1/2*margin.left)+","+(contents.size.height-margin.bottom-1/3*contents.size.height)+")");

     svg.append("path")
        .attr("d", arrow_path_right)
        .attr("fill", "black")
        .attr("transform","translate("+(contents.size.width-margin.right-15+1/2*margin.left)+","+(contents.size.height-margin.bottom-1/3*contents.size.height)+")");

   }

   function draw_bar() {
     b = svg.append("g").attr("class","bar").attr("transform","translate("+ margin.left +","+ margin.top +")");

     var left_bar_height = 0;
     var right_bar_height = 0;
     var bar_scale = (contents.size.width-margin.left-margin.right)*1/8;  /*比例*/
     for (var i = 0; i < contents.datas.left_data.length; i++) {
       if (contents.datas.left_data[i] > 200) {
         bar_len = 200
       }
       else {
         bar_len = contents.datas.left_data[i]
       }
       if (contents.datas.left_data.length > 13) {
         b.append("rect")
          .attr("x", (contents.size.width-margin.left-margin.right)*1/8-bar_scale/200*bar_len)
          .attr("y", contents.size.height-margin.top-margin.bottom-left_bar_height-(contents.size.height-margin.bottom-50)/contents.datas.left_data.length)
          .attr("class", "rect")
          .attr("width", bar_scale/200*bar_len)
          .attr("height", (contents.size.height-margin.bottom-50)/contents.datas.left_data.length)
          .style("fill", contents.params.color_left)
          .style("stroke", "white");
         left_bar_height += (contents.size.height-margin.bottom-50)/contents.datas.left_data.length;
       }
       else {
         b.append("rect")
          .attr("x", (contents.size.width-margin.left-margin.right)*1/8-bar_scale/200*bar_len)
          .attr("y", contents.size.height-margin.top-margin.bottom-left_bar_height-1/24*contents.size.height)
          .attr("class", "rect")
          .attr("width", bar_scale/200*bar_len)
          .attr("height", 1/24*contents.size.height)
          .style("fill", contents.params.color_left)
          .style("stroke", "white");
         left_bar_height += 1/24*contents.size.height;
       }
     }

     for (var i = 0; i < contents.datas.right_data.length; i++) {
       if (contents.datas.right_data[i] > 200) {
         bar_len = 200
       }
       else {
         bar_len = contents.datas.right_data[i]
       }
       if (contents.datas.right_data.length > 13) {
         b.append("rect")
          .attr("x", (contents.size.width-margin.left-margin.right)*7/8)
          .attr("y", contents.size.height-margin.top-margin.bottom-right_bar_height-(contents.size.height-margin.bottom-50)/contents.datas.right_data.length)
          .attr("class", "rect")
          .attr("width", bar_scale/200*bar_len)
          .attr("height", (contents.size.height-margin.bottom-50)/contents.datas.right_data.length)
          .style("fill", contents.params.color_right)
          .style("stroke", "white");
         right_bar_height += (contents.size.height-margin.bottom-50)/contents.datas.right_data.length;
       }
       else {
         b.append("rect")
          .attr("x", (contents.size.width-margin.left-margin.right)*7/8)
          .attr("y", contents.size.height-margin.top-margin.bottom-right_bar_height-1/24*contents.size.height)
          .attr("class", "rect")
          .attr("width", bar_scale/200*bar_len)
          .attr("height", 1/24*contents.size.height)
          .style("fill", contents.params.color_right)
          .style("stroke", "white");
         right_bar_height += 1/24*contents.size.height;
       }
     }
   }  /* 柱子超过13行高度就按照整体大小平分。 */

   draw_text();
   draw_arrow();
   draw_bar();
   draw_line();

  }
}
