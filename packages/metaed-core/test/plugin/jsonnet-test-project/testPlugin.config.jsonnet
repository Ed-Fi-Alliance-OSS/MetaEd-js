// Test Jsonnet configuration file
local testValue = "jsonnet-value";

{
  config: [
    {
      rule: "testRule",
      data: {
        source: "jsonnet",
        value: testValue,
        computed: testValue + "-computed",
      },
    },
  ],
}