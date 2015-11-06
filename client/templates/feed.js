// Template.feed.helpers({
// 	'getActivities': function () {
// 		var activities = this;
// 		console.log('reactiveVar', activities);

// 		Meteor.call('activities', function (error, result) {
// 			activities.set(result);
// 		});

// 		return activities.get();
// 	}
// });

Template.pin.events({
  'submit': function(event, template) {
    event.preventDefault();

    Meteor.call('pin', this.object.item._id);
  },
});

Template.pin.helpers({
  pinned: function(itemId) {
    return Pins.find({item: itemId, user: Meteor.userId()}).count() > 0;
  },
});
