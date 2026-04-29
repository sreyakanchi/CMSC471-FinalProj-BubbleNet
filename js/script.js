function createVis(data) {
    const width = 1200;
    const height = 800;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const links = data.edges.map(d => ({...d}));
    const nodes = data.nodes.map(d => ({...d}));

    //create simulation
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).strength(0.5))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);  

    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    //SVG container
    const svg = d3.select("#vis").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    //edges (line for each edge, and a circle for each node)
    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll()
        .data(links)
        .join("line")
        .attr("stroke-width", 1); 

    //nodes
    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll()
        .data(nodes)
        .join("circle")
        .attr("r", 5)
        .attr("fill", "black");

    //Drag behavior (same as lab 7)
    node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }
}

function init() {
    d3.json("./data/data.json")
        .then(data => createVis(data.boston)) //starting with boston as th first default topic, but you guys can change when you do the dropdown
        .catch(error => console.error("Error loading data.json:", error));
}

window.addEventListener("load", init);
