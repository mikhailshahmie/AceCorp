const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    //basics
    mode: "development",
    entry: {
        main: path.resolve(__dirname, "src/js/main.js"),
        index: path.resolve(__dirname, "src/js/index.js"),
        signin: path.resolve(__dirname, "src/js/signin.js"),
        signup: path.resolve(__dirname, "src/js/signup.js"),
        loginadmin: path.resolve(__dirname, "src/js/loginadmin.js"),
        adminmain: path.resolve(__dirname, "src/js/adminmain.js"),
        home: path.resolve(__dirname, "src/js/home.js"),
        driverhome: path.resolve(__dirname, "src/js/driver-home.js"),
        driverhistory: path.resolve(__dirname, "src/js/driver-history.js"),
        resetpasswordadmin: path.resolve(__dirname, "src/js/resetpasswordadmin.js"),
        forgotpassword: path.resolve(__dirname, "src/js/forgotpassword.js"),
        driverapplication: path.resolve(__dirname, "src/js/driver-application.js"),
        bookride: path.resolve(__dirname, "src/js/book-ride.js"),
        bookcurrent: path.resolve(__dirname, "src/js/book-current.js"),
        bookhistory: path.resolve(__dirname, "src/js/book-history.js"),
        adminprofile: path.resolve(__dirname, "src/js/adminprofile.js"),
        profile: path.resolve(__dirname, "src/js/profile.js"),
        editadminprofile: path.resolve(__dirname, "src/js/editadminprofile.js"),
        transaction: path.resolve(__dirname, "src/js/transaction.js"),
        userRecord: path.resolve(__dirname, "src/js/userRecord.js"),
        driverrequest: path.resolve(__dirname, "src/js/driverrequest.js"),
        admindash: path.resolve(__dirname, "src/js/admindash.js"),
        adminlist: path.resolve(__dirname, "src/js/adminlist.js"),
        driverbook: path.resolve(__dirname, "src/js/driver-book.js"),
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        clean: true,
    },

    devtool: "inline-source-map",
    devServer: {
        static: path.join(__dirname, "dist"),
        open: true,
        hot: true,
    },

    //loaders
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.html$/,
                use: ["html-loader"],
            },
            {
                test: /\.(svg|ico|png|webp|jpg|jpeg|gif|woff2?)$/,
                type: "asset/resource",
                generator: {
                    filename: "img/[name][ext]",
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 8192,
                    },
                },
            },
        ],
    },
    //plugins
    plugins: [
        //do not touch
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),

        /*ADD NEW HTMLWEBPACKPLUGIN WHEN NEW HTML ADDED (COPY PASTE)
            new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, "src/html/index.html"),
            chunks: ["index"], //CHUNK IS JAVASCRIPT USED (LINE 8 TO ADD MORE JS) !!! FOLLOW THE HTML NAME
        }),
        */

        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, "src/html/index.html"),
            chunks: ["index"],
        }),
        new HtmlWebpackPlugin({
            filename: "signin.html",
            template: path.resolve(__dirname, "src/html/signin.html"),
            chunks: ["signin"],
        }),
        new HtmlWebpackPlugin({
            filename: "signup.html",
            template: path.resolve(__dirname, "src/html/signup.html"),
            chunks: ["signup"],
        }),
        new HtmlWebpackPlugin({
            filename: "loginadmin.html",
            template: path.resolve(__dirname, "src/html/loginadmin.html"),
            chunks: ["loginadmin"],
        }),
        new HtmlWebpackPlugin({
            filename: "home.html",
            template: path.resolve(__dirname, "src/html/home.html"),
            chunks: ["home"],
        }),
        new HtmlWebpackPlugin({
            filename: "driver-home.html",
            template: path.resolve(__dirname, "src/html/driver-home.html"),
            chunks: ["driverhome"],
        }),
        new HtmlWebpackPlugin({
            filename: "driver-history.html",
            template: path.resolve(__dirname, "src/html/driver-history.html"),
            chunks: ["driverhistory"],
        }),
        new HtmlWebpackPlugin({
            filename: "adminmain.html",
            template: path.resolve(__dirname, "src/html/adminmain.html"),
            chunks: ["adminmain"],
        }),
        new HtmlWebpackPlugin({
            filename: "resetpasswordadmin.html",
            template: path.resolve(__dirname, "src/html/resetpasswordadmin.html"),
            chunks: ["resetpasswordadmin"],
        }),
        new HtmlWebpackPlugin({
            filename: "forgotpassword.html",
            template: path.resolve(__dirname, "src/html/forgotpassword.html"),
            chunks: ["forgotpassword"],
        }),
        new HtmlWebpackPlugin({
            filename: "driver-application.html",
            template: path.resolve(__dirname, "src/html/driver-application.html"),
            chunks: ["driverapplication"],
        }),
        new HtmlWebpackPlugin({
            filename: "book-ride.html",
            template: path.resolve(__dirname, "src/html/book-ride.html"),
            chunks: ["bookride"],
        }),
        new HtmlWebpackPlugin({
            filename: "book-current.html",
            template: path.resolve(__dirname, "src/html/book-current.html"),
            chunks: ["bookcurrent"],
        }),
        new HtmlWebpackPlugin({
            filename: "book-history.html",
            template: path.resolve(__dirname, "src/html/book-history.html"),
            chunks: ["bookhistory"],
        }),
        new HtmlWebpackPlugin({
            filename: "adminprofile.html",
            template: path.resolve(__dirname, "src/html/adminprofile.html"),
            chunks: ["adminprofile"],
        }),
        new HtmlWebpackPlugin({
            filename: "profile.html",
            template: path.resolve(__dirname, "src/html/profile.html"),
            chunks: ["profile"],
        }),
        new HtmlWebpackPlugin({
            filename: "editadminprofile.html",
            template: path.resolve(__dirname, "src/html/editadminprofile.html"),
            chunks: ["editadminprofile"],
        }),
        new HtmlWebpackPlugin({
            filename: "transaction.html",
            template: path.resolve(__dirname, "src/html/transaction.html"),
            chunks: ["transaction"],
        }),
        new HtmlWebpackPlugin({
            filename: "userRecord.html",
            template: path.resolve(__dirname, "src/html/userRecord.html"),
            chunks: ["userRecord"],
        }),
        new HtmlWebpackPlugin({
            filename: "driverrequest.html",
            template: path.resolve(__dirname, "src/html/driverrequest.html"),
            chunks: ["driverrequest"],
        }),
        new HtmlWebpackPlugin({
            filename: "admindash.html",
            template: path.resolve(__dirname, "src/html/admindash.html"),
            chunks: ["admindash"],
        }),
        new HtmlWebpackPlugin({
            filename: "adminlist.html",
            template: path.resolve(__dirname, "src/html/adminlist.html"),
            chunks: ["adminlist"],
        }),
        new HtmlWebpackPlugin({
            filename: "driver-book.html",
            template: path.resolve(__dirname, "src/html/driver-book.html"),
            chunks: ["driverbook"],
        }),
    ],
};
