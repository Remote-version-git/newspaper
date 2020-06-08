module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ["Android >= 4.0", "iOS >= 8"],
    },
    "postcss-pxtorem": {
      // vant based 375px so if you based 750, you can / 2
      rootValue: 37.5,
      propList: ["*"],
    },
  },
};
