(function() {
  'use strict';

  angular.module('linagora.esn.chat').factory('ChatTextEntitySelector', function(KEY_CODE) {

    function ChatTextEntitySelector(entityList, startChar, endChar) {
      this._fullEntityList = entityList;
      this._resetState();

      var matchStartChar = startChar === '^' ? '\\^' : '[' + startChar + ']';
      this.REGEXP_ENTITY_IN_EDITION = new RegExp(matchStartChar + '([a-zA-Z0-9_+-]+)$');
      this.endChar = endChar || '';
    }

    ChatTextEntitySelector.prototype._resetState = function() {
      this.visible = false;
      this.focusIndex = 0;
      this.entityStart = '';
    };

    ChatTextEntitySelector.prototype.select = function(entity) {
      this._insertEntityTag(entity);
      this._resetState();
    };

    ChatTextEntitySelector.prototype.textChanged = function(textareaAdapter) {
      this.textarea = textareaAdapter;

      if (this.textarea.selectionStart !== this.textarea.selectionEnd) {
        this._resetState();
        return;
      }

      var inEdition = this._entityInEdition(this.textarea.value, this.textarea.selectionStart);

      if (!inEdition || inEdition.length < 2) {
        this._resetState();
        return;
      }

      this.entityList = this._fullEntityList.filter(function(e) {
        return e.indexOf(inEdition) === 0;
      });

      if (this.entityList.length) {
        this.entityStart = inEdition;
        this.visible = true;
        return;
      }

      this._resetState();
    };

    ChatTextEntitySelector.prototype.keyDown = function(event) {
      if (!this.visible) {
        return;
      }

      var keyCode = event.keyCode || event.which || 0;

      if (keyCode === KEY_CODE.ENTER) {
        event.preventDefault();
        this.select(this.entityList[this.focusIndex]);
      } else if (keyCode === KEY_CODE.ARROW_UP || keyCode === KEY_CODE.ARROW_LEFT) {
        event.preventDefault();
        this._updateFocusIndex(-1);
      } else if (keyCode === KEY_CODE.ARROW_DOWN || keyCode === KEY_CODE.ARROW_RIGHT || isTab(event)) {
        event.preventDefault();
        this._updateFocusIndex(1);
      }
    };

    ChatTextEntitySelector.prototype._insertEntityTag = function(entity) {
      var value = this.textarea.value,
      selectionStart = this.textarea.selectionStart,
      valueStart = value.substring(0, selectionStart),
      valueEnd = value.substring(selectionStart);

      var distanceToColon = valueStart.match(this.REGEXP_ENTITY_IN_EDITION)[1].length;
      var newValueStart = valueStart.substr(0, valueStart.length - distanceToColon) + entity + this.endChar;
      this.textarea.replaceText(newValueStart  + valueEnd, newValueStart.length, newValueStart.length);
    };

    ChatTextEntitySelector.prototype._entityInEdition = function(text, cursorNextChar) {
      var textUntilCursorEnd = text.substring(0, cursorNextChar);
      var entityLast = textUntilCursorEnd.match(this.REGEXP_ENTITY_IN_EDITION);
      if (entityLast) {
        return entityLast[1];
      }
    };

    ChatTextEntitySelector.prototype._updateFocusIndex = function(diff) {
      this.focusIndex = (this.focusIndex + this.entityList.length + diff) % this.entityList.length;
    };

    function isTab(event) {
      var keyCode = event.keyCode || event.which || 0;

      return keyCode === KEY_CODE.TAB && !event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey;
    }

    return ChatTextEntitySelector;
  });
})();
