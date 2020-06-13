function init() {
    (async function() {
        var selector = d3.select("#selPlayer");
        var data = await d3.json("/api/all_players");
        var player_names = data.map(row => row.name);
        console.log(player_names);

        player_names.forEach(name => {
            selector.append("option")
            .text(name)
            .property("value", name);
        });

        const default_player = player_names[0];
        updatePlayerData(default_player);
    })()
}

function updatePlayerData(player) {
    (async function() {
        var data = await d3.json("/api/all_players");

        var filtered_data = data.filter(row => row.name === player)[0];

        Object.entries(filtered_data).forEach(([key, value]) => {
            if (value == null) {
                filtered_data[key] = "Unknown";
            }
        })

        var player_data_selector = d3.select("#player-data");
        player_data_selector.html("");

        player_data_selector.append("h6")
            .text(`Birth City: ${filtered_data["birth_city"]}, ${filtered_data["birth_state"]}`);
        player_data_selector.append("h6")
            .text(`Birth Date: ${filtered_data["birth_date"]}`);
        player_data_selector.append("h6")
            .text(`College: ${filtered_data["college"]}`);
        player_data_selector.append("h6")
            .text(`Height: ${filtered_data["height"]} cm`);
        player_data_selector.append("h6")
            .text(`Position: ${filtered_data["position"]}`);
        player_data_selector.append("h6")
            .text(`Year Start: ${Math.trunc(filtered_data["year_start"])}`);
        player_data_selector.append("h6")
            .text(`Year End: ${Math.trunc(filtered_data["year_end"])}`);
    })()

}

function playerChanged(player) {
    updatePlayerData(player);
}

init()