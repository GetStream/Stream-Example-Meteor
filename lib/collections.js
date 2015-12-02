// Create three monog collections to hold our app's data
Items = new Mongo.Collection('items');
Pins = new Mongo.Collection('pins');
Follows = new Mongo.Collection('follows');

// Register the Pins collection as an activity
// This ensures that a message is send to the getstream.io api
// on creation of new follow items in the database
Stream.registerActivity(Pins, {
  activityVerb: 'pin',                    // Verb of the activity send to getstream.io
  activityActorProp: 'user',              // The property that holds the user id to be used for activities actor property
  activityExtraData: function() {         // Extra data set on activity send to getstream.io
    return {                              // this is used to setup the right publications on
      item: `items:${this.item}`,         // subscription on a feed
    };
  },
  activityForeignId: function() {         // Foreign id send to getsteam.io
    return this.user + ':' + this.item;
  },
});


// Register the Follow Mongo Collection as an activity
// This ensures that a message is send to the getstream.io api
// on creation of new follow items in the database
Stream.registerActivity(Follows, {
  activityVerb: 'follow',
  activityActorProp: 'user',

  activityExtraData: function() {
    return {
      target: `users:${this.target}`,
    };
  },

  activityForeignId: function() {
    return this.user + ':' + this.target;
  },

  activityNotify: function() {            // return a list of feed identifiers with this method
    if(Meteor.isServer) {                 // to automatically notify those feeds on an added
                                          // activity.
      targetFeed = Stream.feedManager.getNotificationFeed(this.target);
      return [targetFeed];
    }
  },
});

if (Meteor.isServer) {

  // When a new user is created the user automatically follows their own feed
  Meteor.users.after.insert(function(userId, doc) {
    var followData = {user: doc._id, target: doc._id};

    if (Follows.find(followData).count() === 0) {
      var record = Follows.insert(followData);
    }
  });

  // After a follow relation is created in our MongoDB signal the getstream.io
  // api to also create the follow relation between the feeds
  Follows.after.insert(function(userId, doc) {
    Stream.feedManager.followUser(doc.user, doc.target);
  });

  // After a follow relation is removed from the MongoDB signal the getstream.io
  // api to remove the follow relation
  Follows.before.remove(function(user, doc) {
    Stream.feedManager.unfollowUser(doc.user, doc.target);
  });
}

