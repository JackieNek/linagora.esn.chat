'use strict';

angular.module('linagora.esn.chat')

  .controller('channelViewController', function(
        $scope,
        $window,
        $log,
        $rootScope,
        session,
        ChatConversationService,
        channelsService,
        ChatMessageAdapter,
        CHAT,
        CHAT_EVENTS,
        ChatScroll,
        _,
        webNotification,
        chatLocalStateService,
        $stateParams) {

    $scope.user = session.user;
    $scope.messages = [];

    function addUniqId(message) {
      message._uniqId = message.creator._id + ':' + message.date  + '' + message.text;
    }

    ChatConversationService.fetchMessages($scope.chatLocalStateService.activeRoom._id, {}).then(function(result) {
      result.forEach(addUniqId);
      $scope.messages = result || [];
      ChatScroll.scrollDown();
    });

    function insertMessage(messages, message) {
      addUniqId(message);
      // chances are, the new message is the most recent
      // So we traverse the array starting by the end
      for (var i = messages.length - 1; i > -1; i--) {
        if (messages[i].date < message.date) {
          messages.splice(i + 1, 0, message);
          return;
        }
      }
      messages.unshift(message);
    }

    $scope.newMessage = function(message) {
      insertMessage($scope.messages, message);
      ChatScroll.scrollDown();
    };

    $scope.updateTopic = function($data) {
      channelsService.updateChannelTopic($data, chatLocalStateService.activeRoom._id);
    };

    $scope.$on(CHAT_EVENTS.TEXT_MESSAGE, function(event, message) {
      if (message.channel === $scope.chatLocalStateService.activeRoom._id) {
        $scope.newMessage(message);
      } else {
        chatLocalStateService.unreadMessage(message);
      }
    });
  });
