(function() {
  'use strict';

  angular.module('linagora.esn.chat')
    .constant('CHAT', {
      DEFAULT_FETCH_SIZE: 20
    })
    .constant('CHAT_ATTACHMENT_PROVIDER', {
      conversation: 'chat.conversation'
    })
    .constant('CHAT_MEMBER_STATUS', {
      MEMBER: 'member',
      NONE: 'none'
    })
    .constant('CHAT_LOCAL_STORAGE', {
      LAST_CONVERSATION: 'chat.last-conversation'
    })
    .constant('CHAT_EVENTS', {
      CONVERSATION_TOPIC_UPDATED: 'chat:conversation:topic:updated',
      MESSAGE_RECEIVED: 'chat:message:received',
      USER_CHANGE_STATE: 'user:state',
      NEW_CONVERSATION: 'chat:conversation:created',
      CONVERSATION_DELETION: 'chat:conversation:deleted',
      TEXT_MESSAGE: 'chat:message:text',
      FILE_MESSAGE: 'chat:message:file',
      SET_ACTIVE_ROOM: 'chat:message:set_active_room',
      UNSET_ACTIVE_ROOM: 'chat:message:unset_active_room',
      CONVERSATIONS: {
        NEW: 'chat:conversations:new',
        ADD_NEW_MEMBERS: 'chat:conversation:members:add',
        UPDATE: 'chat:conversation:update'
      }
    })
    .constant('CHAT_WEBSOCKET_EVENTS', {
      MESSAGE: 'message'
    })
    .constant('CHAT_WEBSOCKET_ROOM', {
      DEFAULT: 'default'
    })
    .constant('CHAT_MESSAGE_DISPLAYABLE_TYPES', {
      USER: 'user',
      SYSTEM: 'system'
    })
    .constant('CHAT_MESSAGE_PREFIX', 'chat:message:')
    .constant('CHAT_SYSTEM_MESSAGE_SUBTYPES', ['conversation_join', 'topic_update'])
    .constant('CHAT_MENTION_CHAR', '@')
    .constant('CHAT_NAMESPACE', '/chat')
    .constant('CHAT_NOTIF', {
      CHAT_AUTO_CLOSE: 4000,
      CHAT_DEFAULT_ICON: '/images/default_avatar.png'
    })
    .constant('CHAT_CONVERSATION_TYPE', {
      OPEN: 'open',
      CONFIDENTIAL: 'confidential'
    })
    .constant('CHAT_CONVERSATION_MODE', {
      CHANNEL: 'channel'
    })
    .constant('CHAT_DEFAULT_CHANNEL', {
      CHANNEL: {
        name: 'general',
        type: 'restricted',
        mode: 'channel',
        topic: 'default',
        purpose: 'default',
        isNotRead: false
      }
    })
    .constant('CHAT_OBJECT_TYPES', {
      CONVERSATION: 'chat.conversation'
    })
    .constant('MENTION_CHOOSER_MAX_RESULT', 15)
    .constant('CHAT_MESSAGE_TYPE', {
      USER_TYPING: 'user_typing',
      TEXT: 'text',
      FILE: 'file'
    })
    .constant('MESSAGE_GROUP_TIMESPAN', 60000)
    .constant('KEY_CODE', {
      ENTER: 13,
      TAB: 9,
      ARROW_LEFT: 37,
      ARROW_UP: 38,
      ARROW_RIGHT: 39,
      ARROW_DOWN: 40
    });
})();
