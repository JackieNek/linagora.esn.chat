(function() {
  'use strict';

  angular.module('linagora.esn.chat').component('chatEmoticonChooser', {
    templateUrl: '/chat/views/components/channel-view/messages/chat-emoticon-chooser.html',
    controllerAs: 'ctlr',
    controller: ChatEmoticonChooserController
  });

  function ChatEmoticonChooserController($scope, esnEmoticonList, KEY_CODE, ChatTextEntitySelector) {
    var self = this;

    self.entitySelector = new ChatTextEntitySelector(esnEmoticonList.split(','), ':', ':');

    $scope.$on('chat:message:compose:keydown', function(angularEvent, event) {
      self.entitySelector.keyDown(event);
      $scope.$applyAsync();
    });

    $scope.$on('chat:message:compose:textChanged', function(angularEvent, textareaAdapter) {
      self.entitySelector.textChanged(textareaAdapter);
    });
  }

})();
