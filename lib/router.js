Router.configure({
  layoutTemplate: 'appBody',

  // notFoundTemplate: 'appNotFound',

  // loadingTemplate: 'appLoading',
});

// Write Router Stuff Here
Router.route('/', {
  name: 'trending',
  waitOn: function() {
    return [
      Meteor.subscribe('items'),
      Meteor.subscribe('pins'),
      Meteor.subscribe('follows'),
      Meteor.subscribe('users'),
    ];
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
  waitOn: function() {
    return [
      Meteor.subscribe('pins'),
      Meteor.subscribe('users'),
      Meteor.subscribe('items'),
      Meteor.subscribe('follows'),
    ];
  },

  action: function() {
    var self = this;

    Meteor.call('autoFollow');

    Meteor.call('activities', function(err, activities) {
      var enrichedActivities = Stream.backend.enrichActivities(activities);

      self.render('feed', { data: {activities: enrichedActivities} });
    });

    self.render('feed', { data: { activities: [] } });
  },
});

Router.route('/profile', {
  name: 'profile',
  waitOn: function() {
    return [
      Meteor.subscribe('follows'),
      Meteor.subscribe('items'),
      Meteor.subscribe('pins'),
      Meteor.subscribe('users'),
    ];
  },

  action: function() {
    var user = Meteor.users.findOne(Meteor.userId()),
        self = this;

    if(user) {
      user.showFeed = true;
    }

    Meteor.call('activities', function(err, activities) {
      if(user) {
        user.activities = Stream.backend.enrichActivities(activities);
      }

      self.render('profile', { data: user });
    });

    self.render('profile', { data: user });
  }
});

Router.route('/profile/:_user', {
  waitOn: function() {
    return [
      Meteor.subscribe('users'),
      Meteor.subscribe('follows'),
    ];
  },

  action: function() {
    var username = this.params._user;
    var user = Meteor.users.findOne({ $or: [{username: username}, {"services.github.username": username}] });

    if(user) {
      user.followed = Follows.find({ user: user._id, target: user._id }).count() > 0;
    }

    this.render('profile', { data: user });
  },

});

Router.route('/people', {
  name: 'people',
  waitOn: function() {
    return [
      Meteor.subscribe('users'),
      Meteor.subscribe('follows'),
    ];
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

  waitOn: function() {
    return [
      Meteor.subscribe('pins'),
      Meteor.subscribe('users'),
      Meteor.subscribe('items'),
      Meteor.subscribe('follows'),
    ];
  },

  action: function() {
    var self = this;

    Meteor.call('aggregated', function(err, activities) {
      var enrichedAggregated = Stream.backend.enrichAggregatedActivities(activities);

      self.render('aggregated_feed', { data: {activities: enrichedAggregated} });
    });

    self.render('aggregated_feed', { data: {activities: []} });
  },
});
