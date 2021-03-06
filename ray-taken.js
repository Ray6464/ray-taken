const raytakenAuthors = "Ray Voice and Anna Voice";
const raytakenVersion = "2.0.0";

module.exports = {
  value: [],
  logTypes: ["number", "string", "object", "function",
	     "boolean", "undefined", "symbol", "bigint"],
  commonRegex: [/\w/, /\W/, /\d/, /\D/,
	        /^\w/, /^http:/, /^https:/],
  take: function(argsArray) {
    this.value = argsArray;
    return this;
  },
  getArgsOfType: function(dataType) {
    const argsOfType = [];
    this.overArray(this.value, (item)=>{
      if (typeof(item) === dataType) argsOfType.push(item);
    });
    this.value = argsOfType;
    return this;
  },
  overArray: function(arr, callback) {
    for (let item of arr) {
      callback(item);
    }
    return this;
  },
  union: function(argsB) {
    this.overArray(argsB, (itemB)=>{ this.value.push(itemB) });
    return this;
  },
  subtraction: function(argsB) {
    this.overArray(argsB, (itemB)=>{
      this.value = this.value.filter(valB => valB !== itemB)
    });
    return this;
  },
  intersection: function(argsB) {
    const intersectingSet = [];
    this.overArray(argsB, (itemB) => {
      if(this.value.includes(itemB)) return intersectingSet.push(itemB)
    });
    this.value = intersectingSet;
    return this;
  },
  getArgsOfRegex: function(regex) {
    const regexedArray = [];
    this.overArray(this.value, (item)=>{
      if(regex.test(item) && typeof(item) !== "function" && typeof(item) !== "object") regexedArray.push(item);
    });
    this.value = regexedArray;
    return this;
  },
  getNumArgs: function(defaults) {
    this.value = this.getArgsOfType("number").value;
    if (typeof(defaults) === "number") this.value.push(defaults);
    return this;
  },
  getStrArgs: function(defaults) {
    this.value = this.getArgsOfType("string").value;
    if (typeof(defaults) === "string") this.value.push(defaults);
    return this;
  },
  getFuncArgs: function(defaults) {
    this.value = this.getArgsOfType("function").value;
    if (typeof(defaults) === "function") this.value.push(defaults);
    return this;
  },
  getObjArgs: function(defaults) {
    this.value = this.getArgsOfType("object").value;
    if (typeof(defaults) === "object") this.value.push(defaults);
    return this;
  },
  getBoolArgs: function() {
    this.value = this.getArgsOfType("boolean").value;
    return this;
  },
  getPortNums: function() {
    const numbers = this.getNumArgs().value;
    this.value = numbers.filter(item => (item > 1));
    //need to imporve this function
    return this;
  },
  getNodeNames: function() {
    const names = this.getStrArgs().value;
    this.value = names.filter(item => (/^\//.test(item)));
    return this;
  },
  getDirNames: function() {
    const names = this.getStrArgs().value;
    this.value = names.filter(item => (/\/$/.test(item)));
    return this;
  },
  getURINames: function() {
    const fileNames = this.getFileNames().value;
    const dirNames = this.getDirNames().value;
    const absPaths = this.getAbsPath().value;
    this.value = [...fileNames, ...dirNames, ...absPaths];
    return this;
  },
  getFileNames: function() {
    const names = this.getStrArgs().value;
    this.value = names.filter(item => !(/^\//.test(item)));
    this.value = this.value.filter(item => !(/\/$/.test(item)));
    return this;
  },
  getAbsUnixPaths: function() {
    const names = this.getStrArgs().value;
    this.value = names.filter(item => /^\/home/.test(item));
    return this;
  },
  getAbsWinPaths: function() {
    const names = this.getStrArgs().value;
    this.value = names.filter(item => /^[A-Z]:/.test(item));
    return this;
  },
  getAbsPaths: function() {
    const names = this.getStrArgs().value;
    this.value = names.filter(item => /^\/home/.test(item) || /^[A-Z]:/.test(item));
    return this;
  }
}

