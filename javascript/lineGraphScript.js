/*
 * Name: Aylwin Sim 100074144
 */
const { d3 } = window;

function linechartInit() {
  // Margin
  const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
  };

  const widther = window.innerWidth;
  const heighther = 200;

  const w = widther - margin.left - margin.right;
  const h = heighther - margin.top - margin.bottom;

  const dataset = [];
  let maxDomain = 1;

  const converter = 100;

  const rowConverter = (d) => ({
    time: parseInt(d.time, 10),
    speed: parseFloat(d.speed),
  });

  d3.csv('dataprototype/line-chart.csv', rowConverter)
    .then((data) => {
      for (let i = 0; i < data.length; i += 1) {
        if (i % converter === 0) {
          dataset.push(data[i]);
        }
      }
      
      maxDomain = d3.max(dataset, (d) => d.time);
      console.log(dataset)
      console.log(maxDomain)
      const xScale = d3.scaleLinear()
        .domain([0, maxDomain])
        .range([0, w]);

      // Y scale is static
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, (d) => d.speed)]).range([h, 0]);

      // Set up the SVG and Path
      const svg = d3.select('#myLineGraph')
        .append('svg')
        .attr('width', w + margin.left + margin.right)
        .attr('height', h + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);


      // Add X-Axis
      // (1) Add translate to align x-axis at the bottom
      const xAxis = d3.axisBottom(xScale).tickSize(-h).tickPadding(8).ticks(5);

      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${h})`)
        .call(xAxis);

      const yAxis = d3.axisLeft(yScale).tickSize(-w).tickPadding(8).ticks(4);

      // Add Y-Axis
      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

      // Data line
      let valueline = d3.line()
        .x((d) => xScale(d.time))
        .y((d) => yScale(d.speed))
        .curve(d3.curveMonotoneX);

      const path = svg.append('path')
        .datum(dataset);

      // hide graph over-width when adjust timeline
      const clip = svg.append('defs').append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('x', '0')
        .attr('y', '0')
        .attr('width', w)
        .attr('height', h);

      path.attr('clip-path', 'url(#clip)')
        .attr('class', 'line')
        .attr('d', valueline);

      const focus = svg.append('g')
        .attr('class', 'focus')
        .style('display', 'none');

      // Adds circle to focus point on line
      focus.append('circle')
        .attr('r', 4);

      // Adds text to focus point on line
      focus.append('text')
        .attr('x', 9)
        .attr('dy', '.35em');

      const bisectDate = d3.bisector((d) => d.time).left;

      // Tooltip mouseovers
      function mousemove() { // (1) Read More ***
        const x0 = xScale.invert(d3.mouse(this)[0]);
        const i = bisectDate(dataset, x0, 1);
        const d0 = dataset[i - 1];
        const d1 = dataset[i];
        const d = x0 - d0.time > d1.time - x0 ? d1 : d0;
        focus.attr('transform', `translate(${xScale(d.time)}, ${yScale(d.speed)})`);
        focus.select('text').text(`${d.speed.toFixed(2)} r/s`);
      }

      function zoom(begin, end) {
        xScale.domain([begin, end]);

        const t = svg.transition().duration(0);

        t.select('.x.axis').call(xAxis);
        path.attr('d', valueline);
      }

      // Creates larger area for tooltip
      const overlay = svg.append('rect')
        .attr('class', 'overlay')
        .attr('width', w)
        .attr('height', h)
        .on('mouseover', () => { focus.style('display', null); })
        .on('mouseout', () => { focus.style('display', 'none'); })
        .on('mousemove', mousemove);

      $(() => {
        $('#slider-range2').slider({
          range: true,
          min: 0,
          max: maxDomain,
          step: converter,
          values: [0, maxDomain], // Default value
          slide: (event, ui) => {
            const begin = d3.min([ui.values[0], maxDomain]);
            const end = d3.max([ui.values[1], 0]);
            console.log('begin:', begin, 'end:', end);
            zoom(begin, end);
          },
        });
      });

      // RESPONSIVENESS
      function resized() {
        const widther1 = window.innerWidth;
        const w1 = widther1 - margin.left - margin.right;

        // (1) Update xScale
        xScale.range([0, w1]); // <- Scale knows value changes

        svg.select('.x.axis').call(xAxis);

        // (2) Update line chart
        d3.select('svg').attr('width', widther1);

        valueline = d3.line()
          .x((d) => xScale(d.time))
          .y((d) => yScale(d.speed))
          .curve(d3.curveMonotoneX);

        d3.select('.line').attr('d', valueline);

        // (3) Update yAxis
        yAxis.tickSize(-w1);

        svg.select('.y.axis').call(yAxis);

        // (4) update mouseover & invisible rectangle
        d3.selectAll('rect').attr('width', w1);
      }

      d3.select(window).on('resize', resized);
    });
}

window.onload = linechartInit;
