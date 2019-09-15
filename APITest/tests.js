"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MojangAPI = require("../MojangAPI/MojangAPI");
const chai_1 = require("chai");
var APITest;
(function (APITest) {
    // class Test {
    //   name: string;
    //   passed: boolean = false;
    //   result: any = null;
    //   constructor(_name: string, _pass: boolean) {
    //     this.name = _name;
    //     this.passed = _pass;
    //   }
    // }
    // test();
    // async function test() {
    //   console.log("Starting tests....")
    //   let tests: Test[] = [];
    //   tests = tests.concat(await testAPI());
    //   let result: [number, number] = [0, 0];
    //   let failedTests: string[] = [];
    //   for (let test of tests) {
    //     if (test.passed) result[0]++;
    //     else {
    //       result[1]++;
    //       failedTests.push(test.name);
    //     }
    //   }
    //   console.log(`Results:\n\t${result[0]} passed\n\t${result[1]} failed`);
    //   if (result[1] > 0)
    //     console.log("\n\nFailed tests:\n", failedTests);
    // }
    // async function testAPI(): Promise<Test[]> {
    //   let tests: Test[] = [];
    //   await API.getUUIDFromName("Plagiatus").then((res) => {
    //     if (res == "e75e2d263b724a93a3e7a2491f4c454f") {
    //       tests.push(new Test("API.getUUIDFromName", true));
    //     }
    //     else
    //       tests.push(new Test("API.getUUIDFromName", false));
    //   }).catch(() => {
    //     tests.push(new Test("API.getUUIDFromName", false));
    //   });
    //   // console.log(uuid);
    //   // console.log(await API.getNamesFromUUID(uuid));
    //   return tests;
    // }
    describe("API.getUUIDFromName", () => {
        it("should return correct UUID", async () => {
            let result = await MojangAPI.API.getUUIDFromName("Plagiatus");
            chai_1.expect(result).to.equal("e75e2d263b724a93a3e7a2491f4c454f");
        });
    });
    describe("API.getNameFromUUID", () => {
        it("should return correct Names", async () => {
            let result = await MojangAPI.API.getNamesFromUUID("e75e2d263b724a93a3e7a2491f4c454f");
            let expected = [{ name: "Plagiatus" }];
            chai_1.expect(result[0].name).to.equal("Plagiatus");
            chai_1.expect(result).to.deep.equal(expected);
        });
    });
    describe("API.getStatus", () => {
        it("should return Status", async () => {
            let result = await MojangAPI.API.getStatus();
            chai_1.expect(result).to.be.an("array").that.is.not.empty;
            chai_1.expect(result).to.be.an("array").to.have.lengthOf(8);
        });
    });
})(APITest || (APITest = {}));
