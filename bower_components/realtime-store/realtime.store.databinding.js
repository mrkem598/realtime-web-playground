// Forked from ShareJS

"use strict";

/**
 * A namespace that includes classes and methods for binding collaborative objects to UI elements.
 */
realtime.store.databinding = realtime.store.databinding || {};
realtime.store.databinding.EVENT_NAMES = ['textInput', 'keydown', 'keyup', 'select', 'cut', 'paste'];

/**
 * Binds a text input element to an collaborative string. Once bound, any change to the
 * collaborative string (including changes from other remote collaborators) is immediately displayed
 * in the text editing control. Conversely, any change in the text editing control is reflected in
 * the data model.
 *
 * @param string The collaborative string to bind.
 * @param textInputElement The text input element to bind. This must be a textarea element or an
 *                         input type=text element.
 */
realtime.store.databinding.bindString = function(string, textInputElement) {
  if (!(string instanceof realtime.store.CollaborativeString)) {
    throw new TypeError("Expected CollaborativeString for string, but was: " + string + ".");
  }
  if (!(textInputElement instanceof Element)) {
    throw new TypeError("Expected Element for textInputElement, but was: " + textInputElement);
  }
  if ("textarea" != textInputElement.type && "text" != textInputElement.type) {
    throw new TypeError("Expected text or textarea element for string, but was: "+ textInputElement
                            + ".");
  }
  textInputElement.value = string.getText();

  // The current value of the element's text is stored so we can quickly check
  // if its been changed in the event handlers.
  var prevvalue;
  // Replace the content of the text area with newText, and transform the
  // current cursor by the specified function.
  var replaceText = function(newText, transformCursor) {
    if (transformCursor) {
      var newSelection = [transformCursor(textInputElement.selectionStart),
                          transformCursor(textInputElement.selectionEnd)];
    }

    // Fixate the window's scroll while we set the element's value. Otherwise
    // the browser scrolls to the element.
    var scrollTop = textInputElement.scrollTop;
    textInputElement.value = newText;
    prevvalue = textInputElement.value; // Not done on one line so the browser can do newline conversion.
    if (textInputElement.scrollTop !== scrollTop) textInputElement.scrollTop = scrollTop;

    // Setting the selection moves the cursor. We'll just have to let your
    // cursor drift if the element isn't active, though usually users don't
    // care.
    if (newSelection && window.document.activeElement === textInputElement) {
      textInputElement.selectionStart = newSelection[0];
      textInputElement.selectionEnd = newSelection[1];
    }
  };
  replaceText(string.getText());

  // *** remote -> local changes
  var textInsertedRegistration = string.onTextInserted(function(evt) {
    if (evt.isLocal()) return;
    var transformCursor = function(cursor) {
      return evt.index() < cursor ? cursor + evt.text().length : cursor;
    };
    var prev = textInputElement.value.replace(/\r\n/g, '\n');
    replaceText(prev.slice(0, evt.index()) + evt.text() + prev.slice(evt.index()), transformCursor);
  });

  var textDeletedRegistration = string.onTextDeleted(function(evt) {
    if (evt.isLocal()) return;
    var transformCursor = function(cursor) {
      // If the cursor is inside the deleted region, we only want to move back to the start
      // of the region. Hence the Math.min.
      return evt.index() < cursor ? cursor - Math.min(evt.text().length, cursor - evt.index())
          : cursor;
    };
    var prev = textInputElement.value.replace(/\r\n/g, '\n');
    replaceText(prev.slice(0, evt.index()) + prev.slice(evt.index() + evt.text().length)
        , transformCursor);
  });


  // *** local -> remote changes
  /**
   * applyChange creates the edits to convert oldval -> newval.
   * This function should be called every time the text element is changed.
   */
  var applyChange = function(string, before, after) {
    // Strings are immutable and have reference equality. I think this test is O(1), so its worth doing.
    if (before === after) return;

    var dmp = new window.diff_match_patch();
    var diffs = dmp.diff_main(before, after);
    dmp.diff_cleanupSemantic(diffs);
    var cursor = 0;
    for (var i in diffs) {
      var text = diffs[i][1], len = text.length;
      switch (diffs[i][0]) {
        case 0:
          cursor += len;
          break;
        case 1:
          string.insertString(cursor, text);
          cursor += len;
          break;
        case -1:
          string.removeRange(cursor, cursor + len);
          break;
        default:
      }
    }
  };

  // This function generates operations from the changed content in the textarea.
  var genOp = function() {
    // In a timeout so the browser has time to propogate the event's changes to the DOM.
    setTimeout(function() {
      if (textInputElement.value !== prevvalue) {
        prevvalue = textInputElement.value;
        applyChange(string, string.getText(), textInputElement.value.replace(/\r\n/g, '\n'));
      }
    }, 0);
  };

  for (var i = 0; i < realtime.store.databinding.EVENT_NAMES.length; i++) {
    var e = realtime.store.databinding.EVENT_NAMES[i];
    if (textInputElement.addEventListener) {
      textInputElement.addEventListener(e, genOp, false);
    } else {
      textInputElement.attachEvent('on' + e, genOp);
    }
  }

  var binding = new realtime.store.databinding.Binding(string, textInputElement);
  binding.unbind = function() {
    textInsertedRegistration.unregister();
    textDeletedRegistration.unregister();
    for (var i = 0; i < realtime.store.databinding.EVENT_NAMES.length; i++) {
      var e = realtime.store.databinding.EVENT_NAMES[i];
      if (this.domElement.removeEventListener) {
        this.domElement.removeEventListener(e, genOp, false);
      } else {
        this.domElement.detachEvent('on' + e, genOp);
      }
    }
  };
  return binding;
};

/**
 * A binding between a collaborative object in the data model and a DOM element.
 *
 * @param collaborativeObject The collaborative object to bind.
 * @param domElement The DOM element to bind.
 * @constructor
 */
realtime.store.databinding.Binding = function(collaborativeObject, domElement) {
  /**
   * The collaborative object that this registration binds to the DOM element.
   */
  this.collaborativeObject = collaborativeObject;
  /**
   * The DOM element that this registration binds to the collaborative object.
   */
  this.domElement = domElement;
};

/**
 * Unbinds the DOM element from the collaborative object.
 */
realtime.store.databinding.Binding.prototype.unbind = function () {
};