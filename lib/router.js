Router.configure({
  layoutTemplate: 'appBody',
  notFoundTemplate: 'appNotFound',
});

// Routes setup for this application the following routes use the getstream.io API:
// - /flat
// - /profile
// - /profile/:_user
// - /aggregated_feed

// All routes use the notification feed, the code managing this feed can be found in
// client/templates/nav.js

Router.route('/', {
  name: 'trending',
  waitOn: function() {
    return [
      Meteor.subscribe('items'),
      Meteor.subscribe('pins'),
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
  template: 'feed',

  waitOn: function() {
    // All feed groups defined in your settings file have their own publication, by default:
    // feed group: 'flat', with feed type: flat
    // feed group: 'notification', with feed type: notification
    // feed group: 'user', with feed type: flat
    // feed group: 'aggregated', with feed type: aggregated

    // They are named Stream.feeds.feedGroupName
    // where feedGroupName is the name of a feed group
    return Meteor.subscribe('Stream.feeds.flat');
  },

  data: function() {
    // Check if all cursors published by the subscription to the flat feed are retrieved
    if(this.ready()) {
      // Publications add a feed activities to a collection stored in Stream.feeds
      // they are named by their feed group name (same as publications)
      var activities = Stream.feeds.flat.find().fetch();

      // The activities in the collection are automatically 'enriched' once retrieved from
      // the collection (i.e. fields on the activity referencing a MongoDB collection item are 
      // automatically populated with the document retrieved from the database)

      return { activities };
    }
  },
});

Router.route('/profile', {
  name: 'profile',
  waitOn: function() {
    return Meteor.subscribe('Stream.feeds.user');
  },

  data: function() {
    if(this.ready()) {
      var user = Meteor.users.findOne(Meteor.userId());

      if(user) {
        user.showFeed = true;
        user.activities = Stream.feeds.user.find().fetch();
      }

      return user; 
    }
  }
});

Router.route('/profile/:_user', {
  subscriptions: function() {
    return [
      Meteor.subscribe('users'),
      Meteor.subscribe('follows'),
    ];
  },

  onBeforeAction: function() {
    var username = this.params._user;
    var user = Meteor.users.findOne({ $or: [{username: username}, {"services.github.username": username}] });

    if(user) {
      // By default a subscription to a news feed subscribes to the feed of the current user
      // if we want to subscribe to a feed of a different user we can supply a user id as the 
      // second parameter (the first parameter is amount of activities to retrieve from the feed 
      // i.e. limit)
      this.subscribe('Stream.feeds.user', 20, user._id).wait();
    }

    this.next();
  },

  action: function() {
    var username = this.params._user;
    var user = Meteor.users.findOne({ $or: [{username: username}, {"services.github.username": username}] });

    if(user) {
      user.followed = Follows.find({ user: Meteor.userId(), target: user._id }).count() > 0;
      user.showFeed = true;
      user.activities = Stream.feeds.user.find().fetch();
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
  template: 'aggregated_feed',

  waitOn: function() {
    return Meteor.subscribe('Stream.feeds.aggregated');
  },

  data: function() {
    if(this.ready()) {
      var activities = Stream.feeds.aggregated.find().fetch();

      return { activities };
    }
  },
});
