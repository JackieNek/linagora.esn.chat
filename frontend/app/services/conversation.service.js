(function() {
  'use strict';

  angular.module('linagora.esn.chat')
    .factory('chatConversationService', chatConversationService);

    function chatConversationService(
      $q,
      _,
      session,
      esnCollaborationClientService,
      ChatRestangular,
      chatPrivateConversationService,
      CHAT_OBJECT_TYPES,
      CHAT_CONVERSATION_TYPE
    ) {
      var service = {
        addMember: addMember,
        archive: archive,
        create: create,
        fetchMessages: fetchMessages,
        fetchAttachments: fetchAttachments,
        fetchOpenAndSubscribedConversations: fetchOpenAndSubscribedConversations,
        fetchUnreadOpenAndSubscribedConversations: fetchUnreadOpenAndSubscribedConversations,
        get: get,
        getMessage: getMessage,
        getSummary: getSummary,
        join: join,
        leave: leave,
        list: list,
        listForCurrentUser: listForCurrentUser,
        markAsRead: markAsRead,
        remove: remove,
        update: update,
        updateTopic: updateTopic,
        getUserStarredMessages: getUserStarredMessages
      };

      return service;

      function _getBase(id) {
        return ChatRestangular.all('conversations').one(id);
      }

      function _stripResponse(response) {
        return ChatRestangular.stripRestangular(response.data);
      }

      function addMember(id, userId) {
        return _getBase(id).one('members').one(userId).doPUT();
      }

      function archive(id) {
        return _getBase(id).one('archive').doPOST();
      }

      function create(conversation) {
        return ChatRestangular.one('conversations').doPOST(conversation);
      }

      function fetchMessages(id, options) {
        return _getBase(id).all('messages').getList(options).then(_stripResponse);
      }

      function fetchAttachments(id, options) {
        return _getBase(id).all('attachments').getList(options);
      }

      function get(id) {
        return _getBase(id).get().then(_stripResponse);
      }

      function getMessage(id) {
        return _getBase(id).get().then(_stripResponse);
      }

      function getSummary(id) {
        return _getBase(id).one('summary').get().then(_stripResponse);
      }

      function join(id, userId) {
        return esnCollaborationClientService.join(CHAT_OBJECT_TYPES.CONVERSATION, id, userId);
      }

      function leave(id, userId) {
        return esnCollaborationClientService.leave(CHAT_OBJECT_TYPES.CONVERSATION, id, userId);
      }

      function list(options) {
        return ChatRestangular.all('conversations').getList(options);
      }

      /**
       * List conversations of current user.
       *
       * @param  {Object} options - Query option, possible attributes:
       *                              + unread: if true, list all conversation in that user has unread messages
       * @return {Promise}        - Resolve response with conversations list
       */
      function listForCurrentUser(options) {
        return ChatRestangular.one('user').all('conversations').getList(options);
      }

      function markAsRead(id) {
        return _getBase(id).one('readed').doPOST();
      }

      function remove(id) {
        return _getBase(id).doDELETE();
      }

      function update(id, conversation) {
        return _getBase(id).doPUT(conversation);
      }

      function updateTopic(id, topic) {
        return _getBase(id).one('topic').doPUT({
          value: topic
        });
      }

      function getUserStarredMessages(options) {
        options = options || {};
        options.starred = true;

        return ChatRestangular.all('messages').getList(options);
      }

      function fetchOpenAndSubscribedConversations() {
        return $q.all([_fetchOpenConversation(), chatPrivateConversationService.get()])
          .then(function(result) {
            return result[0].concat(result[1]);
          })
          .then(_calculateUnreadMessage);
      }

      function fetchUnreadOpenAndSubscribedConversations() {
        return fetchOpenAndSubscribedConversations().then(function(conversations) {
          return conversations.filter(function(conversation) {
            return conversation.unreadMessageCount > 0;
          });
        });
      }

      function _fetchOpenConversation() {
        return _fetchAllConversations()
          .then(function(conversations) {
            return _.filter(conversations, function(conversation) {
              return conversation.type === CHAT_CONVERSATION_TYPE.OPEN;
            });
          });
      }

      function _fetchAllConversations() {
        return $q.all({
          conversations: listForCurrentUser(),
          session: session.ready
        }).then(function(resolved) {
          return resolved.conversations.data;
        });
      }

      function _calculateUnreadMessage(conversations) {
        return conversations.map(function(conversation) {
          var numOfMessage = conversation.numOfMessage;
          var numOfReadMessages = conversation.memberStates && conversation.memberStates[session.user.id] && conversation.memberStates[session.user.id].numOfReadMessages || 0;

          conversation.unreadMessageCount = numOfMessage - numOfReadMessages;

          return conversation;
        });
      }
    }
})();
