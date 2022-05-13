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
    for path, subdirs, files in os.walk(r'C:\\Users\\liat\\GitHub\\graphic_lab\\data'):
        for filename in files:
            fname = os.path.join(path, filename)
            if fname.endswith('.jpg') and bool([ele for ele in ["paint_","rotate_","sharpen_"] if(ele in filename)]) != True:
                print(filename)
                # open the image
                img = Image.open(fname)
                splitPath = fname.split("\\")
                print("//".join(splitPath[:-1]))
                print("//".join(splitPath[:-1])+"//rotate_"+str(rotationAmt)+'deg'+splitPath[-1])
                img.rotate(rotationAmt).save("//".join(splitPath[:-1])+"//rotate_"+str(rotationAmt)+'deg'+splitPath[-1])
                # close the image
                img.close()

#defining a function
from scipy.interpolate import UnivariateSpline
def LookupTable(x, y):
  spline = UnivariateSpline(x, y)
  return spline(range(256))


def colorQuantizationImages(total_color=7):  
    for path, subdirs, files in os.walk(r'C:\\Users\\liat\\GitHub\\graphic_lab\\data'):
        for filename in files:
            fname = os.path.join(path, filename)
            if fname.endswith('.jpg') and bool([ele for ele in ["paint_","rotate_","sharpen_","cq_"] if(ele in filename)]) != True:
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
                ret, label, center = cv2.kmeans(data, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
                center = np.uint8(center)
                result = center[label.flatten()]
                result = result.reshape(img.shape)
                print("//".join(splitPath[:-1])+"//cq_"+splitPath[-1])
                cv2.imwrite("//".join(splitPath[:-1])+"//cq_"+splitPath[-1], result)

def paintImages(k_size=7):
    # for each image in the current directory    
    for path, subdirs, files in os.walk(r'C:\\Users\\liat\\GitHub\\graphic_lab\\data'):
        for filename in files:
            fname = os.path.join(path, filename) 
            if fname.endswith('.jpg') and bool([ele for ele in ["paint_","rotate_","sharpen_","cq_"] if(ele in filename)]) != True:
                img = cv2.imread(fname)
                splitPath = fname.split("\\")
                stylize = cv2.stylization(img, sigma_s=60, sigma_r=0.07)
                print("//".join(splitPath[:-1])+"//paint_"+splitPath[-1])
                cv2.imwrite("//".join(splitPath[:-1])+"//paint_"+splitPath[-1], stylize)
                # ok
                """hdr = cv2.detailEnhance(img, sigma_s=12, sigma_r=0.15)
                cv2.imwrite("//".join(splitPath[:-1])+"//pencilSketch_"+splitPath[-1], hdr)"""
                #colour quantization
                #k value determines the number of colours in the image
                """total_color = 8
                k=total_color
                # Transform the image
                data = np.float32(img).reshape((-1, 3))
                # Determine criteria
                criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 0.001)
                # Implementing K-Means
                ret, label, center = cv2.kmeans(data, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
                center = np.uint8(center)
                result = center[label.flatten()]
                result = result.reshape(img.shape)
                cv2.imwrite("//".join(splitPath[:-1])+"//pencilSketch_"+splitPath[-1], result)"""
                """gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                blur_img = cv2.GaussianBlur(gray_img, (3,3), 0)
                img_edges = cv2.Canny(image=blur_img, threshold1=50, threshold2=155)
                cv2.imwrite("//".join(splitPath[:-1])+"//pencilSketch_"+splitPath[-1], img_edges)"""

                """# summer
                increaseLookupTable = LookupTable([0, 64, 128, 256], [0, 80, 160, 256])
                decreaseLookupTable = LookupTable([0, 64, 128, 256], [0, 50, 100, 256])
                blue_channel, green_channel,red_channel  = cv2.split(img)
                red_channel = cv2.LUT(red_channel, increaseLookupTable).astype(np.uint8)
                blue_channel = cv2.LUT(blue_channel, decreaseLookupTable).astype(np.uint8)
                sum= cv2.merge((blue_channel, green_channel, red_channel ))
                cv2.imwrite("//".join(splitPath[:-1])+"//pencilSketch_"+splitPath[-1], sum)"""
                """# summer
                increaseLookupTable = LookupTable([0, 64, 128, 256], [0, 80, 160, 256])
                decreaseLookupTable = LookupTable([0, 64, 128, 256], [0, 50, 100, 256])
                blue_channel, green_channel,red_channel  = cv2.split(img)
                red_channel = cv2.LUT(red_channel, increaseLookupTable).astype(np.uint8)
                blue_channel = cv2.LUT(blue_channel, decreaseLookupTable).astype(np.uint8)
                sum= cv2.merge((blue_channel, green_channel, red_channel ))
                cv2.imwrite("//".join(splitPath[:-1])+"//pencilSketch_"+splitPath[-1], sum)"""
                """increaseLookupTable = LookupTable([0, 64, 128, 256], [0, 80, 160, 256])
                decreaseLookupTable = LookupTable([0, 64, 128, 256], [0, 50, 100, 256])
                blue_channel, green_channel,red_channel = cv2.split(img)
                red_channel = cv2.LUT(red_channel, decreaseLookupTable).astype(np.uint8)
                blue_channel = cv2.LUT(blue_channel, increaseLookupTable).astype(np.uint8)
                win= cv2.merge((blue_channel, green_channel, red_channel))
                cv2.imwrite("//".join(splitPath[:-1])+"//pencilSketch_"+splitPath[-1], win)"""



def sharpenImages():  
    for path, subdirs, files in os.walk(r'C:\\Users\\liat\\GitHub\\graphic_lab\\data'):
        for filename in files:
            fname = os.path.join(path, filename)
            if fname.endswith('.jpg') and bool([ele for ele in ["paint_","rotate_","sharpen_","cq_"] if(ele in filename)]) != True:
                img = cv2.imread(fname)
                splitPath = fname.split("\\")
                print("//".join(splitPath[:-1]))
                kernel = np.array([[-1, -1, -1], [-1, 9.5, -1], [-1, -1, -1]])
                new_img = cv2.filter2D(img, -1, kernel)
                cv2.imwrite("//".join(splitPath[:-1])+"//sharpen_"+splitPath[-1], new_img)

@app.route('/data_augmentation', methods = ['POST'])
def data_augmentation(): 
    if request.method == 'POST':
        types_selected = request.form.get('types_selected')
        types_selected = types_selected.split(',')
        
        print(types_selected)
        if 'Rotate' in types_selected:
            rotateImages(25)
            rotateImages(-35)
            rotateImages(45)
        if 'Sharpen'  in types_selected:
            sharpenImages()
        if 'Paint'  in types_selected:
            paintImages(20)
        if 'ColorQuantization'  in types_selected:
            colorQuantizationImages(12)
            
    return Response('Data augmentation colmplete in C:\\Users\\liat\\GitHub\\graphic_lab\\data !', status=200, mimetype='application/json')


@app.route('/delete_selected', methods = ['POST'])
def delete_selected(): 
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
            #print(selectedImages)
        return img_list_from_vid()
        #return Response('delete selected colmplete in C:\\Users\\liat\\GitHub\\graphic_lab\\data !', status=200, mimetype='application/json')

@app.route('/stop')
def stop():
    detect.stop()
    return img_list_from_vid()

@app.route('/crop_split_to_folders')
def crop_split_to_folders(): 
    data_folder_path = 'C:\\Users\\liat\\GitHub\\graphic_lab\\data'
    if os.path.exists(data_folder_path): 
        shutil.rmtree(data_folder_path)
    train = request.args.get('train') 
    validation = request.args.get('validation') 
    test = request.args.get('test') 
    print(train)
    # the ratio to split. e.g. for train/val/test 
    splitfolders.ratio('C://Users//liat//GitHub//graphic_lab//server//yolo5_small//static', 
    output="C://Users//liat//GitHub//graphic_lab//data", 
    seed=1337, ratio=(float(train), float(validation),float(test))) 
    # loop through the list of folders
    #for sub_dir in content_list:  
    """for path, subdirs, files in os.walk('test'):
        for sub_dir in subdirs:
            # loop through the contents of the
            # list of folders
            #for contents in content_list[sub_dir]:  
            # make the path of the content to move 
            path_to_content = sub_dir + "/" + contents    
            # make the path with the current folder
            dir_to_move = os.path.join(current_folder, path_to_content )
    
            # move the file
            shutil.move(dir_to_move, merge_folder_path)"""
    return 'split folders colmplete in C:\\Users\\liat\\GitHub\\graphic_lab\\data !'
        

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
        folder_path = 'C://Users//liat//GitHub//graphic_lab//server//yolo5_small//static//yes'
        if os.path.exists(folder_path): 
            shutil.rmtree(folder_path)
        # conf_thres=0.75 important good conf
        detect.run(source=f.filename,save_crop=True,classes= classesListIndexes,conf_thres=0.5
        ,save_txt=False,view_img=True,project='C://Users//liat//GitHub//graphic_lab//server//yolo5_small//static',name='yes'
        ,imgsz=(384,640))

        return img_list_from_vid()

        """for path, subdirs, files in os.walk('C://Users//liat//GitHub//graphic_lab//server//yolo5_small//static'):
                for filename in files:
                    fname = os.path.join(path, filename)
                    if fname.endswith('.jpg'):
                        print(777,'http://127.0.0.1:5000/static/'+fname.split('\\')[-2]+'/'+fname.split('\\')[-1])
                        images_from_folder.append({"label":fname.split('\\')[-1],"id":str(i),"image":'http://127.0.0.1:5000/static/'+fname.split('\\')[-2]+'/'+fname.split('\\')[-1]})
                        i+=1
        res['images_from_folder'] = images_from_folder
        return res"""
        #return Response(images_from_folder, status=200, mimetype='application/json')
        #return 200,'file uploaded and convert to classes successfully'


if __name__ == '__main__':
    app.run(debug=True)