
import React,{Component} from 'react';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
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
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
class App extends Component {
  
  
  state = {

    // Initially, no file is selected
    selectedFile: null,
    Upload_disable:false,
    classesList:[],
    imagesFromFolder: []
  };
  
  // On file select (from the pop up)
  onFileChange = event => {
  
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
  
  };
  handleCallback = (childData) =>{
    this.setState({classesList: childData})
}
  
  // On file upload (click the upload button)
  onFileUpload = () => {
  
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
  
  render() {
  
    return (
      <div>
      <AppBar position="static" style={{backgroundColor: "#080862",marginBottom: "10px"}} >
        <Toolbar>
        <Grid container>
        <Grid item xs={1} > 
        <MenuIcon />
        <IconButton edge="start"  color="inherit" aria-label="menu">         
           </IconButton>
        </Grid>
        <Grid item xs={7} >

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
          <Grid item xs={12}>
            <h4 style={{marginTop: "8px",marginBottom: "8px"}}>  Upload file and select at least one class:  </h4> 

            </Grid>
            <Grid item xs={12} md={2}>
               <input type="file" style={{marginTop: "12px"}} onChange={this.onFileChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ClassesList parentCallback={this.handleCallback}/>
            </Grid>
            <Grid item xs={12} md={2}>            
                <button variant="contained"
                disabled={this.state.selectedFile === null || this.state.classesList.length === 0}
                 onClick={this.onFileUpload}>
                Upload!
              </button>             
            </Grid>
          </Grid>
          </CardContent></Card>

          <Card style={{marginRight: "10px",marginLeft: "10px",marginTop: "10px",borderRadius: 0,padding:'0px',height:"425px"}} >
          <CardContent>
          <Grid container spacing={0}>
          <Grid item xs={12}>
            <h4 style={{marginTop: "8px",marginBottom: "8px"}}>  Select all images not in class:  </h4> <CircularProgress />

            </Grid>

          <Grid item xs={12}>
          {/*this.state.imagesFromFolder.length > 0 ?
          <ImageList  imagesFromFolder={this.state.imagesFromFolder} />:null}*/}
        {this.state.imagesFromFolder.length > 0 ? 
        <ImagesInFolderEditor imagesFromFolder={this.state.imagesFromFolder}/> : null}
            </Grid>
            <Grid item xs={12}><button style={{marginTop: "10px",marginBottom: "0px"}}>
            Select</button>          
          </Grid>
          </Grid>
          </CardContent>
          </Card>
          </Grid>

          <Grid item xs={12} md={3}>
          <Card style={{marginRight: "10px",marginLeft: "10px",padding:'0px',borderRadius: 0,height:"520px"}} >
          <CardContent>
          <Grid container style={{marginRight: "10px",marginLeft: "10px"}}
         spacing={0} >
           <Grid item xs={12}><h4> Image data augmentation: </h4> </Grid>
           </Grid>
          </CardContent>
          </Card>
          </Grid>
          </Grid>    

          <div>
             


             
             
          </div>
        {/*this.fileData()*/}

      </div>
    );
  }
}

export default App;
