var secret = '40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2';
var base_url = ''
var queue = [];
var discipleship = new Graph();
var nodesCreated = [];

var mocks = {
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

// Main function of algorithm that processes one item from queue.

var processLeader = function () {
    var leader = getNextLeader();
    var groupIds = getGroupIdsLeadBy(leader);
    //var leaderNode = getNode(leader);
    $.each(groupIds, function(index, groupId) {
        var people = getMembersForGroupId(groupId);
        $.each(people, function(index, person) {
            makeNode(person);
            makeEdge(leader.id, person.id);
        });
    });
}

// @todo: unstub
var getNextLeader = function() {
    //return mocks.T1Leader;
    // This works as an actual queue but apparently can be slow
    return queue.shift();
}

// @todo: unstub
var getGroupIdsLeadBy = function(leader) {
    return mocks.T1LeaderGroups;
}

// @todo: unstub
var makeNode = function(person) {
    //If person hasn't been encountered yet, create new node and return
    // This should catch if there is no node property yet in person. It should work for both
    // undefined cases and null cases
    if (nodesCreated.indexOf(person.id) == -1))
    {
        //Push the person into the queue
        queue.push(person);
		//Push the id into created notes
		nodesCreated.push(person.id);
        // Using the addNode for D3
        discipleship.addNode(person.id, person.name);
    }
}

// @todo: unstub
var makeEdge = function(node1, node2) {
	discipleship.addEdge(node1, node2);
}

var getRootLeaders = function() {

}

var init = function() {
    queue = getRootLeaders();
}

while(queue.length > 0) {
    processLeader();
}

discipleship.renderGraph();


//leaders
//https://stage.missionhub.com/apis/v3/people?secret=40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2&filters%5Bgroup_role%5D=leader
//https://stage.missionhub.com/apis/v3/people?secret=40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2&filters%5Bgroup_role%5D=leader
//group membership
//https://stage.missionhub.com/apis/v3/group_memberships?secret=40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2&filters%5Bleader_id%5D=2603159
//person detail
//https://stage.missionhub.com/apis/v3/people?secret=40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2&filters%5Bids%5D=1262344&includes=first_name
