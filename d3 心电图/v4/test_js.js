jQuery.BSA_linechart = {
  show_BSA_linechart:function(container,contents)
  {
    var arcGenerator = d3.arc().innerRadius(80).outerRadius(100).startAngle(0);
    var picture = d3.select('svg').append('g').attr('transform','translate(480,250)');
    var backGround = picture.append("path")
                            .datum({endAngle: 2 * Math.PI})
                            .style("fill", "#FDF5E6")
                            .attr("d", arcGenerator);
    var upperGround = picture.append('path')
                            .datum({endAngle: 0})
                            .style('fill','#FFC125')
                            .attr('d',arcGenerator)
    var dataText = picture.append('text')
                          .text(0)
                          .attr('text-anchor','middle')
                          .attr('dominant-baseline','middle')
                          .attr('font-size','38px')
    var colorLinear = d3.scaleLinear().domain([0,100]).range(["#EEE685","#EE3B3B"]);
    var n = 0;
    d3.interval(function() {
        upperGround.transition().duration(750).attrTween('d',
        function(d) {
            var compute = d3.interpolate(d.endAngle, 1 * Math.PI * 2);
            return function(t) {
                d.endAngle = compute(t);
                console.log(d.endAngle);
                var data = d.endAngle / Math.PI / 2 * 100;
                //设置数值
                d3.select('text').text(data.toFixed(0) + '%');
                //将新参数传入，生成新的圆弧构造器
                // console.log(d);
                // console.log(arcGenerator(d));
                return arcGenerator(d);
            }
        })
        .styleTween('fill',
        function(d) {
            return function(t) {
                var data = d.endAngle / Math.PI / 2 * 100;
                //返回数值对应的色值
                return colorLinear(data);
            }
        })
        n += 1;
        if (n >= 100) {
          n = 0;
        }
    }, 100)

  }
}
