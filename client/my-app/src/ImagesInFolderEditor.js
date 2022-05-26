import React from 'react';
import { Component } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';


export default class ImagesInFolderEditor extends Component {
  constructor() {
    super();
    this.state = {
      selectedImages: [],
      imagesFromFolder: [],
    };
  }
  //description: when componentWillUpdate lifecycle happend 
  // if nextProps.imagesFromFolder !== this.props.imagesFromFolder
  // then imagesFromFolder=  nextProps.imagesFromFolder
  //input: nextProps - new props
  componentWillUpdate(nextProps) {
    console.log(nextProps, this.props)
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.imagesFromFolder !== this.props.imagesFromFolder) {
      console.log(nextProps.imagesFromFolder, this.state.imagesFromFolder)
      this.setState({ imagesFromFolder: [] });
      this.setState({ imagesFromFolder: nextProps.imagesFromFolder });
    }
  }
  shouldComponentUpdate() {
    return true;
  }
  //description: when componentDidUpdate lifecycle happend 
  // if nextProps.imagesFromFolder !== this.props.imagesFromFolder
  // then imagesFromFolder=  nextProps.imagesFromFolder
  //input: prevProps - old props
  componentDidUpdate(prevProps) {
    console.log(prevProps, this.props)
    if (prevProps.imagesFromFolder !== this.props.imagesFromFolder) {
      this.setState({ imagesFromFolder: [] });
      this.setState({ imagesFromFolder: this.props.imagesFromFolder });
    }
  }
  //description: when componentWillMount lifecycle happend 
  // state.imagesFromFolder=  nextProps.imagesFromFolder
  componentWillMount() {
    console.log(this.props)
    // this.setState({ imagesFromFolder: [] });
    this.setState({ imagesFromFolder: [] });
    this.setState({ imagesFromFolder: this.props.imagesFromFolder })
  }
  //description: add selected  image to selectedImages list
  //input: event e
  handleImageCheckboxChange(e) {
    if (!this.state.selectedImages.includes(e.target.name)) {
      this.setState({
        selectedImages: [...this.state.selectedImages
          , e.target.name]
      })
    } else {
      this.setState({
        selectedImages: this.state.selectedImages.filter(function (selectedImage) {
          return selectedImage !== e.target.name
        })
      });
    }
  }
  //description: delete selected images 
  //             post call to server to tell him delete selected images
  //input: event e
  //output:if success: Alert 'success'
  //       if error: Alert error.response.data
  DeleteSelected = () => {
    const formData = new FormData();
    formData.append(
      "selectedImages",
      this.state.selectedImages
    );
    axios.post("http://127.0.0.1:5000/delete_selected", formData).then(resp => {
      console.log(resp)
      this.setState({ selectedImages: [] })
      this.setState({ imagesFromFolder: [] })

      this.setState({ imagesFromFolder: resp.data.images_from_folder })
      console.log(this.state.imagesFromFolder)
    })
  }
  //description: when componentWillUnmount lifecycle happend state.imagesFromFolder=[]
  componentWillUnmount() {
    this.setState({ imagesFromFolder: [] });
  }
  //description: make image list and return her
  //output: image list HTML
  renderImages() {
    return (<Box sx={{ width: '100%', overflowY: 'regular' }} style={{ paddingTop: "0px" }}>
      <button style={{ marginTop: "10px", marginBottom: "0px" }}
        onClick={this.DeleteSelected}>
        Delete selected</button>
      <ImageList sx={{ height: 280 }} cols={8} rowHeight={80}
        gap={0}
        style={{ width: "100%", marginTop: "10px" }}>
        {this.state.imagesFromFolder.map((item, index) => (
          <ImageListItem key={item.image} >
            <img src={`${item.image}`} alt={`${item.image}`} onChange={e => this.handleImgChange(e)} />

            <ImageListItemBar
              sx={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                  'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
              }}

              position="top"
              actionIcon={
                <IconButton>
                  <Checkbox key={item.id} name={item.image}
                    onChange={e => this.handleImageCheckboxChange(e)}
                    style={{ background: '#ffffff9e', color: '#080862' }} />
                </IconButton>
              }
              actionPosition="left"
            />
          </ImageListItem>

        ))}
      </ImageList>
    </Box>)
  }
  render() {
    return (
      this.renderImages()
    );
  }
}

