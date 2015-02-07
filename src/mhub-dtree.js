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

// Generate the tree of the people led by a leader located at the index parameter
var peopleLedBy = function(index) {
    leader = rootLeaders[index];

    // console.log('leader');
    // console.log(leader);

    // Root of the tree
    makeNode(leader);

    // Query mission hub for the list of people that are leaders but not a member
    // of any group themselves.
    queryMissionHub('group_memberships', {'filters[leader_id]': leader.id}, function(members) {
        // console.log('here right now')
        if (members.group_memberships.length > 0){
            // console.log('here now')
            getName(0, leader, members.group_memberships, index);
        } else {
            if (index == (rootLeaders.length - 1)){
                // console.log('all done');   
                discipleship.renderGraph();
            } else {
                peopleLedBy(index + 1);
            }
        }
    });
}

// Get all the names of the people in a group and add them to the tree
var getName = function(index_name, leader, members, index_leader){
    member = members[index_name];

    // console.log('index_name ' + index_name);
    // console.log('member');
    // console.log(member);

    queryMissionHub('people', {'filters[ids]': String(member.person_id)}, function(json) {
        person = {};
        full_person = json.people[0];
        person.id = full_person.id;
        person.name = full_person.first_name + ' ' + full_person.last_name;

        // Adding the graph objects
        makeNode(person);
        makeEdge(leader.id, person.id);
        // console.log('now here');
        // Once done adding all the members to the graph, move on to the next group
        if (index_name == (members.length - 1)){
            // Once done building all trees, render the graph
            if (index_leader == (rootLeaders.length - 1)){
                // console.log('all done');   
                discipleship.renderGraph();
            } else {
                // Otherwise keep building the tree with the next root leader
                peopleLedBy(index_leader + 1);
            }
        } else {
            // console.log('index_leader ' + index_leader);
            // Otherwise keep building the tree
            getName(index_name + 1, leader, members, index_leader);
        }
    });
}

// Gets the root leaders from Missionhub
var getRootLeaders = function() {
    // Query mission hub for the list of people that are leaders but not a member
    // of any group themselves.
    queryMissionHub('people', {'filters[group_role]': 'leader'}, function(json) {
        //Parse through the data from Missionhub and just take ID and name
        $.each(json.people, function(index, person) {
            console.log(person);
            rootLeaders.push({
                id: person.id,
                name: person.first_name + ' ' + person.last_name
            });
        });

        peopleLedBy(0);
    });
}

// Helper function to query a given endpoint on mission hub with a given set of
// URL parameters
var queryMissionHub = function(endpoint, options, successCallback)
{
    var url = base_url + endpoint + '?secret=' + secret + '&organization_id=941';

    $.each(options, function(key, value) {
        url += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(value);
    });

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

getRootLeaders();
