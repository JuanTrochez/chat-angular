app.config(function ($stateProvider) {
//    var templateFolder = "app/templates/client/";    
//    
    var channelState = {
        name: 'channel',
        url: '/channel/{channelId:int}',
    };
    
    var userState = {
        name: 'user',
        url: '/user/{userId:int}',
    };
    
    $stateProvider.state(channelState);
    $stateProvider.state(userState);
});
