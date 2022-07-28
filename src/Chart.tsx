import React, { useEffect, useRef } from "react";
import * as d3 from 'd3';
import { StandStats } from './StandStats';


const HEIGHT = 500;
const WIDTH = 500;
const OUTER_RADIUS = (WIDTH / 2) * 0.99;


function appendBorder(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
    svg.append("circle")
        .attr("r", OUTER_RADIUS)
        .attr("fill", "none")
        .attr("stroke-width", 3)
        .attr("stroke", "black");
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

function radialPointOnAxis(axisIndex: number, radius: number): number[] {
    return d3.pointRadial((2 * Math.PI * axisIndex) / 6, radius);
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
        .attr("font-family", "serif")
        .attr("font-weight", "bold")
        .attr("font-size", 15)
        .call((g: any) => g.selectAll("g")
            .data(categories)
            .join("g")
            .call((g: any) => g.append("path")
                .attr("id", (d: string) => d)
                .attr("fill", "none")
                .attr("d", (d: string, i: number) => `
              M ${radialPointOnAxis(i - 1, xAxisLabelRadius)}
              A${xAxisLabelRadius},${xAxisLabelRadius} 0,0,1 ${radialPointOnAxis(i + 1, xAxisLabelRadius)}
        `))
            .call((g: any) => g.append("text")
                .append("textPath")
                .attr("startOffset", "50%")
                .attr("text-anchor", "middle")
                .attr("xlink:href", (d: string) => `#${d}`)
                .text((d: string) => d)))

    svg.append("g")
        .call(xAxisLabels);


    const summaryValues = svgData.map(mapValueToLetter);
    const summaryRadius = xAxisLabelRadius * 0.825;
    const xAxisSummaries = (g: any) => g
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .attr("font-size", 40)
        .attr("fill", "black")
        .call((g: any) => g.selectAll("g")
            .data(summaryValues)
            .join("g")
            .call((g: any) => g.append("text")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr('x', (d: string, i: number) => radialPointOnAxis(i, summaryRadius)[0])
                .attr('y', (d: string, i: number) => radialPointOnAxis(i, summaryRadius)[1])
                .text((d: string) => d)));

    svg.append("g")
        .call(xAxisSummaries);
}


function appendPolygonGraph(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, svgData: number[]) {
    const polygonRadius = OUTER_RADIUS * 0.6;

    svg.append("circle")
        .attr("r", polygonRadius)
        .attr("fill", "none")
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
                .attr('x2', (d: string, i: number) => radialPointOnAxis(i, polygonRadius)[0])
                .attr('y2', (d: string, i: number) => radialPointOnAxis(i, polygonRadius)[1])
                .text((d: string) => d)));

    svg.append("g")
        .call(yAxis);

    const powerLevelStep = 0.17;
    svg.append("polygon")
        .attr("fill", "red")
        .attr("fill-opacity", 0.45)
        .data([svgData])
        .attr("points", (d: number[]) => d.map((val: number, i: number) => {
            const point = radialPointOnAxis(i, polygonRadius * (val * powerLevelStep));
            return point.join(',');
        }).join(" "));
}


function createStatChartElement(stats: StandStats): HTMLDivElement {
    const node = document.createElement('div');
    const svg = d3.select(node)
        .append("svg")
        .attr("viewBox", [-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT]);

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
        <div className="standChart filterShadow" ref={containerRef} />
    )
}

export default Chart;