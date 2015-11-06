Items = new Mongo.Collection('items');

Pins = Stream.activityCollection('pins', {
  verb: 'pin',
  methods: {
    activityForeignId: function() {
      return this.user + ':' + this.item;
    },

    getItem: function() {
      return Items.findOne(this.item);
    },

    getUser: function() {
      return Meteor.users.findOne(this.user);
    },

    populate: function() {
      if (!this._populated) {
        this.item = this.getItem();
        this.user = this.getUser();
        this._populated = true;
      }
    },
  },
});

Follows = Stream.activityCollection('follows', {
  verb: 'follow',
  methods: {
    activityForeignId: function() {
      return this.user + ':' + this.target;
    },

    getUser: function() {
      return Meteor.users.findOne(this.user);
    },

    getTarget: function() {
      return Meteor.users.findOne(this.target);
    },

    populate: function() {
      if (!this._populated) {
        this.user = this.getUser();
        this.target = this.getTarget();
        this._populated = true;
      }
    },
  },
});

// Follows.statics({
// 	activityNotify: function() {
// 		targetFeed = FeedManager.getNotificationFeed(this.target._id);
// 		return [targetFeed];
// 	},
// });

if (Meteor.isServer) {
  Follows.after.insert(function(userId, doc) {
    var target = doc.target;

    console.log('User', userId, 'now follows user', target);

    Stream.FeedManager.followUser(userId, target);
  });

  Follows.before.remove(function(user, doc) {
    Stream.FeedManager.unfollowUser(doc.user, doc.target);
  });
}

