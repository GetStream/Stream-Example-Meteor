Meteor.publish('items', function() {
  return Items.find({});
});

Meteor.publish('pinned', function(userId) {
  check(userId, String);

  var pinned = Pins.find({ user: userId }).fetch(),
  itemIds = _.pluck(pinned, 'item');

  return Items.find({ _id: {$in: itemIds }});
});

Meteor.publish('follows', function(userId) {
  check(userId, String);

  return Follows.find({ user: userId });
});

Meteor.publish('users', function() {
  return Meteor.users.find({});
});

Meteor.publish('pins', function() {
  return Pins.find({});
});
