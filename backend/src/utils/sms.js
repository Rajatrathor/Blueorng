const axios = require('axios');

const sendSMS = async ({ phone, message }) => {
    try {
        // Fast2SMS API requires headers and body
        // Ensure FAST2SMS_API_KEY is in your .env
        const response = await axios.post(
            "https://www.fast2sms.com/dev/bulkV2",
            {
                route: "q",          // quick transactional
                message: message,
                numbers: phone,
            },
            {
                headers: {
                    "authorization": process.env.FAST2SMS_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log(`✅ SMS Sent to ${phone}`);
        return response.data;
    } catch (error) {
        console.error("❌ SMS Error:", error.response?.data || error.message);
        // We don't want to crash the flow if SMS fails, just log it
        // throw new Error("SMS failed"); 
        return null;
    }
};

module.exports = { sendSMS };
