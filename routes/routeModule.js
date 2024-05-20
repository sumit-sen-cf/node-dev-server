const accountRoutes = require('./accounts');
const salesRoutes = require('./sales');
const vendorTypeRoutes = require('./PMS2/vendorTypeRoutes');
const vendorGroupLinkRoutes = require('./PMS2/vendorGroupLinkRoutes');
const vendorPlatformRoutes = require('./PMS2/vendorPlatformRoutes');
const vendorPaymentMethodRoutes = require('./PMS2/paymentMethodRoutes');
const vendorPayCycleRoutes = require('./PMS2/payCycleRoutes');
const groupLinkTypeRoutes = require('./PMS2/groupLinkTypesRoutes');

//used for the http://localhost:8080/api/v1/end-points
exports.routeModulesV1 = [
    vendorTypeRoutes,
    vendorGroupLinkRoutes,
    vendorPlatformRoutes,
    vendorPayCycleRoutes,
    groupLinkTypeRoutes,
    vendorPaymentMethodRoutes
];

//used for the http://localhost:8080/api/end-points
exports.routeModules = [
    accountRoutes,
    salesRoutes,
];

