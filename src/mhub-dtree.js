var secret = '40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2',
    base_url = 'https://stage.missionhub.com/apis/v3/',
    rootLeaders = [],
    queue = [],
    discipleship = new Graph(),
    nodesCreated = [];

var makeNode = function(person) {
    // Checks if a node has been created for a given person yet
    if (nodesCreated.indexOf(person.id) == -1)
    {
        // The main issue is that just don't have name for person to create node so probably throwing error 
        console.log('inside making the node');
        console.log(person);
        //Push the person into the queue
        queue.push(person);
        //Push the id into created notes
        nodesCreated.push(person.id);
        // Using the addNode for D3
        discipleship.addNode(person.id, person.name);
        console.log('got here');
    }
}

var makeEdge = function(node1, node2) {
    discipleship.addEdge(node1, node2);
}

// Main function of algorithm that processes one item from queue.
var processLeader = function () {

    // Iterate through leaders using the callback hacked together loop

    console.log('queue');
    console.log(queue);
    var leader = getNextLeader();
    console.log('leader');
    console.log(leader);
    // console.log('queue');
    // console.log(queue);
    peopleLedBy(leader, // callback that will continue to iterate through the loop)
}

var getNextLeader = function() {
    return rootLeaders.shift();
}

// @todo: unstub
var peopleLedBy = function(leader, successCallback) {
    // Getting all the members led by the leader
    queryMissionHub('group_memberships', {'filters[leader_id]': leader.id}, function(members) {

        // for each memeber, need to make another query to get the actual name and id of the person
        // once receive that in the callback add node and edge to tree

        // 

        // $.each(people, function(index, person) {
        //     // makeNode(person);
        //     // makeEdge(leader.id, person.id);
        // });
    });

        //Parse through the data from Missionhub and just take ID and name
        // $.each(json.group_memberships, function(index, membership) {
            
        // });
    successCallback(json);
        // $.each(json.people, function(index, person) {
        //     queue.push({
        //         id: person.id,
        //         name: person.first_name+' '+person.last_name
        //     });
        // });
    // });
}

// Gets the root leaders from Missionhub and begins processing the queue
var getRootLeaders = function() {
    // Query mission hub for the list of people that are leaders but not a member
    // of any group themselves.
    queryMissionHub('people', {'filters[group_involvement_id]': 'none', 'filters[group_role]': 'leader'}, function(json) {
        console.log('orig');
        console.log(json);
        //Parse through the data from Missionhub and just take ID and name
        $.each(json.people, function(index, person) {
            rootLeaders.push({
                id: person.id,
                name: person.first_name + ' ' + person.last_name
            });
        });

        // Begin processing the root leaders
        processLeader();
    });
}

// Helper function to query a given endpoint on mission hub with a given set of
// URL parameters
var queryMissionHub = function(endpoint, options, successCallback)
{
    var url = base_url+endpoint+'?secret='+secret;

    $.each(options, function(key, value) {
        url += '&'+encodeURIComponent(key)+'='+encodeURIComponent(value);
    });

    $.ajax({
        url: url,
        dataType: 'jsonp',
        success: successCallback,
        error: function() {
            console.log('Error querying Missionhub endpiont "'+endpoint+'"!');
        }
    });
}

var init = function() {
    getRootLeaders();
}

var finish = function() {
    discipleship.renderGraph();
}

//leaders
//https://stage.missionhub.com/apis/v3/people?secret=40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2&filters%5Bgroup_role%5D=leader
//https://stage.missionhub.com/apis/v3/people?secret=40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2&filters%5Bgroup_role%5D=leader
//group membership
// https://stage.missionhub.com/apis/v3/group_memberships?secret=40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2&filters%5Bleader_id%5D=2603159
//person detail
//https://stage.missionhub.com/apis/v3/people?secret=40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2&filters%5Bids%5D=1262344&includes=first_name
