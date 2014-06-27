/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Realtime Store playground.
 *
 * Shows off and demos various Realtime Store API features. This application is
 * intentionally low-tech, and devoid of clever abstraction, being designed
 * to be used as a sample.
 */

/**
 * Realtime Store playground namespace.
 */
var rtpg = rtpg || {};

rtpg.realtimeDoc = null;

rtpg.allDemos = [];

rtpg.mapDemos = function(callback) {
  return rtpg.allDemos.map(callback);
};


/**
 * Whether Realtime Store has loaded the doc and model.
 *
 * This is used as a guard to ensure that certain state has been set before
 * attempting to use it.
 */
rtpg.isInitialized = function() {
  return (rtpg.string.field != null);
}


rtpg.getField = function(name) {
  return rtpg.realtimeDoc.getModel().getRoot().get(name);
}

rtpg.INITILIZED_MESSAGE_SELECTOR = '#realtimeInitialized';
rtpg.COLLAB_HOLDER_SELECTOR = '#collabSections';

/**
 * Generates the initial model for newly created Realtime documents.
 * @param model
 */
rtpg.initializeModel = function(model) {
  var l = rtpg.allDemos.length;
  for (var i = 0; i < l; i++) {
    var demo = rtpg.allDemos[i];
    demo.initializeModel(model);
  }
};

// Called when the realtime file has been loaded.
rtpg.onFileLoaded = function(doc) {
  console.log('File loaded');
  console.log(doc);
  window.doc = doc;
  window.collaborators = doc.getCollaborators();
  window.mod = doc.getModel();
  window.root = mod.getRoot();
  window.str = root.get('demo_string');
  window.list = root.get('demo_list');
  window.map = root.get('demo_map');

  rtpg.realtimeDoc = doc;
  // Binding UI and listeners for demo data elements.
  for (var i = 0; i < rtpg.allDemos.length; i++) {
    var demo = rtpg.allDemos[i];
    demo.loadField();
    demo.updateUi();
    demo.connectUi();
    demo.connectRealtime(doc);
  }

  // Activating undo and redo buttons.
  var model = doc.getModel();
  $('#undoButton').click(function(){model.undo();});
  $('#redoButton').click(function(){model.redo();});

  // Add event handler for UndoRedoStateChanged events.
  var onUndoRedoStateChanged = function(e) {
    $('#undoButton').prop('disabled', !e.canUndo());
    $('#redoButton').prop('disabled', !e.canRedo());
  };
  model.onUndoRedoStateChanged(onUndoRedoStateChanged);

  // Enable Step 3 and 4
  $(rtpg.SHARE_DOC_HOLDER_SELECTOR).removeClass('disabled');
  $(rtpg.INITILIZED_MESSAGE_SELECTOR).show();
  $(rtpg.COLLAB_HOLDER_SELECTOR).removeClass('disabled');
  //Re-enabling buttons to create or load docs
  $('#createNewDoc').removeClass('disabled');
  $('#openExistingDoc').removeClass('disabled');
};

// Handles errors thrown by the Realtime Store API.
rtpg.handleErrors = function(e) {
  if(e.type == realtime.store.ErrorType.TOKEN_REFRESH_REQUIRED) {
    alert("TOKEN_REFRESH_REQUIRED");
  } else if(e.type == realtime.store.ErrorType.CLIENT_ERROR) {
    alert("An Error happened: " + e.message);
    window.location.href= "/";
  } else if(e.type == realtime.store.ErrorType.NOT_FOUND) {
    alert("The file was not found. It does not exist or you do not have read access to the file.");
    window.location.href= "/";
  }
};

// Register all types on Realtime doc creation.
rtpg.registerTypes = function() {
  var l = rtpg.allDemos.length;
  for (var i = 0; i < l; i++) {
    var demo = rtpg.allDemos[i];
    var registerTypes = demo.registerTypes;
    if (registerTypes) {
      registerTypes();
    }
  }
  console.log(rtpg);
}

// Initializes the Realtime Playground.
rtpg.start = function() {
  rtpg.registerTypes();
  window.store = new realtime.store.StoreImpl("https://realtime.goodow.com/channel", null);
  window.bus = store.getBus();
  store.load("playground/0", rtpg.onFileLoaded, rtpg.initializeModel, rtpg.handleErrors);
};

// Returns the collaborator for the given session ID.
rtpg.getCollaborator = function(sessionId) {
  var collaborators = rtpg.realtimeDoc.getCollaborators();
  for (var i = 0; i < collaborators.length; i = i+1) {
    if(collaborators[i].sessionId() == sessionId) {
      return collaborators[i];
    }
  }
  return null;
};

// Returns the Collaborator object for the current user.
rtpg.getMe = function() {
  var collaborators = rtpg.realtimeDoc.getCollaborators();
  for (var i = 0; i < collaborators.length; i = i+1) {
    if(collaborators[i].isMe()) {
      return collaborators[i];
    }
  }
  return null;
};
