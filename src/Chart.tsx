import React, { useEffect, useRef } from "react";
import * as d3 from 'd3';
import { StandStats } from './StandStats';


const HEIGHT = 500;
const WIDTH = 500;
const OUTER_RADIUS = (WIDTH / 2) * 0.8;


function appendBorder(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
    svg.append("circle")
        .attr("r", OUTER_RADIUS)
        .attr("fill", "white")
        .attr("stroke-width", 5)
        .attr("stroke", "#c09f10");
}


function mapValueToLetter(num: any): string {
    const lookup = {
        1: "E",
        2: "D",
        3: "C",
        4: "B",
        5: "A"
    };
    return lookup[num as 1 | 2 | 3 | 4 | 5] || '?';
}


function appendAxisLabelsAndSummaries(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, svgData: number[]) {
    const categories = [
        "Power",
        "Speed",
        "Range",
        "Stamina",
        "Precision",
        "Potential",
    ]

    const xAxisLabelRadius = OUTER_RADIUS * 0.9;
    const xAxisLabels = (g: any) => g
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .call((g: any) => g.selectAll("g")
            .data(categories)
            .join("g")
            .call((g: any) => g.append("path")
                .attr("id", (d: string) => d)
                .attr("fill", "none")
                .attr("d", (d: string, i: number) => `
              M ${d3.pointRadial((2 * Math.PI * i) / 6, xAxisLabelRadius)}
              A${xAxisLabelRadius},${xAxisLabelRadius} 0,0,1 ${d3.pointRadial(i + 1, xAxisLabelRadius)}
        `))
            .call((g: any) => g.append("text")
                .append("textPath")
                .attr("xlink:href", (d: string) => `#${d}`)
                .text((d: string) => d)))

    svg.append("g")
        .call(xAxisLabels);


    const summaryValues = svgData.map(mapValueToLetter);
    const summaryRadius = xAxisLabelRadius * 0.8;
    const xAxisSummaries = (g: any) => g
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .attr("font-size", 25)
        .attr("fill", "red")
        .call((g: any) => g.selectAll("g")
            .data(summaryValues)
            .join("g")
            .call((g: any) => g.append("text")
                .attr('x', (d: string, i: number) => d3.pointRadial((2 * Math.PI * i) / 6, summaryRadius)[0])
                .attr('y', (d: string, i: number) => d3.pointRadial((2 * Math.PI * i) / 6, summaryRadius)[1])
                .text((d: string) => d)));

    svg.append("g")
        .call(xAxisSummaries);
}


function appendPolygonGraph(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, svgData: number[]) {
    const polygonRadius = OUTER_RADIUS * 0.5;

    svg.append("circle")
        .attr("r", polygonRadius)
        .attr("fill", "white")
        .attr("stroke-width", 1)
        .attr("stroke", "black");

    const yAxis = (g: any) => g
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .call((g: any) => g.selectAll("g")
            .data(svgData)
            .join("g")
            .call((g: any) => g.append("line")
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', (d: string, i: number) => d3.pointRadial((2 * Math.PI * i) / 6, polygonRadius)[0])
                .attr('y2', (d: string, i: number) => d3.pointRadial((2 * Math.PI * i) / 6, OUTER_RADIUS * 0.5)[1])
                .text((d: string) => d)));

    svg.append("g")
        .call(yAxis);

    svg.append("polygon")
        .attr("fill", "blue")
        .attr("fill-opacity", 0.4)
        .data([svgData])
        .attr("points", (d: number[]) => d.map((val: number, i: number) => {
            const point = d3.pointRadial((2 * Math.PI * i) / 6, (polygonRadius) * (val * 0.17));
            return point.join(',');
        }).join(" "));
}


function createStatChartElement(stats: StandStats): HTMLDivElement {
    const node = document.createElement('div');
    const svg = d3.select(node)
        .append("svg")
        .attr("viewBox", [-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT])
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

    const svgData = [
        stats.power,
        stats.speed,
        stats.range,
        stats.stamina,
        stats.precision,
        stats.potential
    ];

    appendBorder(svg);
    appendAxisLabelsAndSummaries(svg, svgData);
    appendPolygonGraph(svg, svgData);

    return node;
}


interface ChartProps {
    stats: StandStats | undefined
}

function Chart(props: ChartProps): JSX.Element {
    const containerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;

    useEffect(() => {
        if (!containerRef.current || !props.stats) {
            return;
        }
        const chart = createStatChartElement(props.stats);
        containerRef.current.replaceChildren(chart);
    }, [props.stats]);


    return (
        <div id="stand-chart-container" ref={containerRef} />
    )
}

export default Chart;