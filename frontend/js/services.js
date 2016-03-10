'use strict';

angular.module('linagora.esn.chat')
  .factory('ChatService', function($q, $log, session) {

    function sendMessage(message) {
      $log.debug('Send message', message);
      return $q.when(message);
    }

    function fetchMessages(options) {

      var messages = [
        {
          user: session.user,
          text: 'Hello, how are you?!',
          date: '20/02/2015 at 09:0'
        },
        {
          user: session.user,
          text: 'Mauris volutpat magna nibh, et condimentum est rutrum a. Nunc sed turpis mi. In eu massa a sem pulvinar lobortis.',
          date: '20/02/2015 at 09:0'
        },
        {
          user: session.user,
          text: 'Etiam ex arcumentum',
          date: '20/02/2015 at 09:0'
        },
        {
          user: session.user,
          text: 'Etiam nec facilisis lacus. Nulla imperdiet augue ullamcorper dui ullamcorper, eu laoreet sem consectetur. Aenean et ligula risus. Praesent sed posuere sem. Cum sociis natoque penatibus et magnis dis parturient montes',
          date: '20/02/2015 at 09:0'
        },
        {
          user: session.user,
          text: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam ac tortor ut elit sodales varius. Mauris id ipsum id mauris malesuada tincidunt. Vestibulum elit massa, pulvinar at sapien sed, luctus vestibulum eros. Etiam finibus tristique ante, vitae rhoncus sapien volutpat eget',
          date: '20/02/2015 at 09:0'
        }
      ];

      messages.forEach(function(message, index) {
        console.log(index);
        message.date = message.date + index;
      });
      return $q.when(messages);
    }

    return {
      fetchMessages: fetchMessages,
      sendMessage: sendMessage
    };

  });
