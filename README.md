# How to install
1. install node.js , python3 and anaconda.
2. clone this git repo https://github.com/liatdavid2/graphic_lab.git to your local git.
3. go to client\my-app run npm install , after he finish run npm start
4. open anaconda on server\yolo5_small\ and pip install all python project dependencies: flask,flask_cors,werkzeug.utils,splitfolders,PIL,shutil,os,cv2,torch,pandas...
5. go to server\yolo5_small\ run python app.py
# How to use
<b>Step 1:</b> Open http://localhost:3000/ and select video file and classname (for example "person") and click "Upload!" button. 
<img src="https://user-images.githubusercontent.com/11797397/168041594-48eb3300-28b2-4b8d-816d-98c37f358f82.png" width=50% height=50%><br/>
 Now you can see the video finds all persons.<br />
<span><img src="https://user-images.githubusercontent.com/11797397/168043328-47ab5943-7ac5-41b7-ab5a-74c8eb16d82b.png" width=30% height=30%>
<img src="https://user-images.githubusercontent.com/11797397/168044063-19fae0ef-5392-4849-8fab-f008b210682d.png" width=30% height=30%></span><br/>
<b>Step 2:</b> select all images not in class (not baby JJ) and click "Delete selected".<br/>
<img src="https://user-images.githubusercontent.com/11797397/168248213-3ad30bdf-852a-4afb-b761-ef17b51e1b86.png" width=70% height=70%><br/>


<b>Step 3:</b> Select how to split the images collected from video to Train, Validation, Test splits and click "split".<br>The split will be in new "data" folder<br/>
<span><img src="https://user-images.githubusercontent.com/11797397/168046864-1ddc088c-515c-48df-9f56-150a5e45b70a.png" width=20% height=20%>
<img src="https://user-images.githubusercontent.com/11797397/168049360-3b4fed3e-f73a-4d7b-a3fa-136c4b70c039.png" width=10% height=10%></span><br/>
<b>Step 4:</b> Select Image data augmentation types and click "Select Data Augmentation Types". Example of rotate Image data augmentation. <br/>
For example 3 Rotates increase the images number * 3.   <br/>
<img src="https://user-images.githubusercontent.com/11797397/168048876-f9d54c14-7e3d-40e1-9749-247d016ee475.png" width=20% height=20%>
<img src="https://user-images.githubusercontent.com/11797397/168055850-f786ae92-f243-429e-a9bf-c2e1bc1b66b2.png" width=50% height=50%>
<img src="https://user-images.githubusercontent.com/11797397/168243151-e6287950-cee0-40ba-b415-cebfe885c2b6.png" width=20% height=20%><br/>
I made new data augmentation styles from skratch with opencv2 like:sharpen,<br/>
<span><img src="https://user-images.githubusercontent.com/11797397/168252614-9061ef5c-671c-430f-9638-7e7510f10f45.png" width=20% height=20%>
<img src="https://user-images.githubusercontent.com/11797397/168268562-ad5fdd19-8a20-45ce-903d-240e66e0717d.png" width=19.5% height=19.5%>
<img src="https://user-images.githubusercontent.com/11797397/168262679-8a78e889-8d73-48bc-9c73-368f585985e1.png" width=20.7% height=20.7%>
<img src="https://user-images.githubusercontent.com/11797397/168294969-65e1284f-3600-40e7-a706-c0ffed34edd9.png" width=19.5% height=19.5%>
<img src="https://user-images.githubusercontent.com/11797397/168318503-d63ecb9f-4aa6-4f80-94dd-5bacd9f1ad0d.png" width=19.8% height=19.8%>
<img src="https://user-images.githubusercontent.com/11797397/168297010-fb6085fe-7fe7-4ada-9a17-b74c6e280313.png" width=19.5% height=19.5%>
<img src="https://user-images.githubusercontent.com/11797397/168297875-3024dffa-b319-4cad-a3eb-5629d34eb2cc.png" width=19.5% height=19.5%>
 <img src="https://user-images.githubusercontent.com/11797397/168317115-7961dc40-6494-49dc-8560-ce7a5604c6b5.png" width=19.5% height=19.5%>
</span>


# Fully responsive user interface supports mobile, tablet, laptop and large screen
<span><img src="https://user-images.githubusercontent.com/11797397/168056839-5a2cdd51-d352-4e09-bda3-e157122b5cd2.png" width=40% height=40%>
<img src="https://user-images.githubusercontent.com/11797397/168057051-b7db5b94-f806-4143-8052-4885dc594574.png" width=40% height=40%></span><br/>
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
# Proof of concept
Results of train VGG-16 cnn to classify photos to 2 categories: baby JJ / not baby JJ.<br/>
<img src="https://user-images.githubusercontent.com/11797397/169505032-617df0bc-5825-4405-8e9b-b93f8713a3c2.png" width=70% height=70%>
<img src="https://user-images.githubusercontent.com/11797397/169505404-6bdd4a23-5f86-4773-ba2e-2f81551f0a15.png" width=70% height=70%>
# Technologies
1. Client side - React + Material ui + Axios(for http calls to flask api).
2. Server side - python flask.
3. Deep learning - yolo5 video object detection model.
# Project challenges
1. Innovation - There is no such product today (currently collecting images manually) - there was a risk that it would not work, so before building the system I did programming tests in google colab.
2. The project uses 3 different technologies, each with its own world react, flask python and deepl learning.
3. Train the VGG-16 cnn o classify photos to 2 categories: baby JJ / not baby JJ.
