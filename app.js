/* Freshworks Coding Challenge - Gowtham K - 7/11/19 */
// 
const _ = require('lodash');
const yargs = require('yargs');
const fs = require('fs');
var asyncLoop = require('node-async-loop');
const argv = yargs
    .command('MergeFiles','Merge JSON Files',{
        folderPath:{
            describe: 'Input JSON files location',
            demand: true,
            alias: 'fp'
        },
        inputFileName:{
            describe: 'Input file base name',
            demand: true,
            alias: 'ifn'
        },
        outputFileName:{
            describe: 'Name of the output file',
            demand: true,
            alias: 'ofn'
        },
        maxSize:{
            describe: 'maximum size of the output file',
            demand: true,
            alias: 'ms'
        }
    })
    .help()
    .argv;
var command = argv._[0];
if(command === "MergeFiles")
{
    var inputFile = argv.ifn; //Input file base name
    var testFolder = argv.fp; //Input file location
    testFolder = './'+testFolder+'/';
    var res={};
    fs.readdir(testFolder, (err, files) => { //reading all the files in the given file location
        if(err) throw err;
        files.sort();  //sorting the files
        asyncLoop(files,function(file,next){
            var filename=file.split('.')[0];
            var sLength = filename.length; //length of the input file base name
            if(filename.substring(0,sLength-1)===inputFile){ //Checking whether the file name matches with the given base name
                fs.readFile('./'+testFolder+'/'+filename+'.json',(err,jsonstring)=>{
                    console.log("Reading File: "+file);
                    if (err) {
                        console.log("File read failed:", err)
                        next();
                        return
                    }
                    var obj = JSON.parse(jsonstring);
                    var attributes = Object.keys(obj);
                    asyncLoop(attributes,function(name,next){
                        if (!res.hasOwnProperty(name)) {
                          res[name] = obj[name]
                          next()
                        }else{
                            obj[name].forEach(ob=>{
                                res[attributes].push(ob);
                            });
                            next()
                        }
                    },function(err){next()});                  
                })
            }else{
                next();
            }
        },function(err){
            if(err) throw err;
            var result = JSON.stringify(res);
            var sSize = Buffer.byteLength(result); //Size of the newly created json string
            console.log('The resultant JSON string is:' + result);
            console.log('The resultant JSON size is:' + sSize);
            if(sSize<=argv.ms)
            {
                fs.writeFile(argv.ofn+'.json',result,function(err){if(err) throw err});
            }else{
                console.log("File size limit exceeded");
            }
        })     
    });
}
else if(command === 'Search'){
    var arr = argv.w.toString().split(',');
    arr.forEach(word => {
        search.searchWord(word);
    });
}

