var gulp = require('gulp');

gulp.task('default', function(){
    // Default task code
});
gulp.task('leggo', function(){ console.log("EXID dabaek !!")});

//convert SASS
var sass = require('gulp-sass');

gulp.task('sass', function(){
    return gulp.src('app/style/**/*.scss') //get all files ending .sass or .scss in app/style
    .pipe(sass()) //using gulp-sass
    .pipe(gulp.dest('app/style'))
    .pipe(browsersync.reload({ //update css into browser whenever the sass task running
        stream: true
    }))
});


//live reload with browser sync ( run both watch and browsersync )
var browsersync = require('browser-sync').create();

gulp.task('browsersync', function(){
    browsersync.init({
        server:{
            baseDir: 'app'//let Browser Sync know where the root of the server
        },
    })
})
//--watch all Sass files and run the sass task whenever a Sass file is saved
gulp.task('watch', ['browsersync', 'sass'], function(){ //make sure sasss run before watch so the CSS will already be the latest whenever we run a Gulp command.
    gulp.watch('app/style/**/*.scss', ['sass']);
    //Reload the browser whenever HTML or JS change
    gulp.watch('app/*.html', browsersync.reload);
    gulp.watch('app.js/**/*.js', browsersync.reload);
});
//Optimize 
var gulpIf = require('gulp-if');
//-- minify js
var uglify = require('gulp-uglify');
//--concatenate css and js
var useref= require('gulp-useref');
//--minify the concatenated CSS file
var cssnano = require('gulp-cssnano');

gulp.task('useref', function(){
    return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))  // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.css', cssnano()))  // Minifies only if it's a CSS file
    .pipe(gulp.dest('dist')) //concatenate them into dist/js/main.min.js
});

//Optimize image
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache'); // decrease slow process during images task

gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({ // Caching images that ran through imagemin
        //setting interlaced to true for interlace gif
        progressive: true,
        optimizationLevel: 5,
    })))
    .pipe(gulp.dest('dist/images'))
});

//Copying fonts
gulp.task('fonts', function(){
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

//Clean up generated files
var del = require('del');

  gulp.task('clean:dist', function() {
    return del.sync('dist');
  });

//task sequence
  var runSequence = require('run-sequence');
    
  gulp.task('build', function(callback) {
    runSequence('clean:dist', 
    ['sass', 'useref', 'images', 'fonts'],
    callback)
    });  
    //gulp name defaut can simply run gulp in command line
gulp.task('default', function (callback) {
    runSequence(['sass','browserSync', 'watch'],
     callback)
    });



