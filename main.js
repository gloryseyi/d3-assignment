const canvas = d3.select(".canvas")
const height = 850
const width  = 650

const map_svg = canvas
    .append("svg")
    .attr("height", height)
    .attr("width", width)

const g = map_svg.append("g")
const projection = d3.geoMercator()

const geoPath = d3.geoPath(projection)

d3.json('uk_map.json').then(
    mapData => {
        projection.fitSize([width, height], mapData);

        g.selectAll("path")
        .data(mapData.features)
        .enter()
        .append("path")
        .attr("fill", "white")
        .attr( "stroke", "#000")
        .attr( "d", geoPath);
    }
);