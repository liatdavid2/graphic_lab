#from flask import Flask
#Import necessary libraries
from flask import Flask, render_template, Response, request
from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
import cv2
import detect
import torch

# number of classes
nc: 80

# class names
new_var = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
        'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
        'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
        'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
        'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
        'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
        'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 
        'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 
        'teddy bear', 'hair drier', 'toothbrush']

app = Flask(__name__)

"""def gen_frames():
    camera = cv2.VideoCapture(0)
    '''
    for ip camera use - rtsp://username:password@ip_address:554/user=username_password='password'_channel=channel_number_stream=0.sdp' 
    for local webcam use cv2.VideoCapture(0)
    '''
    while True:
        success, frame = camera.read()  # read the camera frame
        if not success:
            break
    else:
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')"""

@app.route('/')
def hello_world():
    # conf_thres=0.75 important good conf
    detect.run(source='bus27.mp4',save_crop=True,classes= 5,conf_thres=0.5
    ,imgsz=(384,640))
    return 'complete! '


@app.route('/upload_video', methods = ['GET', 'POST'])
def upload_file():
   if request.method == 'POST':
      f = request.files['video_file']
      f.save(secure_filename(f.filename))
      print(f.filename)
      # conf_thres=0.75 important good conf
      detect.run(source=f.filename,save_crop=True,classes= 5,conf_thres=0.5
      ,imgsz=(384,640))
      return 'file uploaded successfully'


if __name__ == '__main__':
    app.run(debug=True)