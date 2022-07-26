"use strict"

var gulp = require('gulp');
var run = require('gulp-run');
var del = require('del');
var concat = require('concat');
var taskListing = require('gulp-task-listing');
var tslint = require('gulp-tslint');
var fs = require('fs');
var shell = require('shelljs');
const _ = require('lodash');
var flag;


gulp.task('help', taskListing);
gulp.task('default', gulp.series('help'));

gulp.task('lint', function () {
    console.log('Started code analysis');
    return executeCodeAnalysis();
});

function executeCodeAnalysis() {
    return gulp.src('src/**/*.ts')
        .pipe(tslint({
            formatter: 'prose'
        }))
        .pipe(tslint({
            formatter: 'checkstyle'
        }))       
}


gulp.task('run-test', function (done) {
        var shell = require('shelljs');
        shell.exec('npm run test', function (code, stdout, stderr) {
            console.log('Completed unit test');
            console.log(stdout);
            done();
        });
});

gulp.task('clean-pkg_dist', function () {
    return del(['pkg_dist']);
});

// Gulp task which will create zip file for all the environments specified in the config folder.
gulp.task('package-service', gulp.series('clean-pkg_dist', function (done) {
        var fs = require('fs');
        var shell = require('shelljs');
        shell.exec('npm run package', function (code, stdout, stderr) {
                console.log('Completed serverless package');
                console.log(stdout);
                done();       
        });
}));

// This task loops through the available configs and creates zip file. ,['build-lambdaFunc']
gulp.task('create-sourceZip', gulp.series('package-service', function (done) {
        console.log('Started compressing the content');
        var fileName;
        var env;
        var fs = require('fs');
        var dir = 'pkg_dist';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        createEnvSpecificZip('sbx');
        createEnvSpecificZip('dev');
        createEnvSpecificZip('stg');
        done();
}));

// This function will create zip for a given environment.
function createEnvSpecificZip(env) {
    // Timer keeps checking whether any other process which is executing this method is completed.
    var timerId = setTimeout(function request() {
        if (flag == false || flag == undefined) {
            flag = true;
            var fs = require('fs');
            var archiver = require('archiver');
            var zipFileName = "pkg_dist/source-" + env + ".zip"

            var output = fs.createWriteStream(zipFileName);
            var zipArchive = archiver('zip');

            fixPackageArtifactPath(env);

            // Event which gets executed once the compression process is completed.
            output.on('close', function () {
                clearTimeout(timerId);
                console.log('Completed compressing files for ' + zipFileName);
                flag = false;
                return true;
            });

            zipArchive.pipe(output);

            zipArchive.append(fs.createReadStream('buildspec-' + env + '.yml'), { name: 'buildspec.yml' });
            zipArchive.append(fs.createReadStream('serverless.yml'), { name: 'serverless.yml' });
            zipArchive.append(fs.createReadStream('common/config/serverless.app.config.yml'), { name: 'common/config/serverless.app.config.yml' });
            zipArchive.append(fs.createReadStream('serverless-request-template.txt'), { name: 'serverless-request-template.txt' });
            zipArchive.append(fs.createReadStream('package.json'), { name: 'package.json' });
            zipArchive.append(fs.createReadStream('common/config/serverless.config.' + env + '.yml'), { name: 'common/config/serverless.config.' + env + '.yml' });
            zipArchive.directory('deca-homes-tisa-sls-pkg-' + env + '/', 'serverless');

            zipArchive.finalize(function (err, bytes) {
                if (err) {
                    throw err;
                }
                console.log('done:', base, bytes);
            });
        }
        else {
            timerId = setTimeout(request, 500); // (*)     
        }
    }, 500);
}

function fixPackageArtifactPath(stage){
    var fs = require('fs');
    var packagePath = 'deca-homes-tisa-sls-pkg-' + stage + '/serverless-state.json'

    var stateObj = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    var functions = stateObj.service.functions;

    var newFunctions = _.mapValues(functions, (func) => {
                            func.package.artifact = _.replace(func.package.artifact, ".serverless\\", "serverless\/");
                            return func;
                        });
    
    stateObj.service.functions = newFunctions;
    delete stateObj.service.provider.profile;
    delete stateObj.service.custom.configFile.profile;
    
    fs.writeFileSync(packagePath, JSON.stringify(stateObj, null, '  '));
};
