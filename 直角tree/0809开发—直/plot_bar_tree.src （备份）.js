var sum = function(array) {
        var sum_v = 0;
        for (var i in array) {
            sum_v += array[i]
        }
        return sum_v
    };
/*输入数据格式转化*/
var Newick_parse = function(s) {
        var ancestors = [];
        var tree = {};
        var tokens = s.split(/\s*(;|\(|\)|,|:)\s*/);
        var tree_id = 0;
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            switch (token) {
            case '(':
                var subtree = {};
                tree.branchset = [subtree];
                ancestors.push(tree);
                tree = subtree;
                break;
            case ',':
                var subtree = {};
                ancestors[ancestors.length - 1].branchset.push(subtree);
                tree = subtree;
                break;
            case ')':
                tree = ancestors.pop();
                break;
            case ':':
                break;
            default:
                var x = tokens[i - 1];
                if (x == ')' || x == '(' || x == ',') {
                    tree.name = token;
                    tree.tree_id = tree_id;
                    tree_id += 1;
                } else if (x == ':') {
                    tree.length = parseFloat(token)
                }
            }
        }
        return tree
    };

    /*全局tree_id，选中的树枝传入id给该变量，再传给按钮。*/
    var clickon_tree_id = null;

    /*将选中id的数据的树枝位置改变。*/
    var count_num = 0;
    function rotate_data(tree_data, line_tree_id) {
      if (tree_data.tree_id == line_tree_id) {
        if (tree_data.branchset) {
          /*调list顺序进行翻转。*/
          var new_list = [];
          for (var i in tree_data.branchset) {
            new_list.unshift(tree_data.branchset[i])
          }
          tree_data.branchset = new_list;
        }
      }
      else {
        if (tree_data.branchset) {
          for (var i in tree_data.branchset) {
            rotate_data(tree_data.branchset[i], line_tree_id)
          }
        }
      }
    }

    /*循环branchset*/
    function get_name(data) {
      if (data.branchset) {
        for (var i in data.branchset) {
          get_name(data.branchset[i])
        }
      }
      else {
        count_num = count_num + 1;
      }
      return count_num;
    }

