const Factory = require('rosie').Factory;
const uuid = require('uuid');

const bracUser = () => {
  return new Factory()
    .sequence('_id', uuid.v4)
    .attr('name', '')
    .attr('type', 'user')
    .attr('roles', '')
    .attr('facility_id', '')
    .attr('password', 'Secret_1')
    /*.attr('password_scheme', 'pbkdf2')
    .attr('iterations', 10)
    .attr('derived_key', '')
    .attr('salt', '')*/
    .attr('known', true);
};

const generateBracUser = function (name, roles, facility) {
  return bracUser().build(
    {
      name: name,
      roles: roles,
      facility_id: facility,
    }
  );
};

module.exports = {
  generateBracUser,
  bracUser
};
