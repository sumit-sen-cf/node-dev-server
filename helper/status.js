module.exports = {
    saleBookingStatus: {
        '01': {
            status: "Sale Booking Created",
            discription: "Sale Booking Only Created.No Other operation start yet."
        },
        '02': {
            status: "Payment Approval Pending( Finance)",
            discription: "Payment of sale booking is requested.Response is pending from Finance."
        },
        '03': {
            status: "Credit Approval Pending(Manager)",
            discription: "Sale booking is sent for credit approval to BDM and Admin ,Response is pending from BDM or Admin."
        },
        '04': {
            status: "Pending for Record Services",
            discription: "Sale booking is ready for create record service.After Either Full payment received or Credit approved by admin or BDM ,or Sales Executive used his own credit."
        },
        '05': {
            status: "Request for Execution",
            discription: "After Record service creation.record service is ready for send to Execution."
        },
        '06': {
            status: "Pending for Execution Approval",
            discription: "After Record service is sent to Execution.Pendinf for response from Execution team."
        },
        '07': {
            status: "Execution Accepted",
            discription: "Execution Accepted from Execution Team."
        },
        '08': {
            status: "Execution Rejected",
            discription: "Execution Rejected from Execution Team."
        },
        '09': {
            status: "Execution Done",
            discription: "Execution Done from Execution Team."
        },
        '10': {
            status: "Execution Paused",
            discription: "Execution Paused By Sales Executive."
        },
        '11': {
            status: "Execution Closed",
            discription: "Full payment received and Execution is done."
        },
        '12': {
            status: "Requested Amount Approved.Balance Amount Request Pending.",
            discription: "Requested Amount Approved. Balance Amount (partial payment) Request Pending."
        },
    }
}