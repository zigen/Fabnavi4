/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
var Ca = {
  x:0,
  y:0,
  w:1000,
  h:1000,
  cx:0,
  cy:0,
  lx:0,
  ly:0,
  drag:false,
  init: function(){
    document.getElementById('bwp').onclick = function(){
      Ca.w += 50;
      Ca.h += 50;
      Ca.update();
    };
    document.getElementById('bwm').onclick = function(){
      Ca.w -= 50;
      Ca.h -= 50;
      Ca.update();
    };
    document.getElementById('bhp').onclick = function(){
      Ca.h += 50;
      Ca.w += 50;
      Ca.update();
    };
    document.getElementById('bhm').onclick = function(){
      Ca.h -= 50;
      Ca.w -= 50;
      Ca.update();
    };

    var cvs = document.getElementById('cvs');
    cvs.onmousedown = function (e) {
      Ca.drag = true;
      Ca.lx = e.clientX;
      Ca.ly = e.clientY;
    };
    cvs.onmouseup = function (e){
      Ca.drag = false;
    };
    cvs.onmousemove= function (e){
      if(Ca.drag){
        Ca.cx -= Ca.lx - e.clientX;
        Ca.cy += e.clientY - Ca.ly; 
        Ca.lx =  e.clientX;
        Ca.ly =  e.clientY;
        Ca.update();
      }
    };
    Ca.cvs = document.getElementById('cvs');
    Ca.ctx = Ca.cvs.getContext('2d');
    Ca.image = document.getElementById('photo');
    Ca.cvs.height = screen.height;
    Ca.cvs.width = screen.width;
    $("#save").click(Ca.saveConfig);
    Ca.updatePhoto();
  },

  updatePhoto:function () {
                Ca.maxWidth = Ca.image.naturalWidth;
                Ca.maxHeight = Ca.image.naturalHeight;
                Ca.cx = Math.floor(Ca.maxWidth/2);
                Ca.cy = Math.floor(Ca.maxHeight/2);
              },

  updateConfig:function(){
                 Ca.x = Ca.cx - Math.floor(Ca.w/2);
                 Ca.y = Ca.cy - Math.floor(Ca.h/2);
                 CommonController.localConfig = {
                   x:Ca.x,y:Ca.y,w:Ca.w,h:Ca.h
                 };
               },

  saveConfig : function(){
                 if(CommonController.localConfig != "")CommonController.setLocalConfig(PlayConfig.projectName);
               },

  update : function(){
             Ca.updateConfig();
             PlayController.show(PlayConfig.index,true);
           },

  initProject: function(id) {
                 CommonController.getLocalConfig(id);
                 if(CommonController.localConfig != ""){
                   Ca.x = CommonController.localConfig.x;
                   Ca.y = CommonController.localConfig.y;
                   Ca.w = CommonController.localConfig.w;
                   Ca.h = CommonController.localConfig.h;
                 }
               }
}

