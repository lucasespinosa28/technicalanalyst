import React, { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";

interface CandleChartProps {
    data: {
        Date: Date;
        Open: number;
        High: number;
        Low: number;
        Close: number;
    }[];
    width?: number;
    height?: number;
}

const CandleChart: React.FC<CandleChartProps> = (
    { data, width = 928, height = 300 },
) => {
    const svgRef = useRef<SVGSVGElement>(null);

    const interval = useMemo(() => {
        if (data.length < 2) return "day";

        const timeDiff = data[1].Date.getTime() - data[0].Date.getTime();
        const minutesDiff = timeDiff / (1000 * 60);

        if (minutesDiff < 60) return "minute";
        if (minutesDiff < 24 * 60) return "hour";
        return "day";
    }, [data]);
    useEffect(() => {
        if (!data || data.length === 0 || !svgRef.current) return;

        const marginTop = 5;
        const marginRight = 60;
        const marginBottom = 100;
        const marginLeft = 60;

        // Ensure dates are valid Date objects
        const validData = data.filter((d) =>
            d.Date instanceof Date && !isNaN(d.Date.getTime())
        );

        const availableWidth = width - marginLeft - marginRight;
        const maxCandleWidth = 15; // Maximum width of a candle
        const minCandleWidth = 2; // Minimum width of a candle
        const spacing = 1; // Space between candles

        const candleWidth = Math.min(
            maxCandleWidth,
            Math.max(minCandleWidth, (availableWidth / validData.length) - spacing)
        );

        const x = d3.scaleTime()
            .domain(d3.extent(validData, d => d.Date) as [Date, Date])
            .range([marginLeft, width - marginRight]);

                const y = d3.scaleLog()
                    .domain([
                        d3.min(validData, (d) => d.Low) || 1,
                        d3.max(validData, (d) => d.High) || 1,
                    ])
                    .rangeRound([height - marginBottom, marginTop]);

                const svg = d3.select(svgRef.current)
                    .attr("viewBox", [0, 0, width, height]);

                svg.selectAll("*").remove(); // Clear previous render

                // Function to format date based on interval
                const formatDate = (date: Date) => {
                    switch (interval) {
                        case "minute":
                            return d3.timeFormat("%H:%M")(date);
                        case "hour":
                            return d3.timeFormat("%d %b %H:%M")(date);
                        default:
                            return d3.timeFormat("%d %b")(date);
                    }
                };

                const getTickValues = () => {
                    const dateExtent = d3.extent(validData, (d) => d.Date);
                    if (!dateExtent[0] || !dateExtent[1]) return [];

                    switch (interval) {
                        case "minute":
                            return d3.timeMinute.every(30)!.range(dateExtent[0], dateExtent[1]);
                        case "hour":
                            return d3.timeHour.every(6)!.range(dateExtent[0], dateExtent[1]);
                        default:
                            return d3.timeDay.every(1)!.range(dateExtent[0], dateExtent[1]);
                    }
                };
                // Create x-axis
                const xAxis = svg.append("g")
                    .attr("transform", `translate(0,${height - marginBottom})`)
                    .call(
                        d3.axisBottom(x)
                            .tickValues(getTickValues())
                            .tickFormat(d => formatDate(d as Date))
                    );

                // Adjust x-axis labels
                xAxis.selectAll(".tick text")
                    .attr("transform", "rotate(-45)")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em");

                // Remove x-axis domain line
                xAxis.select(".domain").remove();

                svg.append("g")
                    .attr("transform", `translate(${marginLeft},0)`)
                    .call(
                        d3.axisLeft(y)
                            .tickFormat(d3.format("$~f"))
                            .tickValues(
                                d3.scaleLinear().domain(y.domain() as [number, number])
                                    .ticks(),
                            ),
                    )
                    .call((g) =>
                        g.selectAll(".tick line").clone()
                            .attr("stroke-opacity", 0.2)
                            .attr("x2", width - marginLeft - marginRight)
                    )
                    .call((g) => g.select(".domain").remove());

                const g = svg.append("g")
                    .attr("stroke-linecap", "butt")
            .attr("stroke", "black")
            .selectAll("g")
            .data(validData)
            .join("g")
            .attr(
                "transform",
                (d) => `translate(${x(d.Date) - candleWidth / 2},0)`,
            );

        g.append("line")
            .attr("x1", candleWidth / 2)
            .attr("x2", candleWidth / 2)
            .attr("y1", (d) => y(d.Low))
            .attr("y2", (d) => y(d.High))
            .attr("stroke-width", 1);

        g.append("rect")
            .attr("x", 0)
            .attr("y", (d) => Math.min(y(d.Open), y(d.Close)))
            .attr("width", candleWidth)
            .attr("height", (d) => Math.abs(y(d.Close) - y(d.Open)))
            .attr("fill", (d) =>
                d.Open > d.Close
                    ? d3.schemeSet1[0]
                    : d.Close > d.Open
                        ? d3.schemeSet1[2]
                        : d3.schemeSet1[8]
            );

        const formatValue = d3.format(".2f");
        const formatChange = ((f) => (y0: number, y1: number) =>
            f((y1 - y0) / y0))(d3.format("+.2%"));

        g.append("title")
            .text((d) =>
                `${formatDate(d.Date)}
Open: ${formatValue(d.Open)}
Close: ${formatValue(d.Close)} (${formatChange(d.Open, d.Close)})
Low: ${formatValue(d.Low)}
High: ${formatValue(d.High)}`
            );
    }, [data, width, height, interval]);

    return <svg ref={svgRef} />;
};

export default CandleChart;
