const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    //basics
    mode: "development",
    entry: {
        main: path.resolve(__dirname, "src/js/main.js"),
        index: path.resolve(__dirname, "src/js/index.js"),
        portfoliodetails: path.resolve(__dirname, "src/js/portfolio-details.js"),
        innerpage: path.resolve(__dirname, "src/js/inner-page.js"),
        signin: path.resolve(__dirname, "src/js/signin.js"),

        //home: path.resolve(__dirname, "src/js/home.js"),
        //index: path.resolve(__dirname, "src/js/index.js"),
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        //assetModuleFilename: "img/[name].[ext]",
        clean: true,
    },

    devtool: "inline-source-map",
    devServer: {
        static: path.join(__dirname, "dist"),
        //contentBase: path.resolve(__dirname, "dist"),
        //port: 5001,
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
            filename: "inner-page.html",
            template: path.resolve(__dirname, "src/html/inner-page.html"),
            chunks: ["innerpage"],
        }),
        new HtmlWebpackPlugin({
            filename: "portfolio-details.html",
            template: path.resolve(__dirname, "src/html/portfolio-details.html"),
            chunks: ["portfoliodetails"],
        }),
        new HtmlWebpackPlugin({
            filename: "signin.html",
            template: path.resolve(__dirname, "src/html/signin.html"),
            chunks: ["signin"],
        }),

        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
    ],
};
