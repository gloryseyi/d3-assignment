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
        d3.json(`http://34.38.72.236/Circles/Towns/50`).then(
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
            }
        );
    }
);