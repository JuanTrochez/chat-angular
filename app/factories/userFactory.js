app.factory("userFactory", [function () {
//        console.log("client factory");

        var userFactory = {
        };

        userFactory.setClient = function (client) {
            this.client = client;
        };

        userFactory.getAll = function () {
            
        };
        

        return userFactory;
    }]);
