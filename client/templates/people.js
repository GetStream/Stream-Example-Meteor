Template.profile.events({
  'submit': function(event, template) {
    event.preventDefault();

    Meteor.call('follow', this._id);
  },
});
