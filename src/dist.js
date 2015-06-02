import Markuapad from "./markuapad"

// Expose the Markuapad object as a global
if (window !== undefined)
  window.Markuapad = Markuapad;

export default Markuapad;