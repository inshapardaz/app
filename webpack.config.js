/* eslint-disable global-require */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
  const isProduction = env.production;
  const configTarget = isProduction ? 'prod' : env.TARGET_ENV || 'dev';
  
  console.log(`Building with configuration target ${configTarget}`);

  return ({
    entry: './src/index.jsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      chunkFilename: '[id].js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@material-ui/core/Checkbox': path.resolve(__dirname, 'node_modules/@mui/material/Checkbox'),
        '@material-ui/core/FormControlLabel': path.resolve(__dirname, 'node_modules/@mui/material/FormControlLabel'),
        '@material-ui/core/InputBase': path.resolve(__dirname, 'node_modules/@mui/material/InputBase'),
        '@material-ui/core/RadioGroup': path.resolve(__dirname, 'node_modules/@mui/material/RadioGroup'),
        '@material-ui/core/Select': path.resolve(__dirname, 'node_modules/@mui/material/Select'),
        '@material-ui/core/FormControl': path.resolve(__dirname, 'node_modules/@mui/material/FormControl'),
        '@material-ui/core/InputLabel': path.resolve(__dirname, 'node_modules/@mui/material/InputLabel'),
        '@material-ui/core/Input': path.resolve(__dirname, 'node_modules/@mui/material/Input'),
        '@material-ui/core/FormHelperText': path.resolve(__dirname, 'node_modules/@mui/material/FormHelperText'),
        '@material-ui/core/Switch': path.resolve(__dirname, 'node_modules/@mui/material/Switch'),
        '@material-ui/core/TextField': path.resolve(__dirname, 'node_modules/@mui/material/TextField'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: ['babel-loader', 'source-map-loader'],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
                },
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    ['autoprefixer', {}],
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          use: 'file-loader',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: `${__dirname}/src/index.html`,
        filename: 'index.html',
        inject: 'body',
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: './public', to: '' },
        ],
      }),
    ],
    externals: {
      config: JSON.stringify(require(`./config/config.${configTarget}.json`)),
    },
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      historyApiFallback: true,
    },
  });
};
