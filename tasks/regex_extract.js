/*
 * grunt-regex-extract
 * https://github.com/mpau23/grunt-regex-extract
 *
 * Copyright (c) 2014 Miren Pau
 * Licensed under the MIT license.
 *
 *
 * Forked and updated by Philip Kahn, July 2016
 * https://github.com/tigerhawkvok/grunt-regex-extract
 */

module.exports = function (grunt) {

  grunt.registerMultiTask('regex_extract', 'Enable the user to extract all matching results of a regular expression and save them to file', function () {

  'use strict';
  
var options = this.options(
    {
        regex : "(.*|\n*)",
        modifiers: "ig",
        matchPoints : "1",
        includePath : true,
        printMatches: false
    });
     
    // For each [destination : source map] in list
    this.files.forEach(function(file)
    {
        var countMatches = 0;
        // For each source file
        var src = file.src.filter(function(filepath) {            
            // Let me know through warning if a source doesn't exist
            if (!grunt.file.exists(filepath)) {
                grunt.log.warn('Source file "' + filepath + '" not found.');
                return false;
            } else {
                return true;
            }
        }).map(function(filepath) {
          // Read file source.
          var filestring = grunt.file.read(filepath);
          var re = new RegExp(options.regex, options.modifiers);
          var matches = "";
          var matchPointsArray = options.matchPoints.split(",");
          var match = re.exec(filestring);
          while (match !== null) {
              countMatches++;
              var matchstring = match[0];
              if(options.includePath) {
                  matchstring += filepath;
              }
              
              matchPointsArray.forEach(function(current) {
                  if(match[current] != undefined) {
                      if(!options.includePath && matchstring.length === 0) {
                          matchstring += match[current].trim();
                      } else {
                          matchstring += ("," + match[current].trim());                 
                      }
                  }
              });
              matches = matches + matchstring + "\n";
              matchstring = undefined;
              match = re.exec(filestring);
          }
          if(options.printMatches) grunt.log.writeln(matches);
          return matches;
      }).join("");
        
      // Write the destination file.
      grunt.file.write(file.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + file.dest + '" created with '+countMatches+' matches.');
    });
  });

};
