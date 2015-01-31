var secret = '40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2';

var queue = [];
var nodeCounter = 0;

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
    var leaderNode = getNode(leader);
    $.each(groupIds, function(index, groupId) {
        var people = getMembersForGroupId(groupId);
        $.each(people, function(index, person) {
            var personNode = getNode(person);
            addEdge(leaderNode, personNode);
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
var getNode = function(person) {
    //If person hasn't been encountered yet, create new node and return
	// This should catch if there is no node property yet in person. It should work for both
	// undefined cases and null cases
	if (person.node == null)
	{
		//Push the person into the queue
		queue.push(person);
		// Using the setNode for D3
		setNode(nodeCounter, {label: person.name});
		// Add a node property to the person 
		person.push("node": nodeCounter); 
		// Increase the global node counter so we have unique node numbers for everyone
		// Israel: I think that we could use the person's id for setNode instead of a 
		// global node counter but I think this is the way you wanted it formatted
		nodeCounter++;
		return person.node;
    }
	//Else, return existing node
	else
		return person.node;
}

// @todo: unstub
var addEdge = function(node1, node2) {

}

while(queue.length > 0) {
    processLeader();
}

// For a good time visit room 212
// ...and knock very loudly at 4am