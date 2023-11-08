const canvas = d3.select(".canvas")
const height = 850
const width  = 650

const map_svg = canvas
    .append("svg")
    .attr("height", height)
    .attr("width", width)

const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .classed("visible", true)

const span = d3.select("span")
const button = d3.select(".button")

let townLimit;

function setTownLimit(value){
    townLimit = value
    span.text(townLimit)
}

button.on("click", () => loadDataOnMap(townLimit))

d3.select(window).on("load", () => loadDataOnMap(50));

const g = map_svg.append("g")
const projection = d3.geoMercator()

const geoPath = d3.geoPath(projection)

function loadDataOnMap(townCount) {
    d3.json('uk_map.json').then(
        mapData => {
            d3.json(`http://34.38.72.236/Circles/Towns/${townCount}`).then(
                townData => {
                    projection.fitSize([width, height], mapData);
    
                    g.selectAll("path")
                    .data(mapData.features)
                    .enter()
                    .append("path")
                    .attr("fill", "white")
                    .attr( "stroke", "#000")
                    .attr( "d", geoPath);
    
                    let circle = g.selectAll("circle")
                    .data(townData);
    
                    circle.exit().remove();
    
                    circle.enter().append("circle")
                    .merge(circle)
                    .attr("cx", d => projection([d.lng, d.lat])[0])
                    .attr("cy", d => projection([d.lng, d.lat])[1])
                    .attr("r", d => d.Population/10_000)
                    .attr("fill", "tomato")
                    .on("mouseover", function(e, d) {
                        tooltip.classed("visible", false).html(
                        `Town: <strong>${d.Town}</strong>
                        <br/>
                        Population: <strong>${d.Population.toLocaleString()}</strong>
                        <br/>
                        County: <strong>${d.County}</strong>`
                        ).style("left", (e.pageX) + "px")
                        .style("top", (e.pageY) + "px")
                        
                    }).on("mouseout", () => tooltip.classed("visible", true));
                }
            );
        }
    );
}

