
import React,{Component} from 'react';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ClassesList from './ClassesList';
import ImagesInFolderEditor from './ImagesInFolderEditor';
import ImageList from './ImageList';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import './App.css';
import axios from 'axios';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      Upload_disable:false,
      classesList:[],
      data_augmentation_types_selected:[],
      imagesFromFolder: [],
      value: [50,70, 80],
      data_augmentation_types :['Rotate','scale','Rotate2','scale2','Rotate3','scale3'],
      classes_names : ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
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

  
  // On file select (from the pop up)
  onFileChange = event => {
  
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
  
  };
  handleCallback = (childData) =>{
    if(childData.includes('Rotate')){
      console.log(childData)
      this.setState({data_augmentation_types_selected: childData})
    }else{
      console.log(childData)
      this.setState({classesList: childData})
    }
    
}
shouldComponentUpdate() {
  return true;
}
  selectDataAugmentation= () => {
    const formData = new FormData();
    formData.append(
      "types_selected",
      this.state.data_augmentation_types_selected
    );
    axios.post("http://127.0.0.1:5000/data_augmentation", formData).then(resp => {
      console.log(resp)
    })
  }
  Split = () => {
    axios.get("http://127.0.0.1:5000/crop_split_to_folders"
    , { params: { train: (this.state.value[0])/100 
    ,validation:(this.state.value[1]-this.state.value[0])/100,
    test:(100 - (this.state.value[0]+(this.state.value[1]-this.state.value[0])))/100
      } }).then(resp => {
    })
  }
  // On file upload (click the upload button)
  onFileUpload = () => {
    this.setState({imagesFromFolder:[]})
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
      //imagesFromFolder = [...useState(resp.data.images_from_folder)]
      this.setState({imagesFromFolder:resp.data.images_from_folder})
      console.log(this.state.imagesFromFolder)
         
     });
  };
  
  // File content to be displayed after
  // file upload is complete
  fileData = () => {
  
    if (this.state.selectedFile) {
       
      return (
        <div>
          <h2>File Details:</h2>
           
<p>File Name: {this.state.selectedFile.name}</p>           
<p>File Type: {this.state.selectedFile.type}</p>          
<p>
            Last Modified:{" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>

        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };
   handleChange = (event, newValue) => {
    // setValue(newValue);
    this.setState({value:newValue})
  };
  valuetext(value) {
    return `${value}°C`;
  }
  make = () => {
   
    return <ImagesInFolderEditor imagesFromFolder={this.state.imagesFromFolder}/>
   
      
        
  }
  render() {
  
    return (
      <div>
      <AppBar position="static" style={{backgroundColor: "#080862",marginBottom: "10px"}} >
        <Toolbar>
        <Grid container>
       
        <MenuIcon />
        <IconButton edge="start"  color="inherit" aria-label="menu">         
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
          <Card style={{marginRight: "10px",marginLeft: "10px",borderRadius: 0}} >
          <CardContent>
          <Grid container spacing={0}>
          <Grid item xs={12} style={{marginTop: '8px'}}>
            <div className='number'>1</div>
            <h4 style={{marginTop: "8px",marginBottom: "8px",display: "inline"}}> 
             Upload file and select at least one class:  </h4> 

            </Grid>
            <Grid item xs={12} md={3}>
               <input type="file" style={{marginTop: "12px"}} onChange={this.onFileChange} />
            </Grid>
            <Grid item xs={12} md={8}>
           
            <ClassesList classes_names={this.state.classes_names} parentCallback={this.handleCallback}
            />

        
            </Grid>
            <Grid item xs={12} md={1}>            
                <button variant="contained" style={{marginLeft:'10px'}}
                disabled={this.state.selectedFile === null || this.state.classesList.length === 0}
                 onClick={this.onFileUpload}>
                Upload!
              </button>             
            </Grid>
          </Grid>
          </CardContent></Card>

          <Card style={{marginRight: "10px",marginLeft: "10px",marginTop: "10px",marginBottom: "10px",borderRadius: 0,padding:'0px',height:"425px"}} >
          <CardContent>
          <Grid container spacing={0}>
          <Grid item xs={12} style={{marginTop: '8px'}}>
          <div className='number'>2</div>
            <h4 style={{marginTop: "8px",marginBottom: "8px",display: "inline"}}>  Delete all images not in class:  </h4> 

            </Grid>

          <Grid item xs={12}>
            { this.make()}

        {/*
         
        this.state.imagesFromFolder.length > 0 && 
      
    <ImagesInFolderEditor imagesFromFolder={this.state.imagesFromFolder}/>*/}
        {/*<ImagesInFolderEditor imagesFromFolder={this.state.imagesFromFolder}/> */}
            </Grid>
     
          </Grid>
          </CardContent>
          </Card>
          </Grid>

          <Grid item xs={12} md={3}>
          <Card style={{marginRight: "10px",marginLeft: "10px",padding:'0px',borderRadius: 0,height:"520px"}} >
          <CardContent>
          <Grid container style={{marginRight: "10px",marginLeft: "0px"}}
         spacing={0} >
          <Grid item xs={12} style={{marginTop: '8px'}}>
          <div className='number'>3</div>
            <h4 style={{display: "inline"}}> Train, Validation, Test split: </h4>
             </Grid>
          <Grid item xs={12}>
          <Slider style={{color: '#080862'}}
         
            value={this.state.value}
            onChange={this.handleChange}
            getAriaValueText={this.valuetext}  /></Grid>
          <Grid item xs={12}>
            Train: {this.state.value[0]}, Validation: {this.state.value[1]-this.state.value[0]} 
            , Test: {100 - (this.state.value[0]+(this.state.value[1]-this.state.value[0]))}
          </Grid>
          <Grid item xs={12}>
            <button style={{marginTop: '10px'}} 
             onClick={this.Split}
            >Split</button>
            <Divider />
            </Grid>
            
           <Grid item xs={12} style={{marginTop: '8px'}}>
           <div className='number'>4</div>
             <h4 style={{display: "inline"}}> Image data augmentation: </h4> 
             </Grid>
           <Grid item xs={12}>
           <ClassesList classes_names={this.state.data_augmentation_types} parentCallback={this.handleCallback}/>

            </Grid>
            <Grid>
            <Grid item xs={12} md={12}>            
                <button variant="contained" 
               
                 onClick={this.selectDataAugmentation}>
                Select Data Augmentation Types
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
