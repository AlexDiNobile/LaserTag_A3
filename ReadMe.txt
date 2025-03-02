-------CONTROLS
	Mouse and Keyboard
	- Use WASD to move
	- Click, hold and drag to move the camera
	- Click and release to shoot 

	Mobile
	- Move the phone to move the camera
	- Tap or tap and hold to move the player
	- Tap the screen to shoot

	Note
	- To hit a button or a target, they must be in the middle of the screen behind the reticle.


-------Overview of what you did?
	For this project, I created a two-player A-Frame interactive experience with a competitive and collaborative mode. To achieve this, I used WebSockets to connect the two players. The competitive experience is laser tag, in which both players have three lives and must fight each other until one has eliminated all the other's lives, claiming victory. The collaborative experience is an aim trainer in which players must work together to destroy 20 teleporting targets as quickly as possible. 
Both players have different perspectives, and they can see where the other is because their locations are emitted from the client to the server to be shared with everyone in the experience. Boxes are then attached to these locations that represent the players’ avatars. Aside from allowing players to see each other, the game interactions provide visual and auditory feedback. When a player shoots their laser, they can see it in their view and get a specific sound effect (player one and player two’s lasers sound different). In the laser tag mode, there is also visual and auditory feedback for when a player gets hit by their enemy. 
 In both experiences, players have different perspectives of the environment, seeing through different cameras. In the collaborative experience, however, both players have designated targets that only they can see (teal can only see teal targets, and pink can only see pink targets). The experience is also playable on mobile devices, sharing much of the same controls but just tapping instead of clicking, as well as camera movements and pressing/holding instead of using a mouse/keyboard.



-------What was challenging? 
	This project was a massive undertaking, and many aspects were challenging. Some were easier to solve than others, but a few kept me stuck for a while.
One of these was that it was tough to transfer the players' movement data between sockets so that they could see each other. This was one of the first things I tried to do for my project, and since I was unfamiliar with sockets at the time (I have a much clearer understanding of how they work now), it was a challenge to figure out the correct way to transfer the data.
	Trying to figure out how to use the nav mesh with my model and players was also a big challenge. I was about halfway through my project by the time I was adding it in. I didn’t realize that A-Frame Extras has some peculiarities when implementing a nav mesh. For the nav mesh to work, the camera needs to be set up in a specific way with specific attributes. This caused a lot of frustration since I had to alter my existing code. The construction of the nav mesh also had to be done in a specific way, which took a lot of time to figure out.
	One very odd issue also had me stumped for a while. When testing my project with the two players over Ngrok, I found that sometimes the second-player controls wouldn’t follow the camera and be stuck facing in one direction. I spent hours trying to determine what was causing the issue, but no matter what I did or changed, the problem persisted at seemingly random times. I was always unable to recreate the issue consistently, which made it very hard to discover the root problem.



-------What went well (i.e. how did you solve the above challenges?)
	Figuring out how to transfer position information (information/data in general) from the client to the server and back to every client on the server was a little tricky initially as I was getting comfortable with sockets. However, with a little trial and error, I figured it out. I successfully transferred users' position data to the server and sent it back to the clients, allowing them to see the location of the other player’s avatar.
	Implementing the nav mesh was challenging, but with some time and patience, I could make it work with my code. Creating the model and nav mesh in Blender was time-consuming, and I encountered strange issues. For example, in Blender, the nav mesh has to be made of one material, or it won’t work correctly. I slowly figured out these issues and created a good nav mesh that worked in my final interactive experience.
	In the end, I was never able to figure out the issue that sometimes caused the second player’s camera to get stuck; however, I did find that when I ran both players locally on one computer, the issue never happened; it only ever occurred when the second player was joining over Ngrok. This discovery and my lack of ability to find the root of the issue after hours of testing and research leads me to believe that the problem is caused by important information being lost while the second player loads in over Ngrok instead of an actual issue in the code itself. Still, I cannot say for sure if that is genuinely the cause.
	Overall, I am pleased with the result of all my hard work and am happy with the outcome.


-------The URL to your GitHub repository: https://github.com/AlexDiNobile/LaserTag_A3 



-------Audio References
Driken5482. (September 1, 2024). Retro Laser 2. [audio file] In Pixabay. Retrieved from https://pixabay.com/sound-effects/retro-laser-2-236680/ 

Sergenious. (September 5, 2022). Laser. [audio file] In Pixabay. Retrieved from https://pixabay.com/sound-effects/laser-104024/ 

PearceWilsonKing. (August 14, 2022). Badass Victory. [audio file] In Pixabay. Retrieved from https://pixabay.com/sound-effects/badass-victory-85546/ 

bipwave. (January 26, 2022). 80 Synth Music 2. [audio file] In Pixabay. Retrieved from https://pixabay.com/sound-effects/80-synth-music-2-14672/ 