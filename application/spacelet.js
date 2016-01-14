    // Spaceify core modules are in /api/ directory. Fibrous is a module for synchronous function calls.
    var fibrous = require("fibrous");
    var Config = require("/api/config")();
    var WebSocketRPCServer = require("/api/websocketrpcserver");
    var WebSocketRPCClient = require("/api/websocketrpcclient");
     
    function ExampleSpacelet1()
    {
      var self = this;
      var rpcCore = new WebSocketRPCClient();
      var rpcServer = new WebSocketRPCServer();
     
      self.start = fibrous( function()
      {
        try
        {
          // Open a connection to the Spaceify core.
          rpcCore.sync.connect({hostname: Config.EDGE_HOSTNAME, port: Config.CORE_PORT_WEBSOCKET, persistent: true});
     
          // Create WebSocket JSON-RPC server for this spacelet.
          rpcServer.connect.sync({hostname: null, port: Config.FIRST_SERVICE_PORT});
     
          // Expose a method for external calls.
          rpcServer.exposeMethod("sayHello", self, self.sayHello);
     
          // Register the provided service to the Spaceify core.
          rpcCore.sync.call("registerService", ["spaceify.org/services/example/spacelet1"], self);
     
          // Notify Spaceify core application was succesfully initialized.
          rpcCore.sync.call("initialized", [true, null], self);
        }
        catch(err)
        {
          // Notify Spaceify core application failed to initialize itself. The error message can be passed to the core.
          rpcCore.sync.call("initialized", [false, err.message], self);
          self.sync.stop();
        }
        finally
        {
          rpcCore.sync.close();
        }
      });
     
      // Close the server.
      self.stop = fibrous( function()
      {
        rpcServer.sync.close();
      });
     
      // Implement the exposed method.
      self.sayHello = fibrous( function(param)
      {
        var date = new Date();
        date = date.getFullYear() + "-" +
        ("00" + (date.getMonth()+1)).slice(-2) + "-" +
        ("00" + date.getDate()).slice(-2) + " " +
        ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2) + ":" +
        ("00" + date.getSeconds()).slice(-2);
     
        return "Hello, " + param + ". I am example/spacelet1. The date and time is now " + date + ".";
      });
     
    }
     
    // Start the application.
    fibrous.run(function()
    {
      var example = new ExampleSpacelet1();
      example.sync.start();
    });

