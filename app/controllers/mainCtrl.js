
app.controller('MainController', ['$scope', '$rootScope', '$anchorScroll', '$location', 
    '$stateParams', 'messageFactory', 'httpFactory',
    function ($scope, $rootScope, $anchorScroll, $location, $stateParams, messageFactory, httpFactory) {
        $scope.userMessage = '';
        $scope.messages = [];
        var socket = io();


        $scope.sendMessage = function () {    
            var userId = sessionStorage.getItem("user_id");
            var dataMessage = {
                message: $scope.userMessage,
                from_id: userId,
                to_id: 1,
                channel_id: 2,
                date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            }
            $scope.userMessage = "";
            var oMessage = messageFactory.sendMessage(socket, dataMessage);
            if (!oMessage.valid) {                
                $scope.messages.push("[Server] Please connect");
            }
            
        };
        
        $scope.connectUser = function() {
            console.log($scope.userForm);
            httpFactory.setMethod("GET");
            httpFactory.setData($scope.userForm);
            httpFactory.setUrl("user/connect/" + $scope.userForm.pseudo + "/" + $scope.userForm.password);
            httpFactory.request().then(function(data) {
                console.log("connection", data);
                if (data.valid) {
                    sessionStorage.setItem("user_id", data.data[0].id);
                }
            });            
        }
        
        $scope.insertUser = function() {
            console.log($scope.userForm);
            httpFactory.setMethod("GET");
            httpFactory.setData($scope.userInscription);
            httpFactory.setUrl("user/inscription/" + $scope.userInscription.pseudo + "/" + $scope.userInscription.password);
            httpFactory.request().then(function(data) {
                console.log("connection", data);
                if (data.valid) {
                    sessionStorage.setItem("user_id", data.data.insertId);
                }
            });            
        }

        socket.on('chat_message_post', function (data) {
//            console.log('Message received:', data);
            if (data.valid) {
                $scope.messages.push(data.message);
                
            } else {
                if (typeof data.from_id != "undefined" && data.from_id == $rootScope.userId) {
                    $scope.messages.push("[Server] rekted");
                    
                }
            }
            
            $scope.$apply();
            $location.hash('tampon');
            $anchorScroll();
        });
        
        
        $scope.getChannelMessage = function () {
            var dataChannel = {
                channel_id: $stateParams.channelId,
            }
            socket.emit('chat_message_get_channel', dataChannel);
        };
        
        socket.on('chat_message_get_channel', function (data) {
            console.log('Message received:', data);
            if (data.valid) {
                $scope.messages.push(data.messages);
                
            }
            
            $scope.$apply();
            $location.hash('tampon');
            $anchorScroll();
        });
    }]);