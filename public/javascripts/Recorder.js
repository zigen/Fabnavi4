/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
 var RecordController = {

   newProject : function() {
     $("#start").hide();
     $('#projectList').hide();
     PlayConfig.init();
     //    Ca.initProject("  ");
     Keys.recorderKeyBind(); 
   },

   shoot: function() {
     $('#shoot').hide();
     $('#projectList').hide();
     $('#contents').hide();
     clearTimeout(RecordController.timer);
     console.log("index : "+PlayConfig.index);
     RecordController.timer = setTimeout(function() {
         var p = CameraAPI.shoot();
         p.then(function(url, error) {
             if (error) {
               alert(error);
               return;
             }
             PlayConfig.imgURLs.splice(PlayConfig.index+1,0,{localURL:url});
             RecordController.updateList();
             PlayController.next();
             if(PlayConfig.index > 0)Ca.removeMouseEvent();
             PlayController.show(PlayConfig.index,true);
             queue.push(PlayConfig.projectName,url,PlayConfig.index);
         });
     }, 10);
   },
   updateList: function () {
     PlayController.photoList.clear();
     for(key in PlayConfig.imgURLs.list){
       PlayController.photoList.append(PlayConfig.imgURLs.getURL(key));
     }
   }
 };

