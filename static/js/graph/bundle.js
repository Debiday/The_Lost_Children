(function (React$1, ReactDOM, d3) {
  'use strict';

  var React$1__default = 'default' in React$1 ? React$1['default'] : React$1;
  ReactDOM = ReactDOM && Object.prototype.hasOwnProperty.call(ReactDOM, 'default') ? ReactDOM['default'] : ReactDOM;

  const csvUrl =
    'https://gist.githubusercontent.com/Debiday/5e789cf011f020169e6d17dc7ec7404d/raw/8e3d60b02c20c41482d57c6764910927f07239a8/CA.csv';

  const useData = () => {
    const [data, setData] = React$1.useState(null);

      React$1.useEffect(() => {
      const row = d => {
        d.case= +d.case;
        d.date_missing = new Date(d.date_missing);
        d.lname = d.lname;
      	d.fname = d.fname;
        d.age = +d.age;
        d.city = d.city;
        d.county = d.county;
        d.state= d.state;
        d.gender = d.gender;
        d.ethnicity = d.ethnicity;
        return d;
      };
      d3.csv(csvUrl, row).then(setData);
    }, []);
    
    return data;
  };

  const AxisBottom = ({ xScale, innerHeight, tickFormat, tickOffset = 3 }) =>
    xScale.ticks().map(tickValue => (
      React.createElement( 'g', {
        className: "tick", key: tickValue, transform: `translate(${xScale(tickValue)},0)` },
        React.createElement( 'line', { y2: innerHeight }),
        React.createElement( 'text', { style: { textAnchor: 'middle' }, dy: ".71em", y: innerHeight + tickOffset },
          tickFormat(tickValue)
        )
      )
    ));

  const AxisLeft = ({ yScale, innerWidth, tickOffset = 3 }) =>
    yScale.ticks().map(tickValue => (
      React.createElement( 'g', { className: "tick", transform: `translate(0,${yScale(tickValue)})` },
        React.createElement( 'line', { x2: innerWidth }),
        React.createElement( 'text', {
          key: tickValue, style: { textAnchor: 'end' }, x: -tickOffset, dy: ".32em" },
          tickValue
        )
      )
    ));

  const Marks = ({
    data,
    xScale,
    xValue,
    yScale,
    yValue,
    colorScale,
    colorValue,
    tooltipFormat,
    circleRadius
  }) =>
    data.map(d => (
      React.createElement( 'circle', {
        className: "mark", cx: xScale(xValue(d)), cy: yScale(yValue(d)), fill: colorScale(colorValue(d)), r: circleRadius },
        React.createElement( 'title', null, tooltipFormat(xValue(d)) )
      )
    ));

  const ColorLegend = ({
    colorScale,
    tickSpacing = 20,
    tickSize = 10,
    tickTextOffset = 20,
    onHover,
    hoveredValue,
    fadeOpacity
  }) =>
    colorScale.domain().map((domainValue, i) => (
      React.createElement( 'g', {
        className: "tick", transform: `translate(0,${i * tickSpacing})`, onMouseEnter: () => {
          onHover(domainValue);
        }, onMouseOut: () => {
          onHover(null);
        }, opacity: hoveredValue && domainValue !== hoveredValue ? fadeOpacity : 1 },
        React.createElement( 'circle', { fill: colorScale(domainValue), r: tickSize }),
        React.createElement( 'text', { x: tickTextOffset, dy: ".32em" },
          domainValue
        )
      )
    ));

  const width = 960;
  const height = 500;
  const margin = { top: 30, right: 200, bottom: 65, left: 90 };
  const xAxisLabelOffset = 50;
  const yAxisLabelOffset = 45;
  const fadeOpacity = 0.2;

  const App = () => {
    const data = useData();
    const [hoveredValue, setHoveredValue] = React$1.useState(null);

    if (!data) {
      return React$1__default.createElement( 'pre', null, "Loading..." );
    }

    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    const xValue = d => d.date_missing;
    const xAxisLabel = 'Year Missing';
    
    // const tValue = d => d.fname;
    // console.log(tValue)

    const yValue = d => d.age;
    const yAxisLabel = 'Age';
   

    const colorValue = d => d.gender;
    const colorLegendLabel = 'Gender';

    const filteredData = data.filter(d => hoveredValue === colorValue(d));

    const circleRadius = 7;

    const xAxisTickFormat = d3.timeFormat('%Y');

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth])
      .nice();

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yValue))
      .range([innerHeight, 0])
    	.nice();

    const colorScale = d3.scaleOrdinal()
      .domain(data.map(colorValue))
      .range(['#fdedf6', '#53cac6', '#C1BAA9']);

    return (
      React$1__default.createElement( 'svg', { width: width, height: height },
        React$1__default.createElement( 'g', { transform: `translate(${margin.left},${margin.top})` },
          React$1__default.createElement( AxisBottom, {
            xScale: xScale, innerHeight: innerHeight, tickFormat: xAxisTickFormat, tickOffset: 5 }),
          React$1__default.createElement( 'text', {
            className: "axis-label", textAnchor: "middle", transform: `translate(${-yAxisLabelOffset},${innerHeight /
            2}) rotate(-90)` },
            yAxisLabel
          ),
          React$1__default.createElement( AxisLeft, { yScale: yScale, innerWidth: innerWidth, tickOffset: 5 }),
          React$1__default.createElement( 'text', {
            className: "axis-label", x: innerWidth / 2, y: innerHeight + xAxisLabelOffset, textAnchor: "middle" },
            xAxisLabel
          ),
          React$1__default.createElement( 'g', { transform: `translate(${innerWidth + 60}, 60)` },
            React$1__default.createElement( 'text', { x: 35, y: -25, className: "axis-label", textAnchor: "middle" },
              colorLegendLabel
            ),
            React$1__default.createElement( ColorLegend, {
              tickSpacing: 22, tickSize: 10, tickTextOffset: 12, tickSize: circleRadius, colorScale: colorScale, onHover: setHoveredValue, hoveredValue: hoveredValue, fadeOpacity: fadeOpacity })
          ),
          React$1__default.createElement( 'g', { opacity: hoveredValue ? fadeOpacity : 1 },
            React$1__default.createElement( Marks, {
              data: data, xScale: xScale, xValue: xValue, yScale: yScale, yValue: yValue, colorScale: colorScale, colorValue: colorValue, tooltipFormat: xAxisTickFormat, circleRadius: circleRadius })
          ),
          React$1__default.createElement( Marks, {
            data: filteredData, xScale: xScale, xValue: xValue, yScale: yScale, yValue: yValue, colorScale: colorScale, colorValue: colorValue, tooltipFormat: xAxisTickFormat, circleRadius: circleRadius })
        )
      )
    );
  };
  const rootElement = document.getElementById('d3-root');
  ReactDOM.render(React$1__default.createElement( App, null ), rootElement);

}(React, ReactDOM, d3));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbInVzZURhdGEuanMiLCJBeGlzQm90dG9tLmpzIiwiQXhpc0xlZnQuanMiLCJNYXJrcy5qcyIsIkNvbG9yTGVnZW5kLmpzIiwiaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjc3YgfSBmcm9tICdkMyc7XG5cbmNvbnN0IGNzdlVybCA9XG4gICdodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0RlYmlkYXkvNWU3ODljZjAxMWYwMjAxNjllNmQxN2RjN2VjNzQwNGQvcmF3LzhlM2Q2MGIwMmMyMGM0MTQ4MmQ1N2M2NzY0OTEwOTI3ZjA3MjM5YTgvQ0EuY3N2JztcblxuZXhwb3J0IGNvbnN0IHVzZURhdGEgPSAoKSA9PiB7XG4gIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlKG51bGwpO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCByb3cgPSBkID0+IHtcbiAgICAgIGQuY2FzZT0gK2QuY2FzZTtcbiAgICAgIGQuZGF0ZV9taXNzaW5nID0gbmV3IERhdGUoZC5kYXRlX21pc3NpbmcpO1xuICAgICAgZC5sbmFtZSA9IGQubG5hbWU7XG4gICAgXHRkLmZuYW1lID0gZC5mbmFtZTtcbiAgICAgIGQuYWdlID0gK2QuYWdlO1xuICAgICAgZC5jaXR5ID0gZC5jaXR5O1xuICAgICAgZC5jb3VudHkgPSBkLmNvdW50eTtcbiAgICAgIGQuc3RhdGU9IGQuc3RhdGU7XG4gICAgICBkLmdlbmRlciA9IGQuZ2VuZGVyO1xuICAgICAgZC5ldGhuaWNpdHkgPSBkLmV0aG5pY2l0eTtcbiAgICAgIHJldHVybiBkO1xuICAgIH07XG4gICAgY3N2KGNzdlVybCwgcm93KS50aGVuKHNldERhdGEpO1xuICB9LCBbXSk7XG4gIFxuICByZXR1cm4gZGF0YTtcbn07IiwiZXhwb3J0IGNvbnN0IEF4aXNCb3R0b20gPSAoeyB4U2NhbGUsIGlubmVySGVpZ2h0LCB0aWNrRm9ybWF0LCB0aWNrT2Zmc2V0ID0gMyB9KSA9PlxuICB4U2NhbGUudGlja3MoKS5tYXAodGlja1ZhbHVlID0+IChcbiAgICA8Z1xuICAgICAgY2xhc3NOYW1lPVwidGlja1wiXG4gICAgICBrZXk9e3RpY2tWYWx1ZX1cbiAgICAgIHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgke3hTY2FsZSh0aWNrVmFsdWUpfSwwKWB9XG4gICAgPlxuICAgICAgPGxpbmUgeTI9e2lubmVySGVpZ2h0fSAvPlxuICAgICAgPHRleHQgc3R5bGU9e3sgdGV4dEFuY2hvcjogJ21pZGRsZScgfX0gZHk9XCIuNzFlbVwiIHk9e2lubmVySGVpZ2h0ICsgdGlja09mZnNldH0+XG4gICAgICAgIHt0aWNrRm9ybWF0KHRpY2tWYWx1ZSl9XG4gICAgICA8L3RleHQ+XG4gICAgPC9nPlxuICApKTtcbiIsImV4cG9ydCBjb25zdCBBeGlzTGVmdCA9ICh7IHlTY2FsZSwgaW5uZXJXaWR0aCwgdGlja09mZnNldCA9IDMgfSkgPT5cbiAgeVNjYWxlLnRpY2tzKCkubWFwKHRpY2tWYWx1ZSA9PiAoXG4gICAgPGcgY2xhc3NOYW1lPVwidGlja1wiIHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgwLCR7eVNjYWxlKHRpY2tWYWx1ZSl9KWB9PlxuICAgICAgPGxpbmUgeDI9e2lubmVyV2lkdGh9IC8+XG4gICAgICA8dGV4dFxuICAgICAgICBrZXk9e3RpY2tWYWx1ZX1cbiAgICAgICAgc3R5bGU9e3sgdGV4dEFuY2hvcjogJ2VuZCcgfX1cbiAgICAgICAgeD17LXRpY2tPZmZzZXR9XG4gICAgICAgIGR5PVwiLjMyZW1cIlxuICAgICAgPlxuICAgICAgICB7dGlja1ZhbHVlfVxuICAgICAgPC90ZXh0PlxuICAgIDwvZz5cbiAgKSk7XG4iLCJleHBvcnQgY29uc3QgTWFya3MgPSAoe1xuICBkYXRhLFxuICB4U2NhbGUsXG4gIHhWYWx1ZSxcbiAgeVNjYWxlLFxuICB5VmFsdWUsXG4gIGNvbG9yU2NhbGUsXG4gIGNvbG9yVmFsdWUsXG4gIHRvb2x0aXBGb3JtYXQsXG4gIGNpcmNsZVJhZGl1c1xufSkgPT5cbiAgZGF0YS5tYXAoZCA9PiAoXG4gICAgPGNpcmNsZVxuICAgICAgY2xhc3NOYW1lPVwibWFya1wiXG4gICAgICBjeD17eFNjYWxlKHhWYWx1ZShkKSl9XG4gICAgICBjeT17eVNjYWxlKHlWYWx1ZShkKSl9XG4gICAgICBmaWxsPXtjb2xvclNjYWxlKGNvbG9yVmFsdWUoZCkpfVxuICAgICAgcj17Y2lyY2xlUmFkaXVzfVxuICAgID5cbiAgICAgIDx0aXRsZT57dG9vbHRpcEZvcm1hdCh4VmFsdWUoZCkpfTwvdGl0bGU+XG4gICAgPC9jaXJjbGU+XG4gICkpO1xuIiwiZXhwb3J0IGNvbnN0IENvbG9yTGVnZW5kID0gKHtcbiAgY29sb3JTY2FsZSxcbiAgdGlja1NwYWNpbmcgPSAyMCxcbiAgdGlja1NpemUgPSAxMCxcbiAgdGlja1RleHRPZmZzZXQgPSAyMCxcbiAgb25Ib3ZlcixcbiAgaG92ZXJlZFZhbHVlLFxuICBmYWRlT3BhY2l0eVxufSkgPT5cbiAgY29sb3JTY2FsZS5kb21haW4oKS5tYXAoKGRvbWFpblZhbHVlLCBpKSA9PiAoXG4gICAgPGdcbiAgICAgIGNsYXNzTmFtZT1cInRpY2tcIlxuICAgICAgdHJhbnNmb3JtPXtgdHJhbnNsYXRlKDAsJHtpICogdGlja1NwYWNpbmd9KWB9XG4gICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHtcbiAgICAgICAgb25Ib3Zlcihkb21haW5WYWx1ZSk7XG4gICAgICB9fVxuICAgICAgb25Nb3VzZU91dD17KCkgPT4ge1xuICAgICAgICBvbkhvdmVyKG51bGwpO1xuICAgICAgfX1cbiAgICAgIG9wYWNpdHk9e2hvdmVyZWRWYWx1ZSAmJiBkb21haW5WYWx1ZSAhPT0gaG92ZXJlZFZhbHVlID8gZmFkZU9wYWNpdHkgOiAxfVxuICAgID5cbiAgICAgIDxjaXJjbGUgZmlsbD17Y29sb3JTY2FsZShkb21haW5WYWx1ZSl9IHI9e3RpY2tTaXplfSAvPlxuICAgICAgPHRleHQgeD17dGlja1RleHRPZmZzZXR9IGR5PVwiLjMyZW1cIj5cbiAgICAgICAge2RvbWFpblZhbHVlfVxuICAgICAgPC90ZXh0PlxuICAgIDwvZz5cbiAgKSk7XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7IGNzdiwgc2NhbGVMaW5lYXIsIHNjYWxlVGltZSwgdGltZUZvcm1hdCwgc2NhbGVPcmRpbmFsLCBtYXgsIGRhdGVGb3JtYXQsIGZvcm1hdCwgZXh0ZW50IH0gZnJvbSAnZDMnO1xuaW1wb3J0IHsgdXNlRGF0YSB9IGZyb20gJy4vdXNlRGF0YSc7XG5pbXBvcnQgeyBBeGlzQm90dG9tIH0gZnJvbSAnLi9BeGlzQm90dG9tJztcbmltcG9ydCB7IEF4aXNMZWZ0IH0gZnJvbSAnLi9BeGlzTGVmdCc7XG5pbXBvcnQgeyBNYXJrcyB9IGZyb20gJy4vTWFya3MnO1xuaW1wb3J0IHsgQ29sb3JMZWdlbmQgfSBmcm9tICcuL0NvbG9yTGVnZW5kJztcblxuY29uc3Qgd2lkdGggPSA5NjA7XG5jb25zdCBoZWlnaHQgPSA1MDA7XG5jb25zdCBtYXJnaW4gPSB7IHRvcDogMzAsIHJpZ2h0OiAyMDAsIGJvdHRvbTogNjUsIGxlZnQ6IDkwIH07XG5jb25zdCB4QXhpc0xhYmVsT2Zmc2V0ID0gNTA7XG5jb25zdCB5QXhpc0xhYmVsT2Zmc2V0ID0gNDU7XG5jb25zdCBmYWRlT3BhY2l0eSA9IDAuMjtcblxuY29uc3QgQXBwID0gKCkgPT4ge1xuICBjb25zdCBkYXRhID0gdXNlRGF0YSgpO1xuICBjb25zdCBbaG92ZXJlZFZhbHVlLCBzZXRIb3ZlcmVkVmFsdWVdID0gdXNlU3RhdGUobnVsbCk7XG5cbiAgaWYgKCFkYXRhKSB7XG4gICAgcmV0dXJuIDxwcmU+TG9hZGluZy4uLjwvcHJlPjtcbiAgfVxuXG4gIGNvbnN0IGlubmVySGVpZ2h0ID0gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG4gIGNvbnN0IGlubmVyV2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xuXG4gIGNvbnN0IHhWYWx1ZSA9IGQgPT4gZC5kYXRlX21pc3Npbmc7XG4gIGNvbnN0IHhBeGlzTGFiZWwgPSAnWWVhciBNaXNzaW5nJztcbiAgXG4gIC8vIGNvbnN0IHRWYWx1ZSA9IGQgPT4gZC5mbmFtZTtcbiAgLy8gY29uc29sZS5sb2codFZhbHVlKVxuXG4gIGNvbnN0IHlWYWx1ZSA9IGQgPT4gZC5hZ2U7XG4gIGNvbnN0IHlBeGlzTGFiZWwgPSAnQWdlJztcbiBcblxuICBjb25zdCBjb2xvclZhbHVlID0gZCA9PiBkLmdlbmRlcjtcbiAgY29uc3QgY29sb3JMZWdlbmRMYWJlbCA9ICdHZW5kZXInO1xuXG4gIGNvbnN0IGZpbHRlcmVkRGF0YSA9IGRhdGEuZmlsdGVyKGQgPT4gaG92ZXJlZFZhbHVlID09PSBjb2xvclZhbHVlKGQpKTtcblxuICBjb25zdCBjaXJjbGVSYWRpdXMgPSA3O1xuXG4gIGNvbnN0IHhBeGlzVGlja0Zvcm1hdCA9IHRpbWVGb3JtYXQoJyVZJyk7XG5cbiAgY29uc3QgeFNjYWxlID0gc2NhbGVMaW5lYXIoKVxuICAgIC5kb21haW4oZXh0ZW50KGRhdGEsIHhWYWx1ZSkpXG4gICAgLnJhbmdlKFswLCBpbm5lcldpZHRoXSlcbiAgICAubmljZSgpO1xuXG4gIGNvbnN0IHlTY2FsZSA9IHNjYWxlTGluZWFyKClcbiAgICAuZG9tYWluKGV4dGVudChkYXRhLCB5VmFsdWUpKVxuICAgIC5yYW5nZShbaW5uZXJIZWlnaHQsIDBdKVxuICBcdC5uaWNlKCk7XG5cbiAgY29uc3QgY29sb3JTY2FsZSA9IHNjYWxlT3JkaW5hbCgpXG4gICAgLmRvbWFpbihkYXRhLm1hcChjb2xvclZhbHVlKSlcbiAgICAucmFuZ2UoWycjRjZCNjU2JywgJyM0MkE1QjMnLCAnI0MxQkFBOSddKTtcblxuICByZXR1cm4gKFxuICAgIDxzdmcgd2lkdGg9e3dpZHRofSBoZWlnaHQ9e2hlaWdodH0+XG4gICAgICA8ZyB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHttYXJnaW4ubGVmdH0sJHttYXJnaW4udG9wfSlgfT5cbiAgICAgICAgPEF4aXNCb3R0b21cbiAgICAgICAgICB4U2NhbGU9e3hTY2FsZX1cbiAgICAgICAgICBpbm5lckhlaWdodD17aW5uZXJIZWlnaHR9XG4gICAgICAgICAgdGlja0Zvcm1hdD17eEF4aXNUaWNrRm9ybWF0fVxuICAgICAgICAgIHRpY2tPZmZzZXQ9ezV9XG4gICAgICAgIC8+XG4gICAgICAgIDx0ZXh0XG4gICAgICAgICAgY2xhc3NOYW1lPVwiYXhpcy1sYWJlbFwiXG4gICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgdHJhbnNmb3JtPXtgdHJhbnNsYXRlKCR7LXlBeGlzTGFiZWxPZmZzZXR9LCR7aW5uZXJIZWlnaHQgL1xuICAgICAgICAgICAgMn0pIHJvdGF0ZSgtOTApYH1cbiAgICAgICAgPlxuICAgICAgICAgIHt5QXhpc0xhYmVsfVxuICAgICAgICA8L3RleHQ+XG4gICAgICAgIDxBeGlzTGVmdCB5U2NhbGU9e3lTY2FsZX0gaW5uZXJXaWR0aD17aW5uZXJXaWR0aH0gdGlja09mZnNldD17NX0gLz5cbiAgICAgICAgPHRleHRcbiAgICAgICAgICBjbGFzc05hbWU9XCJheGlzLWxhYmVsXCJcbiAgICAgICAgICB4PXtpbm5lcldpZHRoIC8gMn1cbiAgICAgICAgICB5PXtpbm5lckhlaWdodCArIHhBeGlzTGFiZWxPZmZzZXR9XG4gICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgID5cbiAgICAgICAgICB7eEF4aXNMYWJlbH1cbiAgICAgICAgPC90ZXh0PlxuICAgICAgICA8ZyB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHtpbm5lcldpZHRoICsgNjB9LCA2MClgfT5cbiAgICAgICAgICA8dGV4dCB4PXszNX0geT17LTI1fSBjbGFzc05hbWU9XCJheGlzLWxhYmVsXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiPlxuICAgICAgICAgICAge2NvbG9yTGVnZW5kTGFiZWx9XG4gICAgICAgICAgPC90ZXh0PlxuICAgICAgICAgIDxDb2xvckxlZ2VuZFxuICAgICAgICAgICAgdGlja1NwYWNpbmc9ezIyfVxuICAgICAgICAgICAgdGlja1NpemU9ezEwfVxuICAgICAgICAgICAgdGlja1RleHRPZmZzZXQ9ezEyfVxuICAgICAgICAgICAgdGlja1NpemU9e2NpcmNsZVJhZGl1c31cbiAgICAgICAgICAgIGNvbG9yU2NhbGU9e2NvbG9yU2NhbGV9XG4gICAgICAgICAgICBvbkhvdmVyPXtzZXRIb3ZlcmVkVmFsdWV9XG4gICAgICAgICAgICBob3ZlcmVkVmFsdWU9e2hvdmVyZWRWYWx1ZX1cbiAgICAgICAgICAgIGZhZGVPcGFjaXR5PXtmYWRlT3BhY2l0eX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2c+XG4gICAgICAgIDxnIG9wYWNpdHk9e2hvdmVyZWRWYWx1ZSA/IGZhZGVPcGFjaXR5IDogMX0+XG4gICAgICAgICAgPE1hcmtzXG4gICAgICAgICAgICBkYXRhPXtkYXRhfVxuICAgICAgICAgICAgeFNjYWxlPXt4U2NhbGV9XG4gICAgICAgICAgICB4VmFsdWU9e3hWYWx1ZX1cbiAgICAgICAgICAgIHlTY2FsZT17eVNjYWxlfVxuICAgICAgICAgICAgeVZhbHVlPXt5VmFsdWV9XG4gICAgICAgICAgICBjb2xvclNjYWxlPXtjb2xvclNjYWxlfVxuICAgICAgICAgICAgY29sb3JWYWx1ZT17Y29sb3JWYWx1ZX1cbiAgICAgICAgICAgIHRvb2x0aXBGb3JtYXQ9e3hBeGlzVGlja0Zvcm1hdH1cbiAgICAgICAgICAgIGNpcmNsZVJhZGl1cz17Y2lyY2xlUmFkaXVzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZz5cbiAgICAgICAgPE1hcmtzXG4gICAgICAgICAgZGF0YT17ZmlsdGVyZWREYXRhfVxuICAgICAgICAgIHhTY2FsZT17eFNjYWxlfVxuICAgICAgICAgIHhWYWx1ZT17eFZhbHVlfVxuICAgICAgICAgIHlTY2FsZT17eVNjYWxlfVxuICAgICAgICAgIHlWYWx1ZT17eVZhbHVlfVxuICAgICAgICAgIGNvbG9yU2NhbGU9e2NvbG9yU2NhbGV9XG4gICAgICAgICAgY29sb3JWYWx1ZT17Y29sb3JWYWx1ZX1cbiAgICAgICAgICB0b29sdGlwRm9ybWF0PXt4QXhpc1RpY2tGb3JtYXR9XG4gICAgICAgICAgY2lyY2xlUmFkaXVzPXtjaXJjbGVSYWRpdXN9XG4gICAgICAgIC8+XG4gICAgICA8L2c+XG4gICAgPC9zdmc+XG4gICk7XG59O1xuY29uc3Qgcm9vdEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpO1xuUmVhY3RET00ucmVuZGVyKDxBcHAgLz4sIHJvb3RFbGVtZW50KTtcbiJdLCJuYW1lcyI6WyJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsImNzdiIsIlJlYWN0IiwidGltZUZvcm1hdCIsInNjYWxlTGluZWFyIiwiZXh0ZW50Iiwic2NhbGVPcmRpbmFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7RUFHQSxNQUFNLE1BQU07RUFDWixFQUFFLGlJQUFpSSxDQUFDO0FBQ3BJO0VBQ08sTUFBTSxPQUFPLEdBQUcsTUFBTTtFQUM3QixFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUdBLGdCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekM7RUFDQSxJQUFJQyxpQkFBUyxDQUFDLE1BQU07RUFDcEIsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUk7RUFDckIsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztFQUN0QixNQUFNLENBQUMsQ0FBQyxZQUFZLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO0VBQ2hELE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0VBQ3hCLEtBQUssQ0FBQyxDQUFD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