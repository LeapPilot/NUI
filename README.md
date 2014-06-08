Introduction
=======================
This pilot combines different GitHub projects and enhances some of them. 



Description
=======================

Control an AR Drone 2.0 using a Leap Motion / keyboard and display video & control visualization in browser.

How to Fly
=======================

1. Hold hand above Leap Motion controller
2. To takeoff, gesture with your pointer finger as though left clicking a mouse
3. Keeping fingers together as though saluting, move hand right to move drone right, up to move drone up and forward to move drone forward
4. To rotate, make a circle with pointer finger in a clockwise or counterclockwise motion
5. To land, gesture with pointer finger as though left clicking a mouse

Stack
=======================

Node.js for server
Express for web app deployment
Faye for publishing and subscribing between leap, server and drone
Leap.js for converting leap motions into javascript
jQuery for browser displays and accessing keypresses for optional keyboard controls

