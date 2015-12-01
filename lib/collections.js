Items = new Mongo.Collection('items');

Pins = new Mongo.Collection('pins');
Pins.helpers({
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
});

Stream.registerActivity(Pins, {
  activityVerb: 'pin',
  activityActorProp: 'user',
  activityForeignId: function() {
    return this.user + ':' + this.item;
  },
});

Follows = new Mongo.Collection('follows');
Follows.helpers({
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
});

Stream.registerActivity(Follows, {
  activityVerb: 'follow',
  activityActorProp: 'user',

  activityForeignId: function() {
    return this.user + ':' + this.target;
  },

  activityNotify: function() {
    if(Meteor.isServer) {
      targetFeed = Stream.feedManager.getNotificationFeed(this.target);
      return [targetFeed];
    }
  },
});

if (Meteor.isServer) {
  Follows.after.insert(function(userId, doc) {
    var target = doc.target;

    Stream.feedManager.followUser(userId, target);
  });

  Follows.before.remove(function(user, doc) {
    Stream.feedManager.unfollowUser(doc.user, doc.target);
  });
}

