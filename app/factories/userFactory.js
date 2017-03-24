app.factory("userFactory", [function () {
//        console.log("client factory");

        var userFactory = {
        };

        userFactory.setClient = function (client) {
            this.client = client;
        };

        userFactory.getMessagesById = function (id) {
            
        };
        

        return userFactory;
    }]);
