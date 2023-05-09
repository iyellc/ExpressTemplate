const { defineAbility } = require('@casl/ability');

module.exports = defineAbility(can => {
    can('read', 'User');
    can('write', 'User');
    can('delete', 'User');
    can('update', 'User')
});