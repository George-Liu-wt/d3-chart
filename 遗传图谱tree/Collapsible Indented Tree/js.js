jQuery.treemap = {
  show_treemap:function(container,contents)
  {
    var margin = {top: 30, right: 20, bottom: 30, left: 20},
        width = contents.size.width,
        barHeight = contents.size.height,
        barWidth = 70;

    var aaa = 0;
    var bbb = 0;

    var i = 0,
        duration = 400,
        root;

    var diagonal = d3.linkHorizontal()  /* line, arc, pie,area,radialArea, linkVertical,linkHorizontal*/
        .x(function(d) { return (d.y); })
        .y(function(d) { return d.x; });
        console.log(diagonal);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var flare = contents.datas;
      root = d3.hierarchy(flare);
      console.log(root);
      root.x0 = 0;
      root.y0 = 0;
      update(root);

      /*默认展开多少层*/
      function clickAll(d) {
        if (d.children) {
          d.children.forEach(clickAll);
          click(d);
        }
      }

      console.log(root);
      for (var i = 0; i < root.children.length; i++) {
        for (var n = 0; n < root.children[i].children.length; n++) {
          for (var m = 0; m < root.children[i].children[n].children.length; m++) {
            for (var p = 0; p < root.children[i].children[n].children[m].children.length; p++) {
              for (var q = 0; q < root.children[i].children[n].children[m].children[p].children.length; q++) {
                root.children[i].children[n].children[m].children[p].children[q].children.forEach(clickAll);
                update(root);
                console.log("11");
              }
            }
          }
        }
      }

      // for (var i = 0; i < root.children.length; i++) {
      //   console.log("111");
      //   console.log(root.children[0].children);
      //   for (var n = 0; n < root.children[i].children.length; n++) {
      //           root.children[i].children[n].children.forEach(clickAll);
      //           update(root);
      //           console.log("11");
      //   }
      // }
      // console.log(root);
      // console.log("-------");
      // console.log(root.children[0].children[0]);
      // root.children[0].children[0].children.forEach(clickAll);
      // // click(root.children[1].children[2]);
      // update(root);

    function update(source) {

      var nodes = root.descendants();

      var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

      d3.select("svg").transition()
          .duration(duration)
          .attr("height", height);

      d3.select(self.frameElement).transition()
          .duration(duration)
          .style("height", height + "px");

      var index = -1;
      root.eachBefore(function(n) {
        n.x = ++index * barHeight;
        n.y = n.depth * 20;
      });

      var node = svg.selectAll(".node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

      var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
          .style("opacity", 0);

      bbb = source.x0;

      nodeEnter.append("rect")
          .attr("y", -barHeight / 2)
          .attr("height", barHeight)
          .attr("width", barWidth)
          .style("fill", color)
          // .style("stroke-dasharray", "5,5")
          .on("click", click);

      nodeEnter.append("rect")
          .attr("y", -barHeight / 2)
          .attr("height", barHeight)
          .attr("width", 20)
          .attr("transform", "translate("+ barWidth +", 0)")
          .style("fill", "white")
          // .style("stroke-dasharray", "5,5")
          .on("click", click2);

      nodeEnter.append("text")
          .attr("dy", 3.5)
          .attr("dx", 5.5)
          .text(function(d) { return d.data.name; });

      nodeEnter.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
          .style("opacity", 1);

      node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
          .style("opacity", 1)
        .select("rect")
          .style("fill", color);

      node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .style("opacity", 0)
          .remove();

      var link = svg.selectAll(".link")
        .data(root.links(), function(d) { return d.target.id; });

      link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
          })
        .transition()
          .duration(duration)
          .attr("d", diagonal);

      link.transition()
          .duration(duration)
          .attr("d", diagonal);

      link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          })
          .remove();

      root.each(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    var j = 1;
    var k = 0;
    function click(d) {
      // if (j >contents.params.children_amount) {
          if (d.children) {
            d._children = d.children;
            d.children = null;
            if (j > k) {
              console.log("off");
            }
          } else {
            d.children = d._children;
            d._children = null;
            console.log(d.data.name);  /*点击展开时打印对应name*/
          }
          j += 1;
          update(d);
    // }
    // else {
    //   j += 1;
    // }
    }

    var test_list = {};
    function click2(d) {
      key = d.data.value;
        if (test_list[key]) {
          d3.select(this).style("fill", "white");
          delete(test_list[key]);
          console.log(test_list);
        }
        else {
          test_list[key] = 1;
          d3.select(this).style("fill", "green");
          console.log(test_list);
        }
    }

    function color(d) {
      return d._children ? "#3182bd" : d.children ? "#ffffff" : "#ffffff";  /*第一个颜色是能点击区域；第二个颜色是点击后变白区域；最后一个颜色是不能点击的白色区域*/
    }
  }
}
