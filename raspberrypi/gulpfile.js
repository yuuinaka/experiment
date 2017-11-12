
const gulp = require("gulp");
const babel = require("gulp-babel");
const plumber = require("gulp-plumber");

const fs = require("fs");
const path = require("path");

const dir = "/sys/class/gpio/";
const pin_error = 4;
const pin_success = 26;
const gpio_error = path.join(dir, `gpio${pin_error}`);
const gpio_success = path.join(dir, `gpio${pin_success}`);

fs.writeFileSync(path.join(dir, "export"), pin_error);
fs.writeFileSync(path.join(dir, "export"), pin_success);

gulp.task("build", () => {
  let is_success = true;
  gulp.src("./scripts/*.js")
  .pipe(plumber({
    errorHandler: (err) => {
      console.log("err");
      is_success = false;
      //console.log(err);
      fs.writeFileSync(path.join(gpio_error, "direction"), "out");
      fs.writeFileSync(path.join(gpio_error, "value"), 1);
      setTimeout(() => {
        fs.writeFileSync(path.join(gpio_error, "value"), 0);
        fs.writeFileSync(path.join(dir, "unexport"), pin_error);
        fs.writeFileSync(path.join(dir, "unexport"), pin_success);
      }, 5000);
    }
  }))
  .on('end', () => {
    if (is_success) {
      console.log("success");
      fs.writeFileSync(path.join(gpio_success, "direction"), "out");
      fs.writeFileSync(path.join(gpio_success, "value"), 1);
      setTimeout(() => {
        fs.writeFileSync(path.join(gpio_success, "value"), 0);
        fs.writeFileSync(path.join(dir, "unexport"), pin_error);
        fs.writeFileSync(path.join(dir, "unexport"), pin_success);
      }, 5000);
    }
  })
  .pipe(babel());
});

