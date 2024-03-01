const catchAsync = require('../../../helper/catchAsync')
const appError = require('../../../helper/appError')
const axios = require('axios')

exports.getPostInfo = catchAsync(async (req, res, next) => {
    const { shortCode } = req.body
    const response = await axios.post(
        'https://app.ylytic.com/ylytic/api/v1/data_refresh/requests',
        // '{\n    "request_type": "instagram_post",\n    "shortcode": "C0uGS2TLcCu"\n}',
        {
            'request_type': 'instagram_post',
            'shortcode': shortCode
        },
        {
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY0NmNhOTExZWY5ZTcwNWM3ODc1Nzk0NyIsIm5hbWUiOiJjcmVhdGl2ZWZ1ZWwiLCJleHAiOjE3Mjc0ODg3MzAsInJvbGUiOiJDTElFTlQiLCJwZXJtaXNzaW9ucyI6W10sInNlc3Npb24iOiJhNjUwNDg1MS00ZTgwLTRiZjQtODBkZC02YzgxYWYxNjU2MzAifQ.EP0JfWCsLxaFdCLr6MizEeltnJ4h3s9PLi-GuoCUops',
                'Content-Type': 'application/json'
            }
        }
    );

    const responseData = {
        request_id: response.data.request_id,
        status: response.data.status
    };

    // console.log(responseData);
    let details
    setTimeout(async () => {

        details = await axios.get(
            `https://app.ylytic.com/ylytic/api/v1/data_refresh/requests/${responseData.request_id}`,
            // '{\n    "request_type": "instagram_post",\n    "shortcode": "C0uGS2TLcCu"\n}',

            {
                headers: {
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY0NmNhOTExZWY5ZTcwNWM3ODc1Nzk0NyIsIm5hbWUiOiJjcmVhdGl2ZWZ1ZWwiLCJleHAiOjE3Mjc0ODg3MzAsInJvbGUiOiJDTElFTlQiLCJwZXJtaXNzaW9ucyI6W10sInNlc3Npb24iOiJhNjUwNDg1MS00ZTgwLTRiZjQtODBkZC02YzgxYWYxNjU2MzAifQ.EP0JfWCsLxaFdCLr6MizEeltnJ4h3s9PLi-GuoCUops',

                }
            })
            console.log(details.data)
        const result = {
            response: details.data.response,
            status:details.data.status
        }

        res.status(200).json({
            result
        });
    }, [15000])



})