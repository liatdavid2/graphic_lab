
import React, { Component } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import ClassesList from './ClassesList';
import ImagesInFolderEditor from './ImagesInFolderEditor';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import './App.css';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      autoHideDuration: 3000,
      showCircularProgress: false,
      showAlert: false,
      severityAlert: 'info',
      errorAlert: '',
      selectedFile: null,
      Upload_disable: false,
      classesList: [],
      data_augmentation_types_selected: [],
      imagesFromFolder: [],
      value: [50, 70, 80],
      data_augmentation_types: ['Rotate', 'Sharpen', 'Paint', 'ColorQuantization', 'NoiseImages'],
      yolo5_classes: ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
        'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
        'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
        'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
        'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
        'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
        'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard',
        'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors',
        'teddy bear', 'hair drier', 'toothbrush']
    };
  }


  /*This method On file select will change selected video file .*/
  onFileChange = event => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  handleAlertClose = event => {
    this.setState({ showAlert: false })
  };
  changeSelectedClasses = (childData) => {
    // Change Image data augmentation selected classes 
    if (childData.includes('Rotate') || childData.includes('Sharpen') || childData.includes('Paint') ||
      childData.includes('ColorQuantization') || childData.includes('NoiseImages')) {
      this.setState({ data_augmentation_types_selected: childData })
    } else {
      // Change video to image selected classes 
      this.setState({ classesList: childData })
    }

  }
  makDataAugmentation = () => {
    const formData = new FormData();
    formData.append(
      "types_selected",
      this.state.data_augmentation_types_selected
    );
    axios.post("http://127.0.0.1:5000/data_augmentation", formData).then(resp => {
      console.log(resp)
      this.setState({ showAlert: true, severityAlert: 'success', errorAlert: resp.data })
    }).catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        this.setState({ showAlert: true, severityAlert: 'error', errorAlert: error.response.data })
      }
    });
  }
  Split = () => {
    axios.get("http://127.0.0.1:5000/crop_split_to_folders"
      , {
        params: {
          train: (this.state.value[0]) / 100
          , validation: (this.state.value[1] - this.state.value[0]) / 100,
          test: (100 - (this.state.value[0] + (this.state.value[1] - this.state.value[0]))) / 100
        }
      }).then(resp => {
        console.log(resp);
        this.setState({ showAlert: true, severityAlert: 'success', errorAlert: resp.data })
      }).catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          this.setState({ showAlert: true, severityAlert: 'error', errorAlert: error.response.data })
        }
      });
  }
  // On file upload (click the upload button)
  onFileUpload = () => {
    this.setState({ showAlert: true, showCircularProgress: true, autoHideDuration: 400000, severityAlert: 'info', errorAlert: 'Creating images from video! in C:\\Users\\liat\\GitHub\\graphic_lab\\server\\yolo5_small\\static\\yes' })
    this.setState({ imagesFromFolder: [] })
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append(
      "video_file",
      this.state.selectedFile,
      this.state.selectedFile.name,
    );
    formData.append(
      "classesList",
      this.state.classesList
    );

    // Details of the uploaded file
    console.log(this.state.selectedFile);

    // Request made to the backend api
    // Send formData object
    axios.post("http://127.0.0.1:5000/upload_video", formData).then(resp => {
      console.log(resp)
      this.setState({ imagesFromFolder: resp.data.images_from_folder })
      console.log(this.state.imagesFromFolder)
      this.setState({ showAlert: true, severityAlert: 'success', showCircularProgress: false, autoHideDuration: 3000, errorAlert: 'Images created from video! in C:\\Users\\liat\\GitHub\\graphic_lab\\server\\yolo5_small\\static\\yes' })
    }).catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        this.setState({ showAlert: true, severityAlert: 'error', errorAlert: 'Error: ' + error.response.data })
      }
    });
  };


  handleChange = (event, newValue) => {
    this.setState({ value: newValue })
  };


  render() {

    return (
      <div>
        <Snackbar open={this.state.showAlert} autoHideDuration={this.state.autoHideDuration} onClose={this.handleAlertClose}>
          <Alert onClose={this.handleAlertClose} severity={this.state.severityAlert} sx={{ width: '700px' }}>
            {this.state.errorAlert}
            {this.state.showCircularProgress === true ? <CircularProgress
              style={{ width: '18px', height: '10px', marginLeft: '10px' }} /> : null}
          </Alert>
        </Snackbar>
        {/*this.state.showAlert?<Alert severity={this.state.severityAlert} >{this.state.errorAlert}</Alert>:null*/}
        <AppBar position="static" style={{ backgroundColor: "#080862", marginBottom: "10px" }} >
          <Toolbar>
            <Grid container>

              <MenuIcon />
              <IconButton edge="start" color="inherit" aria-label="menu">
              </IconButton>

              <Grid item xs={10} >

                <Typography variant="h6" >
                  Video to Classified data!
                </Typography>
              </Grid>
            </Grid>

          </Toolbar>
        </AppBar>

        <Grid container>
          <Grid item xs={12} md={9}>
            <Card style={{ marginRight: "10px", marginLeft: "10px", borderRadius: 0 }} >
              <CardContent>
                <Grid container spacing={0}>
                  <Grid item xs={12} style={{ marginTop: '8px' }}>
                    <Tooltip title="Step 1: select video file and class name and click Upload!" arrow>                      
                      <div className='number'>1</div>                     
                    </Tooltip>
                    <h4 style={{ marginTop: "8px", marginBottom: "8px", display: "inline" }}>
                      Upload file and select at least one class:  </h4>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <input type="file" style={{ marginTop: "12px" }} onChange={this.onFileChange} />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <ClassesList classes_names={this.state.yolo5_classes} parentChangeSelectedClasses={this.changeSelectedClasses} />


                  </Grid>
                  <Grid item xs={12} md={1}>
                    <button variant="contained" style={{ marginLeft: '10px' }}
                      disabled={this.state.selectedFile === null || this.state.classesList.length === 0}
                      onClick={this.onFileUpload}>
                      Upload!
                    </button>
                  </Grid>
                </Grid>
              </CardContent></Card>

            <Card style={{ marginRight: "10px", marginLeft: "10px", marginTop: "10px", marginBottom: "10px", borderRadius: 0, padding: '0px', height: "425px" }} >
              <CardContent>
                <Grid container spacing={0}>
                  <Grid item xs={12} style={{ marginTop: '8px' }}>
                  <Tooltip title="Step 2: select all images not in class and click Delete selected." arrow>                      
                      <div className='number'>2</div>                     
                    </Tooltip>
                    <h4 style={{ marginTop: "8px", marginBottom: "8px", display: "inline" }}>  Delete all images not in class:  </h4>

                  </Grid>

                  <Grid item xs={12}>

                    {this.state.imagesFromFolder.length > 0 &&
                      <div>

                        <ImagesInFolderEditor imagesFromFolder={this.state.imagesFromFolder} /></div>}
                  </Grid>

                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card style={{ marginRight: "10px", marginLeft: "10px", padding: '0px', borderRadius: 0, height: "508px" }} >
              <CardContent>
                <Grid container style={{ marginRight: "10px", marginLeft: "0px" }}
                  spacing={0} >
                  <Grid item xs={12} style={{ marginTop: '8px' }}>
                    <div className='number'>3</div>
                    <h4 style={{ display: "inline" }}> Train, Validation, Test split: </h4>
                  </Grid>
                  <Grid item xs={12}>
                    <Slider style={{ color: '#080862' }}

                      value={this.state.value}
                      onChange={this.handleChange}
                    /></Grid>
                  <Grid item xs={12}>
                    Train: {this.state.value[0]}, Validation: {this.state.value[1] - this.state.value[0]}
                    , Test: {100 - (this.state.value[0] + (this.state.value[1] - this.state.value[0]))}
                  </Grid>
                  <Grid item xs={12}>
                    <button style={{ marginTop: '10px' }}
                      onClick={this.Split}
                    >Split</button>
                    <Divider />
                  </Grid>

                  <Grid item xs={12} style={{ marginTop: '8px' }}>
                    <div className='number'>4</div>
                    <h4 style={{ display: "inline" }}> Image data augmentation: </h4>
                  </Grid>
                  <Grid item xs={12}>
                    <ClassesList classes_names={this.state.data_augmentation_types} parentChangeSelectedClasses={this.changeSelectedClasses} />

                  </Grid>
                  <Grid>
                    <Grid item xs={12} md={12}>
                      <button variant="contained"

                        onClick={this.makDataAugmentation}>
                        Make Data Augmentation
                      </button>
                    </Grid>
                  </Grid>

                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <div>
        </div>

      </div>
    );
  }
}

export default App;
