import React from 'react';
import {Component} from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


export default class ImagesInFolderEditor extends Component {
    constructor() {
        super();
        this.state = {
            selectedImages: [],
            imagesFromFolder: [],
          };
    }
    
 
    componentWillMount(){
      // images =getAssets().list("images");
      //listImages = new ArrayList<String>(Arrays.asList(images));
     /*axios.get('http://localhost:5000/get_images_list_from_folder').then(resp => {

     //imagesFromFolder = [...useState(resp.data.images_from_folder)]
     this.setState({imagesFromFolder:[...resp.data.images_from_folder]})
     console.log(this.props.imagesFromFolder)
        
    });*/
    }
    handleChange(e) {
      console.log(e.target.name)
      if(!this.state.selectedImages.includes(e.target.name)){
        this.setState({
          selectedImages: [...this.state.selectedImages
            ,e.target.name]})
      }else{
        this.setState({selectedImages: this.state.selectedImages.filter(function(selectedImage) { 
          return selectedImage !== e.target.name 
      })});
      }
      
      // let isChecked = e.target.checked;
      // do whatever you want with isChecked value
    }
    DeleteSelected= () => {
      const formData = new FormData();
      formData.append(
        "selectedImages",
        this.state.selectedImages
      );
      axios.post("http://127.0.0.1:5000/delete_selected", formData).then(resp => {
        console.log(resp)
      })
    }
  render() {
    // console.log(this.props.imagesFromFolder);
  return (
      
    this.props.imagesFromFolder && this.props.imagesFromFolder.length > 0 ?
      <Box sx={{ width: '100%', overflowY: 'regular' }} style={{paddingTop: "0px"}}>
          <button style={{marginTop: "10px",marginBottom: "0px"}}
          onClick={this.DeleteSelected}>
            Delete selected</button> 
        <ImageList sx={{  height: 280 }} cols={8} rowHeight={80}
        gap={0}
        style={{width: "100%",marginTop: "10px"}}>
        {this.props.imagesFromFolder.map((item, index) => (
            <ImageListItem key={index}>
            <img
                src={`${item.image}?w=50&h=50&fit=crop&auto=format`}
                srcSet={`${item.image}?w=50&h=50&fit=crop&auto=format&dpr=2 2x`}
                alt={item.label}
                loading="lazy"
            />
            <ImageListItemBar
              sx={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                  'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
              }}
          
              position="top"
              actionIcon={
                <IconButton>
                <Checkbox  key={index} name={item.image}
                  onChange={e => this.handleChange(e)}
                  style={{background:'#ffffff9e',color: '#080862'}}/>
                </IconButton>
              }
              actionPosition="left"
            />
            </ImageListItem>
            
        ))}
        </ImageList>
    </Box>:null
  );
 }
}

