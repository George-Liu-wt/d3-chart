function buildHierarchy(csv, groups) {
    var root = {
        "name": "root",
        "children": [],
        "size":0,
        "groups": []
    };
    groupsLen = csv[0].length;
    // console.log(groupsLen)
    for (var i = 0; i < csv.length; i++) {
        var sequence = csv[i][0];
        var size = +csv[i][1];
        if(groupsLen>2){
          multiSam = true;
          size = d3.sum(csv[i].slice(1, groupsLen));
        }
        if (isNaN(size)) {
            continue;
        };
        if (size == 0) {
            continue;
        };
        var parts = sequence.split(";");

        // parts = parts.slice(2, parts.length-1);
        // console.log(parts)
        var currentNode = root;
        for (var j = 0; j < parts.length; j++) {
            var children = currentNode["children"];
            // console.log(children)
            var nodeName = parts[j];
            // console.log(nodeName)
            var childNode;
            var foundChild = false;
            for (var k = 0; k < children.length; k++) {
                if (children[k]["name"] == nodeName) {
                    childNode = children[k];
                    children[k]["size"] += size;
                    if(groupsLen>2){
                      for(var g=1;g<groupsLen;g++){
                        children[k]["groups"][g-1] += csv[i][g];
                      }
                    }
                    foundChild = true;
                    break;
                }
            }
            if (!foundChild) {
                childNode = {
                    "name": nodeName,
                    "size": size,
                    "children": []
                };
                if(groupsLen>2){
                  childNode["groups"] = csv[i].slice(1, groupsLen);
                }
                children.push(childNode);
            }
            currentNode = childNode;

        }
    }
    return root;
}

