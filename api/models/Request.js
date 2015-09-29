/**
* Request.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      'status': 'string',
      'fields': 'array',
      'document_type': 'string',
      'document_name': 'string',
      'comments': 'string',
      'outputPath':'string',
      'previewPath':'string',
      'client': 'json'
  }
};

