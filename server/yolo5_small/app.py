#Import necessary libraries
from flask import Flask, Response, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import splitfolders
from PIL import Image
import shutil
import os
import detect
import os  
import cv2
import numpy as np
import random
import json
from flask import jsonify, make_response

# coco128 dataset number of classes
nc: 80

# coco128 dataset class names
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

"""
description: get image and angle and rotate her by angle and save as new image
input:fname - file name and rotationAmt:rotation in degrees
"""
def rotateImage(fname,rotationAmt):
    img = Image.open(fname)
    splitPath = fname.split("\\")
    print("//".join(splitPath[:-1])+"//rotate_"+str(rotationAmt)+'deg'+splitPath[-1])
    img.rotate(rotationAmt).save("//".join(splitPath[:-1])+"//rotate_"+str(rotationAmt)+'deg'+splitPath[-1])
    img.close()


"""
description: get image and add her colorQuantization (kmeans) and save as new image
of total_color 
input:fname - file name and total_color: number of k colors for image
"""
def colorQuantizationImages(fname,total_color=7):  
    img = cv2.imread(fname)
    splitPath = fname.split("\\")               
    #colour quantization
    #k value determines the number of colours in the image
    k=total_color
    # Transform the image
    data = np.float32(img).reshape((-1, 3))
    # Determine criteria
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 0.001)
    # Implementing K-Means
    _ , label, center = cv2.kmeans(data, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    center = np.uint8(center)
    result = center[label.flatten()]
    result = result.reshape(img.shape)
    print("//".join(splitPath[:-1])+"//cq_"+splitPath[-1])
    cv2.imwrite("//".join(splitPath[:-1])+"//cq_"+splitPath[-1], result)
"""
description: get image and add salt_n_pepper_noise
input:img 
output:img with salt_n_pepper_noise
"""
def add_salt_n_pepper_noise(img): 
    # Getting the dimensions of the image
    dimensions= img.shape
    row = dimensions[0]
    col = dimensions[1]
    # Randomly pick some pixels in the
    # image for coloring them white
    # Pick a random number between 300 and 10000
    number_of_pixels = random.randint(7000, 8000)
    for i in range(number_of_pixels):      
        # Pick a random y coordinate
        y_coord=random.randint(0, row - 1)         
        # Pick a random x coordinate
        x_coord=random.randint(0, col - 1)        
        # Color that pixel to white
        img[y_coord][x_coord] = 255         
    # Randomly pick some pixels in
    # the image for coloring them black
    # Pick a random number between 300 and 10000
    number_of_pixels = random.randint(7000, 8000)
    for i in range(number_of_pixels):       
        # Pick a random y coordinate
        y_coord=random.randint(0, row - 1)         
        # Pick a random x coordinate
        x_coord=random.randint(0, col - 1)        
        # Color that pixel to black
        img[y_coord][x_coord] = 0
    return img
"""
description: get image and add her gray Salt_n_pepper_noise & Gaussian noise
input:fname- image file path
"""
def noiseImages(fname):    
    img = cv2.imread(fname)
    splitPath = fname.split("\\")
    print("//".join(splitPath[:-1])+"//noise_"+splitPath[-1])
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    noise_img = add_salt_n_pepper_noise(gray)
    cv2.imwrite("//".join(splitPath[:-1])+"//noise_"+splitPath[-1], noise_img)
    # Generate Gaussian noise
    gauss = np.random.normal(0,1,img.size)
    gauss = gauss.reshape(img.shape[0],img.shape[1],img.shape[2]).astype('uint8')
    # Add the Gaussian noise to the image
    img_gauss = cv2.add(img,gauss)
    cv2.imwrite("//".join(splitPath[:-1])+"//noiseg_"+splitPath[-1], img_gauss)



"""
description: get image and add her paint style and save as new image
input:fname- image file path
"""
def paintImages(fname):
    img = cv2.imread(fname)
    splitPath = fname.split("\\")
    stylize = cv2.stylization(img, sigma_s=60, sigma_r=0.07)
    print("//".join(splitPath[:-1])+"//paint_"+splitPath[-1])
    cv2.imwrite("//".join(splitPath[:-1])+"//paint_"+splitPath[-1], stylize)
 

"""
description: get image and add her sharpen her and save as new image
input:fname- image file path
"""
def sharpenImages(fname):  
    img = cv2.imread(fname)
    splitPath = fname.split("\\")
    print("//".join(splitPath[:-1]))
    kernel = np.array([[-1, -1, -1], [-1, 9.5, -1], [-1, -1, -1]])
    new_img = cv2.filter2D(img, -1, kernel)
    cv2.imwrite("//".join(splitPath[:-1])+"//sharpen_"+splitPath[-1], new_img)

"""
description: post get data_augmentation selected types,
loop on every image in train and valid folders and add them data_augmentations by selected types 
input:post data_augmentation selected types
output: response object if success: 'Data augmentation colmplete' str,200 
                        if error: str(error),500
"""
@app.route('/data_augmentation', methods = ['POST'])
def data_augmentation(): 
    try:
        if request.method == 'POST':
            types_selected = request.form.get('types_selected')
            types_selected = types_selected.split(',')
            
            print(types_selected)
            for path, subdirs, files in os.walk(r'C:\\Users\\liat\\GitHub\\graphic_lab\\data'):
                for filename in files:
                    fname = os.path.join(path, filename)
                    if fname.endswith('.jpg') and bool([ele for ele in ["paint","rotate","sharpen","cq","noise"] if(ele in filename)]) != True:
                        #img = Image.open(fname)
                        splitPath = fname.split("\\")
                        if 'Rotate' in types_selected:
                            rotateImage(fname,25)
                            rotateImage(fname,-35)
                        if  'Sharpen' in types_selected:
                            sharpenImages(fname)
                        if 'Paint' in types_selected:
                            paintImages(fname,20)
                        if 'ColorQuantization'  in types_selected:
                            colorQuantizationImages(fname,12)
                        if 'NoiseImages'  in types_selected:
                            noiseImages(fname)
            return make_response('Data augmentation colmplete in C:\\Users\\liat\\GitHub\\graphic_lab\\data !', 200)
    except Exception as e:
            return make_response('Server error in /data_augmentation: '+str(e), 500)

"""
description: post get selectedImages to delete and delete them.
input:post selectedImages to delete (not belong to class)
output: response object if success: new images after delete non relevant images,200 
                        if error: str(error),500
"""
@app.route('/delete_selected', methods = ['POST'])
def delete_selected(): 
    try:
        if request.method == 'POST':
            selectedImages = request.form.get('selectedImages')
            selectedImages = selectedImages.split(',')        
            for img in selectedImages:
                splitPath = img.split("/")
                print(img)
                
                imgPath = 'C:/Users/liat/GitHub/graphic_lab/server/yolo5_small/static' +'/'+ splitPath[-2]+'/'+splitPath[-1]
                print(imgPath)
                if os.path.exists(imgPath):
                    os.remove(imgPath)
            return make_response(jsonify(img_list_from_vid()), 200)
    except Exception as e:
            return make_response(str(e), 500)

"""@app.route('/stop')
def stop():
    detect.stop()
    return img_list_from_vid()"""

"""
description: split images to folders train,test,valid
output: response object if success: 'split folders colmplete' str,200 
                        if error: str(error),500
"""
@app.route('/crop_split_to_folders')
def crop_split_to_folders(): 
    try:
        data_folder_path = 'C:\\Users\\liat\\GitHub\\graphic_lab\\data'
        if os.path.exists(data_folder_path): 
            shutil.rmtree(data_folder_path)
        train = request.args.get('train') 
        validation = request.args.get('validation') 
        test = request.args.get('test') 
        # the ratio to split. e.g. for train/val/test 
        splitfolders.ratio('C://Users//liat//GitHub//graphic_lab//server//yolo5_small//static', 
        output="C://Users//liat//GitHub//graphic_lab//data", 
        seed=1337, ratio=(float(train), float(validation),float(test))) 
        return make_response('split folders colmplete in C:\\Users\\liat\\GitHub\\graphic_lab\\data !', 200)
    except Exception as e:
            return make_response('Server error in /crop_split_to_folders: '+str(e), 500)
        
"""
description: return image that made from video
output: images made from video
"""
def img_list_from_vid():
    res = {} 
    i = 0
    images_from_folder = []
    for path, subdirs, files in os.walk('C://Users//liat//GitHub//graphic_lab//server//yolo5_small//static'):
        for filename in files:
            fname = os.path.join(path, filename)
            if fname.endswith('.jpg'):
                print(777,'http://127.0.0.1:5000/static/'+fname.split('\\')[-2]+'/'+fname.split('\\')[-1])
                images_from_folder.append({"label":fname.split('\\')[-1],"id":i,"image":'http://127.0.0.1:5000/static/'+fname.split('\\')[-2]+'/'+fname.split('\\')[-1]})
                i+=1
    res['images_from_folder'] = images_from_folder
    return res

"""
description: upload video make images from video and return all the images path 
in server to client.
input: post video file and class list
output: images made from video
"""
@app.route('/upload_video', methods = ['GET', 'POST'])
def upload_file():
    i = 0
    classesListIndexes = []
    try:
        if request.method == 'POST':
            f = request.files['video_file']
            f.save(secure_filename(f.filename))
            classesList = request.form.get('classesList').split(",")
            for i in range(len(classesList)):
                classesListIndexes.append(class_names.index(classesList[i]))
            folder_path = 'C://Users//liat//GitHub//graphic_lab//server//yolo5_small//static//yes'
            if os.path.exists(folder_path): 
                shutil.rmtree(folder_path)
            detect.run(source=f.filename,save_crop=True,classes= classesListIndexes,conf_thres=0.5
            ,save_txt=False,view_img=True,project='C://Users//liat//GitHub//graphic_lab//server//yolo5_small//static',name='yes'
            ,imgsz=(384,640))
            return make_response(jsonify(img_list_from_vid()), 200)
    except Exception as e:
            return make_response(str(e), 500)


if __name__ == '__main__':
    app.run(debug=True)