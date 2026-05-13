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
    d3.select("#bar-chart").selectAll("*").remove();

    // smooth transition from blue to white to red
    const colorScale = d3.scaleLinear()
        .domain([-3, 0, 3])
        .range(["#4575b4", "#f7f7f7", "#d73027"])
        .interpolate(d3.interpolateHcl)
        .clamp(true);

    const color = d => colorScale(d.ideology);

    // for size scaling
    const links = data.edges.map(d => ({...d}));
    const nodes = data.nodes.map(d => ({...d}));

    //counting idealogies for bar graph 
    const ideologyCounts = {
        "Very Liberal": 0,
        "Liberal": 0,
        "Moderate": 0,
        "Conservative": 0,
        "Very Conservative": 0
    };

    nodes.forEach(d => {
        if (d.ideology <= -2) {
            ideologyCounts["Very Liberal"]++;
        } else if (d.ideology < -1) {
            ideologyCounts["Liberal"]++;
        } else if (d.ideology <= 1) {
            ideologyCounts["Moderate"]++;
        } else if (d.ideology < 2) {
            ideologyCounts["Conservative"]++;
        } else {
            ideologyCounts["Very Conservative"]++;
        }
    });

    const degree = {};
    links.forEach(l => {
        const sourceId = l.source.id || l.source;
        const targetId = l.target.id || l.target;
        degree[sourceId] = (degree[sourceId] || 0) + 1;
        degree[targetId] = (degree[targetId] || 0) + 1;
    });
    nodes.forEach(n => {
        n.degree = degree[n.id] || 0;
    });
    
    // size, can change range later
    const radiusScale = d3.scaleSqrt()
        .domain(d3.extent(nodes, d => d.degree))
        .range([4, 40]);

    //create simulation
    simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).strength(1))
        .force("charge", d3.forceManyBody().strength(-15))  // was -300
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide(d => radiusScale(d.degree) + 1))
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
        .attr("stroke", "#bbbbbb")
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
        // scaling
        .attr("r", d => radiusScale(d.degree))
        // color
        .attr("fill", d => color(d));

    const barData = Object.entries(ideologyCounts).map(([group, count]) => ({
        group,
        count
    }));

    //bar chart to show idealogical distribution
    const barSvgWidth = 700;
    const barSvgHeight = 350;
    const margin = { top: 80, right: 10, bottom: 40, left: 10 };

    const barSvg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", barSvgWidth)
        .attr("height", barSvgHeight)
        .attr("viewBox", [0, 0, barSvgWidth, barSvgHeight])

    const barChart = barSvg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const barWidth = barSvgWidth - margin.left - margin.right;
    const barHeight = barSvgHeight - margin.top - margin.bottom;

    const x = d3.scaleBand()
        .domain(barData.map(d => d.group))
        .range([0, barWidth])
        .padding(0.35);

    const y = d3.scaleLinear()
        .domain([0, d3.max(barData, d => d.count)])
        .range([barHeight, 0]);

    barChart.selectAll("rect")
        .data(barData)
        .join("rect")
        .attr("x", d => x(d.group))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => barHeight - y(d.count))
        .attr("fill", d => {
            if (d.group === "Very Liberal") return colorScale(-3);
            if (d.group === "Liberal") return colorScale(-1.5);
            if (d.group === "Moderate") return colorScale(-0.2);
            if (d.group === "Conservative") return colorScale(1.5);
            if (d.group === "Very Conservative") return colorScale(3);
        }); 

    barChart.selectAll(".bar-label")
        .data(barData)
        .join("text")
        .attr("class", "bar-label")
        .attr("x", d => x(d.group) + x.bandwidth() / 2)
        .attr("y", d => y(d.count) - 10)
        .attr("text-anchor", "middle")
        .text(d => d.count);

    barChart.selectAll(".bar-name")
        .data(barData)
        .join("text")
        .attr("class", "bar-name")
        .attr("x", d => x(d.group) + x.bandwidth() / 2)
        .attr("y", barHeight + 15)
        .attr("text-anchor", "middle")
        .text(d => d.group);

    const currentTopic = TOPICS.find(t => allData[t.key] === data);

    barSvg.append("text")
        .attr("class", "bar-title")
        .attr("x", barSvgWidth / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .text(`Twitter User Distribution for ${currentTopic.label}`);
    barSvg.append("text")
        .attr("class", "bar-caption")
        .attr("x", barSvgWidth / 2)
        .attr("y", 48)
        .attr("text-anchor", "middle")
        .text("Represents the breakdown in ideological distribution among the users sampled from the overall dataset");



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



    // legend stuff
    const legendStops = [
        { offset: "0%",   color: "#4575b4", label: "Liberal" },
        { offset: "25%",  color: "#67a9cf", label: "" },
        { offset: "50%",  color: "#cccccc", label: "Moderate" },
        { offset: "75%",  color: "#ef8a62", label: "" },
        { offset: "100%", color: "#d73027", label: "Conservative" },
    ];

    const legendHeight = 60;
    const legendBarWidth = 8;

    const legend = svg.append("g")
        //.attr("transform", `translate(${width - 140}, 20)`);
        .attr("transform", `translate(40, 40)`);
    
    legend.append("text")
        .attr("x", 0).attr("y", 0)
        .style("font-size", "11px")
        .style("font-weight", "bold")
        .attr("fill", "#1a1a1a")
        .text("Political Ideology");

    // gradient definition — y2=100% makes it vertical
    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "ideology-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");

    legendStops.forEach(stop => {
        gradient.append("stop")
            .attr("offset", stop.offset)
            .attr("stop-color", stop.color);
    });

    // gradient bar itself
    legend.append("rect")
        .attr("x", 0).attr("y", 12)
        .attr("width", legendBarWidth)
        .attr("height", legendHeight)
        .attr("fill", "url(#ideology-gradient)");

    // labels next to each stop
    legend.selectAll(".legend-label")
        .data(legendStops)
        .join("text")
        .attr("x", legendBarWidth + 8)
        .attr("y", (d, i) => 20 + (i / (legendStops.length - 1)) * legendHeight * 0.83)
        .style("font-size", "9px")
        //.style("font-family", "Arial, sans-serif")
        .attr("fill", "#525252")
        .text(d => d.label);

    legend.insert("rect", ":first-child")
        .attr("x", -10)
        .attr("y", -20)
        .attr("width", 120)
        .attr("height", legendHeight + 45)
        .attr("fill", "#f5f5f5")
        .attr("fill-opacity", 0.8)
        .attr("stroke", "#cccccc")  // stroke stays fully opaque
        .attr("stroke-width", 0.5)
        .attr("rx", 12);
    

}
window.addEventListener("load", init);