var tree_data_test = 0;
function plotTree(div, content) {
    var title = content.params ? content.params.title : "treeBar",
        margin_left = 10,
        margin_right = 100,
        margin_top = 80,
        margin_bottom = 30,
        svg_w = content.size.width,
        svg_h = content.size.height,
        newickTree = content.data,
        leafColor = {},
        tree_color = content.tree_color ? content.tree_color : [],
        groupsTree = content.tree_color ? content.tree_color : [];
    var maxtext = 0;

    var barWidth = 0;
    /*处理过的数据,字典中的数据代表横线数据。*/
    var tree_dealdata = Newick_parse(newickTree);
    tree_data_test = tree_dealdata;
    console.log(tree_dealdata);
    var ifChartText = content.params.chart_text ? content.params.chart_text : "true";
    var showLegend = content.params.show_legend ? content.params.show_legend : "all";
    var legendBarData = [];

    for (var n = 0; n < tree_color.length; n++) {
        for (var c = 0; c < tree_color[n].species.length; c++) {
            maxtext = tree_color[n].species[c].length > maxtext ? tree_color[n].species[c].length : maxtext;
            leafColor[tree_color[n].species[c]] = tree_color[n].color
        }
    }

    /*输入不同数据，根据鼠标触发事件生成不同tree。*/
    function clickon(tree_data_test) {
      var targetDiv = "div#" + div;
      d3.select(targetDiv).selectAll("*").remove();
      var svgContainer = d3.select(targetDiv).append("svg").attr("version", "1.1").attr("width", svg_w).attr("height", svg_h);
      var title_g = svgContainer.append("g").attr("class", "title").attr("transform", "translate(" + svg_w / 2 * 4 / 5 + ", " + margin_top / 3 + ")");
      title_g.append("text").text(title).attr("font-family", "arial").attr("font-size", "20px");

      var leaf = [];
      /*取最大长度*/
      var max_x = 0;
      /*算出字典里的x,y数据*/
      var getleaf = function(subtree, x) {
              if ("undefined" == typeof x) {
                  x = 0
              };
              var sub_y = [];
              var length = 0;
              if (subtree.length) {
                  length = subtree.length
              };
              subtree.start_x = x;
              x = x + length;
              subtree.end_x = x;
              if (subtree.end_x > max_x) {
                  max_x = subtree.end_x
              };
              if (subtree.branchset) {
                  for (var i in subtree.branchset) {
                      sub_y.push(getleaf(subtree.branchset[i], x))
                  }
              } else {
                  subtree.y = leaf.length;
                  leaf.push(subtree);
                  return subtree.y
              };
              subtree.y = sum(sub_y) / sub_y.length;
              return subtree.y
          };

      function setColors(tree, color_obj) {
          if (tree.branchset) {
              var branchset_colors = [];
              for (var i in tree.branchset) {
                  branchset_colors.push(setColors(tree.branchset[i], color_obj))
              }
              tree.color = branchset_colors[0];
              for (var i in branchset_colors) {
                  if (branchset_colors[i] != tree.color) {
                      tree.color = "black";
                      break
                  }
              }
              return tree.color
          } else {
              tree.color = color_obj[tree.name] ? color_obj[tree.name] : "black";
              return tree.color
          }
      }
      /*返回列表中的最大最小值*/
      function max_min_array(array) {
          var max = array[0];
          var min = array[0];
          for (var i in array) {
              if (max < array[i]) {
                  max = array[i]
              }
              if (min > array[i]) {
                  min = array[i]
              }
          }
          return {
              max: max,
              min: min
          }
      }

      getleaf(tree_data_test);
      setColors(tree_data_test, leafColor);

      var tree_g = svgContainer.append('g').attr("class", "tree_group");
      var max_name = 0;
      var maxLength = 0;
      for (var i in leaf) {
          if (leaf[i].name.length > max_name) {
              max_name = leaf[i].name.length
          }
      }
      var text_length = max_name * 6;
      var treeRangeWidth = svg_w - text_length - margin_right;
      treeRangeWidth = treeRangeWidth < 100 ? 100 : treeRangeWidth;
      treeRangeWidth = treeRangeWidth > 600 ? 600 : treeRangeWidth;
      /*坐标轴比例尺*/
      var linear_width = d3.scale.linear().domain([0, max_x]).range([5 + margin_left, treeRangeWidth]);
      for (var i in leaf) {
          maxLength = linear_width(max_x) + leaf[i].name.length * 6 > maxLength ? linear_width(max_x) + leaf[i].name.length * 6 : maxLength
      }
      var scaleplate = 80;
      if (max_name < 7) {
          text_length = 80
      }
      var text_size = 13;
      var one_leaf_height = parseInt((svg_h - scaleplate - margin_top) / (leaf.length - 1));
      if (one_leaf_height < text_size) {
          text_size = one_leaf_height
      }
      text_length = (text_size / 13) * text_length;
      var text_x = svg_w - text_length - margin_right;
      var linear_height = d3.scale.linear().domain([0, leaf.length - 1]).range([margin_top, svg_h - scaleplate]);
      /*副标题*/
      tree_g.append("text").text(contents.params.chart_text).attr("font-family", "arial").attr("font-size", "12px").attr("transform", "translate(" + maxLength / 2 + ", " + (margin_top - 20) + ")");

      /*画树的线*/
      function plot_one(tree) {
          /*设置tree_id变量，触发鼠标点击事件时返回tree_id。*/
          var line_tree_id = tree.tree_id;

          /*横线:鼠标触发事件，点击第二下时,把上一个选中的直线取消效果。*/
          tree_g.append("line")
                .attr("x1", linear_width(tree.start_x))
                .attr("y1", linear_height(tree.y))
                .attr("x2", linear_width(tree.end_x))
                .attr("y2", linear_height(tree.y))
                .attr("stroke-width", 2)
                .attr("stroke", tree.color)
                .on("click", function(d) {
                  if (last_this == 0) {
                  }
                  else {
                    var last_line_obj = d3.select(last_this);
                    last_line_obj.attr("stroke", last_color).attr("stroke-width", 2).style("opacity",1);
                  }
                  var line_obj = d3.select(this);
                  line_obj.attr("stroke", tree.color).attr("stroke-width", 4).style("opacity",1);
                  last_this = this;
                  last_color = tree.color;
                  clickon_tree_id = tree.tree_id;
                  console.log(line_tree_id);
                });
          if (tree.branchset) {
              var list_y = [];
              for (var i in tree.branchset) {
                  list_y.push(tree.branchset[i].y)
              };
              var max_min_y = max_min_array(list_y);

              /*竖线*/
              tree_g.append("line").attr("x1", linear_width(tree.end_x)).attr("y1", linear_height(max_min_y.max)).attr("x2", linear_width(tree.end_x)).attr("y2", linear_height(max_min_y.min)).attr("stroke-width", 2).attr("stroke", tree.color)
          } else {
              /*虚线;没有下一层就补虚线*/
              tree_g.append("line").attr("x1", linear_width(tree.end_x)).attr("y1", linear_height(tree.y)).attr("x2", maxLength - tree.name.length * 6).attr("y2", linear_height(tree.y)).attr("stroke-width", 1).attr("stroke", tree.color).attr("stroke-dasharray", 2)
          }
      }
      function plot_tree(tree) {
          plot_one(tree);
          if (tree.branchset) {
              for (var i in tree.branchset) {
                  plot_tree(tree.branchset[i])
              }
          }
      }
      var last_this = 0;
      var last_color = 0;
      plot_tree(tree_data_test);

      treeRangeWidth === 100 ? barWidth = 100 : barWidth = barWidth;

      var groups = new Array();
      for (i in groupsTree) {
          groups.push({
              name: i,
              color: groupsTree[i]
          })
      };

      var legendTree = svgContainer.append("g").attr("id", "legendTree").attr("transform", "translate(" + (maxLength + 10 + barWidth + 10) + ", " + (margin_top) + ")");
      /*Taxa图例上方文字*/
      legendTree.append("text").text(groupsTree.length < 1 ? null : contents.params.legend_text).attr("font-family", "arial").attr("font-size", "13px").attr("transform", "translate(0,-12)");
      // legendTree.exit().remove();
      /*图例*/
      var legendTreeG = legendTree.selectAll(".legendTreeG").data(groupsTree).enter().append("g").attr("transform", function(d, i) {
          return "translate(10," + 20 * i + ")"
      });
      /*图例的长方形*/
      legendTreeG.append('rect').attr('width', 15).attr('height', 5).attr("fill", function(d) {
          return d.color
      });
      /*图例长方形旁边的文字*/
      legendTreeG.append("text").text(function(d) {
          return d.name
      }).attr("font-family", "arial").attr("font-size", 12).attr("transform", "translate(30, 5)");
      // legendTreeG.exit().remove();
      /*一条虚线,目前透明，没有用处。*/
      tree_g.append("line").attr("id", "hhhhh").attr("x1", linear_width(max_x)).attr("x2", linear_width(max_x)).attr("y1", margin_top).attr("y2", svg_h).attr("stroke", "#ccc").attr("stroke-dasharray", 2).attr("opacity", 0);
      // tree_g.exit().remove();
      /*右边文字*/
      var svg_leaves = svgContainer.selectAll("text .leaves").data(leaf).enter().append("text").text(function(d) {
          return d.name
      }).attr('id', 'leaf').attr("font-family", "arial").attr("text-anchor", "end").attr("font-size", text_size).attr("x", maxLength).attr("y", function(d) {
          return linear_height(d.y) + 0.3 * text_size
      }).style("font-size", '10px');
      var axis_length = svg_w - text_length - margin_right - margin_left - 5;
      var ticks_num = Math.ceil(axis_length / 50);
      /*坐标轴比例尺*/
      var axis_linear = linear_width.domain([0, max_x]);

      var axis = d3.svg.axis().orient("top").scale(linear_width).ticks(ticks_num).tickSize(5);
      var translate = "translate(" + 0 + "," + (svg_h - scaleplate + 40) + ")";
      var xAxisG = svgContainer.append("g").attr("class", "xAxis").attr("transform", translate).attr("font-family", "arial").call(axis);
      /*坐标轴线的颜色*/
      d3.selectAll('.xAxis line').attr("fill", 'none').attr("stroke", 'black').attr("shape-rendering", "crispEdges");
      d3.selectAll('.xAxis path').attr("stroke", 'black')
      .style("fill", 'none')
      .attr("shape-rendering", "crispEdges");
      d3.selectAll(".xAxis text").attr("transform", "translate(0,23)").attr("font-size", "10px").attr("font-family", "arial")
      .attr("opacity", function(d, i) {
          return d.toString().length > 5 && i % 2 === 0 ? 0 : 1
      });
    }

    /*设置旋转数据全局变量，改变后替换。*/
    clickon(tree_dealdata)

    var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
      .data([tree_dealdata]);

    datasetpicker.enter()
      .append("input")
      .attr("value", "rotate")
      .attr("type", "button")
      .attr("mouseover", "dataset-button")
      .on("click", function(d) {
        $("#container").html(''); /*清空div，重新画。*/
        rotate_data(tree_data_test, clickon_tree_id);
        console.log(tree_data_test);
        clickon(tree_data_test);
      });

};

/*Jquary传入contents*/
function showClusterTree(cluster_tree, contents) {
    if ('GROUPS' in contents) {
        var max_group_name = 0;
        for (var i in contents.GROUPS) {
            if (i.length > max_group_name) {
                max_group_name = i.length
            } else {}
        }; if (max_group_name > 10) {
            contents.params.margin_right = 150
        } else {
            contents.params.margin_right = 80
        }
    } else {
        contents.GROUPS = {}
    };
    if (contents.samples_colors) {} else {
        contents.samples_colors = {}
    };
    plotTree(cluster_tree, contents)
};
