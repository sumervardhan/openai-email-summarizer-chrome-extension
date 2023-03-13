import React from "react";
import ReactDOM from "react-dom/client";
import { Frame } from './frame.js';

const MENU_ITEM_LIST = ['Summarise', 'Summary History', 'User', 'Settings', 'Our Website'];

const MENU_ICON_SRC = chrome.runtime.getURL('./icons/menu.png');
const STAR_ICON_SRC = chrome.runtime.getURL('./icons/star.png');
const SETTINGS_ICON_SRC = chrome.runtime.getURL('./icons/settings.png');
const MAGNIFYING_GLASS_ICON_SRC = chrome.runtime.getURL('./icons/magnifying_glass.png');
const USER_ICON_SRC = chrome.runtime.getURL('./icons/user.png');
const WEBSITE_ICON_SRC = chrome.runtime.getURL('./icons/website.png');

let frameRef = React.createRef();

// openai API call params
const MODEL = "gpt-3.5-turbo"
const CHAT_BOT_PRIMER = "You are a secretary for a busy CEO. Your job is to help summarise their emails, highlighting important points, questions, and action items."

async function getOpenAiResponse() {
    const url = 'https://email-summarizer-server.herokuapp.com/handleOpenAiApiCall'
    const inputData = document.getElementById("emailInput").value
    fetch(`${url}?input_data=${encodeURIComponent(inputData)}`, {
    method: 'GET'
    })
    .then(response => response.json())
    .then(resJson => {
        document.getElementById('emailInput').value = resJson.data
    })
    .catch(error => {
        console.error(error);
    });
}


// On extension click, render sidebar if it doesn't exist
// Toggle sidebar if already rendered
if (Frame.isReady()) {
  Frame.toggle()
} else {
  boot()
}

function boot() {
    let body = document.getElementsByTagName('body')[0];
    let wrappedBody = wrapBodyNodesInDiv(body);
    document.body.innerHTML = '';
    document.body.appendChild(wrappedBody);
    
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("./styles/sidebar.css");
    document.getElementsByTagName("head")[0].appendChild(link);

    const sidebar = document.createElement('div');
    sidebar.id = 'react-target';
    document.body.appendChild(sidebar);

    const root = ReactDOM.createRoot(document.getElementById('react-target'));
    root.render(<Frame ref = {frameRef} containerChildren={<PopUpContents />}/>);
}

function ImageComponent({ src, alt }) {
    return (
      <img className = 'summariserIcon314' src={src} alt={alt} />
    );
  }

function MenuToggle({src, alt}) {
    return (
        <img className = 'menuIcon314' src={src} alt={alt} onClick={this.insertMenuElements} />
      );
}

function PopUpContents () {
    return (
        <div id="sidebarContainer">
            <MenuToggle src={MENU_ICON_SRC} alt='Toggle Menu'/>
            <ImageComponent src={STAR_ICON_SRC} alt='Summarise'/>
            <ImageComponent src={MAGNIFYING_GLASS_ICON_SRC} alt='Summary History'/>
            <ImageComponent src={USER_ICON_SRC} alt='User'/>
            <ImageComponent src={SETTINGS_ICON_SRC} alt='Settings'/>
            <ImageComponent src={WEBSITE_ICON_SRC} alt='Our Website'/>
        </div>
    )
}

function insertMenuElements () {
    this.frameRef.current.toggle()
    var sidebarContainer = document.getElementById('sidebarContainer');
    MENU_ITEM_LIST.forEach(function(x) {
        var title = document.createElement("p");
        title.className = "menuTitle314"
        title.innerHTML = x;
        sidebarContainer.appendChild(title);
    })
}



function wrapBodyNodesInDiv(parentNode) {

let wrapper = document.createElement("div");
wrapper.id = 'body-wrapper'

const childNodes = parentNode.childNodes;

childNodes.forEach(function(x) {
    wrapper.appendChild(x.cloneNode(true))
})

return wrapper;
}




