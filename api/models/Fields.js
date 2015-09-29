/**
* Fields.js
*
* @description :: Store client fields
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      "name"    : 'string',  //
      "descr"   : 'string',  // for label
      "type"    : 'string',    // textArea, ?select?
      "placeholder": 'string',
      "active"  : 'boolean',
      "order"   : 'integer',
      "data"    : 'array'
  }
};

