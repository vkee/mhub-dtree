var secret = '40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2',
    base_url = 'https://stage.missionhub.com/apis/v3/',
    queue = [],
    discipleship = new Graph(),
    nodesCreated = [],

    mocks = {
        "T1Leader": {
            "id": 12,
            "name": "Drew Aufhammer"
        },
        "T2Leader": {
            "id": 45,
            "name": "Nate Emerson"
        },
        "T1LeaderGroups": [1, 3, 5]
    };

var makeNode = function(person) {
    // Checks if a node has been created for a given person yet
    if (nodesCreated.indexOf(person.id) == -1)
    {
        //Push the person into the queue
        queue.push(person);
        //Push the id into created notes
        nodesCreated.push(person.id);
        // Using the addNode for D3
        discipleship.addNode(person.id, person.name);
    }
}

var makeEdge = function(node1, node2) {
    discipleship.addEdge(node1, node2);
}

// Main function of algorithm that processes one item from queue.
var processLeader = function () {
    var leader = getNextLeader();
    peopleLedBy(leader, function(people) {
        $.each(people, function(index, person) {
            makeNode(person);
            makeEdge(leader.id, person.id);
        });
    });
}

var getNextLeader = function() {
    return queue.shift();
}

// @todo: unstub
var peopleLedBy = function(leader, successCallback) {
    //Query mission hub for the list of people that are leaders but not a member
    //of any group themselves.
    queryMissionHub('group_memberships', {'filters[leader_id]': leader.id}, function(json) {
        //Parse through the data from Missionhub and just take ID and name
        $.each(json.group_memberships, function(index, membership) {
            console.log(membership);
        })
        successCallback(json);
        // $.each(json.people, function(index, person) {
        //     queue.push({
        //         id: person.id,
        //         name: person.first_name+' '+person.last_name
        //     });
        // });
    });
}

// Gets the root leaders from Missionhub and begins processing the queue
var getRootLeaders = function() {
    //Query mission hub for the list of people that are leaders but not a member
    //of any group themselves.
    queryMissionHub('people', {'filters[group_involvement_id]': 'none', 'filters[group_role]': 'leader'}, function(json) {

        //Parse through the data from Missionhub and just take ID and name
        $.each(json.people, function(index, person) {
            queue.push({
                id: person.id,
                name: person.first_name+' '+person.last_name
            });
        });

        // Begin processing the queue.
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
//https://stage.missionhub.com/apis/v3/group_memberships?secret=40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2&filters%5Bleader_id%5D=2603159
//person detail
//https://stage.missionhub.com/apis/v3/people?secret=40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2&filters%5Bids%5D=1262344&includes=first_name
