const accountRoutes = require('./accounts');
const salesRoutes = require('./sales');

//used for the http://localhost:8080/api/v1/end-points
exports.routeModulesV1 = [

];

//used for the http://localhost:8080/api/end-points
exports.routeModules = [
    accountRoutes,
    salesRoutes,
];