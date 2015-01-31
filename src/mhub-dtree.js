var secret = '40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2';
var base_url = 'https://stage.missionhub.com/apis/v3/';
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
        person.push({"node": nodeCounter});
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
        // @todo: unstub
        //processLeader();
        console.log(queue);
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

//leaders
//https://stage.missionhub.com/apis/v3/people?secret=40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2&filters%5Bgroup_role%5D=leader
//https://stage.missionhub.com/apis/v3/people?secret=40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2&filters%5Bgroup_role%5D=leader
//group membership
//https://stage.missionhub.com/apis/v3/group_memberships?secret=40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2&filters%5Bleader_id%5D=2603159
//person detail
//https://stage.missionhub.com/apis/v3/people?secret=40e2d09610aa1bead4583720a2377e24f9fe2b1844b1299ceaff0c2d1186d2e2&filters%5Bids%5D=1262344&includes=first_name
