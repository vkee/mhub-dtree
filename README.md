# Mission Hub Discipleship Tree Visualization
Started by Nate Emerson at the Cru West Coast Hackathon.
Extended by Asaph Yuan and Vincent Kee at the Cru Boston Hackathon.

You will need to make a secret.js file that contains the secret as a secret variable for accessing the stage site. This will need to be in the src folder.

API for accessing MissionHub is located at http://api.missionhub.com/

# Running Discipleship Tree Viewer
Open index.html in a web browser. The organization id is hard coded as BU, which you can change in the queryMissionHub function in mhub-dtree.js.

TODO in the Discipleship Tree Viewer:
Change the API so the names are returned in one call rather than having the hacky callbacks
Space out the nodes in the graph better.

# Running the Interactions Viewer
Open visualization.html in a web browser. The organization id is hard coded as BU.
Enter a name and click display to show the interactions

TODO in the Interactions Viewer
Calculate the day since last met
Add leaders
Add friends in similar labels
Enable hiding/showing the difference labels
Show number of people talked to/choose to follow Jesus/total number of people reached
Add school picker
