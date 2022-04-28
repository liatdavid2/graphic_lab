import React, { PureComponent } from "react";
import { generateItems } from "./utils";
import axios from 'axios';

export default class ImageList extends PureComponent {
  constructor() {
    super();

    this.state = {
      // items: generateItems(120),
      isShiftDown: false,
      selectedItems: [],
      lastSelectedItem: null,
      imagesFromFolder: []
    };

    this.listEl = null;

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.handleSelectStart = this.handleSelectStart.bind(this);
  }
  // On file upload (click the upload button)
  onFileUpload = (e) => {
    e.preventDefault();
    console.log("refresh prevented");
    axios.get('http://localhost:5000/get_images_list_from_folder').then(resp => {

      //imagesFromFolder = [...useState(resp.data.images_from_folder)]
      this.setState({imagesFromFolder:[...resp.data.images_from_folder]})
      console.log(this.state.imagesFromFolder)
         
     });
  };
  componentWillMount(){
    // images =getAssets().list("images");
    //listImages = new ArrayList<String>(Arrays.asList(images));
   axios.get('http://localhost:5000/get_images_list_from_folder').then(resp => {

   //imagesFromFolder = [...useState(resp.data.images_from_folder)]
   this.setState({imagesFromFolder:[...resp.data.images_from_folder]})
   console.log(this.state.imagesFromFolder)
      
  });
  }
  componentDidMount() {
    document.addEventListener("keyup", this.handleKeyUp, false);
    document.addEventListener("keydown", this.handleKeyDown, false);
    this.listEl.addEventListener("selectstart", this.handleSelectStart, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener("keydown", this.handleKeyDown);
    this.listEl.removeEventListener("selectstart", this.handleSelectStart);
  }

  handleSelectStart(e) {
    // if we're clicking the labels it'll select the text if holding shift
    if (this.state.isShiftDown) {
      e.preventDefault();
    }
  }

  handleKeyUp(e) {
    if (e.key === "Shift" && this.state.isShiftDown) {
      this.setState({ isShiftDown: false });
    }
  }

  handleKeyDown(e) {
    if (e.key === "Shift" && !this.state.isShiftDown) {
      this.setState({ isShiftDown: true });
    }
  }

  handleSelectItem(e) {
    
    const { value } = e.target;
    const nextValue = this.getNextValue(value);

    this.setState({ selectedItems: nextValue, lastSelectedItem: value });
  }

  getNextValue(value) {
    console.log(value)
    const { isShiftDown, selectedItems } = this.state;
    const hasBeenSelected = !selectedItems.includes(value);

    if (isShiftDown) {
      const newSelectedItems = this.getNewSelectedItems(value);
      // de-dupe the array using a Set
      const selections = [...new Set([...selectedItems, ...newSelectedItems])];

      if (!hasBeenSelected) {
        return selections.filter(item => !newSelectedItems.includes(item));
      }
      console.log(selections)
      return selections;
    }

    // if it's already in there, remove it, otherwise append it
    return selectedItems.includes(value)
      ? selectedItems.filter(item => item !== value)
      : [...selectedItems, value];
  }

  getNewSelectedItems(value) {
    const { lastSelectedItem, imagesFromFolder } = this.state;
    const currentSelectedIndex = imagesFromFolder.findIndex(item => item.id === value);
    const lastSelectedIndex = imagesFromFolder.findIndex(
      item => item.id === lastSelectedItem
    );

    return imagesFromFolder
      .slice(
        Math.min(lastSelectedIndex, currentSelectedIndex),
        Math.max(lastSelectedIndex, currentSelectedIndex) + 1
      )
      .map(item => item.id);
  }

  renderItems() {
    const { imagesFromFolder, selectedItems } = this.state;
    // console.log(imagesFromFolder,this.state.imagesFromFolder)
    console.log(selectedItems)
    console.log(this.state.imagesFromFolder.filter(item =>selectedItems.includes(item.id)))
    return this.state.imagesFromFolder.map((item)  => {
      const { id, label,image } = item;
      return (
         <li key={id}>
          <input
            onChange={this.handleSelectItem}
            type="checkbox"
            checked={selectedItems.includes(id)}
            value={id}
            id={`item-${id}`}
          />
          <label htmlFor={`item-${id}`}>{}</label>
          <img
                src={`../../assets/${image}?w=50&h=50&fit=crop&auto=format`}
                srcSet={`../../assets/${image}?w=50&h=50&fit=crop&auto=format&dpr=2 2x`}
                loading="lazy"
            />
        </li>
      
      );
    });
  }

  render() {

    return  (<div>
    <button  onClick={this.onFileUpload}>click to see images that created till now from video!</button>

    <ul style={{display: "flex",width: "800px",overflowX: "scroll"}}

     ref={node => (this.listEl = node)}>{this.renderItems()
     }</ul></div>);
  }
}
