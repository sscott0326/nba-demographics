var chosen_state, chosen_year;

function init() {
    (async function() {
        var state_selector = d3.select("#selState");
        var year_selector = d3.select("#selYear");

        var data = await d3.csv("poverty.csv");

        var states = data.map(row => row.State);
        var years = data.map(row => row.Year);
        
        states = states.filter(unique);
        years = years.filter(unique);

        states.forEach(id => {
            state_selector.append("option")
            .text(id)
            .property("value", id);
        });

        years.forEach(id => {
            year_selector.append("option")
            .text(id)
            .property("value", id);
        });

        chosen_state = states[0];
        chosen_year  = years[0];

        updateChart(chosen_state, chosen_year);
    })()
}

function unique(value, index, self) {
    return self.indexOf(value) === index;
}

function stateChanged(state) {
    chosen_state = state;
    updateChart(chosen_state, chosen_year);
}

function yearChanged(year) {
    chosen_year = year;
    updateChart(chosen_state, chosen_year);
}

function updateChart(state, year) {
    (async function() {
        var data = await d3.csv("poverty.csv");
        var filtered_data = data.filter(row => row.State === state)
                                .filter(row => row.Year === year);

        counties = filtered_data.map(row => row.County);
        poverty_rates = filtered_data.map(row => row["Poverty Rate"]);
        
        var bar_trace = {
            x: counties,
            y: poverty_rates,
            type: "bar"
        };

        var plot = [bar_trace];
        Plotly.newPlot("bar", plot);
    })()
}

init();