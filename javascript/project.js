var myAPIKey = 'j26zzb4csqz9j4mprxrkn4ry';

$(document).ready(function() {

    // Change the active class to reflect current page user is viewing
    $('.nav a').click(function(){
        $(this).parent().addClass('active').siblings().removeClass('active')	
    })

    var titletext = document.getElementById('titletext');

    // Click on the Get Stats tab to start getting data 
    document.getElementById("info").onclick = function() {
        $("#formbox").css("display", "block");
        $(".column").css("display", "none");
        titletext.textContent = 'STATS';
    }

    // Click on the home tab to reset the screen to the defualt page
    document.getElementById("home").onclick = function() {
        $("#formbox").css("display", "none");
        $(".column").css("display", "block");
        $("#stats-box").css("display", "none");

        titletext.textContent = 'NBA ANALYTICS';
    }

    // WHEN TEAM IS SELECTED, OPEN JSON FILE AND SEARCH FOR TEAM ID. 
    document.getElementById('team_list').onchange = function() {
        var whichNBATeam = $('#team_list option:selected').val();
        var whichYear = $('#list option:selected').val();
        var URL = 'https://api.sportradar.us/nba-t3/seasontd/' + whichYear + '/REG/standings.json?api_key=' + myAPIKey;
        var playersURL = '';
        var teamID = '';

        var index = findTheTeam(whichNBATeam);
        $.getJSON(URL, function(data) {

            // *********************** TEAM ID SEARCH ***********************
            /* Outer loop is to iterate through the divisions and the inner loop is to iterate through the teams within the division  */
            for(var i = 0; i < 3; i++) {
                for(var j = 0; j < 5; j++) {
                    if(data.conferences[index].divisions[i].teams[j].name == whichNBATeam) {
                        teamID = data.conferences[index].divisions[i].teams[j].id;
                    }
                }
            }

            // GET ID FROM THIS FILE
            playersURL = 'https://api.sportradar.us/nba-t3/teams/' + teamID + '/profile.json?api_key=' + myAPIKey;
            getPlayerList(playersURL);
        })

    } //END OF FUNCTION

    function getPlayerList(URL) {
        $.get(URL, function(teamData) {
            var teamLength = teamData.players.length;

            document.getElementById('team_players').innerHTML = '';

            for(i = 0; i < teamLength; i++) {
                $('#team_players').append('<option val="players">' + teamData.players[i].full_name + '</option>');
            } 
            $('#buttonformat').click(function(e) {
                e.preventDefault();

                $("#formbox").css("display", "none");
                $("#stats-box").css("display", "block");

                var playerID = '';
                var playerSelected = $('#team_players option:selected').val();

                // *********************** PLAYER ID ******************************** //

                for(i=0; i < teamLength; i++) {
                    if(teamData.players[i].full_name === playerSelected) {
                        playerID = teamData.players[i].id;
                        break;
                    }
                }
                getThePlayersStats(playerID);
            }); // END OF BUTTON FUNCTION
        })
    }

    function getThePlayersStats(ID) {
        var URL = 'https://api.sportradar.us/nba-t3/players/' + ID + '/profile.json?api_key=' + myAPIKey;
        var year = $('#list option:selected').val();
        var yearIndex = -1;

        $.get(URL, function(playerData) {
            switch(year) {
                case '2017':
                    yearIndex = 0;
                    break;
                case '2016':
                    yearIndex = 1;
                    break;
            }

            var checkboxValues = $('input[type="checkbox"]:checked');
            if((playerData.experience == '0')) {
                if(year == "2016") {
                    document.getElementById("stats-box").innerHTML += ('Stats are not available for ' + playerData.full_name +  ' during the ' + year + ' season.');  
                    return false;
                }
            }

            document.getElementById("stats-box").innerHTML += ("<h3>Here are the " + year + " stats for " + playerData.full_name + "!") + '</h3><br>';

            if(checkboxValues.length > 0) {
                checkboxValues.each(function() {

                    var stat = $(this).val();
                    switch(stat) {
                        case "points":
                            document.getElementById("stats-box").innerHTML +=
                                ("Points: " + playerData.seasons[yearIndex].teams[0].average.points) + '<br>';
                            break;
                        case "rebounds":
                            document.getElementById("stats-box").innerHTML +=
                                ("Rebounds: " + playerData.seasons[yearIndex].teams[0].average.rebounds) + '<br>';
                            break;
                        case "steals":
                            document.getElementById("stats-box").innerHTML +=
                                ("Steals: " + playerData.seasons[yearIndex].teams[0].average.steals) + '<br>';
                            break;
                        case "minutes":
                            document.getElementById("stats-box").innerHTML +=
                                ("Minutes: " + playerData.seasons[yearIndex].teams[0].average.minutes) + '<br>';
                            break;
                        case "assists":
                            document.getElementById("stats-box").innerHTML +=
                                ("Assists: " + playerData.seasons[yearIndex].teams[0].average.assists) + '<br>';
                            break;
                        case "turnovers":
                            document.getElementById("stats-box").innerHTML +=
                                ("Turnovers: " + playerData.seasons[yearIndex].teams[0].average.turnovers) + '<br>';
                            break;
                        case "blocks":
                            document.getElementById("stats-box").innerHTML +=
                                ("Blocks: " + playerData.seasons[yearIndex].teams[0].average.blocks) + '<br>';
                            break;
                        case "free_throws_pct":
                            document.getElementById("stats-box").innerHTML +=
                                ("Free Throw Percentage: " + (playerData.seasons[yearIndex].teams[0].total.free_throws_pct) * 100) + '%<br>';
                            break;
                        case "three_points_pct":
                            document.getElementById("stats-box").innerHTML +=
                                ("Three Point Percentage: " + (playerData.seasons[yearIndex].teams[0].total.three_points_pct) * 100) + '%<br>';
                            break;
                        case "field_goals_pct":
                            document.getElementById("stats-box").innerHTML +=
                                ("Field Goal Percentage: " + (playerData.seasons[yearIndex].teams[0].total.field_goals_pct) * 100) + '%<br>';
                            break;

                    } // end of switch

                })
                document.getElementById("stats-box").innerHTML += '<button id="end-button" class="btn-primary" onClick="window.location.reload();">Generate More Stats</button>';
            }
        }) // END CHECKBOX



    }

    function findTheTeam(NBATeam) {
        var whichIndex = '-1';
        switch(NBATeam) {
            case 'Bucks':
            case 'Bulls':
            case 'Cavaliers':
            case 'Celtics':
            case 'Hawks':
            case 'Heat':
            case 'Hornets':
            case 'Knicks':
            case 'Magic':
            case 'Nets':
            case 'Pacers':
            case 'Pistons':
            case 'Raptors':
            case '76ers':
            case 'Wizards':
                whichIndex = '0';
                break;
            default:
                whichIndex = '1';
        }
        return whichIndex;
    }

});// window