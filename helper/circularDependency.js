const vari = require("../variables");
const sharedIncentiveSaleBookingModel = require("../models/Sales/sharedIncentiveSaleBookingModel");

module.exports = {
    /**
     * funcion is used for the update fields in the shared sale booking collection. 
     * @param {Object} where : for the update data find condition check.
     * @param {Object} fields : fields for the update in the collection.
     * @returns : as promise to return object or reject error 
     */
    async updateSharedIncentiveSBCollection(where = {}, fields) {
        return new Promise(async function (resolve, reject) {
            try {
                //if the where is blank so return 
                if (!where && Object.keys(where).length < 1) {
                    return resolve();
                }

                // Check if earned_incentive_amount and unearned_incentive_amount are present
                const hasIncentiveFields = fields['$set'] && (
                    'earned_incentive_amount' in fields['$set']
                );

                // data update in shared copy collection
                await sharedIncentiveSaleBookingModel.updateMany(where, fields);

                //If the earned amount set in the fields so the update incntive into the earned_incentive_amount  
                if (hasIncentiveFields) {
                    // Use aggregation pipeline to copy incentive_amount to earned_incentive_amount
                    await sharedIncentiveSaleBookingModel.updateMany(
                        where,
                        [
                            {
                                $set: {
                                    earned_incentive_amount: "$incentive_amount", // Copy incentive_amount to earned_incentive_amount
                                    unearned_incentive_amount: 0, // Set unearned_incentive_amount to 0
                                }
                            }
                        ]
                    );
                }

                //return response
                return resolve();
            } catch (err) {
                console.log('Error While get incentive sharing user wise data', err);
                return resolve();
            }
        })
    },

};
