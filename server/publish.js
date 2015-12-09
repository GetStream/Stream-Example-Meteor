Meteor.publish('items', function(limit=20) {
  return Items.find({}, { limit: limit });
});

Meteor.publish('follows', function() {
  return Follows.find({ user: this.userId });
});

Meteor.publish('users', function(limit=20) {
  return Meteor.users.find({}, {
  	limit: limit,
  	fields: {
  		'services.github.username': 1,
  		profile: 1,
  		username: 1,
  		emails: 1,
  	}
  });
});

Meteor.publish('pins', function() {
  return Pins.find({ user: this.userId });
});