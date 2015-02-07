function Graph() {
    // Create the input graph
    this.dagreGraph =  new dagreD3.graphlib.Graph()
        .setGraph({})
        .setDefaultEdgeLabel(function () {
            return {};
        });
}

Graph.prototype.renderGraph = function() {
    // Create the renderer
    var render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select("svg"),
        svgGroup = svg.append("g");

    // Run the renderer. This is what draws the final graph.
    render(d3.select("svg g"), this.dagreGraph);

    // Center the graph
    var xCenterOffset = (svg[0][0].clientWidth - this.dagreGraph.graph().width) / 2;
    svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
    //svg.attr("height", this.dagreGraph.graph().height + 40);

    // Set up zoom support
    var zoom = d3.behavior.zoom().on("zoom", function() {
            svgGroup.attr("transform", "translate(" + d3.event.translate + ")" +
            "scale(" + d3.event.scale + ")");
        });
    svg.call(zoom);
}

Graph.prototype.addNode = function(id, label) {
    this.dagreGraph.setNode(id, {label: label});

    var node = this.dagreGraph.node(id);
    // Round the corners of the nodes
    node.rx = node.ry = 5;
}

Graph.prototype.addEdge = function(parent, child) {
    this.dagreGraph.setEdge(parent, child);
}

Graph.prototype.getNodes = function() {
    return this.dagreGraph.nodes();
}

Graph.prototype.containsNode = function(id) {
    return this.getNodes().indexOf(id.toString()) != -1;
}