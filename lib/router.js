var streamBackend = new Stream.Backend();

Router.configure({
  layoutTemplate: 'appBody',

  // notFoundTemplate: 'appNotFound',

  // loadingTemplate: 'appLoading',
});

// Write Router Stuff Here
Router.route('/', {
  name: 'trending',
  subscriptions: function() {
    Meteor.subscribe('items');
    Meteor.subscribe('pins');
  },

  data: function() {
    var items = Items.find({}).map(item => {
      item.pinned = Pins.find({ user: Meteor.userId(), item: item._id }).count() > 0;
      return item;
    });

    return items;
  },
});

Router.route('/flat', {
  name: 'flat',
  subscriptions: function() {
    Meteor.subscribe('pins');
    Meteor.subscribe('users');
    Meteor.subscribe('pinned', Meteor.userId());
    Meteor.subscribe('follows', Meteor.userId());
  },

  action: function() {
    var self = this;

    Meteor.call('autoFollow');

    Meteor.call('activities', function(err, activities) {
      var enrichedActivities = streamBackend.enrichActivities(activities);

      console.log('enrichedActivities', enrichedActivities);

      self.render('feed', { data: {activities: enrichedActivities} });
    });
  },
});

Router.route('/people', {
  name: 'people',
  subscriptions: function() {
    Meteor.subscribe('users');
    Meteor.subscribe('follows', Meteor.userId());
  },

  data: function() {
    var users = Meteor.users.find({}).fetch();

    for (var user of users) {
      user.followed = Follows.find({ user: Meteor.userId(), target: user._id }).count() > 0;
    }

    return users;
  },
});

Router.route('/aggregated_feed', {
  name: 'aggregated_feed',

  subscriptions: function() {
    Meteor.subscribe('pins');
    Meteor.subscribe('users');
    Meteor.subscribe('items');
    Meteor.subscribe('follows');
  },

  action: function() {
    var self = this;

    Meteor.call('aggregated', function(err, activities) {
      var enrichedAggregated = streamBackend.enrichAggregatedActivities(activities);

      console.log('enrichedAggregated', enrichedAggregated);

      self.render('aggregated_feed', { data: {activities: enrichedAggregated} });
    });
  },
});
