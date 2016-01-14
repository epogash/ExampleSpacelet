    var serviceRPC = null;
     
    window.addEventListener("load", function()
    {
      // Start the spacelet and request a JSON-RPC connection to the service.
      spaceifyCore.startSpacelet("example/spacelet1", "spaceify.org/services/example/spacelet1", function(err, data)
      {
        if(data)
        {
          serviceRPC = data.rpc;
          serviceRPC.call("sayHello", ["World"], this, function(err, data)
          {
            alert(err ? err : data);
          });
        }
        else
          alert("Requested spacelet/service is not available.");
      });
    });
     
    window.addEventListener("unload", function()
    {
      if(serviceRPC)
      {
        serviceRPC.close();
        serviceRPC = null;
      }
    });

