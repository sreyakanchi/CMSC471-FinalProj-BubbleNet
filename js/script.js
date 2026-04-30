// metadata to match the keys in data.json! 
const TOPICS = [
    { key: "boston",             label: "Boston Bombing",      type: "non-political" },
    { key: "budget",             label: "Budget",              type: "political" },
    { key: "governmentshutdown", label: "Government Shutdown", type: "political" },
    { key: "marriageequality",   label: "Marriage Equality",   type: "political" },
    { key: "minimum_wage",       label: "Minimum Wage",        type: "political" },
    { key: "newtown",            label: "Newtown",             type: "non-political" },
    { key: "olympics",           label: "Olympics",            type: "non-political" },
    { key: "oscars",             label: "Oscars",              type: "non-political" },
    { key: "sotu",               label: "State of the Union",  type: "political" },
    { key: "superbowl",          label: "Super Bowl",          type: "non-political" },
    { key: "syria",              label: "Syria",               type: "political" },
];

let allData;
let simulation;
let svg, g, zoom;
const width = 900; 
const height = 600; 

function createVis(data) {
    if (simulation) simulation.stop();
    g.selectAll("*").remove();

    const color = d3.scaleOrdinal(d3.schemeCategory10); // TODO: change color 

    const links = data.edges.map(d => ({...d}));
    const nodes = data.nodes.map(d => ({...d}));

    //create simulation
    simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).strength(0.5))
        .force("charge", d3.forceManyBody().strength(-30))  // was -300
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

    //edges (line for each edge, and a circle for each node)
    const link = g.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll()
        .data(links)
        .join("line")
        .attr("stroke-width", 1); 

    //nodes
    const node = g.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll()
        .data(nodes)
        .join("circle")
        .attr("r", 5)
        .attr("fill", "black"); // TODO: color by ideology 

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





// builds the  buttons to toggle between diff topics 
function buildTopicButtons(defaultKey) {
    TOPICS.forEach(topic => {
        const containerId = topic.type === "political" 
            ? "#topic-buttons-political" 
            : "#topic-buttons-nonpolitical";

        d3.select(containerId)
            .append("button")
            .attr("class", "topic-btn")
            .attr("data-key", topic.key)
            .attr("data-type", topic.type)
            .classed("active", topic.key === defaultKey)
            .text(topic.label)
            .on("click", function() {
                d3.selectAll(".topic-btn").classed("active", false);
                d3.select(this).classed("active", true);
                // Update status bar
                d3.select("#current-topic-label").text(topic.label);
                d3.select("#current-topic-type")
                    .text(topic.type === "political" ? "Political" : "Non-political")
                    .attr("class", "type-badge " + topic.type);
                createVis(allData[topic.key]);
            });
    });
}



function init() {
    // build svg once in init; createvis w remove and redraw it when category changes 
    svg = d3.select("#vis").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    // zoom here 
    g = svg.append("g"); 
    zoom = d3.zoom()
        .scaleExtent([0.1, 8]) // min 10% zoom, max 800%
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });

    svg.call(zoom);
    svg.call(zoom.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(0.4).translate(-width / 2, -height / 2)
    );

    // reset zoom button 
    d3.select("#reset-zoom").on("click", () => {
        svg.transition().duration(500).call(
            zoom.transform,
            d3.zoomIdentity.translate(width / 2, height / 2).scale(0.4).translate(-width / 2, -height / 2)
        );
    });

    d3.json("./data/data.json")
        .then(data => {
            allData = data;
            buildTopicButtons("minimum_wage"); // default topic to start; can change! 
            createVis(allData["minimum_wage"]);
        })
        .catch(error => console.error("Error loading data.json:", error));
}

window.addEventListener("load", init);