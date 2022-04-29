#from flask import Flask
#Import necessary libraries
from flask import Flask, render_template, Response, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
from distutils.dir_util import copy_tree
import splitfolders
import shutil
import os
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

app = Flask(__name__, static_url_path = '/static')
CORS(app)

@app.route('/crop_split_to_folders')
def crop_split_to_folders():   
    """IMG_PATH = 'C://Users//liat//GitHub//graphic_lab//data'
    os.chdir(IMG_PATH)
    os.makedirs(os.path.join(IMG_PATH, 'Test'), exist_ok=True)
    os.makedirs(os.path.join(IMG_PATH, 'Train'), exist_ok=True)
    os.makedirs(os.path.join(IMG_PATH, 'Validation'), exist_ok=True)
    os.makedirs(os.path.join(IMG_PATH, 'Test/YES/'), exist_ok=True)
    os.makedirs(os.path.join(IMG_PATH, 'Train/YES/'), exist_ok=True)
    os.makedirs(os.path.join(IMG_PATH, 'Validation/YES/'), exist_ok=True)
    #mkdir TRAIN TEST VAL TRAIN/YES TRAIN/NO TEST/YES TEST/NO VAL/YES VAL/NO
    # split the data by train/val/test
    for CLASS in os.listdir(IMG_PATH):
        print(CLASS)
        if not CLASS.startswith('.'):
            IMG_NUM = len(os.listdir(IMG_PATH  +'//'+ CLASS))
            for (n, FILE_NAME) in enumerate(os.listdir(IMG_PATH +'//'+ CLASS)):
                img = IMG_PATH +'//'+ CLASS + '//' + FILE_NAME
                print(img)
                if n < 0.1*IMG_NUM:
                    shutil.copytree(img, './TEST/' + CLASS.upper() + '/' + FILE_NAME)
                    #shutil.copy(img, './TEST/' + CLASS.upper() + '/' + FILE_NAME)
                elif n < 0.8*IMG_NUM:
                    shutil.copytree(img, './TRAIN/'+ CLASS.upper() + '/' + FILE_NAME)
                    #shutil.copy(img, './TRAIN/'+ CLASS.upper() + '/' + FILE_NAME)
                else:
                    shutil.copytree(img, './VAL/'+ CLASS.upper() + '/' + FILE_NAME)
                    #shutil.copy(img, './VAL/'+ CLASS.upper() + '/' + FILE_NAME)"""
    
    splitfolders.ratio('C://Users//liat//GitHub//graphic_lab//server//yolo5_small//static', 
    output="C://Users//liat//GitHub//graphic_lab//data", 
    seed=1337, ratio=(0.7, 0.2,0.1)) 
    return 'split_to_folders colmplete!'
        



@app.route('/upload_video', methods = ['GET', 'POST'])
def upload_file():
    res = {} 
    i = 0
    images_from_folder = []
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
        ,save_txt=False,view_img=True,project='C://Users//liat//GitHub//graphic_lab//server//yolo5_small//static',name='yes'
        ,imgsz=(384,640))

        for path, subdirs, files in os.walk('C://Users//liat//GitHub//graphic_lab//server//yolo5_small//static'):
                for filename in files:
                    fname = os.path.join(path, filename)
                    if fname.endswith('.jpg'):
                        print(777,'http://127.0.0.1:5000/static/'+fname.split('\\')[-2]+'/'+fname.split('\\')[-1])
                        images_from_folder.append({"label":fname.split('\\')[-1],"id":str(i),"image":'http://127.0.0.1:5000/static/'+fname.split('\\')[-2]+'/'+fname.split('\\')[-1]})
                        i+=1
        res['images_from_folder'] = images_from_folder
        return res
        #return Response(images_from_folder, status=200, mimetype='application/json')
        #return 200,'file uploaded and convert to classes successfully'


if __name__ == '__main__':
    app.run(debug=True)