
app.controller('channelCtrl', ['$scope', '$rootScope', '$anchorScroll', '$location',
    '$stateParams', 'messageFactory', 'httpFactory',
    function ($scope, $rootScope, $anchorScroll, $location, $stateParams, messageFactory, httpFactory) {
        var socket = io();


//        console.log($stateParams.channelId);

        if ($stateParams.channelId) {

            httpFactory.setMethod("GET");
            httpFactory.setUrl("channel/" + $stateParams.channelId);
            httpFactory.request().then(function (data) {
//                console.log("channel message list", data);
                $scope.messages = data.data;
            });
        }



        $scope.sendMessage = function () {
            var userId = sessionStorage.getItem("user_id");
            var userPseudo = sessionStorage.getItem("user_pseudo");
            if ($stateParams.channelId) {
                var dataMessage = {
                    message: $scope.userMessage,
                    pseudo: userPseudo,
                    from_id: userId,
                    to_id: 1,
                    channel_id: $stateParams.channelId,
                    date: new Date().toISOString().slice(0, 19).replace('T', ' '),
                }
                $scope.userMessage = "";
                var oMessage = messageFactory.sendMessage(socket, dataMessage);
//                console.log(oMessage);
                if (!oMessage.valid) {
                    $scope.messages.push({pseudo: "[Server]", message: "Please connect"});
                }
            } else {
                $scope.messages.push({pseudo: "[Server]", message: "Error retrieving channel"});
            }

        };

        socket.on('chat_message_post', function (data) {
//            console.log('Message received:', data);
            if (data.valid) {
                $scope.messages.push({message: data.message, pseudo: data.pseudo});

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
//            console.log('Message received:', data);
            if (data.valid) {
                $scope.messages.push({user: data.user, message: data.messages});

            }
            $scope.$apply();
            $location.hash('tampon');
            $anchorScroll();
        });
    }]);