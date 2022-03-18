from flask import Flask
import torch

app = Flask(__name__)


@app.route('/')
def hello_world():
    # Model
    model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)

    # Images
    imgs = ['dog.jpg']  # batch of images
    # Inference
    results = model(imgs)
    # Results
    results.print()
    results.save()  # or .show()
    return 'TEST'


if __name__ == '__main__':
    app.run(debug=True)