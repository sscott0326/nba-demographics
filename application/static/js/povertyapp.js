function init() {
    (async function() {
        var selector = d3.select("#selYear");
        var data = await d3.json("/api/poverty");
        var years = data.map(row => row.Year);
        years = years.filter(unique);
        console.log(years);

        years.forEach(year => {
            selector.append("option")
            .text(year)
            .property("value", year);
        });

        const default_year = years[0];
        yearChanged(default_year);
    })()
}

function unique(value, index, self) {
    return self.indexOf(value) === index;
}

function updateChart(year) {
    (async function() {
        var county_data = await d3.json("/api/counties")
        var poverty_data = await d3.json("/api/poverty")
        console.log(poverty_data);
        console.log(typeof year)

        var filtered_poverty_data = poverty_data.filter(row => row.Year == year)
        counties = county_data.map(row => row["Birth County"])

        poverty_rates = []

        counties.forEach(county => {
            filtered_poverty_data.forEach(row => {
                if (row.County == county + " County") {
                    poverty_rates.push(row["Poverty Rate"]);
                }
            })
        })

        var hist_trace = {
            x: poverty_rates,
            type: 'histogram'
        };

        var plot = [hist_trace];
        var layout = {
            title: "Poverty Rates of NBA Players Birth Cities by Year",
            xaxis: {title: "Poverty Rate (%)"},
            yaxis: {title: "Number of Cities"}
        }
        Plotly.newPlot('hist', plot, layout);
    })()
}
function yearChanged(year) {
    updateChart(year);
}

init()