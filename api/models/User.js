var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {

    username  : { type: 'string', unique: true },
    email     : { type: 'email',  unique: true },
    passports : { collection: 'Passport', via: 'user' },
    active    : { type: 'boolean',  unique: false },
    type      : { type: 'string', unique: false },
    client    : { type: 'array', unique: false }

  }
};

module.exports = User;
