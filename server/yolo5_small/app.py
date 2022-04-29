#from flask import Flask
#Import necessary libraries
from cv2 import split
from flask import Flask, render_template, Response, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
from distutils.dir_util import copy_tree
import splitfolders
from PIL import Image
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


# define a function that rotates images in the current directory
# given the rotation in degrees as a parameter
def rotateImages(rotationAmt):
    # for each image in the current directory
    for path, subdirs, files in os.walk(r'C:\Users\liat\GitHub\graphic_lab\data'):
        for filename in files:
            fname = os.path.join(path, filename)
            if fname.endswith('.jpg'):
                # open the image
                img = Image.open(fname)
                # rotate and save the image with the same filename
                splitPath = fname.split("\\")
                print("//".join(splitPath[:-1]))
                print("//".join(splitPath[:-1])+"//rotate_"+splitPath[-1])
                #print("//".join(splitPath)[0:-1])
                img.rotate(rotationAmt).save("//".join(splitPath[:-1])+"//rotate_"+splitPath[-1])
                # close the image
                img.close()

@app.route('/data_augmentation')
def data_augmentation(): 
    # examples of use
    rotateImages(90)
    rotateImages(180)
    rotateImages(270)
    return Response('Data augmentation colmplete in C:\\Users\\liat\\GitHub\\graphic_lab\\data !', status=200, mimetype='application/json')

@app.route('/crop_split_to_folders')
def crop_split_to_folders():      
    train = request.args.get('train') 
    validation = request.args.get('validation') 
    test = request.args.get('test') 
    print(train)
    # the ratio to split. e.g. for train/val/test 
    splitfolders.ratio('C://Users//liat//GitHub//graphic_lab//server//yolo5_small//static', 
    output="C://Users//liat//GitHub//graphic_lab//data", 
    seed=1337, ratio=(float(train), float(validation),float(test))) 
    return 'split folders colmplete in C:\\Users\\liat\\GitHub\\graphic_lab\\data !'
        



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