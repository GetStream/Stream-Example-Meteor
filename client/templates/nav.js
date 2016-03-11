Template.login.events({
	'click #logout': function(e) {
		e.preventDefault();

		Meteor.logout();
	}
});

// Helper method to retrieve the reactive var set in the onCreated handler
// notice that we can not access this.notification within the template's data context
Template.nav.helpers({
	getNotification: function() {
		return Template.instance().notification.get();
	}
});

Template.nav.onCreated(function() {
	// Here we manage a subscription to a Stream feed not tied to one route
	// This subscription is made on each page including the 'nav' template

	this.notification = new ReactiveVar(); // Use reactive var to store value retrieved from the feed

	// To ensure the template is rerendered once a new notification is pushed to the server
	// we have to run the following code block in an autorun wrapper
	this.autorun(() => {
		// Subscribe to the feed we are interested in
		var sub = Meteor.subscribe('Stream.feeds.notification');

		if(sub.ready()) { // Check if the subscription is ready
			var notifications = Stream.feeds.notification.find().fetch();

			var notificationCount = Stream.feedManager.getNotificationFeedStats(Meteor.userId());

			if(notifications.length > 0 && notifications[0].activities) {
				// Update/set the reactive var (this will rerender the template)
				this.notification.set({
					lastFollower: notifications[0].activities[0],
					count: notifications.length - 1,
					more: notifications.length > 1,
					unread: notificationCount.unread,
					unseen: notificationCount.unseen,
				});
			}
		}
	});
});