function cluster_tree(container, content){

  d3.select("div#" + container).selectAll("*").remove();

  var data = content.data;
  var groups = content.groups ? content.groups : [];
  var width = content.size.width ? content.size.width : 1000;
  var height = content.size.height ? content.size.height : 1000;

  var multiSam = groups.length > 1 ? true : false;
  var circleR = 400;
  var radius = 15;
  // var startLevel = 1;
  // var endLevel = 4;
  // var textStartLevel = 1;
  // var textEndLevel = 3;
  var linkType = content.params.line_type ? content.params.line_type : "diagonal";

  //判断是否为多组
  // if(data[0].length > 2 ){multiSam = true};
  // console.log(data.length)

  var groups_color = content.groups_color;
  // console.log(groups_color)
  var colors = ["#388E3C", "#F44336", "#0288D1", "#FF9800", "#727272", "#E91E63", "#673AB7", "#8BC34A", "#2196F3", "#D32F2F", "#FFC107", "#BDBDBD", "#F8BBD0", "#3F51B5", "#CDDC39", "#009688", "#C2185B", "#FFEB3B", "#212121", "#FFCCBC", "#BBDEFB", "#0099CC", "#FFcc99", ];
  // var colors = ["yellowgreen", "skyblue", "salmon", "plum", "lavender"];


  var treeData = buildHierarchy(content.data, groups);
  // console.log(treeData);
  // console.log(multiSam);
  var totalSize = 0;
  for(var c=0;c<treeData.children.length;c++){ totalSize += treeData.children[c].size; };
  // console.log(totalSize)

  // Calculate total nodes, max label length
    var totalNodes = 0;

    // variables for drag/drop
    var selectedNode = null;
    var draggingNode = null;
    // panning variables
    var panSpeed = 200;
    var panBoundary = 20; // Within 20px from edges will pan when dragging.
    // Misc. variables
    var i = 0;
    var duration = 750;
    var root;

    // size of the diagram
    // var viewerWidth = $(document).width();
    // var viewerHeight = $(document).height();

    var margin = {
      "top": 100,
      "bottom": 50,
      "left": 100,
      "right": 50
    };
    var viewerWidth = width - margin.left - margin.right;
    var viewerHeight = height - margin.top - margin.bottom;

    // console.log(viewerWidth)
    // console.log(viewerHeight)
    var level = content.data[0][0].split(";").length;
    // console.log(content.data[0][0].split(";").length);
    var maxLabelLength = viewerWidth / level;
    // console.log(maxLabelLength)

    var tree = d3.layout.tree()
        .size([viewerHeight, viewerWidth]);

    // define a d3 diagonal projection for use by the node paths later on.
    var diagonal = d3.svg.diagonal().projection(function(d) {
            return [d.y, d.x];
        });
    if(linkType !== "diagonal"){
      diagonal =  function pathLine(d, i){
        return "M" + d.source.y + "," + d.source.x +
             "H" + d.target.y + "V" + d.target.x;
      };
    }


    // A recursive helper function for performing some setup by walking through all nodes

    function visit(parent, visitFn, childrenFn) {
        if (!parent) return;

        visitFn(parent);

        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    }

    // Call visit function to establish maxLabelLength
    visit(treeData, function(d) {
        totalNodes++;
        // maxLabelLength = Math.max(d.name.length, maxLabelLength);

    }, function(d) {
        return d.children && d.children.length > 0 ? d.children : null;
    });


    // sort the tree according to the node names

    function sortTree() {
        tree.sort(function(a, b) {
            return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
        });
    }
    // Sort the tree initially incase the JSON isn't in a sorted order.
    sortTree();

    // TODO: Pan function, can be better implemented.

    function pan(domNode, direction) {
        var speed = panSpeed;
        if (panTimer) {
            clearTimeout(panTimer);
            translateCoords = d3.transform(svgGroup.attr("transform"));
            if (direction == 'left' || direction == 'right') {
                translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                translateY = translateCoords.translate[1];
            } else if (direction == 'up' || direction == 'down') {
                translateX = translateCoords.translate[0];
                translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
            }
            scaleX = translateCoords.scale[0];
            scaleY = translateCoords.scale[1];
            scale = zoomListener.scale();
            svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
            d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
            zoomListener.scale(zoomListener.scale());
            zoomListener.translate([translateX, translateY]);
            panTimer = setTimeout(function() {
                pan(domNode, speed, direction);
            }, 50);
        }
    }

    // Define the zoom function for the zoomable tree

    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }


    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

    function initiateDrag(d, domNode) {
        draggingNode = d;
        d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show').style('display', 'block');
        d3.select(domNode).attr('class', 'node activeDrag').style('display', 'inline');

        svgGroup.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
            if (a.id != draggingNode.id){
                // a is not the hovered element, send "a" to the back
                return 1;
            } else { return -1; }// a is the hovered element, bring "a" to the front
        });
        // if nodes has children, remove the links and nodes
        if (nodes.length > 1) {
            // remove link paths
            links = tree.links(nodes);
            nodePaths = svgGroup.selectAll("path.link")
                .data(links, function(d) {
                    return d.target.id;
                }).remove();
            // remove child nodes
            nodesExit = svgGroup.selectAll("g.node")
                .data(nodes, function(d) {
                    return d.id;
                }).filter(function(d, i) {
                    if (d.id == draggingNode.id) {
                        return false;
                    }
                    return true;
                }).remove();
        }

        // remove parent link
        parentLink = tree.links(tree.nodes(draggingNode.parent));
        svgGroup.selectAll('path.link').filter(function(d, i) {
            if (d.target.id == draggingNode.id) {
                return true;
            }
            return false;
        }).remove();

        dragStarted = null;
    }

    var dragL = d3.behavior.drag()
        .on("dragstart", function() {
            dstartX = d3.mouse(this)[0];
            dstartY = d3.mouse(this)[1];
            d3.event.sourceEvent.stopPropagation(); // silence other listeners
        })
        .on("drag", function(){
            d3.select(this).attr("transform", "translate("+(d3.event.x-dstartX)+", "+(d3.event.y-dstartY)+")");
        });

    // define the baseSvg, attaching a class for styling and the zoomListener
    var baseSvg = d3.select("#" + container).append("svg").attr("version", 1.1).attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "overlay")
        .attr("id", "svgContent")
        .call(zoomListener);

    var title = baseSvg.append("text").text(content.params.title).attr("font-size", "18px")
    .attr("font-family", "arial").attr("text-anchor", "middle")
    .attr("transform", "translate("+content.size.width/2+", "+35+")")
    .call(dragL);


    // Define the drag listeners for drag/drop behaviour of nodes.
    dragListener = d3.behavior.drag().on("dragstart", function(d) {
            if (d == root) {
                return;
            }
            dragStarted = true;
            nodes = tree.nodes(d);
            d3.event.sourceEvent.stopPropagation();
            // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
        }).on("drag", function(d) {
            if (d == root) {
                return;
            }
            if (dragStarted) {
                domNode = this;
                initiateDrag(d, domNode);
            }

            // get coords of mouseEvent relative to svg container to allow for panning
            relCoords = d3.mouse($('#svgContent').get(0));
            if (relCoords[0] < panBoundary) {
                panTimer = true;
                pan(this, 'left');
            } else if (relCoords[0] > ($('#svgContent').width() - panBoundary)) {

                panTimer = true;
                pan(this, 'right');
            } else if (relCoords[1] < panBoundary) {
                panTimer = true;
                pan(this, 'up');
            } else if (relCoords[1] > ($('#svgContent').height() - panBoundary)) {
                panTimer = true;
                pan(this, 'down');
            } else {
                try {
                    clearTimeout(panTimer);
                } catch (e) {

                }
            }

            d.x0 += d3.event.dy;
            d.y0 += d3.event.dx;
            var node = d3.select(this);
            node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
            updateTempConnector();
        }).on("dragend", function(d) {
            if (d == root) {
                return;
            }
            domNode = this;
            if (selectedNode) {
                // now remove the element from the parent, and insert it into the new elements children
                var index = draggingNode.parent.children.indexOf(draggingNode);
                if (index > -1) {
                    draggingNode.parent.children.splice(index, 1);
                }
                if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
                    if (typeof selectedNode.children !== 'undefined') {
                        selectedNode.children.push(draggingNode);
                    } else {
                        selectedNode._children.push(draggingNode);
                    }
                } else {
                    selectedNode.children = [];
                    selectedNode.children.push(draggingNode);
                }
                // Make sure that the node being added to is expanded so user can see added node is correctly moved
                expand(selectedNode);
                sortTree();
                endDrag();
            } else {
                endDrag();
            }
        });

    function endDrag() {
        selectedNode = null;
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle').style('display', 'none');
        d3.select(domNode).attr('class', 'node');
        // now restore the mouseover event or we won't be able to drag a 2nd time
        d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
        updateTempConnector();
        if (draggingNode !== null) {
            update(root);
            centerNode(draggingNode);
            draggingNode = null;
        }
    }

    // Helper functions for collapsing and expanding nodes.

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    function expand(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach(expand);
            d._children = null;
        }
    }

    var overCircle = function(d) {
        selectedNode = d;
        updateTempConnector();
    };
    var outCircle = function(d) {
        selectedNode = null;
        updateTempConnector();
    };

    // Function to update the temporary connector indicating dragging affiliation
    var updateTempConnector = function() {
        var data = [];
        if (draggingNode !== null && selectedNode !== null) {
            // have to flip the source coordinates since we did this for the existing connectors on the original tree
            data = [{
                source: {
                    x: selectedNode.y0,
                    y: selectedNode.x0
                },
                target: {
                    x: draggingNode.y0,
                    y: draggingNode.x0
                }
            }];
        }
        var link = svgGroup.selectAll(".templink").data(data);

        link.enter().append("path")
            .attr("class", "templink")
            .attr("d", d3.svg.diagonal())
            .attr('pointer-events', 'none')
            .style("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", "3px");

        link.attr("d", d3.svg.diagonal());

        link.exit().remove();
    };

    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

    function centerNode(source) {
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

    // Toggle children function

    function toggleChildren(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        return d;
    }

    // Toggle children on click.

    function click(d) {
        if (d3.event.defaultPrevented) return; // click suppressed
        d = toggleChildren(d);
        update(d);
        centerNode(d);
    }

    function update(source) {
        // Compute the new height, function counts total children of root node and sets tree height accordingly.
        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
        // This makes the layout more consistent.
        var levelWidth = [1];
        var childCount = function(level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function(d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        // console.log("llllll"+levelWidth)
        var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line
        // tree = tree.size([newHeight, viewerWidth]);

        // Compute the new tree layout.
        var nodes = tree.nodes(root).slice(1).reverse(),
            links = tree.links(nodes);

        // Set widths between levels based on maxLabelLength.
        // console.log(maxLabelLength)
        nodes.forEach(function(d) {
            d.y = (d.depth * (maxLabelLength * 1)); //maxLabelLength * 10px
            // alternatively to keep a fixed scale one can set a fixed depth per level
            // Normalize for fixed-depth by commenting out below line
            // d.y = (d.depth * 500); //500px per level.
        });

        // Update the nodes…
        node = svgGroup.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            // .call(dragListener)
            .attr("class", "node")
            .style('cursor','pointer')
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on('click', click);

        nodeEnter.append("circle")
            .attr('class', 'nodeCircle')
            .attr("r", 0)
            .attr("stroke", "steelblue")
            .attr("stroke-width", "1.5px")
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });


        //多样本加pie
        if(multiSam){
        var pie = d3.layout.pie().sort(null).value(function(d) {
          return d;
        });

        var arc = d3.svg.arc().innerRadius(0).outerRadius(radius);
        var nodePies = nodeEnter.append("g").attr("class", "nodePie");
        var piePath = nodePies.selectAll(".nodePie").data(function(d){ return pie(d.groups); }).enter().append("path").attr("class", "nodePie")
        .attr("fill", function(d, i){return content.groups_color ? groups_color[groups[i]]: colors[i]})
        .attr("d", arc)
        .attr("stroke", "grey");
      }


        nodeEnter.append("text")
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("dy", ".35em")
            .attr('class', 'nodeText')
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.name;
            })
            .style("fill-opacity", 0);

        // phantom node to give us mouseover in a radius around it
        nodeEnter.append("circle")
            .attr('class', 'ghostCircle')
            .style('display', 'none')
            .attr("r", 30)
            .attr("opacity", 0.2) // change this to zero to hide the target area
        .style("fill", "red")
            .attr('pointer-events', 'mouseover')
            .on("mouseover", function(node) {
                overCircle(node);
            })
            .on("mouseout", function(node) {
                outCircle(node);
            });

        // Update the text to reflect whether node has children or not.
        node.select('text')
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("y", function(d) {return multiSam ? -22 : -Math.sqrt(d.size/totalSize * circleR)-10; })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "middle" : "middle";
            })
            .text(function(d) {
                return d.name;
                // return d.name.slice(3);
                // return d.children ? d.name.slice(3) : null;
            })
            .attr("font-family", "arial")
            .attr("font-size", "10px");

        // Change the circle fill depending on whether it has children and is collapsed
        node.select("circle.nodeCircle")
            .attr("r", function(d) { d["r"] = Math.sqrt(d.size/totalSize * circleR); return  multiSam ? 3 : d.r; })
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        // Fade the text in
        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 0);

        nodeExit.select("text")
            .style("fill-opacity", 0);

        // Update the links…
        var link = svgGroup.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .style("fill", "none")
            .attr("stroke", "#ccc")
            .attr("stroke-width", "1.5px")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Append a group which holds all nodes and which the zoom Listener can act upon.
    var svgGroup = baseSvg.append("g")
    .attr("transform", "translate("+(margin.left)+", "+margin.top+")");

    // Define the root
    root = treeData;
    root.x0 = viewerHeight / 4;
    root.y0 = 0;

    d3.selectAll(".node").style("cursor", "pointer");

    // Layout the tree initially and center on the root node.
    update(root);
    // centerNode(root);
    // console.log(root)
//111111111

}
