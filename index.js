const dataJson = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

d3.json(dataJson)
    .then(dataJson => {
        dataJson.forEach(function (d) {
            d.Place = +d.Place;
            var parsedTime = d.Time.split(':');
            d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
            console.log(d.Time)
            console.log(d.Place)
            console.log(parsedTime)

        });
        const width = 960
        const height = 540

        const margin = {
            top: 20,
            bottom: 20,
            right: 20,
            left: 20
        }
        const innerHeight = height - (margin.top + margin.bottom)
        const innerWidth = width - (margin.left + margin.right)

        const formatTime = d3.utcFormat("%M:%S");

        const svg = d3.select('svg')
            .attr('width', width)
            .attr('height', height)
            .attr("style", "width: 100%; height: 10%; font: 10px sans-serif; background-color: white;")


        const x = d3.scaleLinear()
            .range([0, innerWidth])

        const y = d3.scaleTime()
            .range([0, innerHeight])

        x.domain([
            d3.min(dataJson, function (d) {
                return d.Year - 1;
            }),
            d3.max(dataJson, function (d) {
                return d.Year + 1;
            })
        ]);
        y.domain(
            d3.extent(dataJson, function (d) {
                return d.Time;
            })
        );


        var color = d3.scaleOrdinal(d3.schemeCategory10);




        var div = d3
            .select('body')
            .append('div')
            .attr('class', 'tooltip')
            .attr('id', 'tooltip')
            .style('opacity', 0);

        const textTitle = svg.append("text")
            .text("Doping in Professional Bicycle Racing")
            .attr('x', innerWidth / 2 - 69)
            .attr('y', 30)
            .attr("text-anchor", "middle")
            .attr('id', 'title')
            .style("font-size", "16px")
            .style("text-decoration", "underline")



        const xAxis = svg.append('g')
            .attr('width', width)
            .attr(`transform`, 'translate(20,510)')
            .attr('id', "x-axis");
        xAxis.call(d3.axisBottom(x))
        d3.tickFormat(d3.format('d'))

        const yAxis = svg.append('g')
            .attr('id', 'y-axis')
            .attr(`transform`, 'translate(40,10)')
        yAxis.call(d3.axisLeft(y))

        d3.tickFormat(formatTime)

        const circle = svg.selectAll('.dot')
            .data(dataJson)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('r', 6)
            .attr('cx', function (d) {
                return x(d.Year);
            })
            .attr('cy', function (d) {
                return y(d.Time);
            })
            .attr('data-xvalue', function (d) {
                return d.Year;
            })
            .attr('data-yvalue', function (d) {
                return d.Time.toISOString();
            })
            .style('fill', function (d) {
                return color(d.Doping !== '');
            })
            .on('mouseover', function (event, d) {
                div.style('opacity', 0.9);
                div.attr('data-year', d.Year);
                div
                    .html(
                        d.Name +
                        ': ' +
                        d.Nationality +
                        '<br/>' +
                        'Year: ' +
                        d.Year +
                        ', Time: ' +
                        formatTime(d.Time) +
                        (d.Doping ? '<br/><br/>' + d.Doping : '')
                    )
                    .style('left', event.pageX + 'px')
                    .style('top', event.pageY - 28 + 'px');
            })
            .on('mouseout', function () {
                div.style('opacity', 0);
            });
        svg
            .append('text')
            .attr('id', 'title')
            .attr('x', width / 2)
            .attr('y', 0 - margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '30px')
            .text('Doping in Professional Bicycle Racing');


        var legendContainer = svg.append('g').attr('id', 'legend');

        var legend = legendContainer
            .selectAll('#legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend-label')
            .attr('transform', function (d, i) {
                return 'translate(0,' + (height / 2 - i * 20) + ')';
            });

        legend
            .append('rect')
            .attr('x', width - 18)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', color);

        legend
            .append('text')
            .attr('x', width - 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text(function (d) {
                if (d) {
                    return 'Riders with doping allegations';
                } else {
                    return 'No doping allegations';
                }
            });
    })
    .catch(err => console.log(err));
