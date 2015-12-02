// Methods to pin an item or create a follow relation
// these methods are run/(simulated) on the server and the client 
Meteor.methods({
  pin: function(itemId) {
    if (!this.userId) {
      throw new Error('not-authorized');
    }

    if (Pins.find({ user: this.userId, item: itemId }).count() > 0) {
      Pins.remove({ user: this.userId, item: itemId });
    } else {
      var item = Items.findOne({_id: itemId});

      if (item) {
        var pinData = {user: this.userId, item: itemId};

        Pins.insert(pinData);
      }
    }
  },

  follow: function(userId) {
    if (!this.userId) {
      throw new Error('not-authorized');
    }

    if (Follows.find({ user: this.userId, target: userId }).count() > 0) {
      Follows.remove({ user: this.userId, target: userId });
    } else {
      Follows.insert({ user: this.userId, target: userId });
    }
  },
});
