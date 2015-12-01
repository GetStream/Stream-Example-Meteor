Meteor.methods({
  activities: function() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    var flatFeed = Stream.feedManager.getNewsFeeds(this.userId)['flat'],
        feed = Stream.await(flatFeed.get({})),
        activities = feed.results;

    return activities;
  },

  notificationFeedToken: function() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Stream.feedManager.getNotificationFeed(this.userId).token;
  },

  aggregated: function() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    var aggregatedFeed = Stream.feedManager.getNewsFeeds(this.userId)['aggregated'],
    feed = Stream.await(aggregatedFeed.get({})),
    aggregatedActivities = feed.results;

    return aggregatedActivities;
  },

  notification: function()  {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    var notificationFeed = Stream.feedManager.getNotificationFeed(this.userId),
        feed = Stream.await(notificationFeed.get({ mark_read: true, mark_seen: true })),
        activities = feed.results;

    return activities;
  },

  autoFollow: function() {
    var followData = {user: this.userId, target: this.userId};

    if (Follows.find(followData).count() === 0) {
      var record = Follows.insert(followData);
    }
  },
});
