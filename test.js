const { OPCUAServer, Variant, DataValue, standardUnits, DataType, StatusCodes } = require("node-opcua");


(async () => {

    // Let's create an instance of OPCUAServer
    const server = new OPCUAServer({
        port: 4840, // the port of the listening socket of the server
        resourcePath: "", // this path will be added to the endpoint resource name
        buildInfo: {
            productName: "MySampleServer1",
            buildNumber: "7658",
            buildDate: new Date(2014, 5, 2)
        }
    });
    await server.initialize();
    console.log("initialized");

    const addressSpace = server.engine.addressSpace;
    const namespace = addressSpace.getOwnNamespace();

    const rootFolder = addressSpace.findNode("RootFolder");
    // assert(rootFolder.browseName.toString() === "Root");
    // declare a new object
    // const device = namespace.addObject({
    //     organizedBy: addressSpace.rootFolder.objects,
    //     browseName: "MyDevice"
    // });
    const device = namespace.addFolder(rootFolder.objects, { browseName: "MyDevices" });

    // add some variables
    // add a variable named MyVariable1 to the newly created folder "MyDevice"
    const variable0 = namespace.addVariable({
        organizedBy: device,
        browseName: "FanSpeed",
        nodeId: "ns=1;s=FanSpeed",
        dataType: "Double",
        value: new Variant({ dataType: DataType.Double, value: 1000.0 })
      });
  
      setInterval(function() {
        const fluctuation = Math.random() * 100 - 50;
        variable0.setValueFromSource(new Variant({ dataType: DataType.Double, value: 1000.0 + fluctuation }));
      }, 10);

    let variable1 = 1;

    // emulate variable1 changing every 500 ms
    setInterval(() => { variable1 += 1; }, 500);

    namespace.addVariable({
        componentOf: device,
        nodeId: "ns=1;s=MyVariable1",
        browseName: "MyVariable1",
        dataType: "Double",
        value: {
            get: () => new Variant({ dataType: DataType.Double, value: variable1 })
        }
    });

    // add a variable named MyVariable2 to the newly created folder "MyDevice"
    let variable2 = 10.0;

    namespace.addVariable({

        componentOf: device,
        nodeId: "ns=1;s=WriteVariable1", // some opaque NodeId in namespace 4
        browseName: "WriteVariable1",
        dataType: "Double",

        value: {
            get: () => new Variant({ dataType: DataType.Double, value: variable2 }),
            set: (variant) => {
                variable2 = parseFloat(variant.value);
                return StatusCodes.Good;
            }
        }
    });


    let variable8 = 10.0;

    namespace.addVariable({

        componentOf: device,
        nodeId: "ns=1;s=WriteVariable2", // some opaque NodeId in namespace 4
        browseName: "WriteVariable2",
        dataType: "Double",

        value: {
            get: () => new Variant({ dataType: DataType.Double, value: variable8 }),
            set: (variant) => {
                variable8 = parseFloat(variant.value);
                return StatusCodes.Good;
            }
        }
    });


    let variable9 = 10.0;

    namespace.addVariable({

        componentOf: device,
        nodeId: "ns=1;s=WriteVariable3", // some opaque NodeId in namespace 4
        browseName: "WriteVariable3",
        dataType: "Double",

        value: {
            get: () => new Variant({ dataType: DataType.Double, value: variable9 }),
            set: (variant) => {
                variable9 = parseFloat(variant.value);
                return StatusCodes.Good;
            }
        }
    });

    const os = require("os");
    /**
     * returns the percentage of free memory on the running machine
     * @return {double}
     */
    function available_memory() {
        // var value = process.memoryUsage().heapUsed / 1000000;
        const percentageMemUsed = os.freemem() / os.totalmem() * 100.0;
        return percentageMemUsed;
    }
    namespace.addVariable({
        componentOf: device,
        nodeId: "ns=1;s=FreeMemory", // a string nodeID
        browseName: "FreeMemory",
        dataType: "Double",
        value: {
            get: () => new Variant({ dataType: DataType.Double, value: available_memory() })
        }
    });
    
    const variable3 = namespace.addVariable({
        organizedBy: device,
        browseName: "VoltageA",
        nodeId: "ns=1;s=VoltageA",
        dataType: "Double",
        value: new Variant({ dataType: DataType.Double, value: 22.0 })
      });
      
  
      setInterval(function() {
        variable3.setValueFromSource(new Variant({ dataType: DataType.Double, value: Math.random() * 100 }));
      }, 10);
      const variable4 = namespace.addVariable({
        organizedBy: device,
        browseName: "VoltageB",
        nodeId: "ns=1;s=VoltageB",
        dataType: "Double",
        value: new Variant({ dataType: DataType.Double, value: 25.0 })
      });
  
      setInterval(function() {
        variable4.setValueFromSource(new Variant({ dataType: DataType.Double, value: Math.random() * 100 }));
      }, 10);


      const variable5 = namespace.addVariable({
        organizedBy: device,
        browseName: "VoltageC",
        nodeId: "ns=1;s=VoltageC",
        dataType: "Double",
        value: new Variant({ dataType: DataType.Double, value: 23.0 })
      });
  
      setInterval(function() {
        variable5.setValueFromSource(new Variant({ dataType: DataType.Double, value: Math.random() * 100}));
      }, 10);
      const variable6 = namespace.addVariable({
        organizedBy: device,
        browseName: "Current",
        nodeId: "ns=1;s=Current",
        dataType: "Double",
        value: new Variant({ dataType: DataType.Double, value: 250.0 })
      });
  
      setInterval(function() {
        variable6.setValueFromSource(new Variant({ dataType: DataType.Double, value: Math.random() * 250 }));
      }, 10);
  

      namespace.addVariable({
        organizedBy: device,
        browseName: "PumpSpeed",
        nodeId: "ns=1;s=PumpSpeed",
        dataType: "Double",
        value: {
          /**
           * returns the  current value as a Variant
           * @method get
           * @return {Variant}
           */
          get: function() {
            const pump_speed = 200 + 100 * Math.sin(Date.now() / 10000);
            return new Variant({ dataType: DataType.Double, value: pump_speed });
          }
        }
      });
  
      namespace.addVariable({
        organizedBy: device,
        browseName: "SomeDate",
        nodeId: "ns=1;s=SomeDate",
        dataType: "DateTime",
        value: {
          get: function() {
            return new Variant({ dataType: DataType.DateTime, value: new Date(Date.UTC(2016, 9, 13, 8, 40, 0)) });
          }
        }
      });

      const external_value_with_sourceTimestamp = new DataValue({
        value: new Variant({ dataType: DataType.Double, value: 10.0 }),
        sourceTimestamp: null,
        sourcePicoseconds: 0
      });
      setInterval(function() {
        external_value_with_sourceTimestamp.value.value = Math.random();
        external_value_with_sourceTimestamp.sourceTimestamp = new Date();
      }, 1000);
  
      namespace.addVariable({
        organizedBy: device,
        browseName: "Pressure",
        nodeId: "ns=1;s=Pressure",
        dataType: "Double",
        value: {
          timestamped_get: function() {
            return external_value_with_sourceTimestamp;
          }
        }
      });

      namespace.addVariable({
        organizedBy: device,
        browseName: "Temperature",
        nodeId: "s=Temperature",
        dataType: "Double",
  
        value: {
          refreshFunc: function(callback) {
  
            const temperature = 20 + 10 * Math.sin(Date.now() / 10000);
            const value = new Variant({ dataType: DataType.Double, value: temperature });
            const sourceTimestamp = new Date();
  
            // simulate a asynchronous behaviour
            setTimeout(function() {
              callback(null, new DataValue({ value: value, sourceTimestamp: sourceTimestamp }));
            }, 100);
          }
        }
      });

      const node = namespace.addAnalogDataItem({

        organizedBy: device,
        nodeId: "s=TemperatureAnalogItem",
        browseName: "TemperatureAnalogItem",
        definition: "(tempA -25) + tempB",
        valuePrecision: 0.5,
        engineeringUnitsRange: { low: 100, high: 200 },
        instrumentRange: { low: -100, high: +200 },
        engineeringUnits: standardUnits.degree_celsius,
        dataType: "Double",
        value: {
          get: function() {
            return new Variant({ dataType: DataType.Double, value: Math.random() + 19.0 });
          }
        }
      });


    server.start(function() {
        console.log("Server is now listening ... ( press CTRL+C to stop)");
        console.log("port ", server.endpoints[0].port);
        const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" the primary server endpoint url is ", endpointUrl);
    });

})();
