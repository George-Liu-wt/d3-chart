jQuery.BSA_linechart = {
  show_BSA_linechart:function(container,contents)
  {
    var arcGenerator = d3.arc().innerRadius(80).outerRadius(100).startAngle(0);
    var picture = d3.select('svg').append('g').attr('transform','translate(480,250)');
    var backGround = picture.append("path")
                            .datum({endAngle: 2 * Math.PI})
                            .style("fill", "#FDF5E6")
                            .attr("d", arcGenerator);
    d3.interval(function() {

        foreground.transition().duration(750).attrTween('d',
        function(d) {

            var compute = d3.interpolate(d.endAngle, Math.random() * Math.PI * 2);

            return function(t) {

                d.endAngle = compute(t);

                var data = d.endAngle / Math.PI / 2 * 100;

                //设置数值
                d3.select('text').text(data.toFixed(0) + '%');

                //将新参数传入，生成新的圆弧构造器
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

    },
    2000)

  }
}
