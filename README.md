# Hours worked
24.2.22   first lab meeting. <br/><br/>
3.3.22    8 hours Proposing ideas and research on the main idea in terms of technologies, programming languages, frameworks. <br /><br/>
10.3.22   16 hours of learn how to connect to git Install Github desktop, connect git to visual studio code. Learning and experimenting with python code on yolov5. <br /><br/>
18.3.22   21 hours of run yolo5 from flask.react start client-side. handle git errors with all this files.test yolo5 on diffrent videos. <br /><br/>
24.3.22   8 hours of working on upload video from client to server and split data to test/train/validation folders . <br /><br/>
31.3.22   8 hours of working on client & server of show images in folder and select them . <br /><br/>
8.4.22    20 hours of working on building prove case - train vgg16 cnn from images generated from video. <br /><br/>
27.4.22   8 hours of arranging the code and preparing for the meeting. <br /><br/>
6.5.22    17 hours of make all ui responsive ( fit to mobile, tablet, leptop and big screen). <br /><br/>
12.5.22   22 hours of bulid client and server functionality - Delete all images not in class and Train, Validation, Test split and Image data augmentation.
# Motivation
1. Nowadays for a classification problem you have to manually search for a lot of pictures to train the model and I take out a lot of pictures in an automatic video process that collect enormous amount of photos in a short time.
2. It is easy to see end cases of the YOLO5 model (which extracts images from video) and improve the model - for example YOLO5 classifies a monkey as a person - if you train YOLO5 on a monkey category he will not classify a monkey as a person.
# How to install
1. install node.js , python3 and anaconda.
2. clone this git repo https://github.com/liatdavid2/graphic_lab.git to your local git.
3. go to client\my-app run npm install , after he finish run npm start
4. open anaconda on server\yolo5_small\ and pip install all python project dependencies: flask,flask_cors,werkzeug.utils,splitfolders,PIL,shutil,os,cv2,torch,pandas...
5. go to server\yolo5_small\ run python app.py

# How to use

1. open http://localhost:3000/ and select video file and classname and click "Upload!" button. 
<img src="https://user-images.githubusercontent.com/11797397/168041594-48eb3300-28b2-4b8d-816d-98c37f358f82.png" width=50% height=50%>
2. now you can see the video playing<br />
<img src="https://user-images.githubusercontent.com/11797397/168043328-47ab5943-7ac5-41b7-ab5a-74c8eb16d82b.png" width=50% height=50%>
<img src="https://user-images.githubusercontent.com/11797397/168044063-19fae0ef-5392-4849-8fab-f008b210682d.png" width=50% height=50%>



# Project challenges
