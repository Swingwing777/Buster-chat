# Project Brief User Stories:
The project's user stories were constructed at the start of development to inform the process and gain an idea of timescales involved.

Adobe xD was used to create the wireframes, again as initial concept that did chnage over the course of the develpment as certain requirements became clear.

## Story 1:
As a new user, I want to be able to easily enter a chat room so I can quickly start talking to my friends and family:
Breakdown (Story 1):
•	Open App --> Start Page 
•	[Key Feature] Enter name.
•	[Key Feature] Choose background colour for chat.
•	Start chatting.

#### Tasks:  
A.	Create Start view.
B.	Authenticate user (Google Firebase).
C.	Main page design iaw designer specs with script to listen for user inputs / colour choice and link to chat screen.
D.	Start view links to chat selection.

#### Story Points: 6 
Two views required: Start and Chat.  	 
Serverless function required (including any necessary registration if function).
Work intensive.

#### Wire Frames - Story 1 | Initial Concept:
![story1.png](https://sweepback.co.uk/supportfiles/Readme%20Support%20Media%20-%20for%20Sweepback/story1.png?dl=0&raw=1) 

## Story 2:
As a user, I want to be able to send messages to my friends and family members to exchange the latest news.
Breakdown (Story 2):
•	User enters or initiates chat to desired participants.
•	User writes message - INPUT field. 
•	User sends message - SEND button.
•	App stores conversations in Google Firestore Database.
•	Device stores conversations in LOCAL STORAGE

#### Tasks:  
A.	Links to existing chat or new chat.
B.	Input field required.
C.	Send button required.
D.	Remote storage required.  Presumed serverless.
E.	Local storage required so that previous chart dialogue always displayed.

#### Story Points: 4  
A number of separate tasks - with overlap between story 1 and story 2.	 

#### Wire Frames - Story 2 | Initial Concept:
![story2.png](https://sweepback.co.uk/supportfiles/Readme%20Support%20Media%20-%20for%20Sweepback/story2.png?dl=0&raw=1)

## Story 3:
As a user, I want to send images to my friends to show them what I am currently doing.
Breakdown (Story 3):
•	User selects device camera or pictures app.
•	User able to add picture from either source to chat post. 
•	Submit post.
•	Send notification to intended recipients.

#### Tasks:  
A.	Link (and permission) to camera.
B.	Link (and permission) to Pictures.
C.	Ability to import into chat and then send.
D.	Notification.

#### Story Points: 3  	
Not entirely sure without more complete Native knowledge.  Difficulty points entirely reliant on React-Native integration capabilities with device OS's.

#### Wire Frames - Story 3 | Initial Concept:
![story3.png](https://sweepback.co.uk/supportfiles/Readme%20Support%20Media%20-%20for%20Sweepback/story3.png?dl=0&raw=1)

## Story 4:
As a user, I want to share my location with my friends to show them where I am.
Breakdown (Story 4):
•	User selects option to share location.

#### Tasks:  
A.	Integrate and authorise device location with app (existing device functionality).

#### Story Points:  1 	 
Not entirely sure without more complete Native knowledge.  However, single function/purpose using existing device functionality.

#### Wire Frames - Story 4 | Initial Concept:
![story4.png](https://sweepback.co.uk/supportfiles/Readme%20Support%20Media%20-%20for%20Sweepback/story4.png?dl=0&raw=1)

## Story 5:
As a user, I want to be able to read my messages offline so I can reread conversations at any time.
Breakdown (Story 5):
•	Open app.
•	Read chats.

#### Tasks:  
A.	Access local storage through service worker.  Retrieve and read stored chats.

#### Story Points: 2 	
Single functionality. 

## Story 6:
As a user with a visual impairment, I want to use a chat app that is compatible with a screen reader so that I can engage with a chat interface.
Breakdown (Story 6):
•	Open and use app as if visually unimpaired.
•	Dictate and send messages via voice interaction.
#### Tasks:  
A.	All displays must be screen reader compatible / accessibility compliant
B.	Integrate built-in device dictation capability with app input functions.

#### Story Points: 3 	
React-Native surely includes general functionality that needs to be harnessed, but all app needs to be checked for compatibility. 


