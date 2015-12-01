Template.login.events({
	'click #logout': function(e) {
		e.preventDefault();

		Meteor.logout();
	}
});

Template.nav.onCreated(function() {
	Meteor.call('notification', function(err, activities) {
	    if(err) {
	    	console.error('Requesting notification feed failed with:', err);
	    }

	    if(activities && activities[0]) {
	    	var enriched = Stream.backend.enrichActivities(activities[0].activities);
		}

	    if(enriched) {
		    Session.set('notifications', {
		    		lastFollower: enriched[0],
		    		count: enriched.length - 1,
		    		more: enriched.length > 1,
		    });
		}
	});

	if(Meteor.userId()) {
		Meteor.call('notificationFeedToken', function(err, token) {
			if(err) {
				console.error('Requestion notification feed token failed with: ', err);
			}

			var notificationFeed = Stream.feedManager.getNotificationFeed(Meteor.userId(), token);

			notificationFeed.subscribe(function(data) {
				var el = Template.nav.$('#notification_inner');

				var unseen = data.unseen;
				el.html(unseen);
				if (unseen === 0) {
					el.hide();
				} else {
					el.show();
				}
			});
		});
	}
});