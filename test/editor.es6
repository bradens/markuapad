var should = require("should")
var markuapad = require("../build/markuapad")

describe("Editor", () => {
  it("Should have an editor", () => { markuapad.should.have.function('create'); })
});