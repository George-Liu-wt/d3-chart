jQuery.BSA_linechart = {
  show_BSA_linechart:function(container,contents)
  {
    var margin = { top: 130, right: 80, bottom: 100, left: 120 },
        width = 1260 - margin.left - margin.right,
        height = 780 - margin.top - margin.bottom;

    var svg = d3.select("body").append("svg").attr("width",width + margin.left + margin.right).attr("height",height + margin.top + margin.bottom);

    g = svg.append("g").attr("class","frame").attr("transform","translate("+ margin.left +","+ margin.top +")");

    var yScaleMaxValue = 0;
    for (i = 0; i < contents.params.chrs.length; i++) {
      var chri_length = contents.datas[i].values.length;
      var chri = contents.datas[i];
      for (m = 0; m < chri_length; m++) {
        var chri_value = chri.values[m];
        // console.log(chri_value);
        if (chri_value > yScaleMaxValue) {
          yScaleMaxValue = chri_value;
          // console.log(chri_maxvalue);
        }
      }
    }
    console.log(yScaleMaxValue);

    var space = width / (contents.params.chrs.length * (1.5 + 1) - 1);  //每个柱子间的间距，柱子之间间隔1.5个柱子大小。

    var yScale = d3.scaleLinear()
                   .domain([0,yScaleMaxValue])   //定义域：x轴的坐标刻度。
                   .range([0,height]);  //值域：x轴的长度。

    //定义一个坐标轴
    var yAxis = d3.axisLeft()   //坐标轴位置。
                  .scale(yScale)  //坐标轴大小。
                  .ticks(4);

    g.append("g")
                 .attr("class","axis")
                 .call(yAxis)
                 .attr("transform","translate(-20,0)")
                 .style("stroke-width",2)   //设置坐标轴粗细。
                 .style("font-size","12px");  //设置文字大小

   for (i = 0; i < contents.params.chrs.length; i++) {
     var chri_maxvalue = 0;
     var chri_length = contents.datas[i].values.length;
     var chri = contents.datas[i];
     for (m = 0; m < chri_length; m++) {
       var chri_value = chri.values[m];
       // console.log(chri_value);
       if (chri_value > chri_maxvalue) {
         chri_maxvalue = chri_value;
         // console.log(chri_maxvalue);
       }
     }

    //添加椭圆。
     g.append("rect")
                  .attr("x",i * space * 2.5)
                  .attr("y", -20)
                  .attr("rx",100)
                  .attr("ry",100)
                  .attr("width",space)
                  .attr("height",40)
                  .attr("stroke","grey")
                  .attr("stroke-width",2)
                  .style("fill","white")

    g.append("rect")
                 .attr("x",i * space * 2.5)
                 .attr("y", height / yScaleMaxValue * chri_maxvalue -20)
                 .attr("rx",100)
                 .attr("ry",100)
                 .attr("width",space)
                 .attr("height",40)
                 .attr("stroke","grey")
                 .attr("stroke-width",2)
                 .style("fill","white")

     g.append("rect")
                  .attr("x",i * space * 2.5)
                  .attr("y", 0)
                  .attr("width",space)
                  .attr("height",height / yScaleMaxValue * chri_maxvalue)
                  .attr("stroke","black")
                  .attr("stroke-width",2)
                  .style("fill","white")


     g.append("text")
                  .text(contents.params.chrs[i])
                  .attr("x",i * space * 2.5 + space * 0.5)
                  .attr("y",- 0.3 * margin.top)
                  .attr("transform","translate(0,0)")
                  .attr('text-anchor', 'middle')
                  .style("font-weight",600)
                  .style("font-size","15px")
                  .on("click", function(){
                    var select_body = d3.select("body");
                    var select_svg = select_body.select("svg");
                    var all_g = select_svg.selectAll("g");
                    var all_rect = all_g.selectAll("rect");

                    all_rect.style("display","none");
                    console.log("111");

                    svg.append("rect")
                    .attr("x",100)
                    .attr("y", 100)
                    .attr("width",100)
                    .attr("height",100)
                    .attr("stroke","black")
                    .attr("stroke-width",2)
                    .style("fill","white")
                    .on("click", function(){
                      var select_body = d3.select("body");
                      var select_svg = select_body.select("svg");
                      var all_g = select_svg.selectAll("g");
                      var all_rect = all_g.selectAll("rect");

                      all_rect.style("display","yes");
                    });

                  });



   }

  //画中间颜色
   g = svg.append("g").attr("class","inner_color").attr("transform","translate("+ margin.left +","+ margin.top +")");

   for (i = 0; i < contents.params.chrs.length; i++) {
     var chri_maxvalue = 0;
     var chri_length = contents.datas[i].values.length;
     var chri = contents.datas[i];
     for (m = 0; m < chri_length; m++) {
       var chri_value = chri.values[m];
       // console.log(chri_value);
       if (chri_value > chri_maxvalue) {
         chri_maxvalue = chri_value;
         // console.log(chri_maxvalue);
       }
     }
     for (m = 0; m < chri_length; m++) {

       var pointvalue = contents.datas[i].values[m];

       if (pointvalue < chri_maxvalue) {
         g.append("rect")
                   .attr("x",i * space * 2.5 + 1)
                   .attr("y", height * pointvalue / yScaleMaxValue)
                   .attr("width",space - 2)
                   .attr("height",2)
                   // .attr("stroke","grey")
                   // .attr("stroke-width",2)
                   .style("fill","rgb(45,45,45,0.3)")
       }


     }
   }

   //线边框
   g = svg.append("g").attr("class","line_frame").attr("transform","translate("+ margin.left +","+ margin.top +")");
   for (i = 0; i < contents.params.chrs.length; i++) {
     var chri_maxvalue = 0;
     var chri_length = contents.datas[i].values.length;
     var chri = contents.datas[i];
     for (m = 0; m < chri_length; m++) {
       var chri_value = chri.values[m];
       // console.log(chri_value);
       if (chri_value > chri_maxvalue) {
         chri_maxvalue = chri_value;
         // console.log(chri_maxvalue);
       }
     }

     g.append("line")
                 .attr("x", 100)

                 .attr("y", 100)
                 .attr("transform","translate(0,0)")
                 .style("fill","red");
   }

    //文字
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


  }
}
