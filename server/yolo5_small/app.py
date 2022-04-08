#from flask import Flask
#Import necessary libraries
from flask import Flask, render_template, Response, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
from distutils.dir_util import copy_tree
import splitfolders
import cv2
import detect
import torch
import glob
import os  

# number of classes
nc: 80

# class names
class_names = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
        'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
        'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
        'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
        'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
        'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
        'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 
        'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 
        'teddy bear', 'hair drier', 'toothbrush']

app = Flask(__name__)
CORS(app)

@app.route('/split_to_folders')
def hello_world():    
    splitfolders.ratio('runs\detect\exp3\crops', output="runs\detect\exp3\classes", seed=1337, ratio=(0.7, 0.2,0.1)) 
    return 'split_to_folders colmplete!'
    

@app.route('/get_images_list_from_folder')
def get_images_list_from_folder():  
    res = {} 
    i = 0
    images_from_folder = []
    for dirpath, dirs, files in os.walk('C:\\Users\\liat\\GitHub\\graphic_lab\\client\\my-app\\public\\assets\\yes'): 
        for filename in files:
            fname = os.path.join(dirpath,filename)
            if fname.endswith('.jpg'):
                print(fname)
                images_from_folder.append({"label":fname.split('\\')[-1],"id":str(i),"image":fname.split('\\')[-1]})
                i+=1
    #files = glob.glob('C:/Users/liat/GitHub/graphic_lab/client/my-app/public/assets/person/**/*.jpg')
    #print(files)
    res['images_from_folder'] = images_from_folder
    return res

@app.route('/upload_video', methods = ['GET', 'POST'])
def upload_file():
   if request.method == 'POST':
      f = request.files['video_file']
      f.save(secure_filename(f.filename))
      print(f.filename,request.form.get('classesList'))
      classesList = request.form.get('classesList').split(",")
      classesListIndexes = []
      for i in range(len(classesList)):
          classesListIndexes.append(class_names.index(classesList[i])) 
      # conf_thres=0.75 important good conf
      detect.run(source=f.filename,save_crop=True,classes= classesListIndexes,conf_thres=0.5
      ,save_txt=True,view_img=True
      ,imgsz=(384,640))
      #copy_tree('C://Users//liat//GitHub//graphic_lab//server//yolo5_small//runs//detect//exp22//crops//', 'C://Users//liat//GitHub//graphic_lab//client//my-app//public//assets//')
      print(77)
      return 200,'file uploaded and convert to classes successfully'


if __name__ == '__main__':
    app.run(debug=True)