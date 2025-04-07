// build.js
const esbuild = require('esbuild');

// Determine the mode from command line arguments
const production = process.argv.includes('--production');

const glob = require('glob');
// Define entry points
const entryPoints = glob.sync('app/javascript/**/*.jsx').concat([
    'app/javascript/application.js'
]);

// Configure the build
const config = {
    entryPoints,
    bundle: true,
    sourcemap: !production,
    minify: production,
    outdir: 'app/assets/builds',
    publicPath: '/assets',
    loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.png': 'file',
        '.jpg': 'file',
        '.svg': 'file',
    },
    define: {
        'process.env.NODE_ENV': production ? "'production'" : "'development'"
    },
};

// Build with or without watch based on arguments
if (process.argv.includes('--watch')) {
    // Watch mode
    esbuild.context(config).then(context => {
        context.watch();
        console.log('Watching for changes...');
    });
} else {
    // Build once
    esbuild.build(config).catch(() => process.exit(1));
}