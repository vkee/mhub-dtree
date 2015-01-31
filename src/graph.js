function Graph() {
    // Create the input graph
    this.dagreGraph =  new dagreD3.graphlib.Graph()
        .setGraph({})
        .setDefaultEdgeLabel(function () {
            return {};
        });
}

Graph.prototype.renderGraph = function() {
    this.dagreGraph.nodes().forEach(function (v) {
        var node = this.dagreGraph.node(v);
        // Round the corners of the nodes
        node.rx = node.ry = 5;
    }, this);

    // Create the renderer
    var render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select("svg"),
        svgGroup = svg.append("g");

    // Run the renderer. This is what draws the final graph.
    render(d3.select("svg g"), this.dagreGraph);

    // Center the graph
    var xCenterOffset = (svg.attr("width") - this.dagreGraph.graph().width) / 2;
    svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
    svg.attr("height", this.dagreGraph.graph().height + 40);
}

Graph.prototype.addNode = function(id, label) {
    this.dagreGraph.setNode(id, {label: label});
}

Graph.prototype.addEdge = function(parent, child) {
    this.dagreGraph.setEdge(parent, child);
}

var g = new Graph();

g.addNode(0, "TOP");
g.addNode(1, "S");
g.addNode(2, "NP");
g.addNode(3, "DT");
g.addNode(4, "This");
g.addNode(5, "VP");
g.addNode(6, "VBZ");
g.addNode(7, "is");
g.addNode(8, "NP");
g.addNode(9, "DT");
g.addNode(10, "an");
g.addNode(11, "NN");
g.addNode(12, "example");
g.addNode(13, ".");
g.addNode(14, "sentence");

g.addEdge(3, 4);
g.addEdge(2, 3);
g.addEdge(1, 2);
g.addEdge(6, 7);
g.addEdge(5, 6);
g.addEdge(9, 10);
g.addEdge(8, 9);
g.addEdge(11, 12);
g.addEdge(8, 11);
g.addEdge(5, 8);
g.addEdge(1, 5);
g.addEdge(13, 14);
g.addEdge(1, 13);
g.addEdge(0, 1);

g.renderGraph();

