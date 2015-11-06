Template.item.events({
  'submit': function(event, template) {
    event.preventDefault();

    Meteor.call('pin', this._id);
  },
});
