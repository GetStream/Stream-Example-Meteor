

Meteor.publish('items', function() {
  return Items.find({});
});

Meteor.publish('pinned', function() {
  var pinned = Pins.find({ user: this.userId }).fetch(),
  itemIds = _.pluck(pinned, 'item');

  return Items.find({ _id: {$in: itemIds }});
});

Meteor.publish('follows', function() {
  return Follows.find({});
});

Meteor.publish('users', function() {
  return Meteor.users.find({}, {
  	fields: {
  		"services.github.username": 1,
  		profile: 1,
  		username: 1,
  		emails: 1,
  	}
  });
});

Meteor.publish('pins', function() {
  return Pins.find({});
});
