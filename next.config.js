// /** @type {import('next').NextConfig} */
// module.exports = {
//   reactStrictMode: true,
//   target: "serverless", // Apparently this is required by Netlify
//   webpack5: true, 
//   webpack: (config, { webpack, isServer}) => {
//     config.externals = config.externals.concat([
// 'mssql', 'mysql2', 'oracle', 'oracledb', 'postgres', 'redshift', 'sqlite3', 'pg', 'pg-query-stream', 'tedious']);
//     return config;
//   },
// }
// const runtimeCaching = require("next-pwa/cache");
// const withPWA = require("next-pwa");
// module.exports = withPWA({
// 	pwa: {
// 		dest: "public",
// 		register: true,
// 		skipWaiting: true,
//     runtimeCaching,
// 	},
// });
const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    runtimeCaching,
});

const nextConfig = withPWA({
  reactStrictMode: true,
});
module.exports = nextConfig;
