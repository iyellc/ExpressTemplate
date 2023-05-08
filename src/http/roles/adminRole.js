const { defineAbility } = require('@casl/ability');

module.exports = defineAbility(can => {
    can('read', 'User', ["username", "password"]);
    can('write', 'User');
    can('delete', 'User');
    can('update', 'User')
});