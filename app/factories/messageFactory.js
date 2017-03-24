app.factory("messageFactory", [function () {
//        console.log("client factory");

        var messageFactory = {
        };


        messageFactory.sendMessage = function (socket, oData) {
//            console.log("sendMessage factory");
            var oReturn = {
                valid: false,
            };
            
            if (oData.from_id != null) {
                oReturn.valid = true;
                socket.emit('chat_message_post', oData);
            }   
            
            return oReturn;
        };
        

        return messageFactory;
    }]);
