app.config(function ($stateProvider) {
//    var templateFolder = "app/templates/client/";    
//    
    var channelState = {
        name: 'channel',
        url: '/channel/{channelId:int}',
        templateUrl: 'app/views/list-message.html',
        controller: "channelCtrl"
    };
    
    var userState = {
        name: 'user',
        url: '/user/{userId:int}',
    };
    
    $stateProvider.state(channelState);
    $stateProvider.state(userState);
});
