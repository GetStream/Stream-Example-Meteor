function username(user) {
	if(user && user.username) {
      return user.username;
    } else if(user && user.services && user.services.github) {
      return user.services.github.username;
    } else {
    	return 'unkown user';
    }
}

Template.registerHelper('equals', (v1, v2) => (v1 === v2));

Template.registerHelper('avatarUrl', function(user) {
	if(user && user.profile && user.profile.avatar_url) {
		return user.profile.avatar_url;
	} else if(user) {
		return 'https://avatars.githubusercontent.com/' + username(user);
	}
});

Template.registerHelper('username', username);

Template.registerHelper('session', key => Session.get(key));

Template.registerHelper('pinned', function(itemId) {
	return Pins.find({item: itemId, user: Meteor.userId()}).count() > 0;
});

Template.registerHelper('fromNow', time => moment(time).fromNow());