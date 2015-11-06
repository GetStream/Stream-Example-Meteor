var Future = Npm.require('fibers/future');

var await = function(promise) {
  var fut = new Future();

  promise.then(fut.return.bind(fut), fut.throw.bind(fut));

  return fut.wait();
};

Meteor.methods({
  activities: function() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    var flatFeed = Stream.FeedManager.getNewsFeeds(this.userId)['flat'],
    feed = await(flatFeed.get({})),
    activities = feed.results;

    return activities;
  },

  aggregated: function() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    var aggregatedFeed = Stream.FeedManager.getNewsFeeds(this.userId)['aggregated'],
    feed = await(aggregatedFeed.get({})),
    aggregatedActivities = feed.results;

    console.log('feed', feed);

    return aggregatedActivities;
  },

  autoFollow: function() {
    var followData = {user: this.userId, target: this.userId};

    if (Follows.find(followData).count() === 0) {
      var record = Follows.insert(followData);
    }
  },
});
