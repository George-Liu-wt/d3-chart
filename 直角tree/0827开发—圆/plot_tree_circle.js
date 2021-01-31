jQuery.plotCircleTree = {
  show_plotCircleTree:function(container,contents)
  {
    var sum = function(a) {
        var b = 0;
        for (var i in a) {
            b += a[i]
        }
        return b
    };
    var Newick_parse = function(s) {
        var a = [];
        var b = {};
        var c = s.split(/\s*(;|\(|\)|,|:)\s*/);
        var tree_id = 1;
        for (var i = 0; i < c.length; i++) {
            var d = c[i];
            switch (d) {
                case "(":
                    var e = {};
                    b.branchset = [e];
                    a.push(b);
                    b = e;
                    break;
                case ",":
                    var e = {};
                    a[a.length - 1].branchset.push(e);
                    b = e;
                    break;
                case ")":
                    b = a.pop();
                    break;
                case ":":
                    break;
                default:
                    var x = c[i - 1];
                    if (x == "(" || x == ",") {
                        b.name = d;
                        b.tree_id = tree_id;
                        tree_id += 1;
                    } else if (x == ":") {
                        b.length = parseFloat(d)
                    } else if (x == ')') {
                      if (d.length > 0) {
                        b.confidence = Math.round(parseFloat(d) * 100)
                      }
                      else {
                        b.confidence = null
                      }
                    }
            }
        }
        return b
    };

    /*全局tree_id，选中的树枝传入id给该变量，再传给按钮。*/
    var clickon_tree_id = null;
    var clickon_parent_id = null;

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

    /*添加上层id：parent_id*/
    var parent_id = "null"
    function get_parent_id(tree_data) {
      parent_id = tree_data.tree_id;
      if (tree_data.branchset) {
        for (var i in tree_data.branchset) {
          tree_data.branchset[i].parent_id = parent_id;
        }
        for (var i in tree_data.branchset) {
          get_parent_id(tree_data.branchset[i])
        }
      }
    }

    /*reroot功能*/
    var reroot = {};
    function reroot_root(tree_data, parentid, tree_id) {
      if (tree_data.tree_id == parentid) {
        reroot.branchset = []
        for (var m in tree_data.branchset) {
          if (tree_data.branchset[m].tree_id == tree_id) {
            reroot.branchset.push({})
            reroot.branchset.push(tree_data.branchset[m])
          }
        }
      }
      else {
        if (tree_data.branchset) {
          for (var i in tree_data.branchset) {
            reroot_root(tree_data.branchset[i], parentid, tree_id)
          }
        }
      }
    }
    /*给当前选中的线的parent_id*/
    var last_tree_id = 100000;  /*如果两次选中同一条，不做选择根功能。*/


    /*更新tree_id*/
    var new_tree_id = 0
    function renew_tree_id (data) {
      data.tree_id = new_tree_id
      new_tree_id += 1
      if (data.branchset) {
        for (var i in data.branchset) {
          renew_tree_id(data.branchset[i])
        }
      }
    }

    var tree_data_test = 0;

    var j = Newick_parse(contents.data);
    var tree_data_test = j;
    function clickon(tree_data_test) {
      var k = "div#" + container;
      d3.select(k).selectAll("*").remove();
      var l = d3.select(k).append("svg").attr("version", "1.1").attr("width", contents.size.width).attr("height", contents.size.height);
      var m = contents.samples_colors ? contents.samples_colors : {};
      var show_line = contents.params.show_line;   /* 0:不显示枝长；1:显示枝长。*/
      var n = new Array();
      if (contents.tree_color) {
          for (var i in contents.tree_color) {
              var o = contents.tree_color[i];
              n.push({
                  name: o.name,
                  color: o.color
              });
              for (var p in o.species) {
                  m[o.species[p]] = o.color
              }
          }
      }
      var q = d3.behavior.drag().on("dragstart", function() {
          dstartX = d3.mouse(this)[0];
          dstartY = d3.mouse(this)[1];
          d3.event.sourceEvent.stopPropagation()
      }).on("drag", function() {
          d3.select(this).attr("transform", "translate(" + (d3.event.x - dstartX) + ", " + (d3.event.y - dstartY) + ")")
      });
      var r = l.append("g").attr("class", "title").call(q);
      r.append("text").text(contents.params.title).attr("font-family", "arial").attr("font-size", "22px").attr("x", function(d) {
          return contents.size.width / 2 - this.getComputedTextLength() / 2
      }).attr("y", 30);
      if (contents.params.sub_title) {
          r.append("text").text(contents.params.sub_title).attr("font-family", "arial").attr("font-size", "15px").attr("x", function(d) {
              return contents.size.width / 2 - this.getComputedTextLength() / 2
          }).attr("y", 50)
      }
      var s = [];
      var t = 0;
      var u = function(a, x) {
          if ("undefined" == typeof x) {
              x = 0
          }
          var b = [];
          var c = 0;
          if (a.length) {
              c = a.length
          }
          a.start_x = x;
          x = x + c;
          a.end_x = x;
          if (a.end_x > t) {
              t = a.end_x
          }
          if (a.branchset) {
              for (var i in a.branchset) {
                  b.push(u(a.branchset[i], x))
              }
          } else {
              a.y = s.length;
              s.push(a);
              return a.y
          }
          a.y = sum(b) / b.length;
          return a.y
      };

      function setColors(a, b) {
          if (a.branchset) {
              var c = [];
              for (var i in a.branchset) {
                  c.push(setColors(a.branchset[i], b))
              }
              a.color = c[0];
              for (var i in c) {
                  if (c[i] != a.color) {
                      a.color = "black";
                      break
                  }
              }
              return a.color
          } else {
              a.color = b[a.name] ? b[a.name] : "black";
              return a.color
          }
      }

      function max_min_array(a) {
          var b = a[0];
          var c = a[0];
          for (var i in a) {
              if (b < a[i]) {
                  b = a[i]
              }
              if (c > a[i]) {
                  c = a[ii]
              }
          }
          return {
              max: b,
              min: c
          }
      }
      u(tree_data_test);
      setColors(tree_data_test, m);

      function text_size_test(a, b) {
          var c = 0;
          l.append("text").attr("id", "text_size_test").text(a).attr("id", "leaf").attr("font-family", "arial").attr("font-size", b).text(function() {
              c = this.getComputedTextLength();
              d3.select(this).remove();
              return a
          });
          return c
      }
      var v = 360 / s.length;
      var w = v * Math.PI / 180;
      var y = 60;
      var z = 40;
      var A = 12;
      if (!n) {
          var B = 0
      } else {
          var C = 0;
          var D = '';
          for (var i in n) {
              if (n[i].name.length > C) {
                  C = n[i].name.length;
                  D = n[i].name
              }
          }
          var B = text_size_test(D, A) + 45
      }
      var E = contents.size.width - B;
      var F = contents.size.height - y - z;
      if (F > E) {
          F = E;
          z = contents.size.height - y - F
      } else {
          E = F;
          B = contents.size.width - E
      }
      var G = {
          "x": E / 2,
          "y": E / 2 + y
      };
      var H = 0;
      for (var i in s) {
          if (s[i].name.length > H) {
              H = s[i].name.length;
              var I = s[i].name
          }
      }
      var J = text_size_test(I, 13);
      if (J > (E / 3)) {
          J = E / 3;
          for (var i = 12; i > 1; i--) {
              if (text_size_test(I, i) < J) {
                  var K = i;
                  break
              }
              var K = i
          }
      } else {
          var K = 13
      }
      var L = E / 2 - J - 5;
      if (w < Math.PI / 2) {
          var M = Math.sin(w) * L;
          if (M < K) {
              var K = parseInt(M) ? parseInt(M) : 1;
              var J = text_size_test(I, K);
              var L = E / 2 - J - 5
          }
      }
      var N = d3.behavior.drag().on("dragstart", function() {
          dstartX = d3.mouse(this)[0];
          dstartY = d3.mouse(this)[1];
          d3.event.sourceEvent.stopPropagation()
      }).on("drag", function() {
          var a = Math.atan2((dstartY - G.y), (dstartX - G.y));
          if ((dstartY - G.y) < 0) {
              a += Math.PI
          }
          var b = Math.atan2((d3.event.y - G.y), (d3.event.x - G.y));
          if ((d3.event.y - G.y) < 0) {
              b += Math.PI
          }
          var c = 180 / Math.PI * (b - a);
          if (Math.abs(c) < 3) {
              return null
          }
          d3.select("#tree_group").attr("transform", "rotate(" + c + ", " + G.x + ", " + G.y + ")");
          d3.select("#leafgroup").attr("transform", "rotate(" + c + ", " + G.x + ", " + G.y + ")")
      });
      var O = l.append("g").attr("id", "tree_group");
      var P = d3.scale.linear().domain([0, t]).range([G.x, G.x + L]);
      var Q = d3.scale.linear().domain([0, t]).range([0, L]);

      function plot_one(b) {
        /*竖线*/
          O.append("line").attr("x1", function(d) {
              return P(b.start_x)
          }).attr("y1", G.y).attr("x2", function(d) {
              if (b.branchset) {
                  return P(b.end_x)
              } else {
                  return P(b.end_x)
              }
          }).attr("y2", G.y).attr("stroke-width", 1.2).attr("stroke", b.color).attr("transform", function(d) {
              var a = v * b.y;
              return "rotate(" + a + "," + G.x + "," + G.y + ")"
          }).on("click", function(d) {
            if (last_this == 0) {
            }
            else {
              var last_line_obj = d3.select(last_this);
              last_line_obj.attr("stroke", last_color).attr("stroke-width", 2).style("opacity",1);
            }
            var line_obj = d3.select(this);
            line_obj.attr("stroke", "grey").attr("stroke-width", 6).style("opacity",1);
            last_this = this;
            last_color = b.color;
            clickon_tree_id = b.tree_id;
            clickon_parent_id = b.parent_id;
          });
          /*添加置信度*/
          if (contents.params.show_confidence == 1) {
            O.append("text").text(b.confidence).attr("font-family", "arial").attr("font-size", "10px")
            .attr("x",P(b.end_x) + 5)
            .attr("y", G.y + 5)
            .attr("transform", "rotate(" + (v * b.y) + "," + G.x + "," + G.y + ")");
            if (b.confidence) {
            }
          }

          if (b.branchset) {
              var c = [];
              for (var i in b.branchset) {
                  c.push(b.branchset[i].y)
              }
              var e = max_min_array(c);
              var f = d3.svg.arc().innerRadius(Q(b.end_x)).outerRadius(Q(b.end_x)).startAngle(w * e.min).endAngle(w * e.max);
              /*横线*/
              O.append("path").attr("d", f).attr("fill", "none").attr("transform", "translate(" + G.x + "," + G.y + ") rotate(90)").attr("stroke-width", 1.2).attr("stroke", b.color)
          } else {
                /*虚线*/
                if (show_line == 1) {
                  O.append("line").attr("x1", function(d) {
                      return P(b.end_x)
                  }).attr("y1", G.y).attr("x2", function(d) {
                      if (b.branchset) {
                          return P(b.end_x)
                      } else {
                          return P(t)
                      }
                  }).attr("y2", G.y).attr("stroke-dasharray", "3,3").attr("stroke-width", 0.6).attr("stroke", b.color).attr("transform", function(d) {
                      var a = v * b.y;
                      return "rotate(" + a + "," + G.x + "," + G.y + ")"
                  })
                }
                else if (show_line == 0) {
                  O.append("line").attr("x1", function(d) {
                      return P(b.end_x)
                  }).attr("y1", G.y).attr("x2", function(d) {
                      if (b.branchset) {
                          return P(b.end_x)
                      } else {
                          return P(t)
                      }
                  }).attr("y2", G.y).attr("stroke-width", 1.2).attr("stroke", b.color).attr("transform", function(d) {
                      var a = v * b.y;
                      return "rotate(" + a + "," + G.x + "," + G.y + ")"
                  })
                }
          }
      }

      function plot_tree(a) {
          plot_one(a);
          if (a.branchset) {
              for (var i in a.branchset) {
                  plot_tree(a.branchset[i])
              }
          }
      }
      var last_this = 0;
      var last_color = 0;
      plot_tree(tree_data_test);
      var R = 17;
      var S = 23;
      l.selectAll("rect.legend").data(n).enter().append("rect").attr("x", E).attr("y", function(d, i) {
          return i * R + y
      }).attr("width", S).attr("height", 4).attr("fill", function(d) {
          return d.color
      });
      l.selectAll("text.legend").data(n).enter().append("text").text(function(d) {
          return d.name
      }).attr("font-family", "arial").attr("font-size", A).attr("x", E + S + 4).attr("y", function(d, i) {
          return i * R + y + 6
      });
      if (contents.params.show_name == 1) {
        var T = l.append("g").attr("id", "leafgroup").call(N).selectAll("text .leaves").data(s).enter().append("text").text(function(d) {
            return d.name
        }).attr("id", "leaf").attr("font-family", "arial").attr("font-size", K).text(function(d) {
            var a = this.getComputedTextLength();
            return d.name
        }).attr("x", function(d) {
            var a = this.getComputedTextLength();

                if (270 > v * d.y && v * d.y > 90) {
                    return G.x + L - a - 3
                } else {
                    return G.x + L + 3
                }

        }).attr("y", function(d) {
            return G.y + K / 4
        }).attr("transform", function(d) {
            var a = v * d.y;

                var b = "rotate(180," + (G.x + L) + "," + G.y + ") "
             if (a < 270 && a > 90) {
                return "rotate(" + a + "," + G.x + "," + G.y + ")" + b
            } else {
                return "rotate(" + a + "," + G.x + "," + G.y + ")"
            }
        }).append("title").text(function(d) {
            return d.name
        });
      }

      var U = L;
      var V = Math.ceil(U / 50);
      var W = d3.scale.linear().domain([t, 0]).range([0, L]);
      var W = d3.scale.linear().domain([t, 0]).range([0, L]);
      var X = d3.svg.axis().orient("top").scale(W).ticks(V).tickSize(5);
      var Y = l.append("g").attr("class", "axis").attr("transform", "translate(" + (G.x - L) + "," + (y + F + 30) + ")").attr("font-family", "arial").attr("font-size", "14").call(X);
      Y.selectAll("line,path").attr("fill", function(d) {
          return "none"
      }).attr("stroke", "black").attr("stroke-width", 1).attr("shape-rendering", "crispEdges")
    }

    clickon(j)
    j.tree_id = 0;
    parent_id = "null";
    j.parent_id = parent_id;
    get_parent_id(j)

    function reroot_change(tree_data, parentid, current_id, input_data) {
      /*定位到上层*/
      if (tree_data.tree_id == parentid) {
        for (var m in tree_data.branchset) {
          if (tree_data.branchset[m].tree_id != current_id) {
            input_data.push(tree_data.branchset[m])
          }
        }
        new_parent_id = tree_data.parent_id
        new_current_id = tree_data.tree_id
        if (new_parent_id != 0) {
          var new_data = tree_data
          new_data.branchset = []
          input_data.push(new_data)
          input_length = input_data.length
          reroot_change(tree_data_test, new_parent_id, new_current_id, input_data[input_length - 1].branchset)
        }
        else {
          for (var x in tree_data_test.branchset) {
            if (tree_data_test.branchset[x].tree_id != new_current_id) {
              input_data.push(tree_data_test.branchset[x])
            }
          }
        }
      }
      else {
        if (tree_data.branchset) {
          for (var i in tree_data.branchset) {
            reroot_change(tree_data.branchset[i], parentid, current_id, input_data)
          }
        }
      }
    }

    var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
      .data([j]);

    datasetpicker.enter()
      .append("input")
      .attr("value", "Rotate")
      .attr("type", "button")
      .attr("mouseover", "dataset-button")
      .on("click", function(d) {
        $("#container").html(''); /*清空div，重新画。*/
        rotate_data(tree_data_test, clickon_tree_id);
        clickon(tree_data_test);
        tree_data_test.tree_id = 0;
        parent_id = "null";
        tree_data_test.parent_id = parent_id;
        get_parent_id(tree_data_test);
      });

      datasetpicker.enter()
        .append("input")
        .attr("value", "Reroot")
        .attr("type", "button")
        .attr("mouseover", "dataset-button")
        .on("click", function(d) {
          $("#container").html(''); /*清空div，重新画。*/
          if (last_tree_id == clickon_tree_id) {
            clickon(tree_data_test);
          }
          else if (clickon_parent_id == 0) {
            clickon(tree_data_test);
          }
          else if (clickon_tree_id == 0) {
            clickon(tree_data_test);
          }
          else {
            if (clickon_tree_id) {
              reroot = {};
              var new_parent_id = clickon_parent_id;
              var new_current_id = clickon_tree_id;
              console.log("new_parent_id:"+new_parent_id);
              console.log("new_current_id:"+new_current_id);
              reroot.name = tree_data_test.names
              reroot.tree_id = tree_data_test.tree_id
              reroot.length = tree_data_test.length
              reroot.start_x = tree_data_test.start_x
              reroot.end_x = tree_data_test.end_x
              reroot.y = tree_data_test.y
              reroot.color = tree_data_test.color
              reroot_root(tree_data_test, new_parent_id, clickon_tree_id)
              reroot.branchset[0].name = reroot.branchset[1].name
              reroot.branchset[0].tree_id = reroot.branchset[1].tree_id
              reroot.branchset[0].length = reroot.branchset[1].length
              reroot.branchset[0].start_x = reroot.branchset[1].start_x
              reroot.branchset[0].end_x = reroot.branchset[1].end_x
              reroot.branchset[0].y = reroot.branchset[1].y
              reroot.branchset[0].color = reroot.branchset[1].color
              reroot.branchset[0].branchset = []
              reroot_branchset = reroot.branchset[0].branchset
              reroot_change(tree_data_test, new_parent_id, new_current_id, reroot.branchset[0].branchset)
              tree_data_test = reroot;
              new_tree_id = 0;
              renew_tree_id (tree_data_test)
              parent_id = "null";
              tree_data_test.parent_id = parent_id;
              get_parent_id(tree_data_test)
              clickon(tree_data_test);
              last_tree_id = new_current_id;
            }
            else{
                clickon(tree_data_test);
            }
          }
        });
  }
}
