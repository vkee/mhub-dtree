<!-- Google Chart -->
google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawSeriesChart);

function drawSeriesChart() {
  function selectHandler() {
      var selectedItem = chart.getSelection()[0];
      if (selectedItem) {
        var person = data.getValue(selectedItem.row, 0);
        alert('The user selected ' + person);
        dataview = new google.visualization.DataView(data);
        dataview.hideRows([0,1,2])
        // you can also use dataview.setColumns([1,2]) to show only selected columns and hide the rest
        chart.draw(dataview, options)
      }
    }

    google.visualization.events.addListener(chart, 'select', selectHandler);
}
var dataCallback = function(data2){
  // console.log('data');
  // console.log(data2);
  dataToDisplay = [];
  dataToDisplay.push(['ID', 'Days Since Last Interaction', '# of Interactions', 'Group',     'Size']);
    for (i = 0; i < data2.length; i++) {
        dataToDisplay.push([data2[i], i+1, i+1, "Interactions", 5]);
    }
    // console.log(dataToDisplay);
    var dataTable = google.visualization.arrayToDataTable(dataToDisplay);

  var options = {
    series: {
        Leader: { color: '#e2431e' },
        Community: { color: '#e7711b' },
        Interactions: { color: '#f1ca3a' },
    },
    title: 'Asaph Yuan',
    // explorer: { axis: 'horizontal', keepInBounds: true },
    hAxis: {title: 'Days Since Last Interaction', viewWindowMode:'explicit',
          viewWindow:{
            max:100,
            min:-8
          }},
    vAxis: {title: 'Number of Interactions', viewWindowMode:'explicit',
          viewWindow:{
            max:12,
            min:0
          }},
    bubble: {textStyle: {fontSize: 11},
      color: 'green',
      textStyle: {
        auraColor: 'none'
  }}

  };

  var chart = new google.visualization.BubbleChart(document.getElementById('series_chart_div') );
    chart.draw(dataTable, options);
}

$(document).ready(function(){
  $('#display_button').click(function(){
    var dataToDisplay = []
    var formElements = document.forms['form'].elements['name'].value;
    getPersonInteractions(formElements, "941", dataCallback);

  });
});

var base_url = 'https://stage.missionhub.com/apis/v3/',
    rootLeaders = [],
    discipleship = new Graph(),
    nodesCreated = [];

// Make a D3 Node
var makeNode = function(person) {
    // Checks if a node has been created for a given person yet
    if (nodesCreated.indexOf(person.id) == -1)
    {
        //Push the id into created notes
        nodesCreated.push(person.id);
        // Using the addNode for D3
        discipleship.addNode(person.id, person.name);
    }
}

// Create an edge between two nodes
var makeEdge = function(node1, node2) {
    discipleship.addEdge(node1, node2);
}

// Get all the organizations
var getOrganizations = function(){
    queryMissionHub('organizations', {}, function(json){
        organizations = [];

        $.each(json.organizations, function(index, org){
            organizations.push({
                name: org.name,
                id: org.id
            })
        });
        console.log('organizations');
        console.log(organizations);
        // render organizations on the home page
    });
}

// Gets the leaders from Missionhub
var getLeaders = function(organization_id) {
    // Query mission hub for the list of people that are leaders but not a member
    // of any group themselves.
    queryMissionHub('people', {'organization_id': organization_id,'filters[group_role]': 'leader'}, function(json) {

        leaders = [];

        //Parse through the data from Missionhub and just take ID and name
        $.each(json.people, function(index, person) {
            console.log(person);
            leaders.push({
                id: person.id,
                name: person.first_name + ' ' + person.last_name
            });
        });

        // load the leaders onto the ui
    });
}

// Gets the people from Missionhub
var getPeople = function(organization_id) {
    // Query mission hub for the list of people that are leaders but not a member
    // of any group themselves.
    queryMissionHub('people', {'organization_id': organization_id}, function(json) {
        people = [];
        //Parse through the data from Missionhub and just take ID and name
        $.each(json.people, function(index, person) {
            console.log(person);
            people.push({
                id: person.id,
                name: person.first_name + ' ' + person.last_name
            });
        });

        // load the people onto the ui
    });
}

// Filters at https://github.com/CruGlobal/missionhub/blob/dev/app/models/interaction_filter.rb
// initiator_ids seems to be broken
// https://stage.missionhub.com/apis/v3/interactions?secret=a3c29680ae9cb5b1c028b56578466153&organization_id=941&filters[receiver_ids]=1403488&include=receiver,initiators

var getInteractionTree = function(organization_id, people_ids, interaction_type_ids, callback){
    arguments = {};

    if (organization_id != undefined){
        arguments['organization_id'] = organization_id;
    }

    if (people_ids != undefined){
        arguments['filters[people_ids]'] = people_ids;
    }

    if (interaction_type_ids != undefined){
        arguments['filters[interaction_type_ids]'] = interaction_type_ids;
    }

    arguments['include'] = 'receiver,initiators';

    queryMissionHub('interactions', arguments, function(json) {
        names = []
        $.each(json.interactions, function(index, interaction){
            name = interaction.receiver.first_name + ' ' + interaction.receiver.last_name;
            names.push(name);
        })
        callback(names);
    });
}

var getPersonInteractions = function(name, organization_id, callback){
    queryMissionHub('people', {'organization_id': organization_id, 'filters[name_like]': name}, function(json){
        getInteractionTree(organization_id, json.people[0].id, 1, callback);
    });
}

var returnNames = function(names){
    console.log(names);
    return names;
}

// Helper function to query a given endpoint on mission hub with a given set of
// URL parameters
var queryMissionHub = function(endpoint, options, successCallback){
    var url = base_url + endpoint + '?secret=' + secret;

    $.each(options, function(key, value) {
        url += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(value);
    });
    console.log(url);

    $.ajax({
        type: "GET",
        url: url,
        dataType: 'jsonp',
        success: successCallback,
        error: function() {
            console.log('Error querying Missionhub endpoint "' + endpoint + '"!');
        }
    });
}
// getInteractionTree(941, 12345, 1)
