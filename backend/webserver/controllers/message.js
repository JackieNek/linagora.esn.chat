'use strict';

const Q = require('q');

module.exports = function(dependencies, lib) {

  const logger = dependencies('logger');
  const denormalizer = require('../denormalizers/message')(dependencies);
  const utils = require('./utils')(dependencies, lib);

  return {
    get,
    getAttachmentsForConversation,
    getForConversation,
    search
  };

  function get(req, res) {
    res.status(200).json(req.message);
  }

  function getAttachmentsForConversation(req, res) {
    lib.message.getAttachmentsForConversation(req.conversation._id, req.query, (err, attachments = []) => {
      if (err) {
        return sendHTTPError(`Error while getting attachments of conversation ${req.conversation._id}`, err, res);
      }

      denormalizer.denormalizeAttachments(attachments)
        .then(denormalized => {
          res.status(200).json(denormalized);
        })
        .catch(err => {
          sendHTTPError(`Error while denormalizing attachments of conversation ${req.conversation._id}`, err, res);
        });
    });
  }

  function getForConversation(req, res) {
    lib.message.getForConversation(req.conversation._id, req.query, (err, results) => {
      if (err) {
        return sendHTTPError(`Error while getting messages for conversation ${req.conversation._id}`, err, res);
      }

      return res.status(200).json(results);
    });
  }

  function search(req, res) {

    function hydrateMessage(message) {
      return lib.message.getByIdAndPopulate(message._id, ['creator', 'user_mentions', 'channel']);
    }

    function sendError(err) {
      sendHTTPError('Error while searching messages', err, res);
    }

    lib.message.searchForUser(req.user, {search: req.query.search}, (err, result) => {
      if (err) {
        return sendError(err);
      }

      res.header('X-ESN-Items-Count', result.total_count || 0);
      Q.all(result.list.map(hydrateMessage)).then(messages => res.status(200).json(messages), sendError);
    });
  }

  function sendHTTPError(message, err, res) {
    logger.error(message, err);

    return utils.sendHTTP500Error(message, res);
  }
};
