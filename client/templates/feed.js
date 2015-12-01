Template.pin.events({
  'submit': function(event, template) {
    event.preventDefault();

    Meteor.call('pin', this.object.item._id);
  },
});
