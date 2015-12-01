Meteor.startup(function() {
  var Users = Meteor.users;

  if (Users.find().count() === 0) {
    var users = [
    {
      username: 'Andrew', 
      profile: {
        avatar_url: 'https://github.com/identicons/jasonlong.png',
        name: 'Andrew',
      }
    },
    {
      username: 'Sergey', 
      profile: {
        avatar_url: 'https://avatars0.githubusercontent.com/u/4436860?v=3&s=96',
        name: 'Sergey',
      },
    },
    {
      username: 'Thomas', 
      profile: {
        avatar_url: 'https://avatars0.githubusercontent.com/u/125464?v=3&s=96',
        name: 'Thomas',
      },
    },
    ];

    for (var user of users) {
      Users.insert(user);
    }

    Users.insert({
      username: 'admin',
      profile: {
        name: 'admin',
      },
      avatar_url: 'https://avatars0.githubusercontent.com/u/4336861?v=3&s=96',
    }, function(err, _id) {
      if (Items.find().count() === 0) {
        var fs = Npm.require('fs'),
        path = Npm.require('path');
        var mediaFiles = fs.readdirSync(path.join(process.env.PWD, '/public/media/'));

        mediaFiles.forEach(function(fileName) {
          Items.insert({
            username: 'admin',
            image_url: fileName,
          });
        });
      }
    });
  }

});
