var Director = function(){

  var viewStatusList = ["Initializing","loadingImage","showing"],
      viewStatus= 0,
      modeList = ["play","add","edit"],
      ImageList,
      localImageList,
      showingImageList,
      queueingImageList,
      mode = null,
      counter
  ;

function init (_mode){
  counter = document.getElementById("counter");
  mode = modeList.indexOf(_mode);
  if(mode == -1){
    new Error("mode is invalid");
  }

  /* Before */  
  ImageList = CachableImageList();
  MainView.init();
  Detail.init();
  ImageList.initWithURLArray(PICTURES_DATA);
  showingImageList = ImageList;
  ViewConfig.init();
  CalibrateController.init();

  /*  Initialize each Mode   */
  switch(mode){
    case 0:
    initAsPlayMode();
    break;
    case 1:
    initAsAddMode();
    break;
    case 2:
    initAsEditMode();
    break;
    default:
    break
  }

  /*  After   */
  UIPanel.init();
  KeyBind[modeList[mode]]();

  /* Finish Initializing */
  viewStatus = 1;
  showPage();
}

/* Initilizers */
function initAsPlayMode(){
  showingImageList = ImageList;
}

function initAsAddMode(){
  Camera.init();
  localImageList = CachableImageList();
  localImageList.initEditor();
  queueingImageList = localImageList;
  showingImageList = localImageList;
  showingImageList.initWithURLArray([]);
}

function initAsEditMode(){
  showingImageList.initEditor();
}

/* Common fabnavi methods*/
function getModeInt(){
  return mode;
}

function getViewStatusInt(){
  return viewStatus;
}

function getViewStatus (){
  return viewStatusList[viewStatus];
}

function getMode(){
  return modeList[mode];
}

function nextPage(){
  viewStatus = 1;
  showingImageList.next();
  showPage();
}

function prevPage(){
  viewStatus = 1;
  showingImageList.prev();
  showPage();
}

function setPage(i){
  if(showingImageList.setPage(i) !== false){
    viewStatus = 1;
    showPage(); 
  }
}

function reloadPage(){
  setPage(showingImageList.index());
}

function showPage(){
 counter.textContent = showingImageList.index() + 1 + "/" + showingImageList.length(); 
  var deferredImage;
  if(deferredImage = showingImageList.getDeferredImage()){
    // redraw();
    MainView.clear();
    MainView.showWaitMessage();
    deferredImage.then(function(img){
        MainView.draw(img);
        viewStatus = 2;
    });
  }
}
function redraw(){
  viewStatus = 1;
  MainView.redraw();
  viewStatus = 2;
}

function toggleConsole(){
  UIPanel.toggle();
}

function toggleEditor() {
  showingImageList.toggleEditor();
}

/* recorder interface */
function switchShowingList(){
  if(showingImageList == ImageList){
    showingImageList = localImageList;
  } else {
    showingImageList = ImageList;
  }
  prevPage();
}

function shoot(){
  Camera.ping().done(function(){
      redraw();
      MainView.showShootingMessage();
      Camera.shoot().then(function(url){
          redraw();
          var res = showingImageList.push(url);
          nextPage();
          ImageUploadQueue.push(res);
      });
  }).fail(function(){
      alert("Please Connect to Camera");
  });
}

function shootAndGetURLWithDeferred(){

}

function getShowingImageList(){
  return showingImageList;
}

function updateShowingImageList(a){
  showingImageList.updateListWithURLArray(a);
}

function removePage(){
  if(showingImageList.length() >1){
    showingImageList.remove(showingImageList.index());
    reloadPage();
  }
}

function exitProject(){
  if(confirm("Are you sure to exit this page?")){
    setTimeout(function(){
        window.location.pathname = "/";
    },10);
  }
}

return {
  init:init,
  mode:getModeInt,
  viewStatus:getViewStatusInt,
  getMode:getMode,
  getViewStatus:getViewStatus,
  nextPage:nextPage,
  prevPage:prevPage,
  setPage:setPage,
  redraw:redraw,
  toggleConsole:toggleConsole,
  shoot:shoot,
  toggleShowingList:switchShowingList,
  toggleEditor:toggleEditor,
  list:getShowingImageList,
  updateShowingImageList:updateShowingImageList,
  removePage:removePage,
  reloadPage:reloadPage,
  exit:exitProject,
};
}();