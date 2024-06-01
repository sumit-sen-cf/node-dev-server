const accountRoutes = require('./accounts');
const salesRoutes = require('./sales');
const salesBookingRoutes = require('./Sales/salesBookingRoutes');
const vendorTypeRoutes = require('./PMS2/vendorTypeRoutes');
const vendorGroupLinkRoutes = require('./PMS2/vendorGroupLinkRoutes');
const vendorPlatformRoutes = require('./PMS2/vendorPlatformRoutes');
const vendorPaymentMethodRoutes = require('./PMS2/paymentMethodRoutes');
const vendorPayCycleRoutes = require('./PMS2/payCycleRoutes');
const groupLinkTypeRoutes = require('./PMS2/groupLinkTypesRoutes');
const bankDetailsRoutes = require('./PMS2/bankDetailsRoutes');
const vendorRoutes = require("./PMS2/vendorRoutes")
const countryCodeRoutes = require("./PMS2/countryCodeRoutes")
const ipAuthRoutes = require("./common/ipAuthRoutes")
const pageProfileRoutes = require("./PMS2/pageProfileTypeRoutes");
const pageCategoryRoutes = require("./PMS2/pageCategoryRoutes");
const pagePriceTypeRoutes = require("./PMS2/pagePriceTypeRoutes");
const pagePriceMultipleRoutes = require("./PMS2/pagePriceMultipleRoutes");
const pageMasterRoutes = require("./PMS2/pageMasterRoutes");
const pageStatesRoutes = require("./PMS2/pageStatesRoutes");
const paymentDetailsRoutes = require("./Sales/paymentDetailsRoutes");
const paymentModeRoutes = require("./Sales/paymentModeRoutes");

//used for the http://localhost:8080/api/v1/end-points
exports.routeModulesV1 = [
    vendorTypeRoutes,
    countryCodeRoutes,
    ipAuthRoutes,
    vendorGroupLinkRoutes,
    vendorPlatformRoutes,
    vendorPayCycleRoutes,
    groupLinkTypeRoutes,
    vendorPaymentMethodRoutes,
    bankDetailsRoutes,
    vendorRoutes,
    pageProfileRoutes,
    pageCategoryRoutes,
    pagePriceTypeRoutes,
    pagePriceMultipleRoutes,
    pageMasterRoutes,
    pageStatesRoutes
];

//used for the http://localhost:8080/api/end-points
exports.routeModules = [
    accountRoutes,
    salesRoutes,
    //new sales booking starts
    salesBookingRoutes,
    paymentDetailsRoutes,
    paymentModeRoutes
];

